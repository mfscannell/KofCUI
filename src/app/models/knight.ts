import { StreetAddress } from "./streetAddress";
import { KnightInfo } from "src/app/models/knightInfo";
import { ActivityInterest } from "src/app/models/activityInterest";
import { KnightUser } from "./knightUser";
import { MemberDues } from "./memberDues";

export interface Knight {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    nameSuffix: string;
    dateOfBirth?: string;
    emailAddress: string;
    cellPhoneNumber: string;
    homeAddress: StreetAddress;
    knightInfo: KnightInfo;
    knightUser?: KnightUser;
    activityInterests: ActivityInterest[];
    memberDues: MemberDues[];
}