import { ActivityCoordinator } from 'src/app/models/activityCoordinator';

export class Activity {
    activityId?: number;
    activityName: string = "";
    activityDescription: string = "";
    activityCategoryId: number = 0;
    activityCoordinators: ActivityCoordinator[] = [];

    public constructor(
        fields?: {
            activityId? : number,
            activityName?: string,
            activityDescription?: string,
            activityCategoryId?: number,
            activityCoordinators: ActivityCoordinator[]
    }) {
        if (fields) {
            this.activityId = fields.activityId || this.activityId;
            this.activityName = fields.activityName || this.activityName;
            this.activityDescription = fields.activityDescription || this.activityDescription;
            this.activityCategoryId = fields.activityCategoryId || this.activityCategoryId;
            this.activityCoordinators = fields.activityCoordinators || this.activityCoordinators;
        }
    }
}