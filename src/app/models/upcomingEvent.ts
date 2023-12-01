import { StreetAddress } from 'src/app/models/streetAddress';

export interface UpcomingEvent {
    activityEventId: number;
    activityId: number;
    eventName: string;
    eventDescription: string;
    startDateTime?: string;
    endDateTime?: string;
    locationAddress?: StreetAddress;
    canceled: boolean;
    canceledReason?: string;
}