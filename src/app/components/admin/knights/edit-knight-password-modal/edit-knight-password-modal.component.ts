import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { KnightUser } from 'src/app/models/knightUser';
import { UpdateKnightPasswordRequest } from 'src/app/models/requests/updateKnightPasswordRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { AccountsService } from 'src/app/services/accounts.service';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'edit-knight-password-modal',
  templateUrl: './edit-knight-password-modal.component.html',
  styleUrls: ['./edit-knight-password-modal.component.scss']
})
export class EditKnightPasswordModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightsFullName: string = '';
  @Input() knightId: string = '';
  @Input() knightUser?: KnightUser;
  @Output() editKnightPasswordChanges = new EventEmitter<KnightUser>();
  @ViewChild('cancelEditKnightPasswordChanges', {static: false}) cancelEditKnightPasswordChanges: ElementRef | undefined;
  editKnightPasswordForm: UntypedFormGroup;
  
  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?"
  };
  private updateKnightPasswordSubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
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

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightPasswordForm = new UntypedFormGroup({
      accountActivated: new UntypedFormControl(),
      password: new UntypedFormControl(''),
      resetPasswordAtNextLogin: new UntypedFormControl()
    });

    if (this.knightUser) {
      this.editKnightPasswordForm.patchValue({
        accountActivated: this.knightUser.accountActivated,
        resetPasswordAtNextLogin: this.knightUser.resetPasswordAtNextLogin
      });
    }
  }

  private getPasswordRequirements() {
    const getPasswordRequirementsObserver = {
      next: (response: PasswordRequirements) => this.passwordRequirements = response,
      error: (err: ApiResponseError) => this.logError("Error Getting password requirements.", err),
      complete: () => console.log('Password requirements retrieved.')
    };

    this.getPasswordRequirementsSubscription = this.accountsService.getPasswordRequirements().subscribe(getPasswordRequirementsObserver);
  }

  isAccountActivated() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const isAccountActive = rawForm.accountActivated as boolean;

    return isAccountActive;
  }

  isPasswordDirty() {
    const newPasswordInput = this.editKnightPasswordForm.get('password');

    return newPasswordInput?.dirty;
  }

  hasRequiredLength() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    const hasLength = newPassword.length >= this.passwordRequirements?.requiredLength;

    return hasLength;
  }

  hasDistinctCharacters() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    const numDistinctCharacters = new Set(newPassword).size;

    return numDistinctCharacters >= this.passwordRequirements.requiredUniqueChars;
  }

  hasUpperCase() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    const hasUpper = /[A-Z]/.test(newPassword);

    return hasUpper;
  }

  hasLowerCase() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    const hasLower = /[a-z]/.test(newPassword);

    return hasLower;
  }

  hasDigit() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    const hasDigitChar = /[0-9]/.test(newPassword);

    return hasDigitChar;
  }

  hasAllowedSpecialCharacter() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const newPassword = rawForm.password as string;
    let hasSpecialCharacter = false;

    for (let i = 0; i < this.passwordRequirements.allowedNonAlphanumericCharacters.length; i++) {
      const specialChar = this.passwordRequirements.allowedNonAlphanumericCharacters.charAt(i);

      if (newPassword.indexOf(specialChar) > -1) {
        hasSpecialCharacter = true;
      }
    }

    return hasSpecialCharacter;
  }

  onSubmitEditKnightPassword() {
    const request = this.mapFormToRequest();
    this.updateKnightPassword(request);
  }

  private mapFormToRequest() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const request: UpdateKnightPasswordRequest = {
      knightId: this.knightId,
      accountActivated: rawForm.accountActivated,
      password: rawForm.password,
      resetPasswordAtNextLogin: rawForm.resetPasswordAtNextLogin
    };

    return request;
  }

  private updateKnightPassword(request: UpdateKnightPasswordRequest) {
    const knightObserver = {
      next: (response: KnightUser) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError("Error Updating Knight", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightPasswordSubscription= this.knightsService.updateKnightPassword(request).subscribe(knightObserver);
  }

  private passBackResponse(response: KnightUser) {
    this.editKnightPasswordChanges.emit(response);
    this.cancelEditKnightPasswordChanges?.nativeElement.click();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorSaving = true;
  }
}
