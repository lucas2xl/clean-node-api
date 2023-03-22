import { AccountModel } from '@/domain/models/account-model';
import { AddAccount } from '@/domain/usecases/add-account-usecase';
import { Authentication } from '@/domain/usecases/authentication';
import { SignUpController } from '@/presentation/controllers/signup/signup-controller';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { ServerError } from '@/presentation/errors/server-error';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
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

function makeAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
}

function makeAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
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
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  );

  return { sut, addAccountStub, validationStub, authenticationStub };
}

describe('SignUp Controller', () => {
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

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ token: 'any-token' }));
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

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
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
