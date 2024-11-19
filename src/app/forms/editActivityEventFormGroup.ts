import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { EditAddressFormGroup } from "./editAddressFormGroup";
import { EditVolunteerSignUpRoleFormGroup } from "./editVolunteerSignUpRoleFormGroup";

export interface EditActivityEventFormGroup {
  id: FormControl<string>;
  activityId: FormControl<string>;
  activityCategory: FormControl<string>;
  eventName: FormControl<string>;
  eventDescription: FormControl<string>;
  startDate: FormControl<string>;
  startTime: FormControl<string>;
  endDate: FormControl<string>;
  endTime: FormControl<string>;
  locationAddress: FormGroup<EditAddressFormGroup>;
  showInCalendar: FormControl<boolean>;
  canceled: FormControl<boolean>;
  canceledReason: FormControl<string>;
  notes: FormControl<string>;
  volunteerSignUpRoles: FormArray<FormGroup<EditVolunteerSignUpRoleFormGroup>>;
}