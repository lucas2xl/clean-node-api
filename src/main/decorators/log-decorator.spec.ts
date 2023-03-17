import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { LogDecorator } from '@/main/decorators/log-decorator';
import { serverError } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(_: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any-name',
          email: 'any-email',
          password: 'any-password',
        },
      };
      return Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub();
}

function makeLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(_: string): Promise<void> {
      return Promise.resolve();
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
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
      },
    };
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same return the controller', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
      },
    });
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

    const fakeError = new Error();
    fakeError.stack = 'any-stack';
    const error = serverError(fakeError);
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(error));

    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any-stack');
  });
});
