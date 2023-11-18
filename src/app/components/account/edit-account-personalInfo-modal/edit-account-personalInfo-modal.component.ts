import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { MonthName } from 'src/app/models/monthName';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { AccountsService } from 'src/app/services/accounts.service';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'kofc-edit-account-personalInfo-modal',
  templateUrl: './edit-account-personalInfo-modal.component.html',
  styleUrls: ['./edit-account-personalInfo-modal.component.scss']
})
export class EditAccountPersonalInfoModalComponent implements OnInit, OnDestroy {
  @Input() knight?: Knight;
  public editKnightPersonalInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public months: MonthName[] = MonthName.AllMonths;
  public states: AddressState[] = AddressState.AllStates;
  public countries: Country[] = Country.AllCountries;
  private updateKnightSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService) {
    var today = new Date();
    this.editKnightPersonalInfoForm = new UntypedFormGroup({
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
      dateOfBirthYear: new UntypedFormControl(today.getFullYear()),
      dateOfBirthMonth: new UntypedFormControl(today.getMonth() + 1),
      dateOfBirthDay: new UntypedFormControl(today.getDate()),
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

  ngOnInit() {
    if (this.knight) {
      this.editKnightPersonalInfoForm.patchValue({
        knightId: this.knight.knightId,
        firstName: this.knight.firstName,
        middleName: this.knight.middleName,
        lastName: this.knight.lastName,
        nameSuffix: this.knight.nameSuffix,
        dateOfBirthYear: DateTimeFormatter.getYear(this.knight.dateOfBirth),
        dateOfBirthMonth: DateTimeFormatter.getMonth(this.knight.dateOfBirth),
        dateOfBirthDay: DateTimeFormatter.getDay(this.knight.dateOfBirth),
        emailAddress: this.knight.emailAddress,
        cellPhoneNumber: this.knight.cellPhoneNumber,
        homeAddress: this.knight.homeAddress
       });
    }
  }

  ngOnDestroy() {
    if (this.updateKnightSubscription) {
      this.updateKnightSubscription.unsubscribe();
    }
  }

  onSubmitEditKnight() {
    let updatedKnight = this.mapEditKnightFormToKnight();
    this.updateKnightPersonalInfo(updatedKnight);
  }

  private mapEditKnightFormToKnight() {
    let rawForm = this.editKnightPersonalInfoForm.getRawValue();
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
    let knight = new UpdateKnightPersonalInfoRequest({
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

  private updateKnightPersonalInfo(knightPersonalInfo: UpdateKnightPersonalInfoRequest) {
    let knightObserver = {
      next: (response: Knight) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight.", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightSubscription = this.knightsService.updateKnightPersonalInfo(knightPersonalInfo).subscribe(knightObserver);
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
