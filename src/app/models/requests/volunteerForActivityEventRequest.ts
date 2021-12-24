import { ActivityEvent } from 'src/app/models/activityEvent';

export class VolunteerForActivityEventRequest {
    activityEventId: number = 0;
    knightId: number = 0;
    volunteerSignUpRoles: number[] = [];

    public constructor(
        fields?: {
            activityEventId: number,
            knightId: number,
            volunteerSignUpRoles: number[]
    }) {
        if (fields) {
            this.activityEventId = fields.activityEventId || this.activityEventId;
            this.knightId = fields.knightId || this.knightId;
            this.volunteerSignUpRoles = fields.volunteerSignUpRoles || this.volunteerSignUpRoles;
        }
    }
}