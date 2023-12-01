import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { KnightUser } from 'src/app/models/knightUser';
import { UpdateKnightPasswordRequest } from 'src/app/models/requests/updateKnightPasswordRequest';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { AccountsService } from 'src/app/services/accounts.service';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'kofc-edit-knight-password-modal',
  templateUrl: './edit-knight-password-modal.component.html',
  styleUrls: ['./edit-knight-password-modal.component.scss']
})
export class EditKnightPasswordModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() knightsFullName: string = '';
  @Input() knightId: number = 0;
  @Input() knightUser?: KnightUser;
  editKnightPasswordForm: UntypedFormGroup;
  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: '`~!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?'
  };
  private updateKnightPasswordSubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService,
    private accountsService: AccountsService) {
    this.editKnightPasswordForm = new UntypedFormGroup({
      accountActivated: new UntypedFormControl(),
      password: new UntypedFormControl(''),
      resetPasswordAtNextLogin: new UntypedFormControl()
    });
  }

  ngOnInit() {
    if (this.knightUser) {
      this.editKnightPasswordForm.patchValue({
        accountActivated: this.knightUser.accountActivated,
        resetPasswordAtNextLogin: this.knightUser.resetPasswordAtNextLogin
      });
    }

    this.getPasswordRequirements();
  }

  ngOnDestroy() {
    if (this.updateKnightPasswordSubscription) {
      this.updateKnightPasswordSubscription.unsubscribe();
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

  isAccountActivated() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let isAccountActive = rawForm.accountActivated as boolean;

    return isAccountActive;
  }

  isPasswordDirty() {
    let newPasswordInput = this.editKnightPasswordForm.get('password');

    return newPasswordInput?.dirty;
  }

  hasRequiredLength() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let hasLength = newPassword.length >= this.passwordRequirements?.requiredLength;

    return hasLength;
  }

  hasDistinctCharacters() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let numDistinctCharacters = new Set(newPassword).size;

    return numDistinctCharacters >= this.passwordRequirements.requiredUniqueChars;
  }

  hasUpperCase() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let hasUpper = /[A-Z]/.test(newPassword);

    return hasUpper;
  }

  hasLowerCase() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let hasLower = /[a-z]/.test(newPassword);

    return hasLower;
  }

  hasDigit() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let hasDigitChar = /[0-9]/.test(newPassword);

    return hasDigitChar;
  }

  hasAllowedSpecialCharacter() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let newPassword = rawForm.password as string;
    let hasSpecialCharacter = false;

    for (let i = 0; i < this.passwordRequirements.allowedNonAlphanumericCharacters.length; i++) {
      let specialChar = this.passwordRequirements.allowedNonAlphanumericCharacters.charAt(i);

      if (newPassword.indexOf(specialChar) > -1) {
        hasSpecialCharacter = true;
      }
    }

    return hasSpecialCharacter;
  }

  onSubmitEditKnightPassword() {
    let request = this.mapFormToRequest();
    this.updateKnightPassword(request);
  }

  private mapFormToRequest() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let request: UpdateKnightPasswordRequest = {
      knightId: this.knightId,
      accountActivated: rawForm.accountActivated,
      password: rawForm.password,
      resetPasswordAtNextLogin: rawForm.resetPasswordAtNextLogin
    };

    return request;
  }

  private updateKnightPassword(request: UpdateKnightPasswordRequest) {
    let knightObserver = {
      next: (response: KnightUser) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightPasswordSubscription= this.knightsService.updateKnightPassword(request).subscribe(knightObserver);
  }

  private passBackResponse(response: KnightUser) {
    this.activeModal.close(response);
  }

  private logError(message: string, err: any) {
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
