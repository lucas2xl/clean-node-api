import { AuthenticationUsecase } from '@/domain/usecases/authentication-usecase';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
  authenticationStub: AuthenticationUsecase;
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      email: 'any-email',
      password: 'any-password',
    },
  };
}

function makeAuthentication(): AuthenticationUsecase {
  class AuthenticationStub implements AuthenticationUsecase {
    async auth(): Promise<string> {
      return 'any-token';
    }
  }

  return new AuthenticationStub();
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
}

function makeSut(): SutTypes {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return { sut, authenticationStub, validationStub };
}

describe('Login Controller', () => {
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any-field'));
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any-field')),
    );
  });

  it('Should return 401 if an invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return 200 if valid credentials provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ token: 'any-token' }));
  });

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httRequest = makeFakeRequest();
    await sut.handle(httRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any-email',
      password: 'any-password',
    });
  });

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
