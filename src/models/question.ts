import { PaginatedListOutput } from "./list";

export interface AdminQuestionOutput {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctanswer: string;
  id: string;
}

export type AdminQuestionInput = Omit<AdminQuestionOutput, "id">;

export type QuestionId = AdminQuestionOutput["id"];

export type UserQuestionOutput = Omit<AdminQuestionOutput, "correctanswer">;

export type AdminQuestionListOutput = PaginatedListOutput<AdminQuestionOutput>;

export type UserQuestionListOutput = PaginatedListOutput<UserQuestionOutput>;

export type UserAnswer = Pick<AdminQuestionOutput, "id" | "correctanswer">;

export type UserAnswerList = UserAnswer[];

export interface UserResult extends UserAnswer {
  result: boolean;
}

export type UserResultList = UserResult[];
