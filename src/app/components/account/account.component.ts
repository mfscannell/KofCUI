import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { AccountsService } from 'src/app/services/accounts.service';
import { ChangePasswordResponse } from 'src/app/models/responses/changePasswordResponse';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { ChangePassWordRequest } from 'src/app/models/requests/changePasswordRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { ToggleInterestInActivityEvent } from 'src/app/models/events/toggleInterestInActivityEvent';

@Component({
  selector: 'kofc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  active = 'accountHome';
  knightId?: string;
  knight?: Knight;
  private getFormOptionsSubscriptions?: Subscription;
  private getKnightSubscription?: Subscription;
  private updateAccountSecuritySubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;
  public errorMessages: string[] = [];
  public activityCategoryFormOptions: GenericFormOption[] = [];
  public knightDegreeFormOptions: GenericFormOption[] = [];
  public knightMemberTypeFormOptions: GenericFormOption[] = [];
  public knightMemberClassFormOptions: GenericFormOption[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  showErrorSavingInfo: boolean = false;
  showSuccessSavingInfo: boolean = false;
  showErrorSavingInterests: boolean = false;
  showSuccessSavingInterests: boolean = false;

  @ViewChild('cancelEditPersonalInfoModal', { static: false })
  cancelEditPersonalInfoModal: ElementRef | undefined;
  public errorSaving: boolean = false;
  public editKnightPersonalInfoForm: UntypedFormGroup;
  private updateKnightSubscription?: Subscription;

  @ViewChild('cancelEditActivityInterestsModal', { static: false })
  cancelEditActivityInterestsModal: ElementRef | undefined;
  allActivities: ActivityInterest[] = [];
  public editKnightActivityInterestsForm: UntypedFormGroup;
  private updateKnightActivityInterestSubscription?: Subscription;

  @ViewChild('cancelEditSecurityModal', { static: false })
  cancelEditSecurityModal: ElementRef | undefined;
  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: '`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?',
  };
  public editAccountSecurityForm: UntypedFormGroup;

  disableDegreeSelect() {
    return true;
  }

  constructor(
    private formsService: FormsService,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
    private accountsService: AccountsService,
  ) {
    this.editKnightPersonalInfoForm = this.initEditPersonalInfoForm();
    this.editKnightActivityInterestsForm = new UntypedFormGroup({});
    this.editAccountSecurityForm = this.initEditSecurityForm();
  }

  ngOnInit() {
    this.getFormOptions();
    this.knightId = this.accountsService.getKnightId();
    this.getKnight();
    this.getPasswordRequirements();
  }

  ngOnDestroy() {
    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe();
    }

    if (this.getFormOptionsSubscriptions) {
      this.getFormOptionsSubscriptions.unsubscribe();
    }

    if (this.updateKnightSubscription) {
      this.updateKnightSubscription.unsubscribe();
    }

    if (this.updateKnightActivityInterestSubscription) {
      this.updateKnightActivityInterestSubscription.unsubscribe();
    }

    if (this.updateAccountSecuritySubscription) {
      this.updateAccountSecuritySubscription.unsubscribe();
    }

    if (this.getPasswordRequirementsSubscription) {
      this.getPasswordRequirementsSubscription.unsubscribe();
    }
  }

  private initEditPersonalInfoForm(): UntypedFormGroup {
    const today = new Date();
    return new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      firstName: new UntypedFormControl('', [Validators.required, Validators.maxLength(63)]),
      middleName: new UntypedFormControl('', [Validators.maxLength(63)]),
      lastName: new UntypedFormControl('', [Validators.maxLength(63)]),
      nameSuffix: new UntypedFormControl('', [Validators.maxLength(7)]),
      dateOfBirth: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      ),
      emailAddress: new UntypedFormControl('', [Validators.maxLength(63)]),
      cellPhoneNumber: new UntypedFormControl('', [Validators.maxLength(31)]),
      homeAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        addressName: new UntypedFormControl(null),
        address1: new UntypedFormControl('', [Validators.maxLength(63)]),
        address2: new UntypedFormControl('', [Validators.maxLength(63)]),
        city: new UntypedFormControl('', [Validators.maxLength(63)]),
        stateCode: new UntypedFormControl('', [Validators.maxLength(3)]),
        postalCode: new UntypedFormControl('', [Validators.maxLength(15)]),
        countryCode: new UntypedFormControl('', [Validators.maxLength(7)]),
      }),
    });
  }

  private initEditSecurityForm() {
    return new UntypedFormGroup({
      knightId: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      oldPassword: new UntypedFormControl(''),
      newPassword: new UntypedFormControl(''),
      confirmPassword: new UntypedFormControl(''),
    });
  }

  filterActivitiesByCategory(activityCategoryValue: string) {
    return this.allActivities.filter((x) => x.activityCategory === activityCategoryValue);
  }

  filterActivitiesInterested() {
    return this.knight?.activityInterests.filter((x) => x.interested);
  }

  filterActivitiesInterestedInCategory(activityCategoryValue: string) {
    return this.knight?.activityInterests.filter((x) => x.interested && x.activityCategory === activityCategoryValue);
  }

  public openEditAccountPersonalInfoModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightPersonalInfoForm = this.initEditPersonalInfoForm();

    if (this.knight) {
      this.editKnightPersonalInfoForm.patchValue({
        id: this.knight.id,
        firstName: this.knight.firstName,
        middleName: this.knight.middleName,
        lastName: this.knight.lastName,
        nameSuffix: this.knight.nameSuffix,
        dateOfBirth: DateTimeFormatter.DateTimeToIso8601Date(this.knight.dateOfBirth),
        emailAddress: this.knight.emailAddress,
        cellPhoneNumber: this.knight.cellPhoneNumber,
        homeAddress: this.knight.homeAddress,
      });
    }

    this.enableDisableAdministrativeDivisions();
  }

  public enableDisableAdministrativeDivisions(): void {
    const countryCode = this.getCountryCode();
    const hasCountryCode = this.countryFormOptions.some((cfo) => cfo.value === countryCode);

    if (hasCountryCode) {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.enable();
    } else {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private getCountryCode(): string {
    return this.editKnightPersonalInfoForm.get('homeAddress.countryCode')?.value;
  }

  public filterAdministrativeDivisionsByCountry(): GenericFormOption[] {
    const countryCode = this.getCountryCode();

    const filteredCountryFormOptions = this.countryFormOptions.filter((cfo) => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public onSubmitEditKnight() {
    const updatedKnight = this.mapEditKnightFormToKnight();
    this.updateKnightPersonalInfo(updatedKnight);
  }

  private mapEditKnightFormToKnight(): UpdateKnightPersonalInfoRequest {
    const rawForm = this.editKnightPersonalInfoForm.getRawValue();
    const homeAddress: StreetAddress = {
      id: rawForm.homeAddress.id,
      addressName: rawForm.homeAddress.addressName,
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode,
    };
    const knight: UpdateKnightPersonalInfoRequest = {
      knightId: rawForm.knightId,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress,
    };

    return knight;
  }

  private updateKnightPersonalInfo(knightPersonalInfo: UpdateKnightPersonalInfoRequest) {
    const knightObserver = {
      next: (response: Knight) => this.handleUpdateKnightPersonalInfoResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight.', err),
      complete: () => console.log('Knight updated.'),
    };

    this.updateKnightSubscription = this.knightsService
      .updateKnightPersonalInfo(knightPersonalInfo)
      .subscribe(knightObserver);
  }

  private handleUpdateKnightPersonalInfoResponse(response: Knight) {
    if (this.knight) {
      response.activityInterests = this.knight?.activityInterests;
      this.knight = response;
    }

    console.log('handleUpdateKnightPersonalInfoResponse');

    this.cancelEditPersonalInfoModal?.nativeElement.click();
  }

  openEditAccountActivityInterestsModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    if (this.knight) {
      this.allActivities = this.knight?.activityInterests;
    }
  }

  toggleInterestCheckbox(interestChangeEvent: ToggleInterestInActivityEvent, activity: ActivityInterest) {
    activity.interested = interestChangeEvent?.target?.checked || false;
  }

  onSubmitEditActivityInterests() {
    this.updateKnightActivityInterests(this.allActivities);
  }

  private updateKnightActivityInterests(knightActivityInterests: ActivityInterest[]) {
    if (this.knightId) {
      const knightObserver = {
        next: (response: ActivityInterest[]) => this.handleUpdateActivityInterests(response),
        error: (err: ApiResponseError) => this.logError('Error Updating Knight Activity Interests.', err),
        complete: () => console.log('Knight Activity Interests updated.'),
      };

      const request = {
        knightId: this.knightId,
        activityInterests: knightActivityInterests,
      };

      this.updateKnightActivityInterestSubscription = this.knightActivityInterestsService
        .updateKnightActivityInterests(request)
        .subscribe(knightObserver);
    }
  }

  private handleUpdateActivityInterests(response: ActivityInterest[]) {
    if (this.knight) {
      response.forEach((kai) => {
        const indexOfActivity = this.allActivities.findIndex(ai => ai.activityId === kai.activityId);
  
        if (indexOfActivity > -1) {
          this.allActivities[indexOfActivity].interested = kai.interested;

          if (this.knight) {
            this.knight.activityInterests = this.allActivities;
          }
        }
      });

      //this.knight.activityInterests = response;
    }

    this.cancelEditActivityInterestsModal?.nativeElement.click();
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

  openEditAccountSecurityModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editAccountSecurityForm = this.initEditSecurityForm();
  }

  public isPasswordDirty() {
    const newPasswordInput = this.editAccountSecurityForm.get('newPassword');

    return newPasswordInput?.dirty;
  }

  public hasRequiredLength() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    const hasLength = newPassword.length >= this.passwordRequirements?.requiredLength;

    return hasLength;
  }

  public hasDistinctCharacters() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    const numDistinctCharacters = new Set(newPassword).size;

    return numDistinctCharacters >= this.passwordRequirements.requiredUniqueChars;
  }

  public hasUpperCase() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    const hasUpper = /[A-Z]/.test(newPassword);

    return hasUpper;
  }

  public hasLowerCase() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    const hasLower = /[a-z]/.test(newPassword);

    return hasLower;
  }

  public hasDigit() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    const hasDigitChar = /[0-9]/.test(newPassword);

    return hasDigitChar;
  }

  public hasAllowedSpecialCharacter() {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const newPassword = rawForm.newPassword as string;
    let hasSpecialCharacter = false;

    for (let i = 0; i < this.passwordRequirements.allowedNonAlphanumericCharacters.length; i++) {
      const specialChar = this.passwordRequirements.allowedNonAlphanumericCharacters.charAt(i);

      if (newPassword.indexOf(specialChar) > -1) {
        hasSpecialCharacter = true;
      }
    }

    return hasSpecialCharacter;
  }

  public onSubmitUpdateSecurity() {
    const changePasswordRequest = this.mapFormToChangePasswordRequest();
    this.updateAccountSecurity(changePasswordRequest);
  }

  private mapFormToChangePasswordRequest(): ChangePassWordRequest {
    const rawForm = this.editAccountSecurityForm.getRawValue();
    const changePasswordRequest: ChangePassWordRequest = {
      knightId: rawForm.knightId,
      oldPassword: rawForm.oldPassword,
      newPassword: rawForm.newPassword,
      confirmPassword: rawForm.confirmPassword,
    };

    return changePasswordRequest;
  }

  private updateAccountSecurity(knight: ChangePassWordRequest) {
    const changePasswordObserver = {
      next: (response: ChangePasswordResponse) => this.handleUpdateAccountSecurity(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight.', err),
      complete: () => console.log('Knight updated.'),
    };

    this.updateAccountSecuritySubscription = this.accountsService
      .changePassword(knight)
      .subscribe(changePasswordObserver);
  }

  private handleUpdateAccountSecurity(response: ChangePasswordResponse) {
    if (response.success) {
      this.cancelEditSecurityModal?.nativeElement.click();
    }
  }

  private getFormOptions() {
    const formsObserver = {
      next: ([
        activityCategoriesResponse,
        knightDegreeResponse,
        knightMemberTypeResponse,
        knightMemberClassResponse,
        countryResponse,
      ]: [GenericFormOption[], GenericFormOption[], GenericFormOption[], GenericFormOption[], CountryFormOption[]]) => {
        this.activityCategoryFormOptions = activityCategoriesResponse;
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.countryFormOptions = countryResponse;
      },
      error: (err: ApiResponseError) => this.logError('Error getting Knight Degree Form Options', err),
      complete: () => console.log('Knight Degree Form Options retrieved.'),
    };

    this.getFormOptionsSubscriptions = forkJoin([
      this.formsService.getActivityCategoryFormOptions(),
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions(),
      this.formsService.getCountryFormOptions(),
    ]).subscribe(formsObserver);
  }

  private getKnight() {
    if (this.knightId) {
      const knightObserver = {
        next: (getKnightResponse: Knight) => (this.knight = getKnightResponse),
        error: (err: ApiResponseError) => this.logError('Error getting knight.', err),
        complete: () => console.log('Knight loaded.'),
      };

      this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(knightObserver);
    }
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
  }
}
