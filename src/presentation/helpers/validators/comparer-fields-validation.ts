import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { Validation } from '@/presentation/protocols/validation';

export class ComparerFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToComparerName: string,
  ) {}

  validate<T>(input: T): Error {
    if (input[this.fieldName] !== input[this.fieldToComparerName]) {
      return new InvalidParamError(this.fieldToComparerName);
    }
  }
}
