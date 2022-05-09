import { createContext, Dispatch, SetStateAction } from "react";
import { AdminQuestionOutput } from "../../../models/question";

type QuestionOutputOptional = AdminQuestionOutput | undefined;

export const QuestionOutputContext = createContext<{
  question: QuestionOutputOptional;
  setQuestion: Dispatch<SetStateAction<QuestionOutputOptional>>;
}>({
  question: undefined,
  setQuestion: () => {},
});
