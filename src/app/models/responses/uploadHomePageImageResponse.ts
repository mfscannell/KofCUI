export class UploadHomePageImageResponse {
  success: boolean = false;

  constructor(fields: {
    success: boolean
  }) {
    if (fields) {
      this.success = fields.success;
    }
  }
}