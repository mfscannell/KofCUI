import { UserTypeEnums } from "../enums/userTypeEnums";
import { StreetAddress } from "./streetAddress";
import { KnightInfo } from "src/app/models/knightInfo";
import { ActivityInterest } from "src/app/models/activityInterest";
import { KnightUser } from "./knightUser";
import { MemberDues } from "./memberDues";

export class Knight {
    knightId?: number;
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    nameSuffix: string = "";
    dateOfBirth: string = "";
    emailAddress: string = "";
    cellPhoneNumber: string = "";
    homeAddress: StreetAddress = new StreetAddress();
    knightInfo: KnightInfo = new KnightInfo();
    knightUser: KnightUser = new KnightUser();
    activityInterests: ActivityInterest[] = [];
    memberDues: MemberDues[] = [];

    public constructor(
        fields?: {
            knightId? : number,
            firstName?: string,
            middleName?: string,
            lastName?: string,
            nameSuffix?: string,
            dateOfBirth?: string,
            emailAddress: string,
            cellPhoneNumber: string,
            homeAddressId?: number,
            homeAddress?: StreetAddress,
            knightInfo?: KnightInfo,
            knightUser?: KnightUser,
            activityInterests?: ActivityInterest[],
            memberDues?: MemberDues[]
    }) {
        if (fields) {
            this.knightId = fields.knightId || this.knightId;
            this.firstName = fields.firstName || this.firstName;
            this.middleName = fields.middleName || this.middleName;
            this.lastName = fields.lastName || this.lastName;
            this.nameSuffix = fields.nameSuffix || this.nameSuffix;
            this.dateOfBirth = fields.dateOfBirth || this.dateOfBirth;
            this.emailAddress = fields.emailAddress || this.emailAddress;
            this.cellPhoneNumber = fields.cellPhoneNumber || this.cellPhoneNumber;
            this.homeAddress = fields.homeAddress || this.homeAddress;
            this.knightInfo = fields.knightInfo || this.knightInfo;
            this.knightUser = fields.knightUser || this.knightUser;
            this.activityInterests = fields.activityInterests || this.activityInterests;
            this.memberDues = fields.memberDues || this.memberDues;
        }
    }
}