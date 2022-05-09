import { AuthInput, UserOutput } from "./user";

export type AuthLoginInput = Omit<AuthInput, "email">;

export type AuthRegisterInput = AuthInput;

export interface AuthRefreshTokenInput {
  refreshToken: string;
}

export type AuthLogoutInput = AuthRefreshTokenInput;

interface AuthTokenWithExpirationTime {
  token: string;
  expires: string;
}

export interface AuthTokens {
  access: AuthTokenWithExpirationTime;
  refresh: AuthTokenWithExpirationTime;
}

export interface AuthLoginOutput {
  user: UserOutput;
  tokens: AuthTokens;
}

export type AuthRefreshTokenOutput = AuthTokens;
