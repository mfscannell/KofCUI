import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ExternalLinksFormGroup } from "./externalLinksFormGroup";

export interface ConfigsFormGroup {
  id: FormControl<string>;
  facebookUrl: FormControl<string>;
  twitterUrl: FormControl<string>;
  councilTimeZone: FormControl<string>;
  allowChangeActivitySubscription: FormControl<boolean>;
  externalLinksList: FormArray<FormGroup<ExternalLinksFormGroup>>;
}