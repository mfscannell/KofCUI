import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditKnightPasswordFormGroup } from 'src/app/forms/editKnightPasswordFormGroup';

import { KnightUser } from 'src/app/models/knightUser';
import { UpdateKnightPasswordRequest } from 'src/app/models/requests/updateKnightPasswordRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { AccountsService } from 'src/app/services/accounts.service';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'edit-knight-password-modal',
  templateUrl: './edit-knight-password-modal.component.html',
  styleUrls: ['./edit-knight-password-modal.component.scss'],
})
export class EditKnightPasswordModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightsFullName: string = '';
  @Input() knightId: string = '';
  @Output() editKnightPasswordChanges = new EventEmitter<KnightUser>();
  @ViewChild('cancelEditKnightPasswordChanges', { static: false })
  cancelEditKnightPasswordChanges: ElementRef | undefined;
  editKnightPasswordForm: FormGroup<EditKnightPasswordFormGroup>;

  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: '`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?',
  };
  private updateKnightPasswordSubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private knightsService: KnightsService,
    private accountsService: AccountsService,
  ) {
    this.editKnightPasswordForm = this.initForm();
  }

  ngOnInit() {
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
  }

  public resetForm(knightUser?: KnightUser) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightPasswordForm = this.initForm();
    this.editKnightPasswordForm.markAsPristine();
      this.editKnightPasswordForm.markAsUntouched();

    if (knightUser) {
      this.patchForm(knightUser);
    }
  }

  private initForm(): FormGroup<EditKnightPasswordFormGroup> {
    return new FormGroup<EditKnightPasswordFormGroup>({
      accountActivated: new FormControl<boolean>(false, { nonNullable: true }),
      password: new FormControl<string>('', { nonNullable: true }),
      resetPasswordAtNextLogin: new FormControl<boolean>(false, { nonNullable: true }),
    });
  }

  private patchForm(knightUser: KnightUser) {
    this.editKnightPasswordForm.patchValue({
      accountActivated: knightUser.accountActivated,
      resetPasswordAtNextLogin: knightUser.resetPasswordAtNextLogin,
    });
  }

  private getPasswordRequirements() {
    const getPasswordRequirementsObserver = {
      next: (response: PasswordRequirements) => (this.passwordRequirements = response),
      error: (err: ApiResponseError) => this.logError('Error Getting password requirements.', err),
      complete: () => console.log('Password requirements retrieved.'),
    };

    this.getPasswordRequirementsSubscription = this.accountsService
      .getPasswordRequirements()
      .subscribe(getPasswordRequirementsObserver);
  }

  onSubmitEditKnightPassword() {
    const request = this.mapFormToRequest();
    this.updateKnightPassword(request);
  }

  public cancelEdit() {
    this.errorSaving = false;
    this.errorMessages = [];
  }

  private mapFormToRequest() {
    const rawForm = this.editKnightPasswordForm.getRawValue();
    const request: UpdateKnightPasswordRequest = {
      knightId: this.knightId,
      accountActivated: rawForm.accountActivated,
      password: rawForm.password,
      resetPasswordAtNextLogin: rawForm.resetPasswordAtNextLogin,
    };

    return request;
  }

  private updateKnightPassword(request: UpdateKnightPasswordRequest) {
    const knightObserver = {
      next: (response: KnightUser) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight', err),
      complete: () => console.log('Knight updated.'),
    };

    this.updateKnightPasswordSubscription = this.knightsService.updateKnightPassword(request).subscribe(knightObserver);
  }

  private passBackResponse(response: KnightUser) {
    this.editKnightPasswordChanges.emit(response);
    this.updateKnightPasswordSubscription?.unsubscribe();
    this.errorSaving = false;
    this.errorMessages = [];
    this.cancelEditKnightPasswordChanges?.nativeElement.click();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else if (Array.isArray(err?.error)) {
      err?.error.forEach((e: string) => {
        this.errorMessages.push(e);
      });
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorSaving = true;
  }
}
