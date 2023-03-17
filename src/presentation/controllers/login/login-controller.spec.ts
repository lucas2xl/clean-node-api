import { LoginController } from '@/presentation/controllers/login/login-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { badRequest } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
  emailValidatorStub: EmailValidator;
}

function makePostFake(): HttpRequest {
  return {
    body: {
      email: 'any-email',
      password: 'any-password',
    },
  };
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
  const sut = new LoginController(emailValidatorStub);

  return { sut, emailValidatorStub };
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makePostFake();
    delete httRequest.body.email;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makePostFake();
    delete httRequest.body.password;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if an invalid email is provider', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httRequest = makePostFake();
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValid = jest.spyOn(emailValidatorStub, 'isValid');
    const httRequest = makePostFake();
    await sut.handle(httRequest);

    expect(isValid).toHaveBeenCalledWith('any-email');
  });
});
