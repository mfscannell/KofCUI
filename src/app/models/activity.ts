import { ActivityCoordinator } from 'src/app/models/activityCoordinator';
import { ActivityCategoryEnums } from '../enums/activityCategoryEnums';
import { ActivityEventNotes } from './activityEventNotes';

export class Activity {
    activityId?: number;
    activityName: string = "";
    activityDescription: string = "";
    activityCategory: ActivityCategoryEnums = ActivityCategoryEnums.Miscellaneous;
    activityCoordinators: ActivityCoordinator[] = [];
    activityEventNotes: ActivityEventNotes[] = [];
    notes: string = '';

    public constructor(
        fields?: {
            activityId? : number,
            activityName?: string,
            activityDescription?: string,
            activityCategory?: ActivityCategoryEnums,
            activityCoordinators: ActivityCoordinator[],
            activityEventNotes: ActivityEventNotes[],
            notes?: string
    }) {
        if (fields) {
            this.activityId = fields.activityId || this.activityId;
            this.activityName = fields.activityName || this.activityName;
            this.activityDescription = fields.activityDescription || this.activityDescription;
            this.activityCategory = fields.activityCategory || this.activityCategory;
            this.activityCoordinators = fields.activityCoordinators || this.activityCoordinators;
            this.activityEventNotes = fields.activityEventNotes || this.activityEventNotes;
            this.notes = fields.notes || this.notes;
        }
    }
}