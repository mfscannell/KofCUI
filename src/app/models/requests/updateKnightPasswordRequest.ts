export interface UpdateKnightPasswordRequest {
  knightId: string;
  accountActivated: boolean;
  password: string;
  resetPasswordAtNextLogin: boolean;
}
