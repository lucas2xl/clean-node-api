import { EmailValidator } from '@/presentation/protocols/email-validator';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';
import validator from 'validator';

function makeSut(): EmailValidator {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('valid-email');

    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    const isValid = sut.isValid('valid-email');

    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any-email');

    expect(isEmailSpy).toHaveBeenCalledWith('any-email');
  });
});
