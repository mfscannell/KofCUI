import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { ActivityCategory } from 'src/app/models/activityCategory';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { Address } from 'src/app/models/address';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { ActivityCategoriesService } from 'src/app/services/activityCategories.service';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightInfo } from 'src/app/models/knightInfo';

@Component({
  selector: 'edit-knight-modal',
  templateUrl: './edit-knight-modal.component.html',
  styleUrls: ['./edit-knight-modal.component.css']
})
export class EditKnightModalComponent implements OnInit {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() knight?: Knight;
  public knightDegrees = Object.values(KnightDegreeEnums);
  public knightMemberTypeEnums = Object.values(KnightMemberTypeEnums);
  getKnightActivitiesSubscription?: Subscription;
  updateKnightSubscription?: Subscription;
  createKnightSubscription?: Subscription;
  getActivityCategoriesSubscription?: Subscription
  editKnightForm: FormGroup;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  activityCategories: ActivityCategory[] = [];
  allActivities: ActivityInterest[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
    private activityCategoriesService: ActivityCategoriesService) {
      var today = new Date();
      this.editKnightForm = new FormGroup({
        knightId: new FormControl(0),
        firstName: new FormControl('', [
          Validators.required,
          Validators.maxLength(63)
        ]),
        middleName: new FormControl('', [
          Validators.maxLength(63)
        ]),
        lastName: new FormControl('', [
          Validators.maxLength(63)
        ]),
        nameSuffix: new FormControl('', [
          Validators.maxLength(7)
        ]),
        dateOfBirth: new FormControl({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        }),
        emailAddress: new FormControl('', [
          Validators.maxLength(63)
        ]),
        cellPhoneNumber: new FormControl('', [
          Validators.maxLength(31)
        ]),
        homeAddress: new FormGroup({
          addressId: new FormControl(0),
          addressName: new FormControl(null),
          address1: new FormControl('', [
            Validators.maxLength(63)
          ]),
          address2: new FormControl('', [
            Validators.maxLength(63)
          ]),
          addressCity: new FormControl('', [
            Validators.maxLength(63)
          ]),
          addressStateCode: new FormControl('', [
            Validators.maxLength(3)
          ]),
          addressPostalCode: new FormControl('', [
            Validators.maxLength(15)
          ]),
          addressCountryCode: new FormControl('', [
            Validators.maxLength(7)
          ])
        }),
        knightInfo: new FormGroup({
          knightInfoId: new FormControl(0),
          memberNumber: new FormControl(0),
          mailReturned: new FormControl(false),
          degree: new FormControl(KnightDegreeEnums.First),
          firstDegreeDate: new FormControl({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
          }),
          reentryDate: new FormControl({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
          }),
          memberType: new FormControl(KnightMemberTypeEnums.Associate)
        })
      });

      this.getActivityCategories();
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
            memberType: this.knight.knightInfo.memberType
          }
         });

         this.allActivities = this.knight.activityInterests;
      } else {
        this.knight = new Knight();

        this.getAllKnightActivityInterestsForNewKnight();
      }
    }

    private getActivityCategories() {
      let activityCategoriesObserver = {
        next: (activityCategories: ActivityCategory[]) => this.activityCategories = activityCategories,
        error: (err: any) => this.logError('Error getting activity categories', err),
        complete: () => console.log('Activity categories loaded.')
      };

      this.getActivityCategoriesSubscription = this.activityCategoriesService.getAllActivityCategories().subscribe(activityCategoriesObserver);
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
      if (this.modalAction === ModalActionEnums.Edit) {
        let updatedKnight = this.mapFormToKnight();
        this.updateKnight(updatedKnight);
      } else if (this.modalAction === ModalActionEnums.Create) {
        let createdKnight = this.mapFormToKnight();
        this.createKnight(createdKnight);
      }
    }

    private mapFormToKnight() {
      let rawForm = this.editKnightForm.getRawValue();
      let homeAddress = new Address({
        addressId: rawForm.homeAddress.addressId,
        addressName: rawForm.homeAddress.addressName,
        address1: rawForm.homeAddress.address1,
        address2: rawForm.homeAddress.address2,
        addressCity: rawForm.homeAddress.addressCity,
        addressStateCode: rawForm.homeAddress.addressStateCode,
        addressPostalCode: rawForm.homeAddress.addressPostalCode,
        addressCountryCode: rawForm.homeAddress.addressCountryCode
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
        memberType: rawForm.knightInfo.memberType
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
        activityInterests: this.allActivities
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

    private updateKnight(knight: Knight) {
      let knightObserver = {
        next: (response: Knight) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Updating Knight", err),
        complete: () => console.log('Knight updated.')
      };
  
      this.updateKnightSubscription = this.knightsService.updateKnightAndActivityInterest(knight).subscribe(knightObserver);
    }

    private passBackResponse(knight: Knight) {
      this.activeModal.close(knight);
    }

    filterActivitiesByCategoryId(activityCategoryId: number) {
      return this.allActivities.filter(x => x.activityCategoryId == activityCategoryId);
    }

    toggleInterestCheckbox(interestChangeEvent: any, activity: ActivityInterest) {
      activity.interested = interestChangeEvent.target.checked;
    }

    logError(message: string, err: any) {
      console.error(message);
      console.error(err);
    }
}
