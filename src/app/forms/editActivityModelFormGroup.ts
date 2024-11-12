import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { EditActivityCoordinatorFormGroup } from "./editActivityCoordinatorFormGroup";

export interface EditActivityModelFormGroup {
  id: FormControl<string>;
  activityName: FormControl<string>;
  activityDescription: FormControl<string>;
  activityCategory: FormControl<string>;
  activityCoordinatorsList: FormArray<FormGroup<EditActivityCoordinatorFormGroup>>;
  notes: FormControl<string>;
}