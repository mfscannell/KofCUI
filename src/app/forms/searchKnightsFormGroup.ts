import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { SearchDegreeFormGroup } from "./searchDegreesFormGroup";

export interface SearchKnightsFormGroup {
  nameSearch: FormControl<string>;
  pageSize: FormControl<number>;
  page: FormControl<number>;
  // skip: FormControl<number>;
  // take: FormControl<number>;
  searchDegrees: FormArray<FormGroup<SearchDegreeFormGroup>>;
}