import { MemberDues } from '../memberDues';

export interface UpdateKnightMemberDuesRequest {
  knightId: string;
  memberDues: MemberDues[];
}
