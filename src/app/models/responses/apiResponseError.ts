import { ProblemDetails } from "./problemDetails";

export interface ApiResponseError {
  error: ProblemDetails,
  message: string,
  name: string,
  ok: boolean,
  status: number,
  statusText: string,
  url: string
}
