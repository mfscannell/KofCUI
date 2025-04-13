import { FormControl } from "@angular/forms";

export interface EditMemberDuesAmountsFormGroup {
  year: FormControl<number>;
  memberClassPayingDuesAmount: FormControl<string>;
  memberClassHonoraryLifeDuesAmount: FormControl<string>;
}