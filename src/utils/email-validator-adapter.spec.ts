import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidator Adapter', () => {
  beforeAll(() => {
    jest.mock('validator', () => ({
      isEmail(): boolean {
        return true;
      },
    }));
  });

  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });
});
