import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { EditEventVolunteersFormGroup } from "./editEventVolunteersFormGroup";

export interface EditVolunteerSignUpRoleFormGroup {
  id: FormControl<string>;
  roleTitle: FormControl<string>;
  startDate: FormControl<string>;
  startTime: FormControl<string>;
  endDate: FormControl<string>;
  endTime: FormControl<string>;
  numberOfVolunteersNeeded: FormControl<number>;
  eventVolunteers: FormArray<FormGroup<EditEventVolunteersFormGroup>>;
}