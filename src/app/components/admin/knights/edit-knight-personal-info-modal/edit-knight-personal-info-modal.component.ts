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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditAddressFormGroup } from 'src/app/forms/editAddressFormGroup';
import { EditKnightPersonalInfoFormGroup } from 'src/app/forms/editKnightPersonalInfoFormGroup';
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
    standalone: false
})
export class EditKnightPersonalInfoModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knight?: Knight;
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Output() editKnightPersonalInfoChanges = new EventEmitter<Knight>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public selectedCountry: string = '';
  public editKnightPersonalInfoForm: FormGroup<EditKnightPersonalInfoFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightPersonalInfoSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    this.editKnightPersonalInfoForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.updateKnightPersonalInfoSubscription) {
      this.updateKnightPersonalInfoSubscription.unsubscribe();
    }

    this.enableDisableAdministrativeDivisions();
  }

  ngOnChanges() {
  }

  public resetForm(knight: Knight) {
    this.editKnightPersonalInfoForm = this.initForm();
    this.patchForm(knight);
    this.enableDisableAdministrativeDivisions();
    this.errorSaving = false;
    this.errorMessages = [];
  }

  private initForm(): FormGroup<EditKnightPersonalInfoFormGroup> {
    const today = new Date();
    
    return new FormGroup<EditKnightPersonalInfoFormGroup>({
      id: new FormControl<string>('00000000-0000-0000-0000-000000000000', { nonNullable: true }),
      firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(63)] }),
      middleName: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      nameSuffix: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(7)] }),
      dateOfBirth: new FormControl<string>(
        DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), {nonNullable: true }),
      emailAddress: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
      cellPhoneNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(31)] }),
      homeAddress: new FormGroup<EditAddressFormGroup>({
        addressName: new FormControl<string>('', { nonNullable: true }),
        address1: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        address2: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        city: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(63)] }),
        stateCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(3)] }),
        postalCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(15)] }),
        countryCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(7)] }),
      }),
    });
  }

  private patchForm(knight: Knight) {
    this.editKnightPersonalInfoForm.patchValue({
      id: knight.id,
      firstName: knight.firstName,
      middleName: knight.middleName,
      lastName: knight.lastName,
      nameSuffix: knight.nameSuffix,
      dateOfBirth: DateTimeFormatter.DateTimeToIso8601Date(knight.dateOfBirth),
      emailAddress: knight.emailAddress,
      cellPhoneNumber: knight.cellPhoneNumber,
      homeAddress: knight.homeAddress,
    });
  }

  public filterAdministrativeDivisionsByCountry(): GenericFormOption[] {
    const countryCode = this.editKnightPersonalInfoForm.controls.homeAddress.controls.countryCode.value;  //this.getCountryCode();
    this.selectedCountry = countryCode;

    const filteredCountryFormOptions = this.countryFormOptions.filter((cfo) => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public enableDisableAdministrativeDivisions(): void {
    const countryCode = this.editKnightPersonalInfoForm.controls.homeAddress.controls.countryCode.value;
    this.selectedCountry = countryCode;
    const hasCountryCode = this.countryFormOptions.some((cfo) => cfo.value === countryCode);

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
      error: (err: ApiResponseError) => this.logError('Error Updating Knight Info', err),
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
