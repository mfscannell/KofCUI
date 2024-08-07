import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ChangePassWordRequest } from 'src/app/models/requests/changePasswordRequest';
import { ChangePasswordResponse } from 'src/app/models/responses/changePasswordResponse';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'kofc-edit-account-security-modal',
  templateUrl: './edit-account-security-modal.component.html',
  styleUrls: ['./edit-account-security-modal.component.scss']
})
export class EditAccountSecurityModalComponent implements OnInit, OnDestroy {
  @Input() knightId?: number;
  public editAccountSecurityForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: '`~!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?'
  };
  private updateAccountSecuritySubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private accountsService: AccountsService) {
      this.editAccountSecurityForm = new UntypedFormGroup({
        knightId: new UntypedFormControl(0),
        oldPassword: new UntypedFormControl(''),
        newPassword: new UntypedFormControl(''),
        confirmPassword: new UntypedFormControl('')
      });
    }

  ngOnInit() {
    if (this.knightId) {
      this.editAccountSecurityForm.patchValue({
        knightId: this.knightId
      })
    }

    this.getPasswordRequirements();
  }

  ngOnDestroy() {
    if (this.updateAccountSecuritySubscription) {
      this.updateAccountSecuritySubscription.unsubscribe();
    }

    if (this.getPasswordRequirementsSubscription) {
      this.getPasswordRequirementsSubscription.unsubscribe();
    }
  }

  private getPasswordRequirements() {
    let getPasswordRequirementsObserver = {
      next: (response: PasswordRequirements) => this.passwordRequirements = response,
      error: (err: any) => this.logError("Error Getting password requirements.", err),
      complete: () => console.log('Password requirements retrieved.')
    };

    this.getPasswordRequirementsSubscription = this.accountsService.getPasswordRequirements().subscribe(getPasswordRequirementsObserver);
  }

  public hasRequiredLength() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasLength = newPassword.length >= this.passwordRequirements?.requiredLength;

    return hasLength;
  }

  public isPasswordDirty() {
    let newPasswordInput = this.editAccountSecurityForm.get('newPassword');

    return newPasswordInput?.dirty;
  }

  public hasDistinctCharacters() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let numDistinctCharacters = new Set(newPassword).size;

    return numDistinctCharacters >= this.passwordRequirements.requiredUniqueChars;
  }

  public hasUpperCase() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasUpper = /[A-Z]/.test(newPassword);

    return hasUpper;
  }

  public hasLowerCase() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasLower = /[a-z]/.test(newPassword);

    return hasLower;
  }

  public hasDigit() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasDigitChar = /[0-9]/.test(newPassword);

    return hasDigitChar;
  }

  public hasAllowedSpecialCharacter() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasSpecialCharacter = false;

    for (let i = 0; i < this.passwordRequirements.allowedNonAlphanumericCharacters.length; i++) {
      let specialChar = this.passwordRequirements.allowedNonAlphanumericCharacters.charAt(i);

      if (newPassword.indexOf(specialChar) > -1) {
        hasSpecialCharacter = true;
      }
    }

    return hasSpecialCharacter;
  }

  public onSubmitUpdateSecurity() {
    let changePasswordRequest = this.mapFormToChangePasswordRequest();
    this.updateAccountSecurity(changePasswordRequest);
  }

  private mapFormToChangePasswordRequest(): ChangePassWordRequest {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let changePasswordRequest: ChangePassWordRequest = {
      knightId: rawForm.knightId,
      oldPassword: rawForm.oldPassword,
      newPassword: rawForm.newPassword,
      confirmPassword: rawForm.confirmPassword
    };

    return changePasswordRequest;
  }

  private updateAccountSecurity(knight: ChangePassWordRequest) {
    let changePasswordObserver = {
      next: (response: ChangePasswordResponse) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight.", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateAccountSecuritySubscription = this.accountsService.changePassword(knight).subscribe(changePasswordObserver);
  }

  private passBackResponse(knight: ChangePasswordResponse) {
    this.activeModal.close(knight);
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorSaving = true;
  }
}
