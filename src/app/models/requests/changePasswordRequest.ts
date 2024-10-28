export interface ChangePassWordRequest {
  knightId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
