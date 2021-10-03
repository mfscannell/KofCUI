import { Week } from 'src/app/models/calendar/week';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { UpcomingEvent } from '../upcomingEvent';

export class Month {
    weeks: Week[] = [];
    monthOfYear: number = 0;
    year: number = 0;

    constructor(fields?: {
        monthOfYear?: number,
        year?: number,
        weeks?: Week[]
    }) {
        if (fields) {
            this.monthOfYear = fields.monthOfYear || this.monthOfYear;
            this.year = fields.year || this.year;
            this.weeks = fields.weeks || this.weeks;
        }
    }

    addEventsToMonth(upcomingEvents: UpcomingEvent[]) {
        let eventsInMonth = upcomingEvents.filter(event => DateTimeFormatter.getMonth(event.startDate) === this.monthOfYear && DateTimeFormatter.getYear(event.startDate) === this.year);

        eventsInMonth.forEach((event) => {
            this.weeks.forEach((week) => {
                week.days.forEach((day) => {
                    if (DateTimeFormatter.getDay(event.startDate) === day.dayOfMonth) {
                        day.events.push(event);
                    }
                });
            });
        });
    }
}