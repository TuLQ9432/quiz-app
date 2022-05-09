import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthRegisterInput,
  AuthLoginInput,
  AuthLoginOutput,
  AuthLogoutInput,
  AuthRefreshTokenInput,
  AuthRefreshTokenOutput,
} from "../../models/auth";
import { UserOutput } from "../../models/user";

export enum AuthStatuses {
  LOGGED_OUT = "LOGGED_OUT",
  LOGGING_IN = "LOGGING_IN",
  LOGGED_IN = "LOGGED_IN",
  LOGGING_OUT = "LOGGING_OUT",
}

interface AuthState {
  authStatus: AuthStatuses;
  showError: boolean;
  errorMessage?: string;
  user?: UserOutput;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  authStatus: AuthStatuses.LOGGED_OUT,
  showError: false,
  accessToken: localStorage.getItem("accessToken") || undefined,
  refreshToken: localStorage.getItem("refreshToken") || undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    register(state, _: PayloadAction<AuthRegisterInput>) {
      state.authStatus = AuthStatuses.LOGGING_IN;
      state.showError = false;
    },
    login(state, _: PayloadAction<AuthLoginInput>) {
      state.authStatus = AuthStatuses.LOGGING_IN;
      state.showError = false;
    },
    loginSuccess(state, action: PayloadAction<AuthLoginOutput>) {
      state.authStatus = AuthStatuses.LOGGED_IN;
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.access.token;
      state.refreshToken = action.payload.tokens.refresh.token;
    },
    refreshLogin() {},
    refreshLoginSuccess(state, action: PayloadAction<UserOutput>) {
      state.authStatus = AuthStatuses.LOGGED_IN;
      state.user = action.payload;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.authStatus = AuthStatuses.LOGGED_OUT;
      state.showError = true;
      state.errorMessage = action.payload;
    },
    authReset(state) {
      state.authStatus = AuthStatuses.LOGGED_OUT;
      state.showError = false;
      delete state.errorMessage;
      delete state.user;
      delete state.accessToken;
      delete state.refreshToken;
    },
    logout(state, _: PayloadAction<AuthLogoutInput>) {
      state.authStatus = AuthStatuses.LOGGING_OUT;
    },
    refreshToken(state, _: PayloadAction<AuthRefreshTokenInput>) {
      state.authStatus = AuthStatuses.LOGGED_IN;
    },
    refreshTokenSuccess(state, action: PayloadAction<AuthRefreshTokenOutput>) {
      state.authStatus = AuthStatuses.LOGGED_IN;
      state.accessToken = action.payload.access.token;
      state.refreshToken = action.payload.refresh.token;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
