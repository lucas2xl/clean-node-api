import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation';
import { Validation } from '@/presentation/helpers/validators/validation';

function makeSut(): Validation {
  return new RequiredFieldValidation('field');
}

describe('RequiredField Validation', () => {
  it('should return a MissingParamError of validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any-name' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
