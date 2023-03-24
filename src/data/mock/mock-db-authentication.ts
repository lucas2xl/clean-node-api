import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';

export function mockUpdateAccessTokenRepository(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return;
    }
  }

  return new UpdateAccessTokenRepositoryStub();
}
