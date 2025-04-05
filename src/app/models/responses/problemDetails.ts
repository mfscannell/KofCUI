export interface ProblemDetails {
  title: string,
  status: number,
  detail: string,
  instance: string,
  errors: Record<string, string[]>;
}