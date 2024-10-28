import { EventVolunteersFormGroup } from './eventVolunteersFormGroup';

export interface VolunteerSignUpRoleFormGroup {
  id: string;
  roleTitle: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  numberOfVolunteersNeeded: number;
  eventVolunteers: EventVolunteersFormGroup[];
}
