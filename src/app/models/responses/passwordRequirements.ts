export interface PasswordRequirements {
  requiredLength: number;
  requiredUniqueChars: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireNonAlphanumeric: boolean;
  allowedNonAlphanumericCharacters: string;
}