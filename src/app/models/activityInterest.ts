export class ActivityInterest {
    knightActivityInterestId: number = 0;
    activityId: number = 0;
    activityName: string = '';
    activityCategoryId: number = 0;
    interested: boolean = true;

    public constructor(
        fields?: {
            knightActivityInterestId?: number,
            activityId? : number,
            activityName?: string,
            activityCategoryId?: number,
            interested?: boolean,
    }) {
        if (fields) {
            this.knightActivityInterestId = fields.knightActivityInterestId || this.knightActivityInterestId;
            this.activityId = fields.activityId || this.activityId;
            this.activityName = fields.activityName || this.activityName;
            this.activityCategoryId = fields.activityCategoryId || this.activityCategoryId;
            this.interested = fields.interested || this.interested;
        }
    }
}