import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { Validation } from '@/presentation/helpers/validators/validation';
import { EmailValidator } from '@/presentation/protocols/email-validator';

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
