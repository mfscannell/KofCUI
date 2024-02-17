import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivityInterest } from 'src/app/models/activityInterest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightInfo } from 'src/app/models/knightInfo';
import { MemberDues } from 'src/app/models/memberDues';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { KnightMemberTypeFormOption } from 'src/app/models/inputOptions/knightMemberTypeFormOption';
import { KnightMemberClassFormOption } from 'src/app/models/inputOptions/knightMemberClassFormOption';
import { MemberDuesPaymentStatusFormOption } from 'src/app/models/inputOptions/memberDuesPaymentStatusFormOption';
import { KnightDegreeFormOption } from 'src/app/models/inputOptions/knightDegreeFormOption';

@Component({
  selector: 'edit-knight-modal',
  templateUrl: './edit-knight-modal.component.html',
  styleUrls: ['./edit-knight-modal.component.scss']
})
export class EditKnightModalComponent implements OnInit {
  public modalHeaderText: string = 'Adding Knight';
  public knightDegreeFormOptions: KnightDegreeFormOption[] = [];
  public knightMemberTypeFormOptions: KnightMemberTypeFormOption[] = [];
  public knightMemberClassFormOptions: KnightMemberClassFormOption[] = [];
  public memberDuesPaymentStatusFormOptions: MemberDuesPaymentStatusFormOption[] = [];
  public editKnightForm: UntypedFormGroup;
  public countryFormOptions: CountryFormOption[] = [];
  public activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private getFormsSubscription?: Subscription;
  private getKnightActivitiesSubscription?: Subscription;
  private createKnightSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private formsService: FormsService,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService) {
      var today = new Date();
      this.editKnightForm = new UntypedFormGroup({
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
        dateOfBirth: new UntypedFormControl({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        }),
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
        }),
        knightInfo: new UntypedFormGroup({
          knightInfoId: new UntypedFormControl(0),
          memberNumber: new UntypedFormControl(0),
          mailReturned: new UntypedFormControl(false),
          degree: new UntypedFormControl('First'),
          firstDegreeDate: new UntypedFormControl({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
          }),
          reentryDate: new UntypedFormControl({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
          }),
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
    }

    ngOnInit() {
      this.enableDisableAdministrativeDivisions();
      this.getFormOptions();
      this.getAllKnightActivityInterestsForNewKnight();
      let thisYear = new Date().getFullYear();
      let startYear = thisYear - 9;
      let endYear = thisYear + 1;

      for (let year = startYear; year <= endYear; year++) {
        const memberDueFormGroup = new UntypedFormGroup({
          memberDuesId: new UntypedFormControl(0),
          year: new UntypedFormControl(year),
          paidStatus: new UntypedFormControl('Unpaid')
        });

        this.memberDuesForm.push(memberDueFormGroup);
      }
    }

    get memberDuesForm() {
      return this.editKnightForm.controls["memberDues"] as UntypedFormArray;
    }

    private getCountryCode(): string {
      return this.editKnightForm.get('homeAddress.countryCode')?.value;
    }

    public filterAdministrativeDivisionsByCountry(): AdministrativeDivisionFormOption[] {
      let countryCode = this.getCountryCode();
  
      let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);
  
      if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
        return filteredCountryFormOptions[0].administrativeDivisions;
      }
  
      return [];
    }

    public enableDisableAdministrativeDivisions(): void {
      let countryCode = this.getCountryCode();
      let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

      console.log(`hasCOuntry: ${hasCountryCode}. countryCode ${countryCode}`);

      if (hasCountryCode) {
        console.log(this.editKnightForm.get('homeAddress.stateCode'));
        this.editKnightForm.get('homeAddress.stateCode')?.enable();
      } else {
        console.log(this.editKnightForm.get('homeAddress.stateCode'));
        this.editKnightForm.get('homeAddress.stateCode')?.disable();
      }
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
  
      this.getFormsSubscription = forkJoin([
        this.formsService.getKnightDegreeFormOptions(),
        this.formsService.getKnightMemberTypeFormOptions(),
        this.formsService.getKnightMemberClassFormOptions(),
        this.formsService.getCountryFormOptions()
      ]).subscribe(formsObserver);
    }

    private getAllKnightActivityInterestsForNewKnight() {
      let knightActiviityInterestObserver = {
        next: (knightActivityInterests: ActivityInterest[]) => this.updateFormWithActivityInterests(knightActivityInterests),
        error: (err: any) => this.logError('Error getting knight activity interests for new knight', err),
        complete: () => console.log('Knight Activity Interests loaded.')
      };

      this.getKnightActivitiesSubscription = this.knightActivityInterestsService.getAllIKnightActivityInterestsForNewKnight().subscribe(knightActiviityInterestObserver);
    }

    private updateFormWithActivityInterests(activityInterests: ActivityInterest[]) {
      this.activityCategoryInputOptions.forEach(activityCategoryInputOption => {
        let activityInterestsFormArray = this.getActivityInterestsFormArray(`${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`);
        let filteredActivities = activityInterests?.filter(activityInterest => {
          return activityInterest.activityCategory === activityCategoryInputOption.value;
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

    public getActivityInterestsFormArray(activityCategory: string): UntypedFormArray {
      let activityInterestsFormGroup = this.editKnightForm.controls['activityInterests'] as UntypedFormGroup;
      let activityInterestsFormArray = activityInterestsFormGroup.controls[activityCategory] as UntypedFormArray;
  
      return activityInterestsFormArray;
    }

    public getActivityCategoryFormGroupName(activityCategoryValue: string) {
      return activityCategoryValue.toLowerCase();
    }

    public getFormArrayName(activityCategoryInputOption: ActivityCategoryInputOption) {
      return `${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`;
    }

    public getActivityName(activityInterest: AbstractControl): string {
      let rawValue = activityInterest.getRawValue();
      let activityName = rawValue.activityName;
  
      return activityName as string;
    }

    ngOnDestroy() {
      if (this.createKnightSubscription) {
        this.createKnightSubscription.unsubscribe();
      }

      if (this.getKnightActivitiesSubscription) {
        this.getKnightActivitiesSubscription.unsubscribe();
      }

      if (this.getFormsSubscription) {
        this.getFormsSubscription.unsubscribe();
      }
    }

    onSubmitEditKnight() {
      let mappedKnight = this.mapFormToKnight();

      let knightObserver = {
        next: (response: Knight) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Creating Knight", err),
        complete: () => console.log('Knight created.')
      };
  
      this.createKnightSubscription = this.knightsService.createKnightAndActivityInterest(mappedKnight).subscribe(knightObserver);
    }

    private mapFormToKnight() {
      let rawForm = this.editKnightForm.getRawValue();
      let homeAddress: StreetAddress = {
        streetAddressId: rawForm.homeAddress.streetAddressId,
        address1: rawForm.homeAddress.address1,
        address2: rawForm.homeAddress.address2,
        city: rawForm.homeAddress.city,
        stateCode: rawForm.homeAddress.stateCode,
        postalCode: rawForm.homeAddress.postalCode,
        countryCode: rawForm.homeAddress.countryCode
      };
      let knightInfo: KnightInfo = {
        knightInfoId: rawForm.knightInfo.knightInfoId,
        memberNumber: rawForm.knightInfo.memberNumber,
        mailReturned: rawForm.knightInfo.mailReturned,
        degree: rawForm.knightInfo.degree,
        firstDegreeDate: DateTimeFormatter.ToIso8601Date(
          rawForm.knightInfo.firstDegreeDate.year, 
          rawForm.knightInfo.firstDegreeDate.month, 
          rawForm.knightInfo.firstDegreeDate.day),
        reentryDate: DateTimeFormatter.ToIso8601Date(
          rawForm.knightInfo.reentryDate.year, 
          rawForm.knightInfo.reentryDate.month, 
          rawForm.knightInfo.reentryDate.day),
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
        knightId: rawForm.knightId,
        firstName: rawForm.firstName,
        middleName: rawForm.middleName,
        lastName: rawForm.lastName,
        nameSuffix: rawForm.nameSuffix,
        dateOfBirth: DateTimeFormatter.ToIso8601Date(
          rawForm.dateOfBirth.year, 
          rawForm.dateOfBirth.month, 
          rawForm.dateOfBirth.day),
        emailAddress: rawForm.emailAddress,
        cellPhoneNumber: rawForm.cellPhoneNumber,
        homeAddress: homeAddress,
        knightInfo: knightInfo,
        activityInterests: [],
        memberDues: _memberDues
      };

      this.activityCategoryInputOptions.forEach(activityCategoryInputOption => {
        let activityInterests = rawForm['activityInterests'][`${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`];
  
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

    private passBackResponse(knight: Knight) {
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
