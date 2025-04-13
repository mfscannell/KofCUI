import { FormControl } from "@angular/forms";

export interface GetMemberDuesAmountsFormGroup {
  fromYear: FormControl<number>;
  toYear: FormControl<number>;
}