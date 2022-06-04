export class KnightUser {
  accountActivated: boolean = false;
  resetPasswordAtNextLogin: boolean = false;

  constructor(fields?: {
    accountActivated: boolean,
    resetPasswordAtNextLogin: boolean
  }) {
    if (fields) {
      this.accountActivated = fields.accountActivated;
      this.resetPasswordAtNextLogin = fields.resetPasswordAtNextLogin;
    }
  }
}