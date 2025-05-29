import { MemberDuesPaidStatus } from "src/app/types/knight-member-dues-paid-status.type";

export interface CreateKnightMemberDuesPaidStatusRequest {
  year: number;
  paidStatus: MemberDuesPaidStatus;
}