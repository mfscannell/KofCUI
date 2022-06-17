export class ChangePassWordRequest {
  knightId?: number;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;

  constructor(fields: {
    knightId: number,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  }) {
    if (fields) {
      this.knightId = fields.knightId || this.knightId;
      this.oldPassword = fields.oldPassword || this.oldPassword;
      this.newPassword = fields.newPassword || this.newPassword;
      this.confirmPassword = fields.confirmPassword || this.confirmPassword;
    }
  }
}