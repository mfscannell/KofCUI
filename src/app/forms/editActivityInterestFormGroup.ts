import { FormControl } from "@angular/forms";

export interface EditActivityInterestFormGroup {
  activityId: FormControl<string>;
  activityName: FormControl<string>;
  activityCategory: FormControl<string>;
  interested: FormControl<boolean>;
}