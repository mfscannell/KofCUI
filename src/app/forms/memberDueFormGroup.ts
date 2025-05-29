import { FormControl } from "@angular/forms";
import { MemberDuesPaidStatus } from "../types/knight-member-dues-paid-status.type";

export interface MemberDueFormGroup {
  year: FormControl<number>;
  amountDue: FormControl<number>;
  paidStatus: FormControl<MemberDuesPaidStatus>;
}