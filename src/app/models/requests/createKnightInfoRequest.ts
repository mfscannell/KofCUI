import { KnightDegree } from "@app/types/knight-degree.type";
import { KnightMemberClassType } from "@app/types/knight-member-class.type";
import { KnightMemberTypeType } from "@app/types/knight-member-type.type";

export interface CreateKnightInfoRequest {
  memberNumber: number;
  mailReturned: boolean;
  degree: KnightDegree;
  firstDegreeDate: string;
  reentryDate: string;
  memberType: KnightMemberTypeType;
  memberClass: KnightMemberClassType;
}