export class EventVolunteer {
    eventVolunteerId: number = 0;
    volunteerSignUpRoleId?: number;
    knightId: number = 0;

    public constructor(
        fields?: {
            eventVolunteerId? : number,
            volunteerSignUpRoleId?: number,
            knightId?: number
    }) {
        if (fields) {
            this.eventVolunteerId = fields.eventVolunteerId || this.eventVolunteerId;
            this.volunteerSignUpRoleId = fields.volunteerSignUpRoleId || this.volunteerSignUpRoleId;
            this.knightId = fields.knightId || this.knightId;
        }
    }
}