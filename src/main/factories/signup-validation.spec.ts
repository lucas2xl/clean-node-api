import { makeSignUpValidation } from '@/main/factories/signup-validation-factory';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';

jest.mock('@/presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
