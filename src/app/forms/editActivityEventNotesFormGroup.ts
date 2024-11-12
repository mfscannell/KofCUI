import { FormControl } from "@angular/forms";

export interface EditActivityEventNotesFormGroup {
  startDateTime: FormControl<string>;
  notes: FormControl<string>
}