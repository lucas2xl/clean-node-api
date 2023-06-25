export interface AddSurveyUsecase {
  add(data: AddSurveyUsecase.Params): Promise<AddSurveyUsecase.Result>;
}

export namespace AddSurveyUsecase {
  type Answer = {
    image?: string;
    answer: string;
  };
  export type Params = {
    question: string;
    answers: Answer[];
    createdAt: Date;
  };

  export type Result = void;
}
