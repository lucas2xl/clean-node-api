import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>;
}
