export class KnightUser {
  accountActivated: boolean = false;

  constructor(fields?: {
    accountActivated: boolean
  }) {
    if (fields) {
      this.accountActivated = fields.accountActivated;
    }
  }
}