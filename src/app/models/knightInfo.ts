import { KnightDegree } from '../types/knight-degree.type';

export interface KnightInfo {
  id?: string;
  memberNumber?: number;
  mailReturned: boolean;
  degree: KnightDegree;
  firstDegreeDate?: string;
  reentryDate?: string;
  memberType: string;
  memberClass: string;
}
