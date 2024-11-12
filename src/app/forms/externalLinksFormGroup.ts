import { FormControl } from "@angular/forms";

export interface ExternalLinksFormGroup {
  websiteName: FormControl<string>;
  url: FormControl<string>;
}