import { FormControl } from "@angular/forms";

export interface LeadershipRoleFormGroup {
  id: FormControl<string>;
  title: FormControl<string>;
  occupied: FormControl<boolean>;
  knightId: FormControl<string | undefined>;
  leadershipRoleCategory: FormControl<string>;
};