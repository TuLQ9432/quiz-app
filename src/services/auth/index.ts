import rootApi from "../root-api";
import {
  AuthRegisterInput,
  AuthLoginInput,
  AuthLoginOutput,
  AuthLogoutInput,
  AuthRefreshTokenInput,
  AuthRefreshTokenOutput,
} from "../../models/auth";

namespace authApi {
  const parentUrl = "/auth";

  export function register(data: AuthRegisterInput) {
    return rootApi.post<AuthLoginOutput, AuthLoginOutput, AuthRegisterInput>(
      parentUrl + "/register",
      data
    );
  }

  export function login(data: AuthLoginInput) {
    return rootApi.post<AuthLoginOutput, AuthLoginOutput, AuthLoginInput>(
      parentUrl + "/login",
      data
    );
  }

  export function logout(data: AuthLogoutInput) {
    return rootApi.post<never, never, AuthLogoutInput>(
      parentUrl + "/logout",
      data
    );
  }

  export function refreshToken(data: AuthRefreshTokenInput) {
    return rootApi.post<
      AuthRefreshTokenOutput,
      AuthRefreshTokenOutput,
      AuthRefreshTokenInput
    >(parentUrl + "/refresh-tokens", data);
  }
}

export default authApi;
