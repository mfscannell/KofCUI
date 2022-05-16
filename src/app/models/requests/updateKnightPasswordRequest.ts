export class UpdateKnightPasswordRequest {
  knightId: number = 0;
  accountActivated: boolean = false;
  password: string = '';
  updatePasswordAtNextLogin: boolean = true;

  constructor(fields?: {
    knightId: number,
    accountActivated: boolean,
    password: string,
    updatePasswordAtNextLogin: boolean
  }) {
    if (fields) {
      this.knightId = fields.knightId || this.knightId;
      this.accountActivated = fields.accountActivated;
      this.password = fields.password || this.password;
      this.updatePasswordAtNextLogin = fields.updatePasswordAtNextLogin || this.updatePasswordAtNextLogin;
    }
  }
}