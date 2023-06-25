export interface LogErrorRepository {
  logError(data: LogErrorRepository.Params): Promise<LogErrorRepository.Result>;
}

export namespace LogErrorRepository {
  export type Params = {
    stack: string;
  };
  export type Result = void;
}
