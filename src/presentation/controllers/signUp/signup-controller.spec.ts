import { AccountModel } from '@/domain/models/account-model';
import {
  AddAccount,
  AddAccountModel,
} from '@/domain/usecases/add-account-usecase';
import { SignUpController } from '@/presentation/controllers/signUp/signup-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { ServerError } from '@/presentation/errors/server-error';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http-helper';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
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

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid-id',
    name: 'valid-name',
    email: 'valid-email',
    password: 'hashed-password',
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

function makeAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(_: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return { sut, emailValidatorStub, addAccountStub };
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.name;
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.email;
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.password;
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    delete httpRequest.body.passwordConfirmation;
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    );
  });

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    httpRequest.body.passwordConfirmation = 'invalid-password';
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
  });

  it('Should return 400 if an invalid email is provider', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    httpRequest.body.email = 'invalid-email';
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    httpRequest.body.email = 'invalid-email';
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any-email');
  });

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
    });
  });

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
