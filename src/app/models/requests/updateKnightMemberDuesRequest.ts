import { MemberDues } from "../memberDues";

export interface UpdateKnightMemberDuesRequest {
  knightId: number;
  memberDues: MemberDues[];
}