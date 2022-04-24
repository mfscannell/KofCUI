export class LogInRequest {
  username: string = '';
  password: string = '';

  constructor(fields: {
    username: string,
    password: string
  }) {
    if (fields) {
      this.username = fields.username || this.username;
      this.password = fields.password || this.password;
    }
  }
}