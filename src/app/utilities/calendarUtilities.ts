import { Day } from 'src/app/models/calendar/day';
import { Month } from 'src/app/models/calendar/month';
import { Week } from 'src/app/models/calendar/week';
import { DateTimeFormatter } from './dateTimeFormatter';

export class CalendarUtilities {
    private static months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //year:  number 2021 for 2021
    //month:  number 1 for January
    static getCalendar(year: number, month: number) {
        let numDaysInMonth = DateTimeFormatter.getDaysInMonth(year, month);
        let weeks: Week[] = [new Week()];

        for (let dayOfMonth = 1; dayOfMonth <= numDaysInMonth; dayOfMonth++) {

            if (dayOfMonth === 1) {
                let dayOfWeek = DateTimeFormatter.getDayOfWeek(year, month, dayOfMonth);

                if (dayOfWeek > 0) { // if first day is not Sunday
                    //push blank days in front of first day of month
                    for (let i = 0; i < dayOfWeek; i++) {
                        weeks[weeks.length - 1].days.push(new Day());
                    }
                }
            }

            weeks[weeks.length - 1].days.push(new Day({
                dayOfMonth: dayOfMonth
            }));

            if (weeks[weeks.length - 1].isCompleteWeek() && dayOfMonth < numDaysInMonth) {
                weeks.push(new Week());
            }

            if (dayOfMonth === numDaysInMonth && !weeks[weeks.length - 1].isCompleteWeek()) {
                for (let i = weeks[weeks.length - 1].days.length; i < 7; i++) {
                    weeks[weeks.length - 1].days.push(new Day());
                }
            }
        }

        return new Month({
            monthOfYear: month,
            year: year,
            weeks: weeks
        });
    }

    /// month1BasedIndex: 1 for January
    static getNameOfMonth(month1BasedIndex: number) {
        return CalendarUtilities.months[month1BasedIndex - 1];
    }
}