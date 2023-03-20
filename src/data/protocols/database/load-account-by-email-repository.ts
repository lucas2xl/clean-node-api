import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>;
}
