import { MemberDues } from "../memberDues";
import { CreateActivityInterestRequest } from "./createActivityInterestRequest";
import { CreateKnightInfoRequest } from "./createKnightInfoRequest";
import { CreateStreetAddressRequest } from "./createStreetAddressRequest";

export interface CreateKnightRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  nameSuffix: string;
  dateOfBirth?: string;
  emailAddress: string;
  cellPhoneNumber: string;
  homeAddress: CreateStreetAddressRequest;
  knightInfo: CreateKnightInfoRequest;
  activityInterests: CreateActivityInterestRequest[];
  memberDues: MemberDues[];
}
