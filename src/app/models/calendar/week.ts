import { Day } from 'src/app/models/calendar/day';

export class Week {
    days: Day[] = [];

    constructor(fields?: {
        days?: Day[]
    }) {
        if (fields) {
            this.days = fields.days || this.days;
        }
    }

    isCompleteWeek() {
        return this.days.length === 7;
    }
}