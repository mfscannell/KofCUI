export interface ChangePassWordRequest {
  knightId: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}