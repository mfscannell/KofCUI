import { Address } from 'src/app/models/address';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { EventVolunteer } from './eventVolunteer';

export class ActivityEvent {
    activityEventId: number = 0;
    activityId: number = 0;
    eventName: string = '';
    eventDescription: string = '';
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    locationAddressId: number = 0;
    volunteerSignUpRoles?: VolunteerSignUpRole[] = [];
    showInCalendar: boolean = true;
    canceled: boolean = false;
    canceledReason?: string;

    public constructor(
        fields?: {
            activityEventId? : number,
            activityId?: number,
            eventName: string,
            eventDescription: string,
            startDate: string,
            startTime: string,
            endDate: string,
            endTime: string,
            locationAddressId: number,
            volunteerSignUpRoles: VolunteerSignUpRole[],
            showInCalendar: boolean,
            canceled: boolean,
            canceledReason: string
    }) {
        if (fields) {
            this.activityEventId = fields.activityEventId || this.activityEventId;
            this.activityId = fields.activityId || this.activityId;
            this.eventName = fields.eventName || this.eventName;
            this.eventDescription = fields.eventDescription || this.eventDescription;
            this.startDate = fields.startDate || this.startDate;
            this.startTime = fields.startTime || this.startTime;
            this.endDate = fields.endDate || this.endDate;
            this.endTime = fields.endTime || this.endTime;
            this.locationAddressId = fields.locationAddressId || this.locationAddressId;
            this.volunteerSignUpRoles = fields.volunteerSignUpRoles || this.volunteerSignUpRoles;
            this.showInCalendar = fields.showInCalendar || this.showInCalendar;
            this.canceled = fields.canceled || this.canceled;
            this.canceledReason = fields.canceledReason || this.canceledReason;
        }
    }
}