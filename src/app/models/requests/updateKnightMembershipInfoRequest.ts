import { KnightDegreeEnums } from "src/app/enums/knightDegreeEnums";
import { KnightMemberClassEnums } from "src/app/enums/knightMemberClassEnums";
import { KnightMemberTypeEnums } from "src/app/enums/knightMemberTypeEnums";

export interface UpdateKnightMembershipInfoRequest {
  knightId: number;
  memberNumber?: number;
  mailReturned: boolean;
  degree: KnightDegreeEnums;
  firstDegreeDate?: string;
  reentryDate?: string;
  memberType: KnightMemberTypeEnums;
  memberClass: KnightMemberClassEnums;
}