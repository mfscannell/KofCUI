import { UserTypeEnums } from "../enums/userTypeEnums";
import { Address } from "./address";
import { KnightInfo } from "src/app/models/knightInfo";
import { ActivityInterest } from "src/app/models/activityInterest";

export class Knight {
    knightId?: number;
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    nameSuffix: string = "";
    dateOfBirth: string = "";
    emailAddress: string = "";
    cellPhoneNumber: string = "";
    homeAddress: Address = new Address();
    knightInfo: KnightInfo = new KnightInfo();
    activityInterests: ActivityInterest[] = [];


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
            homeAddress?: Address,
            knightInfo?: KnightInfo,
            activityInterests?: ActivityInterest[]
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
            this.activityInterests = fields.activityInterests || this.activityInterests;
        }
    }
}