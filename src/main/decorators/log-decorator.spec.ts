import { LogDecorator } from '@/main/decorators/log-decorator';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
  controllerStub: Controller;
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

function makeSut(): SutTypes {
  const controllerStub = makeController();
  const sut = new LogDecorator(controllerStub);

  return { sut, controllerStub };
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
});
