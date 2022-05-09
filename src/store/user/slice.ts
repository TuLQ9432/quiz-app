import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserQuestionOutput,
  UserAnswerList,
  UserResultList,
  UserQuestionListOutput,
  UserAnswer,
} from "../../models/question";

interface UserQuizState {
  isLoading: boolean;
  questionList: UserQuestionOutput[];
  questionCount: number;
  answerList: UserAnswerList;
  resultList: UserResultList;
}

function getInitialState(): UserQuizState {
  const questionList: UserQuestionOutput[] = JSON.parse(
    localStorage.getItem("questionList") || "[]"
  );
  const answerList: UserAnswerList = JSON.parse(
    localStorage.getItem("answerList") || "[]"
  );
  const resultList: UserResultList = JSON.parse(
    localStorage.getItem("resultList") || "[]"
  );
  return {
    isLoading: false,
    questionList: questionList,
    questionCount: questionList.length,
    answerList: answerList,
    resultList: resultList,
  };
}

const userQuizSlice = createSlice({
  name: "userQuiz",
  initialState: getInitialState(),
  reducers: {
    init(state) {
      state.isLoading = true;
      state.questionList.splice(0, state.questionList.length);
      state.questionCount = 0;
      state.answerList.splice(0, state.answerList.length);
      state.resultList.splice(0, state.resultList.length);
    },
    getQuestionList() {},
    getQuestionListPartiallySuccess(
      state,
      action: PayloadAction<UserQuestionListOutput>
    ) {
      state.isLoading = false;
      state.questionList = [...state.questionList, ...action.payload.results];
      state.questionCount = action.payload.totalResults;
    },
    saveAnswer(state, action: PayloadAction<UserAnswer>) {
      const answerListIndex = state.answerList
        .map((item) => item.id)
        .indexOf(action.payload.id);
      if (answerListIndex === -1) {
        state.answerList = [...state.answerList, action.payload];
      } else {
        state.answerList[answerListIndex] = action.payload;
      }
    },
    submitAnswerList() {},
    submitAnswerListSuccess(state, action: PayloadAction<UserResultList>) {
      state.resultList = action.payload;
    },
  },
});

export const userQuizActions = userQuizSlice.actions;
export const userQuizReducer = userQuizSlice.reducer;
