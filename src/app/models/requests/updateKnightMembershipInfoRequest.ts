import { KnightDegree } from "src/app/types/knight-degree.type";
import { KnightMemberClassType } from "src/app/types/knight-member-class.type";
import { KnightMemberTypeType } from "src/app/types/knight-member-type.type";

export interface UpdateKnightMembershipInfoRequest {
  knightId: number;
  memberNumber?: number;
  mailReturned: boolean;
  degree: KnightDegree;
  firstDegreeDate?: string;
  reentryDate?: string;
  memberType: KnightMemberTypeType;
  memberClass: KnightMemberClassType;
}