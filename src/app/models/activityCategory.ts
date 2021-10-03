export class ActivityCategory {
    activityCategoryId: number = 0;
    categoryName: string = '';

    public constructor(
        fields?: {
            activityCategoryId? : number,
            categoryName?: string
    }) {
        if (fields) {
            this.activityCategoryId = fields.activityCategoryId || this.activityCategoryId;
            this.categoryName = fields.categoryName || this.categoryName;
        }
    }
}