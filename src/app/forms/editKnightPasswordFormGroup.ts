import { FormControl } from "@angular/forms";

export interface EditKnightPasswordFormGroup {
  accountActivated: FormControl<boolean>;
  password: FormControl<string>;
  resetPasswordAtNextLogin: FormControl<boolean>;
}