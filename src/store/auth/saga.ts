import { PayloadAction } from "@reduxjs/toolkit";
import {
  call,
  put,
  fork,
  race,
  take,
  delay,
  select,
  takeLatest,
} from "redux-saga/effects";
import {
  AuthLoginInput,
  AuthLoginOutput,
  AuthRegisterInput,
  AuthLogoutInput,
  AuthRefreshTokenInput,
  AuthRefreshTokenOutput,
} from "../../models/auth";
import { ApiError } from "../../models/error";
import { UserOutput } from "../../models/user";
import authApi from "../../services/auth";
import userApi from "../../services/user";
import { authActions } from "./slice";
import { userQuizActions } from "../user/slice";
import { RootState } from "..";

function decodeTokenPayload(token: string) {
  interface DecodedTokenPayload {
    sub: string;
    iat: number;
    exp: number;
    type: string;
  }

  const payload = token.split(".")[1];
  const result: DecodedTokenPayload = JSON.parse(window.atob(payload));
  return result;
}

function* handleLogin(action: PayloadAction<AuthLoginInput>) {
  yield put(userQuizActions.init());
  try {
    const response: AuthLoginOutput = yield call(authApi.login, action.payload);
    yield put(authActions.loginSuccess(response));
    localStorage.setItem("accessToken", response.tokens.access.token);
    localStorage.setItem("refreshToken", response.tokens.refresh.token);
  } catch {
    yield put(authActions.authFailed("Wrong username or password!"));
  }
}

function* handleRegister(action: PayloadAction<AuthRegisterInput>) {
  yield put(userQuizActions.init());
  try {
    const response: AuthLoginOutput = yield call(
      authApi.register,
      action.payload
    );
    yield put(authActions.loginSuccess(response));
    localStorage.setItem("accessToken", response.tokens.access.token);
    localStorage.setItem("refreshToken", response.tokens.refresh.token);
  } catch (error) {
    const errorResponse = (error as ApiError).response;
    if (errorResponse) {
      yield put(authActions.authFailed(errorResponse.data.message));
    } else {
      console.error(errorResponse);
    }
  }
}

function* handleLogout(action: PayloadAction<AuthLogoutInput>) {
  yield call(authApi.logout, action.payload);
  yield put(authActions.authReset());
  localStorage.clear();
}

function* handleRefreshLogin() {
  const accessToken: string = yield select(
    (state: RootState) => state.auth.accessToken
  );
  const { sub: userId, exp: tokenExpirationTime } =
    decodeTokenPayload(accessToken);
  if (Date.now() < tokenExpirationTime) {
    const user: UserOutput = yield call(userApi.get, userId);
    yield put(authActions.refreshLoginSuccess(user));
  } else {
    const refreshToken: string = yield select(
      (state: RootState) => state.auth.refreshToken
    );
    yield put(authActions.refreshToken({ refreshToken: refreshToken }));
    yield take(authActions.refreshTokenSuccess.type);
    try {
      const user: UserOutput = yield call(userApi.get, userId);
      yield put(authActions.refreshLoginSuccess(user));
    } catch {
      yield put(authActions.authReset());
      localStorage.clear();
    }
  }
}

function* handleRefreshToken(action: PayloadAction<AuthRefreshTokenInput>) {
  try {
    const response: AuthRefreshTokenOutput = yield call(
      authApi.refreshToken,
      action.payload
    );
    yield put(authActions.refreshTokenSuccess(response));
    localStorage.setItem("accessToken", response.access.token);
    localStorage.setItem("refreshToken", response.refresh.token);
  } catch {
    yield put(authActions.authReset());
    localStorage.clear();
  }
}

function* refreshTokensPeriodically() {
  const mainTask = function* () {
    let accessToken = "";
    let refreshToken = "";
    while (true) {
      const {
        loginSuccess,
        refreshLoginSuccess,
        refreshTokenSuccess,
      }: {
        loginSuccess: PayloadAction<AuthLoginOutput>;
        refreshLoginSuccess: PayloadAction<UserOutput>;
        refreshTokenSuccess: PayloadAction<AuthRefreshTokenOutput>;
      } = yield race({
        loginSuccess: take(authActions.loginSuccess.type),
        refreshLoginSuccess: take(authActions.refreshLoginSuccess.type),
        refreshTokenSuccess: take(authActions.refreshTokenSuccess.type),
      });

      if (loginSuccess) {
        accessToken = loginSuccess.payload.tokens.access.token;
        refreshToken = loginSuccess.payload.tokens.refresh.token;
      } else if (refreshLoginSuccess) {
        accessToken = yield select(
          (state: RootState) => state.auth.accessToken
        );
        refreshToken = yield select(
          (state: RootState) => state.auth.refreshToken
        );
      } else if (refreshTokenSuccess) {
        accessToken = refreshTokenSuccess.payload.access.token;
        refreshToken = refreshTokenSuccess.payload.refresh.token;
      }

      const { exp: tokenExpirationTime } = decodeTokenPayload(accessToken);
      yield delay((tokenExpirationTime - 10) * 1000 - Date.now());

      yield put(
        authActions.refreshToken({
          refreshToken: refreshToken,
        })
      );
    }
  };

  yield fork(function* () {
    yield race({
      task: call(mainTask),
      cancel: take(authActions.authReset.type),
    });
  });
}

export default function* authSaga() {
  yield takeLatest(authActions.login.type, handleLogin);
  yield takeLatest(authActions.register.type, handleRegister);
  yield takeLatest(authActions.logout.type, handleLogout);
  yield takeLatest(authActions.refreshLogin.type, handleRefreshLogin);
  yield takeLatest(authActions.refreshToken.type, handleRefreshToken);
  yield refreshTokensPeriodically();
}
