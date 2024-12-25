import { CreateStreetAddressRequest } from './createStreetAddressRequest';
import { CreateVolunteerSignUpRoleRequest } from './createVolunteerSignUpRoleRequest';

export interface CreateActivityEventRequest {
  activityId: string;
  activityCategory: string;
  eventName: string;
  eventDescription: string;
  startDateTime: string;
  endDateTime: string;
  locationAddress: CreateStreetAddressRequest;
  volunteerSignUpRoles: CreateVolunteerSignUpRoleRequest[];
  showInCalendar: boolean;
  canceled: boolean;
  canceledReason: string;
  notes: string;
}
