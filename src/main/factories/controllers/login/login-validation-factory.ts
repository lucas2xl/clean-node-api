import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidation } from '@/validations/validators/email-validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

export function makeLoginValidation(): ValidationComposite {
  const validations: Validation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
}
