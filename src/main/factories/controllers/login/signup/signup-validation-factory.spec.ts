import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';
import { Validation } from '@/presentation/protocols/validation';
import { mockEmailValidator } from '@/validations/mock/mock-validation';
import { ComparerFieldsValidation } from '@/validations/validators/comparer-fields-validation';
import { EmailValidation } from '@/validations/validators/email-validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

jest.mock('@/validations/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new ComparerFieldsValidation('password', 'passwordConfirmation'),
    );
    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
