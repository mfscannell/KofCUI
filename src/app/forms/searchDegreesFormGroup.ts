import { FormControl } from "@angular/forms";
import { KnightDegree } from "../types/knight-degree.type";

export interface SearchDegreeFormGroup {
  degree: FormControl<KnightDegree>;
  selected: FormControl<boolean>;
}