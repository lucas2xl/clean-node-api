import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByTokenUsecase {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}
