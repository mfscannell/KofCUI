import { KnightDegree } from '../types/knight-degree.type';
import { KnightMemberClassType } from '../types/knight-member-class.type';
import { KnightMemberTypeType } from '../types/knight-member-type.type';

export interface KnightInfo {
  id?: string;
  memberNumber?: number;
  mailReturned: boolean;
  degree: KnightDegree;
  firstDegreeDate?: string;
  reentryDate?: string;
  memberType: KnightMemberTypeType;
  memberClass: KnightMemberClassType;
}
