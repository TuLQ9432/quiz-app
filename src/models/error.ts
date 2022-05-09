import { AxiosError } from "axios";

interface ErrorResponse {
  code: number;
  message: string;
}

export type ApiError = AxiosError<ErrorResponse>;
