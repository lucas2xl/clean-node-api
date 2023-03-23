import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}
