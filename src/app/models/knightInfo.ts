import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { KnightMemberClassEnums } from '../enums/knightMemberClassEnums';

export class KnightInfo {
    knightInfoId?: number;
    memberNumber?: number;
    mailReturned: boolean = false;
    degree: string = 'First';
    firstDegreeDate?: string;
    reentryDate?: string;
    memberType: string = 'Associate';
    memberClass: string = 'Paying'

    public constructor(
        fields?: {
            knightInfoId? : number,
            memberNumber?: number,
            mailReturned?: boolean,
            degree?: string,
            firstDegreeDate?: string,
            reentryDate?: string,
            memberType?: string,
            memberClass?: string
    }) {
        if (fields) {
            this.knightInfoId = fields.knightInfoId || this.knightInfoId;
            this.memberNumber = fields.memberNumber || this.memberNumber;
            this.mailReturned = fields.mailReturned || this.mailReturned;
            this.degree = fields.degree || this.degree;
            this.firstDegreeDate = fields.firstDegreeDate || this.firstDegreeDate;
            this.reentryDate = fields.reentryDate || this.reentryDate;
            this.memberType = fields.memberType || this.memberType;
            this.memberClass = fields.memberClass || this.memberClass;
        }
    }
}