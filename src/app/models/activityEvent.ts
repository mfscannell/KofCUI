import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { ActivityCategoryEnums } from '../enums/activityCategoryEnums';
import { EventVolunteer } from './eventVolunteer';

export class ActivityEvent {
    activityEventId: number = 0;
    activityId: number = 0;
    activityCategory: ActivityCategoryEnums = ActivityCategoryEnums.Miscellaneous;
    eventName: string = '';
    eventDescription: string = '';
    startDateTime?: string;
    endDateTime?: string;
    locationAddress?: StreetAddress;
    volunteerSignUpRoles?: VolunteerSignUpRole[] = [];
    showInCalendar: boolean = false;
    canceled: boolean = false;
    canceledReason?: string;
    notes?: string;
    public constructor(
        fields?: {
            activityEventId? : number,
            activityId?: number,
            activityCategory: ActivityCategoryEnums,
            eventName: string,
            eventDescription: string,
            startDateTime: string,
            endDateTime: string,
            locationAddress: StreetAddress,
            volunteerSignUpRoles: VolunteerSignUpRole[],
            showInCalendar: boolean,
            canceled: boolean,
            canceledReason: string,
            notes?: string
    }) {
        if (fields) {
            this.activityEventId = fields.activityEventId || this.activityEventId;
            this.activityId = fields.activityId || this.activityId;
            this.activityCategory = fields.activityCategory || this.activityCategory;
            this.eventName = fields.eventName || this.eventName;
            this.eventDescription = fields.eventDescription || this.eventDescription;
            this.startDateTime = fields.startDateTime || this.startDateTime;
            this.endDateTime = fields.endDateTime || this.endDateTime;
            this.locationAddress = fields.locationAddress || this.locationAddress;
            this.volunteerSignUpRoles = fields.volunteerSignUpRoles || this.volunteerSignUpRoles;
            this.showInCalendar = fields.showInCalendar || this.showInCalendar;
            this.canceled = fields.canceled || this.canceled;
            this.canceledReason = fields.canceledReason || this.canceledReason;
            this.notes = fields.notes || this.notes;
        }
    }
}