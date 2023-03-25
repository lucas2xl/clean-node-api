import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory';
import { Validation } from '@/presentation/protocols/validation';
import { mockEmailValidator } from '@/validations/mock/mock-validation';
import { EmailValidation } from '@/validations/validators/email-validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

jest.mock('@/validations/validators/validation-composite');

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
