import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { Validation } from '@/presentation/helpers/validators/validation';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate<T>(input: T): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
