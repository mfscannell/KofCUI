import { Pipe, PipeTransform } from '@angular/core';
import { PasswordRequirements } from '../models/responses/passwordRequirements';
@Pipe({
    name: 'meetsPasswordRequrements',
    pure: true,
    standalone: false
})
export class MeetsPasswordRequrementsPipe implements PipeTransform {
  transform(password: string, passwordRequirement: 'requireUppercase' | 'requireLowercase' | 'requireDigit' | 'requiredUniqueChars' | 'requiredLength' | 'requireNonAlphanumeric', passwordRequirements?: PasswordRequirements): boolean {
    switch (passwordRequirement) {
      case 'requireUppercase': {
        const hasUpper = /[A-Z]/.test(password);
        return hasUpper;
      }
      case 'requireLowercase': {
        const hasLower = /[a-z]/.test(password);
        return hasLower;
      }
      case 'requireDigit': {
        const hasDigit = /[0-9]/.test(password);
        return hasDigit;
      }
      case 'requiredUniqueChars': {
        if (passwordRequirements) {
          const numDistinctCharacters = new Set(password).size;

          return numDistinctCharacters >= passwordRequirements.requiredUniqueChars;
        }

        return false;
      }
      case 'requiredLength': {
        if (passwordRequirements) {
          return password.length > passwordRequirements?.requiredLength;
        }

        return false;
      }
      case 'requireNonAlphanumeric': {
        if (passwordRequirements) {
          let hasSpecialCharacter = false;

          for (let i = 0; i < passwordRequirements.allowedNonAlphanumericCharacters.length; i++) {
            const specialChar = passwordRequirements.allowedNonAlphanumericCharacters.charAt(i);

            if (password.indexOf(specialChar) > -1) {
              hasSpecialCharacter = true;
            }
          }

          return hasSpecialCharacter;
        }

        return false;
      }
      default:
        return false;
    }
  }
}