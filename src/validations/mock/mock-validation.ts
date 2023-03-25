import { Validation } from '@/presentation/protocols/validation';
import { EmailValidator } from '@/validations/protocols/email-validator';

export function mockEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

export function mockValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
}
