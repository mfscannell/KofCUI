export class UpdateKnightPasswordRequest {
  knightId: number = 0;
  password: string = '';
  updatePasswordAtNextLogin: boolean = true;

  constructor(fields?: {
    knightId: number,
    password: string,
    updatePasswordAtNextLogin: boolean
  }) {
    if (fields) {
      this.knightId = fields.knightId || this.knightId;
      this.password = fields.password || this.password;
      this.updatePasswordAtNextLogin = fields.updatePasswordAtNextLogin || this.updatePasswordAtNextLogin;
    }
  }
}