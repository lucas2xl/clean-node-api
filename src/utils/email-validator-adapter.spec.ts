import { EmailValidator } from '@/presentation/protocols/email-validator';
import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

function makeSut(): EmailValidator {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
  beforeAll(() => {
    jest.mock('validator', () => ({
      isEmail(): boolean {
        return true;
      },
    }));
  });

  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
