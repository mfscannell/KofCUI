export interface ApiResponseError {
  error: string | { errors: Record<string, string> };
}
