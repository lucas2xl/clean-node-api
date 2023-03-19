import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate<T>(_: T): Error {
      return new MissingParamError('field');
    }
  }

  return new ValidationStub();
}

function makeSut(): Validation {
  const validationStub = makeValidation();
  return new ValidationComposite([validationStub]);
}

describe('Validation Composite', () => {
  it('should return an error if amy validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any-value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
