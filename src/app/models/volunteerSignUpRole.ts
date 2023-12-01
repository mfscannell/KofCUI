import { EventVolunteer } from "./eventVolunteer";

export interface VolunteerSignUpRole {
    volunteerSignupRoleId: number;
    roleTitle: string;
    startDateTime?: string;
    endDateTime?: string;
    numberOfVolunteersNeeded: number;
    eventVolunteers: EventVolunteer[];
}