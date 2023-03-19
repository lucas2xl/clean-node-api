import { makeLoginValidation } from '@/main/factories/login/login-validation-factory';
import { EmailValidation } from '@/presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';
import { EmailValidator } from '@/presentation/protocols/email-validator';

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(_: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

jest.mock('@/presentation/helpers/validators/validation-composite');

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
