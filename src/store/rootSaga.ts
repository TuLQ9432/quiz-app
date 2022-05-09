import { all } from "redux-saga/effects";
import authSaga from "./auth/saga";
import userQuizSaga from "./user/saga";

export default function* rootSaga() {
  yield all([authSaga(), userQuizSaga()]);
}
