import { StreetAddress } from "../streetAddress";

export class UpdateKnightPersonalInfoRequest {
  knightId: number = 0;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nameSuffix?: string;
  dateOfBirth?: string;
  emailAddress?: string;
  cellPhoneNumber?: string;
  homeAddress?: StreetAddress;

  constructor(fields: {
    knightId: number,
    firstName: string,
    middleName: string,
    lastName: string,
    nameSuffix: string,
    dateOfBirth?: string,
    emailAddress: string,
    cellPhoneNumber: string,
    homeAddress: StreetAddress
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
    }
  }
}