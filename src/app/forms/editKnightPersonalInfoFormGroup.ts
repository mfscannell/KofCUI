import { FormControl, FormGroup } from "@angular/forms";
import { EditAddressFormGroup } from "./editAddressFormGroup";

export interface EditKnightPersonalInfoFormGroup {
  id: FormControl<string>;
  firstName: FormControl<string>;
  middleName: FormControl<string>;
  lastName: FormControl<string>;
  nameSuffix: FormControl<string>;
  dateOfBirth: FormControl<string>;
  emailAddress: FormControl<string>;
  cellPhoneNumber: FormControl<string>;
  homeAddress: FormGroup<EditAddressFormGroup>;
}