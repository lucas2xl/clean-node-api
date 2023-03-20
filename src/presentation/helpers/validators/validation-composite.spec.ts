import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';
import { Validation } from '@/presentation/protocols/validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
}

function makeSut(): SutTypes {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
}

describe('Validation Composite', () => {
  it('should return an error if amy validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any-value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any-value' });

    expect(error).toEqual(new Error());
  });

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any-value' });

    expect(error).toBeFalsy();
  });
});
