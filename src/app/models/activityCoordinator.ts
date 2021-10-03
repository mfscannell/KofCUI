export class ActivityCoordinator {
    activityCoordinatorId: number = 0;
    knightId: number = 0;

    public constructor(
        fields?: {
            activityCoordinatorId? : number,
            knightId?: number
    }) {
        if (fields) {
            this.activityCoordinatorId = fields.activityCoordinatorId || this.activityCoordinatorId;
            this.knightId = fields.knightId || this.knightId;
        }
    }
}