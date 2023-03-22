import { Validation } from '@/presentation/protocols/validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

export function makeAddSurveyValidation(): ValidationComposite {
  const validations: Validation[] = [];
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
}
