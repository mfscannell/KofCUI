import { MemberDues } from '../memberDues';

export interface UpdateKnightMemberDuesRequest {
  knightId: string;
  // TODO MFS change this to UpdateMemberDues interface.
  memberDues: MemberDues[];
}
