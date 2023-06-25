import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';
import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { EmailInUseError } from '@/presentation/errors/email-in-use-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { ServerError } from '@/presentation/errors/server-error';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { mockAddAccountUsecase } from '@/presentation/mock/mock-account';
import { mockAuthenticationUsecase } from '@/presentation/mock/mock-authentication';
import { Validation } from '@/presentation/protocols/validation';
import { mockValidation } from '@/validations/mock/mock-validation';

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccountUsecase;
  validationStub: Validation;
  authenticationStub: AuthenticationUsecase;
};

function mockRequest(): SignUpController.Request {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    passwordConfirmation: 'any-password',
  };
}

function makeSut(): SutTypes {
  const addAccountStub = mockAddAccountUsecase();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthenticationUsecase();
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
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any-field')),
    );
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ token: 'any-token' }));
  });

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(mockRequest());

    expect(addSpy).toHaveBeenCalledWith({
      email: 'any-email',
      name: 'any-name',
      password: 'any-password',
    });
  });

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const request = mockRequest();
    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httRequest = mockRequest();
    await sut.handle(httRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any-email',
      password: 'any-password',
    });
  });
});
