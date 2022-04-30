export class UpdateKnightPasswordResponse {
  success: boolean = false;
  errorMessage: string = ''

  constructor(fields?: {
    success: boolean,
    errorMessage: string}) {
      if (fields) {
        this.success = fields.success || this.success;
        this.errorMessage = fields.errorMessage || this.errorMessage;
      }
  }
}