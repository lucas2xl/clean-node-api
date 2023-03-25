import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { Validation } from '@/presentation/protocols/validation';
import { mockValidation } from '@/validations/mock/mock-validation';
import { ValidationComposite } from '@/validations/validators/validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

function makeSut(): SutTypes {
  const validationStubs = [mockValidation(), mockValidation()];
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
