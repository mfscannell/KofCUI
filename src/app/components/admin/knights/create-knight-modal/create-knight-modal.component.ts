import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CreateAddressFormGroup } from 'src/app/forms/createAddressFormGroup';
import { CreateKnightFormGroup } from 'src/app/forms/createKnightFormGroup';
import { EditActivityInterestFormGroup } from 'src/app/forms/editActivityInterestFormGroup';
import { EditActivityInterestsFormGroup } from 'src/app/forms/editActivityInterestsFormGroup';
import { EditKnightMemberInfoFormGroup } from 'src/app/forms/editKnightMemberInfoFormGroup';
import { MemberDueFormGroup } from 'src/app/forms/memberDueFormGroup';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { Knight } from 'src/app/models/knight';
import { MemberDues } from 'src/app/models/memberDues';
import { CreateActivityInterestRequest } from 'src/app/models/requests/createActivityInterestRequest';
import { CreateKnightInfoRequest } from 'src/app/models/requests/createKnightInfoRequest';
import { CreateKnightRequest } from 'src/app/models/requests/createKnightRequest';
import { CreateStreetAddressRequest } from 'src/app/models/requests/createStreetAddressRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightDegree } from 'src/app/types/knight-degree.type';
import { KnightMemberClassType } from 'src/app/types/knight-member-class.type';
import { KnightMemberTypeType } from 'src/app/types/knight-member-type.type';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'create-knight-modal',
  templateUrl: './create-knight-modal.component.html',
  styleUrls: ['./create-knight-modal.component.scss'],
})
export class CreateKnightModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityCategoryFormOptions: GenericFormOption[] = [];
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Input() knightMemberClassFormOptions: GenericFormOption[] = [];
  @Input() knightMemberTypeFormOptions: GenericFormOption[] = [];
  @Input() knightDegreeFormOptions: GenericFormOption[] = [];
  @Input() knightActivityInterestsForNewKnight: ActivityInterest[] = [];
  @Input() memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  @Output() createKnightChanges = new EventEmitter<Knight>();
  @ViewChild('cancelCreateKnightModal', { static: false })
  cancelCreateKnightModal: ElementRef | undefined;

  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public createKnightForm: FormGroup<CreateKnightFormGroup>;
  public selectedCountry: string = '';

  private createKnightSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    this.createKnightForm = this.initCreateKnightForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
  }

  public resetForm() {
    this.createKnightForm = this.initCreateKnightForm();
    this.enableDisableAdministrativeDivisions();

    this.errorSaving = false;
    this.errorMessages = [];
  }

  private initCreateKnightForm(): FormGroup<CreateKnightFormGroup> {
    const today = new Date();
    const activityInterestsFormGroups = this.initActivityInterestsForm(this.knightActivityInterestsForNewKnight);
    const createKnightForm = new FormGroup<CreateKnightFormGroup>({
      firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(63)] }),
      middleName: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      nameSuffix: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(7)] }),
      dateOfBirth: new FormControl<string>(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), { nonNullable: true }),
      emailAddress: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      cellPhoneNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(31)] }),
      homeAddress: new FormGroup<CreateAddressFormGroup>({
        addressName: new FormControl<string>('', { nonNullable: true }),
        address1: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        address2: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        city: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        stateCode: new FormControl<string>({value: '', disabled: true}, { nonNullable: true, validators: [Validators.maxLength(3)] }),
        postalCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(15)] }),
        countryCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(7)] }),
      }),
      knightInfo: new FormGroup<EditKnightMemberInfoFormGroup>({
        memberNumber: new FormControl<number>(0, { nonNullable: true }),
        mailReturned: new FormControl<boolean>(false, { nonNullable: true }),
        degree: new FormControl<KnightDegree>('First', { nonNullable: true }),
        firstDegreeDate: new FormControl<string>(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), { nonNullable: true }        ),
        reentryDate: new FormControl<string>(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), { nonNullable: true }),
        memberType: new FormControl<KnightMemberTypeType>('Associate', { nonNullable: true }),
        memberClass: new FormControl<KnightMemberClassType>('Paying', { nonNullable: true }),
      }),
      memberDues: new FormArray<FormGroup<MemberDueFormGroup>>([]),
      activityInterests: new FormGroup<EditActivityInterestsFormGroup>({
        activityInterests: new FormArray<FormGroup<EditActivityInterestFormGroup>>(activityInterestsFormGroups)
      }),
    });

    this.updateFormWithMemberDuesForCreateKnightForm(createKnightForm);

    return createKnightForm;
  }

  public getFormArrayName(activityCategoryFormOption: GenericFormOption) {
    return `${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    const rawValue = activityInterest.getRawValue();
    const activityName = rawValue.activityName;

    return activityName as string;
  }

  public enableDisableAdministrativeDivisions(): void {
    const countryCode = this.createKnightForm.controls.homeAddress.controls.countryCode.value;
    this.selectedCountry = countryCode;
    const hasCountryCode = this.countryFormOptions.some((cfo) => cfo.value === countryCode);

    console.log(`hasCOuntry: ${hasCountryCode}. countryCode ${countryCode}`);

    if (hasCountryCode) {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.enable();
    } else {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private updateFormWithActivityInterests(activityInterests: ActivityInterest[]) {
    console.log('updateFormWithActivityInterests');
    console.log(activityInterests);
    console.log(this.createKnightForm);
    activityInterests.forEach((activityInterest: ActivityInterest) => {
      const activityInterestFormGroup = new FormGroup<EditActivityInterestFormGroup>({
        activityId: new FormControl<string>(activityInterest.activityId, { nonNullable: true }),
        activityName: new FormControl<string>(activityInterest.activityName, { nonNullable: true }),
        activityCategory: new FormControl<string>(activityInterest.activityCategory, { nonNullable: true }),
        interested: new FormControl<boolean>(activityInterest.interested, { nonNullable: true }),
      });
      this.createKnightForm.controls.activityInterests.controls.activityInterests.controls.push(activityInterestFormGroup);
    });
  }

  private initActivityInterestsForm(activityInterests: ActivityInterest[]): FormGroup<EditActivityInterestFormGroup>[] {
    const formGroups = activityInterests.map((activityInterest: ActivityInterest) => {
      const activityInterestFormGroup = new FormGroup<EditActivityInterestFormGroup>({
        activityId: new FormControl<string>(activityInterest.activityId, { nonNullable: true }),
        activityName: new FormControl<string>(activityInterest.activityName, { nonNullable: true }),
        activityCategory: new FormControl<string>(activityInterest.activityCategory, { nonNullable: true }),
        interested: new FormControl<boolean>(activityInterest.interested, { nonNullable: true }),
      });
      return activityInterestFormGroup;
    });

    return formGroups;
  }

  private updateFormWithMemberDuesForCreateKnightForm(form: FormGroup<CreateKnightFormGroup>) {
    const thisYear = new Date().getFullYear();
    const startYear = thisYear - 9;
    const endYear = thisYear + 1;

    for (let year = startYear; year <= endYear; year++) {
      const memberDueFormGroup = new FormGroup<MemberDueFormGroup>({
        year: new FormControl<number>(year, { nonNullable: true }),
        paidStatus: new FormControl<string>('Unpaid', { nonNullable: true }),
      });

      form.controls.memberDues.controls.push(memberDueFormGroup);
    }
  }

  public getMemberDuesYear(memberDueYear: AbstractControl): string {
    return memberDueYear.getRawValue().year || '';
  }

  onSubmitCreateKnight() {
    const mappedKnight = this.mapCreateKnightFormToKnight();

    const knightObserver = {
      next: (response: Knight) => this.passBack(response),
      error: (err: ApiResponseError) => this.logError('Error Creating Knight', err),
      complete: () => console.log('Knight created.'),
    };

    this.createKnightSubscription = this.knightsService
      .createKnightAndActivityInterest(mappedKnight)
      .subscribe(knightObserver);
  }

  private mapCreateKnightFormToKnight() {
    const rawForm = this.createKnightForm.getRawValue();
    const homeAddress: CreateStreetAddressRequest = {
      addressName: '',
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode,
    };
    const knightInfo: CreateKnightInfoRequest = {
      memberNumber: rawForm.knightInfo.memberNumber,
      mailReturned: rawForm.knightInfo.mailReturned,
      degree: rawForm.knightInfo.degree,
      firstDegreeDate: rawForm.knightInfo.firstDegreeDate,
      reentryDate: rawForm.knightInfo.reentryDate,
      memberType: rawForm.knightInfo.memberType,
      memberClass: rawForm.knightInfo.memberClass,
    };
    const _memberDues: MemberDues[] = rawForm?.memberDues?.map(function (md: MemberDues): MemberDues {
      const memberDues: MemberDues = {
        year: md.year,
        paidStatus: md.paidStatus,
      };

      return memberDues;
    });
    const _activityInterests: CreateActivityInterestRequest[] = this.createKnightForm.controls.activityInterests.controls.activityInterests.controls.map((formGroup: FormGroup<EditActivityInterestFormGroup>) => {
      return {
        activityId: formGroup.controls.activityId.value,
        interested: formGroup.controls.interested.value
      } as CreateActivityInterestRequest;
    });
    const knight: CreateKnightRequest = {
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress,
      knightInfo: knightInfo,
      activityInterests: _activityInterests,
      memberDues: _memberDues,
    };

    console.log('Mapped Knight:');
    console.log(knight);

    return knight;
  }

  private passBack(addedKnight: Knight) {
    this.createKnightChanges.emit(addedKnight);
    this.cancelCreateKnightModal?.nativeElement.click();
    this.createKnightSubscription?.unsubscribe();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
