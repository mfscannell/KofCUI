import { FormControl } from "@angular/forms";

export interface MemberDueFormGroup {
  year: FormControl<number>;
  paidStatus: FormControl<string>;
}