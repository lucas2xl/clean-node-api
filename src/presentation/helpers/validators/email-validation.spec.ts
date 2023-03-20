import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { EmailValidation } from '@/presentation/helpers/validators/email-validation';
import { EmailValidator } from '@/presentation/protocols/email-validator';

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);

  return { sut, emailValidatorStub };
}

describe('Email Validation', () => {
  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any-email' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'valid-email' });

    expect(isValidSpy).toHaveBeenCalledWith('valid-email');
  });
});
