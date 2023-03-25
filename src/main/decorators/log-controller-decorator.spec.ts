import { mockLogErrorRepository } from '@/data/mock/mock-db-log';
import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { mockController } from '@/main/mock/mock-controller';
import { mockServerError } from '@/main/mock/mock-erros';
import { ok } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';

type SutTypes = {
  sut: Controller;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

function mockRequest(): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
      passwordConfirmation: 'any-password',
    },
  };
}

function makeSut(): SutTypes {
  const controllerStub = mockController(mockRequest());
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return { sut, controllerStub, logErrorRepositoryStub };
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(mockRequest());

    expect(handleSpy).toHaveBeenCalledWith(mockRequest());
  });

  it('should return the same return the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockRequest()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(mockServerError());

    await sut.handle(mockRequest());

    expect(logSpy).toHaveBeenCalledWith('any-stack');
  });
});
