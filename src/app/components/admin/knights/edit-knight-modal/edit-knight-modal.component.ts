import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightInfo } from 'src/app/models/knightInfo';
import { MemberDues } from 'src/app/models/memberDues';
import { MemberDuesPaymentStatus } from 'src/app/enums/memberDuesPaymentStatus';
import { MemberDuesPayStatusInputOption } from 'src/app/models/inputOptions/memberDuesPayStatusInputOption';
import { KnightMemberClassInputOption } from 'src/app/models/inputOptions/knightMemberClassInputOption';
import { KnightMemberTypeInputOption } from 'src/app/models/inputOptions/knightMemberTypeInputOption';
import { KnightDegreeInputOption } from 'src/app/models/inputOptions/knightDegreeInputOption';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';

@Component({
  selector: 'edit-knight-modal',
  templateUrl: './edit-knight-modal.component.html',
  styleUrls: ['./edit-knight-modal.component.scss']
})
export class EditKnightModalComponent implements OnInit {
  public modalHeaderText: string = 'Adding Knight';
  @Input() knight?: Knight;
  public knightDegreeInputOptions: KnightDegreeInputOption[] = KnightDegreeInputOption.options
  public knightMemberTypeInputOptions: KnightMemberTypeInputOption[] = KnightMemberTypeInputOption.options
  public knightMemberClassInputOptions: KnightMemberClassInputOption[] = KnightMemberClassInputOption.options;
  public memberDuesPaymentStatusInputOptions: MemberDuesPayStatusInputOption[] = MemberDuesPayStatusInputOption.options;
  public memberDuesPaymentStatusEnums = Object.values(MemberDuesPaymentStatus);
  getKnightActivitiesSubscription?: Subscription;
  updateKnightSubscription?: Subscription;
  createKnightSubscription?: Subscription;
  getActivityCategoriesSubscription?: Subscription;
  editKnightForm: UntypedFormGroup;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  allActivities: ActivityInterest[] = [];
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
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
        memberDues: new UntypedFormArray([])
      });
    }

    ngOnInit() {
      if (this.knight) {
        this.editKnightForm.patchValue({
          knightId: this.knight.knightId,
          firstName: this.knight.firstName,
          middleName: this.knight.middleName,
          lastName: this.knight.lastName,
          nameSuffix: this.knight.nameSuffix,
          dateOfBirth: {
            year: DateTimeFormatter.getYear(this.knight.dateOfBirth),
            month: DateTimeFormatter.getMonth(this.knight.dateOfBirth),
            day: DateTimeFormatter.getDay(this.knight.dateOfBirth)
          },
          emailAddress: this.knight.emailAddress,
          cellPhoneNumber: this.knight.cellPhoneNumber,
          homeAddress: this.knight.homeAddress,
          knightInfo: {
            knightInfoId: this.knight.knightInfo.knightInfoId,
            memberNumber: this.knight.knightInfo.memberNumber,
            mailReturned: this.knight.knightInfo.mailReturned,
            degree: this.knight.knightInfo.degree,
            firstDegreeDate: {
              year: DateTimeFormatter.getYear(this.knight.knightInfo.firstDegreeDate),
              month: DateTimeFormatter.getMonth(this.knight.knightInfo.firstDegreeDate),
              day: DateTimeFormatter.getDay(this.knight.knightInfo.firstDegreeDate)
            }, 
            reentryDate: {
              year: DateTimeFormatter.getYear(this.knight.knightInfo.reentryDate),
              month: DateTimeFormatter.getMonth(this.knight.knightInfo.reentryDate),
              day: DateTimeFormatter.getDay(this.knight.knightInfo.reentryDate)
            },
            memberType: this.knight.knightInfo.memberType,
            memberClass: this.knight.knightInfo.memberClass
          }
         });

         this.knight.memberDues.forEach((memberDue: MemberDues) => {
          const memberDueFormGroup = new UntypedFormGroup({
            year: new UntypedFormControl(memberDue.year),
            paidStatus: new UntypedFormControl(memberDue.paidStatus)
          });

          this.memberDuesForm.push(memberDueFormGroup);
         });

         this.allActivities = this.knight.activityInterests;
      } else {
        this.knight = new Knight();

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
    }

    get memberDuesForm() {
      return this.editKnightForm.controls["memberDues"] as UntypedFormArray;
    }

    private getAllKnightActivityInterestsForNewKnight() {
      let knightActiviityInterestObserver = {
        next: (knightActivityInterests: ActivityInterest[]) => this.setActivityInterestsForNewKnight(knightActivityInterests),
        error: (err: any) => this.logError('Error getting knight activity interests for new knight', err),
        complete: () => console.log('Knight Activity Interests loaded.')
      };

      this.getKnightActivitiesSubscription = this.knightActivityInterestsService.getAllIKnightActivityInterestsForNewKnight().subscribe(knightActiviityInterestObserver);
    }

    private setActivityInterestsForNewKnight(knightActivityInterests: ActivityInterest[]) {
      this.allActivities = knightActivityInterests;
    }

    ngOnDestroy() {
      if (this.updateKnightSubscription) {
        this.updateKnightSubscription.unsubscribe();
      }
  
      if (this.createKnightSubscription) {
        this.createKnightSubscription.unsubscribe();
      }

      if (this.getKnightActivitiesSubscription) {
        this.getKnightActivitiesSubscription.unsubscribe();
      }

      if (this.getActivityCategoriesSubscription) {
        this.getActivityCategoriesSubscription.unsubscribe();
      }
    }

    onSubmitEditKnight() {
      let createdKnight = this.mapFormToKnight();
      this.createKnight(createdKnight);
    }

    private mapFormToKnight() {
      let rawForm = this.editKnightForm.getRawValue();
      let homeAddress = new StreetAddress({
        streetAddressId: rawForm.homeAddress.streetAddressId,
        addressName: rawForm.homeAddress.addressName,
        address1: rawForm.homeAddress.address1,
        address2: rawForm.homeAddress.address2,
        city: rawForm.homeAddress.city,
        stateCode: rawForm.homeAddress.stateCode,
        postalCode: rawForm.homeAddress.postalCode,
        countryCode: rawForm.homeAddress.countryCode
      });
      let knightInfo = new KnightInfo({
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
      });
      let _memberDues: MemberDues[] = rawForm?.memberDues?.map(function(md: any) {
        return new MemberDues({
          year: md.year,
          paidStatus: md.paidStatus
        })
      });
      let knight = new Knight({
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
        activityInterests: this.allActivities,
        memberDues: _memberDues
      });

      return knight;
    }

    private createKnight(knight: Knight) {
      let knightObserver = {
        next: (response: Knight) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Creating Knight", err),
        complete: () => console.log('Knight created.')
      };
  
      this.createKnightSubscription = this.knightsService.createKnightAndActivityInterest(knight).subscribe(knightObserver);
    }

    private passBackResponse(knight: Knight) {
      this.activeModal.close(knight);
    }

    filterActivitiesByCategory(activityCategoryValue: string) {
      return this.allActivities.filter(x => x.activityCategory === activityCategoryValue);
    }

    toggleInterestCheckbox(interestChangeEvent: any, activity: ActivityInterest) {
      activity.interested = interestChangeEvent.target.checked;
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
