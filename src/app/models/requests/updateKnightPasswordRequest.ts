export interface UpdateKnightPasswordRequest {
  knightId: number;
  accountActivated: boolean;
  password: string;
  resetPasswordAtNextLogin: boolean;
}