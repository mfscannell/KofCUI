import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { EditKnightMemberInfoFormGroup } from "./editKnightMemberInfoFormGroup";
import { MemberDueFormGroup } from "./memberDueFormGroup";
import { CreateAddressFormGroup } from "./createAddressFormGroup";
import { EditActivityInterestsFormGroup } from "./editActivityInterestsFormGroup";

export interface CreateKnightFormGroup {
  firstName: FormControl<string>;
  middleName: FormControl<string>;
  lastName: FormControl<string>;
  nameSuffix: FormControl<string>;
  dateOfBirth: FormControl<string>;
  emailAddress: FormControl<string>;
  cellPhoneNumber: FormControl<string>;
  homeAddress: FormGroup<CreateAddressFormGroup>;
  knightInfo: FormGroup<EditKnightMemberInfoFormGroup>;
  memberDues: FormArray<FormGroup<MemberDueFormGroup>>;
  activityInterests: FormGroup<EditActivityInterestsFormGroup>;
}