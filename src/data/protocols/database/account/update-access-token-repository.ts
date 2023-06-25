export interface UpdateAccessTokenRepository {
  updateAccessToken(
    data: UpdateAccessTokenRepository.Params,
  ): Promise<UpdateAccessTokenRepository.Result>;
}

export namespace UpdateAccessTokenRepository {
  export type Params = {
    id: string;
    token: string;
  };
  export type Result = void;
}
