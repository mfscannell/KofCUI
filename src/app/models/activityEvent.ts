import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';

export interface ActivityEvent {
    activityEventId: number;
    activityId: number;
    activityCategory: string;
    eventName: string;
    eventDescription: string;
    startDateTime?: string;
    endDateTime?: string;
    locationAddress?: StreetAddress;
    volunteerSignUpRoles?: VolunteerSignUpRole[];
    showInCalendar: boolean;
    canceled: boolean;
    canceledReason: string;
    notes?: string;
}