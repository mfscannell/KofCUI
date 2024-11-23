export interface ApiResponseError {
  error: string | string[] | { errors: Record<string, string> };
}
