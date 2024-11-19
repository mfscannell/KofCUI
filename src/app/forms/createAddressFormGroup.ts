import { FormControl } from "@angular/forms";

export interface CreateAddressFormGroup {
  addressName: FormControl<string>;
  address1: FormControl<string>;
  address2: FormControl<string>;
  city: FormControl<string>;
  stateCode: FormControl<string>;
  postalCode: FormControl<string>;
  countryCode: FormControl<string>;
}