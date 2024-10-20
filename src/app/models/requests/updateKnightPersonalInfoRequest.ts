import { StreetAddress } from "../streetAddress";

export interface UpdateKnightPersonalInfoRequest {
  knightId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameSuffix: string;
  dateOfBirth?: string;
  emailAddress: string;
  cellPhoneNumber: string;
  homeAddress: StreetAddress;
}