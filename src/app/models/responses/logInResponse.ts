import { Knight } from "../knight";

export class LogInResponse {
  webToken: string = '';
  knight?: Knight;
  roles: string[] = [];

  constructor(fields: {
    webToken: string,
    knight: Knight,
    roles: string[]
  }) {
    if (fields) {
      this.webToken = fields.webToken || this.webToken;
      this.knight = fields.knight || this.knight;
      this.roles = fields.roles || this.roles;
    }
  }
}