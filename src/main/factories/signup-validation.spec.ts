import { makeSignUpValidation } from '@/main/factories/signup-validation-factory';
import { ComparerFieldsValidation } from '@/presentation/helpers/validators/comparer-fields-validation';
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
    validations.push(
      new ComparerFieldsValidation('password', 'passwordConfirmation'),
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
