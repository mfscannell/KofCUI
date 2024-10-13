import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, filter } from 'rxjs';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { Knight } from 'src/app/models/knight';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { FormsService } from 'src/app/services/forms.service';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'app-edit-knight-personal-info-modal',
  templateUrl: './edit-knight-personal-info-modal.component.html',
  styleUrls: ['./edit-knight-personal-info-modal.component.scss']
})
export class EditKnightPersonalInfoModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() knight?: Knight;
  public editKnightPersonalInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  private getCountryFormOptionsSubscription?: Subscription;
  private updateKnightPersonalInfoSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private formsService: FormsService,
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

  ngOnInit() {
    this.enableDisableAdministrativeDivisions();
    this.getCountryFormOptions();
  }

  ngOnDestroy(): void {
    if (this.updateKnightPersonalInfoSubscription) {
      this.updateKnightPersonalInfoSubscription.unsubscribe();
    }

    if (this.getCountryFormOptionsSubscription) {
      this.getCountryFormOptionsSubscription.unsubscribe();
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

  public enableDisableAdministrativeDivisions(): void {
    let countryCode = this.getCountryCode();
    let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

    if (hasCountryCode) {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.enable();
    } else {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private getCountryFormOptions() {
    let getCountryFormOptionsObserver = {
      next: (response: CountryFormOption[]) => this.handleGetCountryFormOptions(response),
      error: (err: any) => this.logError("Error getting Country Form Options", err),
      complete: () => console.log('Country Form Options retrieved.')
    }

    this.getCountryFormOptionsSubscription = this.formsService.getCountryFormOptions().subscribe(getCountryFormOptionsObserver);
  }

  private handleGetCountryFormOptions(response: CountryFormOption[]) {
    this.countryFormOptions = response;

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
  }

  public onSubmitEditKnightPersonalInfo() {
    let updateKnightPersonalInfoRequest = this.mapFormToKnightPersonalInfo();
    let knightMemberInfoObserver = {
      next: (response: Knight) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight Info", err),
      complete: () => console.log('Knight Info updated.')
    };

    this.updateKnightPersonalInfoSubscription = this.knightsService.updateKnightPersonalInfo(updateKnightPersonalInfoRequest).subscribe(knightMemberInfoObserver);
  }

  private mapFormToKnightPersonalInfo(): UpdateKnightPersonalInfoRequest {
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

  private passBackResponse(response: Knight) {
    this.activeModal.close(response);
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
