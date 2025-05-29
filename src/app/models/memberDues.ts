import { MemberDuesPaidStatus } from "../types/knight-member-dues-paid-status.type";

export interface MemberDues {
  year: number;
  amountDue: number;
  paidStatus: MemberDuesPaidStatus;
}
