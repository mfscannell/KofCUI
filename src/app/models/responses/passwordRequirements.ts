export class PasswordRequirements {
  requiredLength: number = 8;
  requiredUniqueChars: number = 1;
  requireUppercase: boolean = false;
  requireLowercase: boolean = false;
  requireDigit: boolean = false;
  requireNonAlphanumeric: boolean = false;
  allowedNonAlphanumericCharacters: string = '';

  constructor(fields: {
    requiredLength: number,
    requiredUniqueChars: number,
    requireUppercase: boolean,
    requireLowercase: boolean,
    requireDigit: boolean,
    requireNonAlphanumeric: boolean,
    allowedNonAlphanumericCharacters: string
  }) {
    if (fields) {
      this.requireUppercase = fields.requireUppercase || this.requireUppercase;
      this.requireLowercase = fields.requireLowercase || this.requireLowercase;
      this.requiredUniqueChars = fields.requiredUniqueChars || this.requiredUniqueChars;
      this.requireDigit = fields.requireDigit || this.requireDigit;
      this.requiredLength = fields.requiredLength || this.requiredLength;
      this.requireNonAlphanumeric = fields.requireNonAlphanumeric || this.requireNonAlphanumeric;
      this.allowedNonAlphanumericCharacters = fields.allowedNonAlphanumericCharacters || this.allowedNonAlphanumericCharacters;
    }
  }
}