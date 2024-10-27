import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { Knight } from 'src/app/models/knight';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { StreetAddress } from 'src/app/models/streetAddress';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-knight-personal-info-modal',
  templateUrl: './edit-knight-personal-info-modal.component.html',
  styleUrls: ['./edit-knight-personal-info-modal.component.scss'],
})
export class EditKnightPersonalInfoModalComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() modalHeaderText: string = '';
  @Input() knight?: Knight;
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Output() editKnightPersonalInfoChanges = new EventEmitter<Knight>();
  @ViewChild('closeModal', { static: false }) closeModal:
    | ElementRef
    | undefined;

  public editKnightPersonalInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightPersonalInfoSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    const today = new Date();
    this.editKnightPersonalInfoForm = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      firstName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(63),
      ]),
      middleName: new UntypedFormControl('', [Validators.maxLength(63)]),
      lastName: new UntypedFormControl('', [Validators.maxLength(63)]),
      nameSuffix: new UntypedFormControl('', [Validators.maxLength(7)]),
      dateOfBirth: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate(),
        ),
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

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.updateKnightPersonalInfoSubscription) {
      this.updateKnightPersonalInfoSubscription.unsubscribe();
    }

    this.enableDisableAdministrativeDivisions();
  }

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];

    if (this.knight) {
      this.editKnightPersonalInfoForm.patchValue({
        id: this.knight.id,
        firstName: this.knight.firstName,
        middleName: this.knight.middleName,
        lastName: this.knight.lastName,
        nameSuffix: this.knight.nameSuffix,
        dateOfBirth: DateTimeFormatter.DateTimeToIso8601Date(
          this.knight.dateOfBirth,
        ),
        emailAddress: this.knight.emailAddress,
        cellPhoneNumber: this.knight.cellPhoneNumber,
        homeAddress: this.knight.homeAddress,
      });
    }
  }

  private getCountryCode(): string {
    return this.editKnightPersonalInfoForm.get('homeAddress.countryCode')
      ?.value;
  }

  public filterAdministrativeDivisionsByCountry(): GenericFormOption[] {
    const countryCode = this.getCountryCode();

    const filteredCountryFormOptions = this.countryFormOptions.filter(
      (cfo) => cfo.value === countryCode,
    );

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public enableDisableAdministrativeDivisions(): void {
    const countryCode = this.getCountryCode();
    const hasCountryCode = this.countryFormOptions.some(
      (cfo) => cfo.value === countryCode,
    );

    if (hasCountryCode) {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.enable();
    } else {
      this.editKnightPersonalInfoForm.get('homeAddress.stateCode')?.disable();
    }
  }

  public onSubmitEditKnightPersonalInfo() {
    const updateKnightPersonalInfoRequest = this.mapFormToKnightPersonalInfo();
    const knightMemberInfoObserver = {
      next: (response: Knight) => this.passBackResponse(response),
      error: (err: ApiResponseError) =>
        this.logError('Error Updating Knight Info', err),
      complete: () => console.log('Knight Info updated.'),
    };

    this.updateKnightPersonalInfoSubscription = this.knightsService
      .updateKnightPersonalInfo(updateKnightPersonalInfoRequest)
      .subscribe(knightMemberInfoObserver);
  }

  private mapFormToKnightPersonalInfo(): UpdateKnightPersonalInfoRequest {
    const rawForm = this.editKnightPersonalInfoForm.getRawValue();
    console.log('mapFormToKnightPersonalInfo');
    console.log(rawForm);
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
      knightId: rawForm.id,
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

  private passBackResponse(response: Knight) {
    this.editKnightPersonalInfoChanges.emit(response);
    this.closeModal?.nativeElement.click();
    this.updateKnightPersonalInfoSubscription?.unsubscribe();
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

    this.errorSaving = true;
  }
}
