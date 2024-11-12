import { FormArray, FormGroup } from "@angular/forms";
import { MemberDueFormGroup } from "./memberDueFormGroup";

export interface EditMemberDuesFormGroup {
  memberDues: FormArray<FormGroup<MemberDueFormGroup>>;
}