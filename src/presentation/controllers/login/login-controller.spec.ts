import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';
import { LoginController } from '@/presentation/controllers/login/login-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import {
  badRequest,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      email: 'any-email',
      password: 'any-password',
    },
  };
}

function makeAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(_: AuthenticationModel): Promise<string> {
      return 'any-token';
    }
  }

  return new AuthenticationStub();
}

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(_: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return { sut, emailValidatorStub, authenticationStub };
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makeFakeRequest();
    delete httRequest.body.email;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makeFakeRequest();
    delete httRequest.body.password;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if an invalid email is provider', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should return 401 if an invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);
    makeFakeRequest();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httRequest = makeFakeRequest();
    await sut.handle(httRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any-email');
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
});
