import { EventVolunteer } from "./eventVolunteer";

export interface VolunteerSignUpRole {
    id: string;
    roleTitle: string;
    startDateTime?: string;
    endDateTime?: string;
    numberOfVolunteersNeeded: number;
    eventVolunteers: EventVolunteer[];
}