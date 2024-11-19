import { FormControl } from "@angular/forms";
import { KnightDegree } from "../types/knight-degree.type";
import { KnightMemberTypeType } from "../types/knight-member-type.type";
import { KnightMemberClassType } from "../types/knight-member-class.type";

export interface EditKnightMemberInfoFormGroup {
  memberNumber: FormControl<number>;
  mailReturned: FormControl<boolean>;
  degree: FormControl<KnightDegree>;
  firstDegreeDate: FormControl<string>;
  reentryDate: FormControl<string>;
  memberType: FormControl<KnightMemberTypeType>;
  memberClass: FormControl<KnightMemberClassType>;
}