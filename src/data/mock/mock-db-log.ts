import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';

export function mockLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(): Promise<void> {
      return;
    }
  }

  return new LogErrorRepositoryStub();
}
