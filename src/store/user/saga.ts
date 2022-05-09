import { call, put, select, takeLatest } from "@redux-saga/core/effects";
import {
  UserQuestionListOutput,
  UserQuestionOutput,
  UserAnswerList,
  UserResultList,
} from "../../models/question";
import questionApi from "../../services/question";
import { userQuizActions } from "./slice";
import { RootState } from "..";

function* handleGetQuestionList() {
  let page = 0,
    pageCount = 0;
  do {
    page++;
    const response: UserQuestionListOutput = yield call(
      questionApi.getQuestionList,
      page
    );
    yield put(userQuizActions.getQuestionListPartiallySuccess(response));
    pageCount = response.totalPages;
  } while (page < pageCount);
  const questionList: UserQuestionOutput[] = yield select(
    (state: RootState) => state.userQuiz.questionList
  );
  localStorage.setItem("questionList", JSON.stringify(questionList));
}

function* handleSaveAnswers() {
  const answerList: UserAnswerList = yield select(
    (state: RootState) => state.userQuiz.answerList
  );
  localStorage.setItem("answerList", JSON.stringify(answerList));
}

function* handleSubmitAnswerList() {
  const answerList: UserAnswerList = yield select(
    (state: RootState) => state.userQuiz.answerList
  );
  const response: UserResultList = yield call(
    questionApi.submitAnswerList,
    answerList
  );
  if (response.length === 0)
    response.push({
      id: "",
      correctanswer: "",
      result: false,
    });
  yield put(userQuizActions.submitAnswerListSuccess(response));
  localStorage.setItem("resultList", JSON.stringify(response));
  localStorage.removeItem("answerList");
}

export default function* userQuizSaga() {
  yield takeLatest(userQuizActions.getQuestionList.type, handleGetQuestionList);
  yield takeLatest(userQuizActions.saveAnswer.type, handleSaveAnswers);
  yield takeLatest(
    userQuizActions.submitAnswerList.type,
    handleSubmitAnswerList
  );
}
