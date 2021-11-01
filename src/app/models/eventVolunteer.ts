export class EventVolunteer {
    eventVolunteerId: number = 0;
    knightId: number = 0;

    public constructor(
        fields?: {
            eventVolunteerId? : number,
            knightId?: number
    }) {
        if (fields) {
            this.eventVolunteerId = fields.eventVolunteerId || this.eventVolunteerId;
            this.knightId = fields.knightId || this.knightId;
        }
    }
}