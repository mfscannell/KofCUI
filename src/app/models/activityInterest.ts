import { ActivityCategoryEnums } from "../enums/activityCategoryEnums";

export class ActivityInterest {
    knightActivityInterestId: number = 0;
    activityId: number = 0;
    activityName: string = '';
    activityCategory: ActivityCategoryEnums = ActivityCategoryEnums.Miscellaneous;
    interested: boolean = true;

    public constructor(
        fields?: {
            knightActivityInterestId?: number,
            activityId? : number,
            activityName?: string,
            activityCategory?: ActivityCategoryEnums,
            interested?: boolean,
    }) {
        if (fields) {
            this.knightActivityInterestId = fields.knightActivityInterestId || this.knightActivityInterestId;
            this.activityId = fields.activityId || this.activityId;
            this.activityName = fields.activityName || this.activityName;
            this.activityCategory = fields.activityCategory || this.activityCategory;
            this.interested = fields.interested || this.interested;
        }
    }
}