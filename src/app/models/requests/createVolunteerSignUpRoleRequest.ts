export interface CreateVolunteerSignUpRoleRequest {
  roleTitle: string;
  startDateTime?: string;
  endDateTime?: string;
  numberOfVolunteersNeeded: number;
  eventVolunteers: string[];
}