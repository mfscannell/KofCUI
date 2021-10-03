import { ActivityEvent } from 'src/app/models/activityEvent';

export class CreateActivityEventRequest {
    activityEvent: ActivityEvent = new ActivityEvent();

    public constructor(
        fields?: {
            activityEvent: ActivityEvent
    }) {
        if (fields) {
            this.activityEvent = fields.activityEvent || this.activityEvent;
        }
    }
}