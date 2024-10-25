import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { KnightDegreeFormOption } from 'src/app/models/inputOptions/knightDegreeFormOption';
import { KnightMemberClassFormOption } from 'src/app/models/inputOptions/knightMemberClassFormOption';
import { KnightMemberTypeFormOption } from 'src/app/models/inputOptions/knightMemberTypeFormOption';
import { MemberDuesPaymentStatusFormOption } from 'src/app/models/inputOptions/memberDuesPaymentStatusFormOption';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { MemberDues } from 'src/app/models/memberDues';
import { StreetAddress } from 'src/app/models/streetAddress';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'create-knight-modal',
  templateUrl: './create-knight-modal.component.html',
  styleUrls: ['./create-knight-modal.component.scss']
})
export class CreateKnightModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Input() knightMemberClassFormOptions: KnightMemberClassFormOption[] = [];
  @Input() knightMemberTypeFormOptions: KnightMemberTypeFormOption[] = [];
  @Input() knightDegreeFormOptions: KnightDegreeFormOption[] = [];
  @Input() knightActivityInterestsForNewKnight: ActivityInterest[] = [];
  @Input() memberDuesPaymentStatusFormOptions: MemberDuesPaymentStatusFormOption[] = [];
  @Output() createKnightChanges = new EventEmitter<Knight>();
  @ViewChild('cancelCreateKnightModal', {static: false}) cancelCreateKnightModal: ElementRef | undefined;

  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public createKnightForm: UntypedFormGroup;

  private createKnightSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    this.createKnightForm = this.initCreateKnightForm();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    this.createKnightForm = this.initCreateKnightForm();
    this.errorSaving = false;
    this.errorMessages = [];
  }

  public getFormArrayName(activityCategoryFormOption: ActivityCategoryFormOption) {
    return `${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    let rawValue = activityInterest.getRawValue();
    let activityName = rawValue.activityName;

    return activityName as string;
  }

  public enableDisableAdministrativeDivisions(form: UntypedFormGroup): void {
    let countryCode = this.getCountryCode(form);
    let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

    console.log(`hasCOuntry: ${hasCountryCode}. countryCode ${countryCode}`);

    if (hasCountryCode) {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.enable();
    } else {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private getCountryCode(form: UntypedFormGroup): string {
    return form.get('homeAddress.countryCode')?.value;
  }

  private initCreateKnightForm() {
    let today = new Date();
    let createKnightForm = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
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
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
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
      }),
      knightInfo: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        memberNumber: new UntypedFormControl(0),
        mailReturned: new UntypedFormControl(false),
        degree: new UntypedFormControl('First'),
        firstDegreeDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        reentryDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        memberType: new UntypedFormControl('Associate'),
        memberClass: new UntypedFormControl('Paying')
      }),
      memberDues: new UntypedFormArray([]),
      activityInterests: new UntypedFormGroup({
        communityActivityInterests: new UntypedFormArray([]),
        faithActivityInterests: new UntypedFormArray([]),
        familyActivityInterests: new UntypedFormArray([]),
        lifeActivityInterests: new UntypedFormArray([]),
        miscellaneousActivityInterests: new UntypedFormArray([])
      })
    });

    this.updateFormWithActivityInterests(createKnightForm, this.knightActivityInterestsForNewKnight);
    this.updateFormWithMemberDuesForCreateKnightForm(createKnightForm);

    return createKnightForm;
  }

  private updateFormWithActivityInterests(form: UntypedFormGroup, activityInterests: ActivityInterest[]) {
    this.activityCategoryFormOptions.forEach(activityCategoryFormOption => {
      let activityInterestsFormArray = this.getActivityInterestsFormArray(form, `${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`);
      let filteredActivities = activityInterests?.filter(activityInterest => {
        return activityInterest.activityCategory === activityCategoryFormOption.value;
      });
      filteredActivities?.forEach((activityInterest: ActivityInterest) => {
        const activityInterestFormGroup = new UntypedFormGroup({
          activityId: new UntypedFormControl(activityInterest.activityId),
          activityName: new UntypedFormControl(activityInterest.activityName),
          activityCategory: new UntypedFormControl(activityInterest.activityCategory),
          interested: new UntypedFormControl(activityInterest.interested),
        });
        activityInterestsFormArray.push(activityInterestFormGroup);
      });
    });
  }

  private updateFormWithMemberDuesForCreateKnightForm(form: UntypedFormGroup) {
    let thisYear = new Date().getFullYear();
      let startYear = thisYear - 9;
      let endYear = thisYear + 1;

      for (let year = startYear; year <= endYear; year++) {
        const memberDueFormGroup = new UntypedFormGroup({
          memberDuesId: new UntypedFormControl(0),
          year: new UntypedFormControl(year),
          paidStatus: new UntypedFormControl('Unpaid')
        });

        this.appendMemberDues(form, memberDueFormGroup)
      }
  }

  public filterAdministrativeDivisionsByCountry(form: UntypedFormGroup): AdministrativeDivisionFormOption[] {
    let countryCode = this.getCountryCode(form);

    let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public getActivityInterestsFormArray(form: UntypedFormGroup, activityCategory: string): UntypedFormArray {
    let activityInterestsFormGroup = form.controls['activityInterests'] as UntypedFormGroup;
    let activityInterestsFormArray = activityInterestsFormGroup.controls[activityCategory] as UntypedFormArray;

    return activityInterestsFormArray;
  }

  getMemberDuesForm(form: UntypedFormGroup) {
    return form.controls["memberDues"] as UntypedFormArray;
  }

  public getMemberDuesYear(memberDueYear: AbstractControl): string {
    return memberDueYear.getRawValue().year || '';
  }

  appendMemberDues(form: UntypedFormGroup, memberDueFormGroup: UntypedFormGroup) {
    let something = form.controls["memberDues"] as UntypedFormArray;
    something.push(memberDueFormGroup);
  }

  onSubmitCreateKnight() {
    let mappedKnight = this.mapCreateKnightFormToKnight();

    let knightObserver = {
      next: (response: Knight) => this.passBack(response),
      error: (err: any) => this.logError("Error Creating Knight", err),
      complete: () => console.log('Knight created.')
    };

    this.createKnightSubscription = this.knightsService.createKnightAndActivityInterest(mappedKnight).subscribe(knightObserver);
  }

  private mapCreateKnightFormToKnight() {
    let rawForm = this.createKnightForm.getRawValue();
    let homeAddress: StreetAddress = {
      id: rawForm.homeAddress.id,
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode
    };
    let knightInfo: KnightInfo = {
      id: rawForm.knightInfo.id,
      memberNumber: rawForm.knightInfo.memberNumber,
      mailReturned: rawForm.knightInfo.mailReturned,
      degree: rawForm.knightInfo.degree,
      firstDegreeDate: rawForm.knightInfo.firstDegreeDate,
      reentryDate: rawForm.knightInfo.reentryDate,
      memberType: rawForm.knightInfo.memberType,
      memberClass: rawForm.knightInfo.memberClass
    };
    let _memberDues: MemberDues[] = rawForm?.memberDues?.map(function(md: any): MemberDues {
      let memberDues: MemberDues = {
        year: md.year,
        paidStatus: md.paidStatus
      };

      return memberDues;
    });
    let knight: Knight = {
      id: rawForm.id,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress,
      knightInfo: knightInfo,
      activityInterests: [],
      memberDues: _memberDues
    };

    this.activityCategoryFormOptions.forEach(activityCategoryFormOption => {
      let activityInterests = rawForm['activityInterests'][`${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`];

      activityInterests.forEach((ai: any) => {
        console.log(ai);
        knight.activityInterests.push({
          activityId: ai.activityId,
          activityName: ai.activityName,
          activityCategory: ai.activityCategory,
          interested: ai.interested
        });
      });
    });

    console.log('Mapped Knight:');
    console.log(knight);

    return knight;
  }

  private passBack(addedKnight: Knight) {
    this.createKnightChanges.emit(addedKnight);
    this.cancelCreateKnightModal?.nativeElement.click();
    this.createKnightSubscription?.unsubscribe();
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
