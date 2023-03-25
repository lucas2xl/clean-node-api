import { AccountModel } from '@/domain/models/account-model';
import { AddAccountParams } from '@/domain/usecases/account/add-account-usecase';

export function mockAddAccountParams(): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}

export function mockAddAccountWithTokenParams(): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    token: 'any-token',
  };
}

export function mockAddAccountWithTokenAndRoleParams(
  role = 'admin',
): AddAccountParams {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    token: 'any-token',
    role,
  };
}

export function mockAccountModel(): AccountModel {
  return {
    id: 'any-id',
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}
