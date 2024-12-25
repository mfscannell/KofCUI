export interface ApiResponseError {
  title: string,
  status: number,
  detail: string,
  instance: string,
  error: string | string[] | { errors: Record<string, string> };
}
