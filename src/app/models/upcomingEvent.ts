import { StreetAddress } from 'src/app/models/streetAddress';

export class UpcomingEvent {
    activityEventId: number = 0;
    activityId: number = 0;
    eventName: string = '';
    eventDescription: string = '';
    startDateTime?: string;
    endDateTime?: string;
    locationAddress?: StreetAddress;
    canceled: boolean = false;
    canceledReason?: string;

    public constructor(
        fields?: {
            activityEventId? : number,
            activityId?: number,
            eventName: string,
            eventDescription: string,
            startDateTime: string,
            endDateTime: string,
            locationAddress: StreetAddress
            canceled: boolean,
            canceledReason: string
    }) {
        if (fields) {
            this.activityEventId = fields.activityEventId || this.activityEventId;
            this.activityId = fields.activityId || this.activityId;
            this.eventName = fields.eventName || this.eventName;
            this.eventDescription = fields.eventDescription || this.eventDescription;
            this.startDateTime = fields.startDateTime || this.startDateTime;
            this.endDateTime = fields.endDateTime || this.endDateTime;
            this.locationAddress = fields.locationAddress || this.locationAddress;
            this.canceled = fields.canceled || this.canceled;
            this.canceledReason = fields.canceledReason || this.canceledReason;
        }
    }
}