import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { Validation } from '@/presentation/helpers/validators/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';

interface SutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate<T>(_: T): Error {
      return null;
    }
  }

  return new ValidationStub();
}

function makeSut(): SutTypes {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return { sut, validationStub };
}

describe('Validation Composite', () => {
  it('should return an error if amy validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any-value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
