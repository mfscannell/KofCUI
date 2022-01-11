import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { ActivityCategory } from 'src/app/models/activityCategory';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { Address } from 'src/app/models/address';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { MonthName } from 'src/app/models/monthName';
import { ActivityCategoriesService } from 'src/app/services/activityCategories.service';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'app-account-personalInfo',
  templateUrl: './account-personalInfo.component.html',
  styleUrls: ['./account-personalInfo.component.css']
})
export class AccountPersonalInfoComponent implements OnInit, OnDestroy {
  knightId: number = 5; //TODO need to get this from log in.
  knight?: Knight;
  getKnightSubscription?: Subscription;
  updateKnightSubscription?: Subscription;
  errorMessages: string[] = [];
  months: MonthName[] = MonthName.AllMonths;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  editKnightPersonalInfoForm: FormGroup;
  errorSaving: boolean = false;

  constructor(
    private knightsService: KnightsService,
    private router: Router
  ) {
    var today = new Date();
      this.editKnightPersonalInfoForm = new FormGroup({
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
        dateOfBirthYear: new FormControl(today.getFullYear()),
        dateOfBirthMonth: new FormControl(today.getMonth() + 1),
        dateOfBirthDay: new FormControl(today.getDate()),
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
        })
      });
  }

  ngOnInit() {
    this.getKnight();
  }

  ngOnDestroy() {
    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe;
    }

    if (this.updateKnightSubscription) {
      this.updateKnightSubscription.unsubscribe();
    }
  }

  private getKnight() {
    let knightObserver = {
      next: (getKnightResponse: Knight) => this.patchKnightForm(getKnightResponse),
      error: (err: any) => this.logError('Error getting knight.', err),
      complete: () => console.log('Knight loaded.')
    };

    this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(knightObserver);
  }

  private patchKnightForm(knight: Knight) {
    this.editKnightPersonalInfoForm.patchValue({
      knightId: knight.knightId,
      firstName: knight.firstName,
      middleName: knight.middleName,
      lastName: knight.lastName,
      nameSuffix: knight.nameSuffix,
      dateOfBirthYear: DateTimeFormatter.getYear(knight.dateOfBirth),
      dateOfBirthMonth: DateTimeFormatter.getMonth(knight.dateOfBirth),
      dateOfBirthDay: DateTimeFormatter.getDay(knight.dateOfBirth),
      emailAddress: knight.emailAddress,
      cellPhoneNumber: knight.cellPhoneNumber,
      homeAddress: knight.homeAddress
     });
  }

  onSubmitEditKnight() {
    let updatedKnight = this.mapEditKnightFormToKnight();
    this.updateKnight(updatedKnight);
  }

  cancelEditKnightPersonalInfo() {
    this.router.navigate(['/account']);
  }

  private mapEditKnightFormToKnight() {
    let rawForm = this.editKnightPersonalInfoForm.getRawValue();
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
    let knight = new Knight({
      knightId: rawForm.knightId,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: DateTimeFormatter.ToIso8601Date(
        rawForm.dateOfBirthYear, 
        rawForm.dateOfBirthMonth, 
        rawForm.dateOfBirthDay),
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress
    });

    return knight;
  }

  private updateKnight(knight: Knight) {
    let knightObserver = {
      next: (response: Knight) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight.", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightSubscription = this.knightsService.updateKnight(knight).subscribe(knightObserver);
  }

  private passBackResponse(knight: Knight) {
    this.router.navigate(['/account']);
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
