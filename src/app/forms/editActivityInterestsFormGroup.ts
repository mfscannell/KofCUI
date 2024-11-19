import { FormArray, FormGroup } from "@angular/forms";
import { EditActivityInterestFormGroup } from "./editActivityInterestFormGroup";

export interface EditActivityInterestsFormGroup {
  activityInterests: FormArray<FormGroup<EditActivityInterestFormGroup>>;
}