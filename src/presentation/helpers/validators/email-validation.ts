import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { Validation } from '@/presentation/protocols/validation';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate<T>(input: T): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
