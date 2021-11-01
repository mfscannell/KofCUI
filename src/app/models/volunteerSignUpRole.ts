import { EventVolunteer } from "./eventVolunteer";

export class VolunteerSignUpRole {
    volunteerSignupRoleId: number = 0;
    roleTitle: string = '';
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    numberOfVolunteersNeeded: number = 0;
    eventVolunteers?: EventVolunteer[] = [];

    public constructor(
        fields?: {
            volunteerSignupRoleId? : number,
            roleTitle?: string,
            startDate?: string,
            startTime?: string,
            endDate?: string,
            endTime?: string,
            numberOfVolunteersNeeded?: number,
            eventVolunteers: EventVolunteer[],
    }) {
        if (fields) {
            this.volunteerSignupRoleId = fields.volunteerSignupRoleId || this.volunteerSignupRoleId;
            this.roleTitle = fields.roleTitle || this.roleTitle;
            this.startDate = fields.startDate || this.startDate;
            this.startTime = fields.startTime || this.startTime;
            this.endDate = fields.endDate || this.endDate;
            this.endTime = fields.endTime || this.endTime;
            this.numberOfVolunteersNeeded = fields.numberOfVolunteersNeeded || this.numberOfVolunteersNeeded;
            this.eventVolunteers = fields.eventVolunteers || this.eventVolunteers;
        }
    }
}