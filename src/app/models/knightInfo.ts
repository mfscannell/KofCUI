import { KnightDegree } from '../types/knight-degree.type';

export interface KnightInfo {
    knightInfoId?: number;
    memberNumber?: number;
    mailReturned: boolean;
    degree: KnightDegree;
    firstDegreeDate?: string;
    reentryDate?: string;
    memberType: string;
    memberClass: string;
}