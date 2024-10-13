import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { AccountsService } from 'src/app/services/accounts.service';
import { ChangePasswordResponse } from 'src/app/models/responses/changePasswordResponse';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { KnightDegreeFormOption } from 'src/app/models/inputOptions/knightDegreeFormOption';
import { KnightMemberTypeFormOption } from 'src/app/models/inputOptions/knightMemberTypeFormOption';
import { KnightMemberClassFormOption } from 'src/app/models/inputOptions/knightMemberClassFormOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { PasswordRequirements } from 'src/app/models/responses/passwordRequirements';
import { ChangePassWordRequest } from 'src/app/models/requests/changePasswordRequest';

@Component({
  selector: 'kofc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  active = 'accountHome';
  knightId?: number;
  knight?: Knight;
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  private getFormOptionsSubscriptions?: Subscription;
  private getKnightSubscription?: Subscription;
  private updateAccountSecuritySubscription?: Subscription;
  private getPasswordRequirementsSubscription?: Subscription;
  public errorMessages: string[] = [];
  public knightDegreeFormOptions: KnightDegreeFormOption[] = [];
  public knightMemberTypeFormOptions: KnightMemberTypeFormOption[] = [];
  public knightMemberClassFormOptions: KnightMemberClassFormOption[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  showErrorSavingInfo: boolean = false;
  showSuccessSavingInfo: boolean = false;
  showErrorSavingInterests: boolean = false;
  showSuccessSavingInterests: boolean = false;

  @ViewChild('cancelEditPersonalInfoModal', {static: false}) cancelEditPersonalInfoModal: ElementRef | undefined;
  public errorSaving: boolean = false;
  public editKnightPersonalInfoForm: UntypedFormGroup;
  private updateKnightSubscription?: Subscription;

  @ViewChild('cancelEditActivityInterestsModal', {static: false}) cancelEditActivityInterestsModal: ElementRef | undefined;
  allActivities: ActivityInterest[] = [];
  public editKnightActivityInterestsForm: UntypedFormGroup;
  private updateKnightActivityInterestSubscription?: Subscription;

  @ViewChild('cancelEditSecurityModal', {static: false}) cancelEditSecurityModal: ElementRef | undefined;
  public passwordRequirements: PasswordRequirements = {
    requireUppercase: false,
    requireLowercase: false,
    requiredUniqueChars: 1,
    requireDigit: false,
    requiredLength: 1,
    requireNonAlphanumeric: false,
    allowedNonAlphanumericCharacters: '`~!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?'
  };
  public editAccountSecurityForm: UntypedFormGroup;

  disableDegreeSelect() {
    return true;
  }

  constructor(
    private formsService: FormsService,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
    private accountsService: AccountsService) {
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
    var today = new Date();
    return new UntypedFormGroup({
      knightId: new UntypedFormControl(0),
      firstName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(63)
      ]),
      middleName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      lastName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      nameSuffix: new UntypedFormControl('', [
        Validators.maxLength(7)
      ]),
      dateOfBirth: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      emailAddress: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      cellPhoneNumber: new UntypedFormControl('', [
        Validators.maxLength(31)
      ]),
      homeAddress: new UntypedFormGroup({
        streetAddressId: new UntypedFormControl(0),
        addressName: new UntypedFormControl(null),
        address1: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        address2: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        city: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        stateCode: new UntypedFormControl('', [
          Validators.maxLength(3)
        ]),
        postalCode: new UntypedFormControl('', [
          Validators.maxLength(15)
        ]),
        countryCode: new UntypedFormControl('', [
          Validators.maxLength(7)
        ])
      })
    });
  }

  private initEditSecurityForm() {
    return new UntypedFormGroup({
      knightId: new UntypedFormControl(0),
      oldPassword: new UntypedFormControl(''),
      newPassword: new UntypedFormControl(''),
      confirmPassword: new UntypedFormControl('')
    });
  }

  filterActivitiesByCategory(activityCategoryValue: string) {
    return this.allActivities.filter(x => x.activityCategory === activityCategoryValue);
  }

  filterActivitiesInterested() {
    return this.knight?.activityInterests.filter(x => x.interested);
  }

  filterActivitiesInterestedInCategory(activityCategoryValue: string) {
    return this.knight?.activityInterests.filter(x => x.interested && x.activityCategory === activityCategoryValue);
  }

  formatDate(date: string | undefined) {
    return DateTimeFormatter.ToDisplayedDate(date);
  }

  public openEditAccountPersonalInfoModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightPersonalInfoForm = this.initEditPersonalInfoForm();

    if (this.knight) {
      this.editKnightPersonalInfoForm.patchValue({
        knightId: this.knight.knightId,
        firstName: this.knight.firstName,
        middleName: this.knight.middleName,
        lastName: this.knight.lastName,
        nameSuffix: this.knight.nameSuffix,
        dateOfBirth: DateTimeFormatter.DateTimeToIso8601Date(this.knight.dateOfBirth),
        emailAddress: this.knight.emailAddress,
        cellPhoneNumber: this.knight.cellPhoneNumber,
        homeAddress: this.knight.homeAddress
       });
    }

    this.enableDisableAdministrativeDivisions();
  }

  public enableDisableAdministrativeDivisions(): void {
    let countryCode = this.getCountryCode();
    let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

    if (hasCountryCode) {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.enable();
    } else {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private getCountryCode(): string {
    return this.editKnightPersonalInfoForm.get('homeAddress.countryCode')?.value;
  }

  public filterAdministrativeDivisionsByCountry(): AdministrativeDivisionFormOption[] {
    let countryCode = this.getCountryCode();

    let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public onSubmitEditKnight() {
    let updatedKnight = this.mapEditKnightFormToKnight();
    this.updateKnightPersonalInfo(updatedKnight);
  }

  private mapEditKnightFormToKnight(): UpdateKnightPersonalInfoRequest {
    let rawForm = this.editKnightPersonalInfoForm.getRawValue();
    let homeAddress: StreetAddress = {
      streetAddressId: rawForm.homeAddress.streetAddressId,
      addressName: rawForm.homeAddress.addressName,
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode
    };
    let knight: UpdateKnightPersonalInfoRequest = {
      knightId: rawForm.knightId,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress
    };

    return knight;
  }

  private updateKnightPersonalInfo(knightPersonalInfo: UpdateKnightPersonalInfoRequest) {
    let knightObserver = {
      next: (response: Knight) => this.handleUpdateKnightPersonalInfoResponse(response),
      error: (err: any) => this.logError("Error Updating Knight.", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightSubscription = this.knightsService.updateKnightPersonalInfo(knightPersonalInfo).subscribe(knightObserver);
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

  toggleInterestCheckbox(interestChangeEvent: any, activity: ActivityInterest) {
    activity.interested = interestChangeEvent.target.checked;
  }

  onSubmitEditActivityInterests() {
    this.updateKnightActivityInterests(this.allActivities);
  }

  private updateKnightActivityInterests(knightActivityInterests: ActivityInterest[]) {
    if (this.knightId) {
      let knightObserver = {
        next: (response: ActivityInterest[]) => this.handleUpdateActivityInterests(response),
        error: (err: any) => this.logError("Error Updating Knight Activity Interests.", err),
        complete: () => console.log('Knight Activity Interests updated.')
      };
  
      let request = {
        knightId: this.knightId,
        activityInterests: knightActivityInterests};
  
      this.updateKnightActivityInterestSubscription = this.knightActivityInterestsService.updateKnightActivityInterests(request).subscribe(knightObserver);
    }
  }

  private handleUpdateActivityInterests(response: ActivityInterest[]) {
    if (this.knight) {
      this.knight.activityInterests = response;
    }

    this.cancelEditActivityInterestsModal?.nativeElement.click();
  }

  private getPasswordRequirements() {
    let getPasswordRequirementsObserver = {
      next: (response: PasswordRequirements) => this.passwordRequirements = response,
      error: (err: any) => this.logError("Error Getting password requirements.", err),
      complete: () => console.log('Password requirements retrieved.')
    };

    this.getPasswordRequirementsSubscription = this.accountsService.getPasswordRequirements().subscribe(getPasswordRequirementsObserver);
  }

  openEditAccountSecurityModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editAccountSecurityForm = this.initEditSecurityForm();
  }

  public isPasswordDirty() {
    let newPasswordInput = this.editAccountSecurityForm.get('newPassword');

    return newPasswordInput?.dirty;
  }

  public hasRequiredLength() {
    let rawForm = this.editAccountSecurityForm.getRawValue();
    let newPassword = rawForm.newPassword as string;
    let hasLength = newPassword.length >= this.passwordRequirements?.requiredLength;

    return hasLength;
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
      next: (response: ChangePasswordResponse) => this.handleUpdateAccountSecurity(response),
      error: (err: any) => this.logError("Error Updating Knight.", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateAccountSecuritySubscription = this.accountsService.changePassword(knight).subscribe(changePasswordObserver);
  }

  private handleUpdateAccountSecurity(response: ChangePasswordResponse) {
    this.cancelEditSecurityModal?.nativeElement.click();
  }

  private getFormOptions() {
    let formsObserver = {
      next: ([ knightDegreeResponse, knightMemberTypeResponse, knightMemberClassResponse, countryResponse ]: [KnightDegreeFormOption[], KnightMemberTypeFormOption[], KnightMemberClassFormOption[], CountryFormOption[]]) => {
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.countryFormOptions = countryResponse;
      },
      error: (err: any) => this.logError("Error getting Knight Degree Form Options", err),
      complete: () => console.log('Knight Degree Form Options retrieved.')
    };

    this.getFormOptionsSubscriptions = forkJoin([
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions(),
      this.formsService.getCountryFormOptions()
    ]).subscribe(formsObserver);
  }

  private getKnight() {
    if (this.knightId) {
      let knightObserver = {
        next: (getKnightResponse: Knight) => this.knight = getKnightResponse,
        error: (err: any) => this.logError('Error getting knight.', err),
        complete: () => console.log('Knight loaded.')
      };
      
      this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(knightObserver);
    }
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
  }
}
