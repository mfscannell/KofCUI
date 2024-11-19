import { FormArray, FormGroup } from "@angular/forms";
import { EditVolunteerForRoleFormGroup } from "./editVolunteerForRoleFormGroup";

export interface EditVolunteerForEventFormGroup {
  volunteerSignUpRoles: FormArray<FormGroup<EditVolunteerForRoleFormGroup>>;
}