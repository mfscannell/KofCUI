import { FormControl } from "@angular/forms";

export interface EditVolunteerForRoleFormGroup {
  volunteerRoleId: FormControl<string>;
  roleTitle: FormControl<string>;
  numVolunteersNeeded: FormControl<number>;
  volunteerForRole: FormControl<boolean>;
}