import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { ComparerFieldsValidation } from '@/presentation/helpers/validators/comparer-fields-validation';
import { Validation } from '@/presentation/protocols/validation';

function makeSut(): Validation {
  return new ComparerFieldsValidation('field', 'fieldToCompare');
}

describe('ComparerField Validation', () => {
  it('should return a InvalidParamError of validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any-field',
      fieldToCompare: 'wrong-field',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any-field',
      fieldToCompare: 'any-field',
    });

    expect(error).toBeFalsy();
  });
});
