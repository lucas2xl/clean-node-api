import { makeSaveSurveyResultValidation } from '@/main/factories/controllers/survey-result/save-survey-result-validation-factory';
import { Validation } from '@/presentation/protocols/validation';
import { RequiredFieldValidation } from '@/validations/validators/required-field-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

jest.mock('@/validations/validators/validation-composite');

describe('SaveSurveyResultValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [];
    for (const field of ['answer', 'surveyId', 'accountId']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
