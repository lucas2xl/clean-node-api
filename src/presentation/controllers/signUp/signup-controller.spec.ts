import { EmailValidator } from '@/presentation/protocols/email-validator';
import { ServerError } from '@/presentation/errors/server-error';
import { SignUpController } from '@/presentation/controllers/signUp/signup-controller';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { AccountModel } from '@/domain/models/account-model';
import {
  AddAccount,
  AddAccountModel,
} from '@/domain/usecases/add-account-usecase';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
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
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'hashed-password',
      };

      return Promise.resolve(fakeAccount);
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
    const httpRequest = {
      body: {
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'invalid-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  it('Should return 400 if an invalid email is provider', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(new Error());

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any-email');
  });

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      },
    };

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
    });
  });

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password',
        passwordConfirmation: 'valid-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'hashed-password',
    });
  });
});
