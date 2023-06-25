export interface AuthenticationUsecase {
  auth(
    data: AuthenticationUsecase.Params,
  ): Promise<AuthenticationUsecase.Result>;
}

export namespace AuthenticationUsecase {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = string;
}
