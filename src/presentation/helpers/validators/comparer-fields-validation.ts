import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { Validation } from '@/presentation/helpers/validators/validation';

export class ComparerFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToComparerName: string,
  ) {}

  validate<T>(input: T): Error {
    if (this.fieldName !== this.fieldToComparerName) {
      return new InvalidParamError(this.fieldToComparerName);
    }
  }
}
