import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { mockEmailValidator } from '@/validations/mock/mock-validation';
import { EmailValidator } from '@/validations/protocols/email-validator';
import { EmailValidation } from '@/validations/validators/email-validation';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

function makeSut(): SutTypes {
  const emailValidatorStub = mockEmailValidator();
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
