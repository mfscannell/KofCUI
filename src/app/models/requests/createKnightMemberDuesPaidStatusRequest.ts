import { MemberDuesPaidStatus } from "@app/types/knight-member-dues-paid-status.type";

export interface CreateKnightMemberDuesPaidStatusRequest {
  year: number;
  paidStatus: MemberDuesPaidStatus;
}