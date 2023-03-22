import { makeAddSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey-controller-factory';
import { Validation } from '@/presentation/protocols/validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

jest.mock('@/validations/validators/validation-composite');

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyControllerFactory();
    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
