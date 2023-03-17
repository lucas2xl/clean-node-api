import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { LogDecorator } from '@/main/decorators/log-decorator';
import { ok, serverError } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
      passwordConfirmation: 'any-password',
    },
  };
}

function makeFakeResponse(): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
    },
  };
}

async function makeFakeServerError(): Promise<HttpResponse> {
  const fakeError = new Error();
  fakeError.stack = 'any-stack';
  return serverError(fakeError);
}

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(_: HttpRequest): Promise<HttpResponse> {
      return ok(makeFakeResponse());
    }
  }

  return new ControllerStub();
}

function makeLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(_: string): Promise<void> {
      return;
    }
  }

  return new LogErrorRepositoryStub();
}

function makeSut(): SutTypes {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogDecorator(controllerStub, logErrorRepositoryStub);

  return { sut, controllerStub, logErrorRepositoryStub };
}

describe('Log Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  it('should return the same return the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeResponse()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(makeFakeServerError());

    await sut.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any-stack');
  });
});
