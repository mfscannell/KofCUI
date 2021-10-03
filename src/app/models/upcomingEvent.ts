import { Address } from 'src/app/models/address';

export class UpcomingEvent {
    activityEventId: number = 0;
    activityId: number = 0;
    eventName: string = '';
    eventDescription: string = '';
    startDate?: string; //yyyy-mm-dd
    startTime?: string;
    endDate?: string;
    endTime?: string;
    locationAddress?: Address;
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
            locationAddress: Address
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
            this.locationAddress = fields.locationAddress || this.locationAddress;
            this.canceled = fields.canceled || this.canceled;
            this.canceledReason = fields.canceledReason || this.canceledReason;
        }
    }
}