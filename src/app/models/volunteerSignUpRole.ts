import { EventVolunteer } from "./eventVolunteer";

export class VolunteerSignUpRole {
    volunteerSignupRoleId: number = 0;
    roleTitle: string = '';
    startDateTime?: string;
    endDateTime?: string;
    numberOfVolunteersNeeded: number = 0;
    eventVolunteers: EventVolunteer[] = [];

    public constructor(
        fields?: {
            volunteerSignupRoleId? : number,
            roleTitle?: string,
            startDateTime?: string,
            endDateTime?: string,
            numberOfVolunteersNeeded?: number,
            eventVolunteers: EventVolunteer[],
    }) {
        if (fields) {
            this.volunteerSignupRoleId = fields.volunteerSignupRoleId || this.volunteerSignupRoleId;
            this.roleTitle = fields.roleTitle || this.roleTitle;
            this.startDateTime = fields.startDateTime || this.startDateTime;
            this.endDateTime = fields.endDateTime || this.endDateTime;
            this.numberOfVolunteersNeeded = fields.numberOfVolunteersNeeded || this.numberOfVolunteersNeeded;
            this.eventVolunteers = fields.eventVolunteers || this.eventVolunteers;
        }
    }
}