import { Day } from 'src/app/models/calendar/day';
import { Month } from 'src/app/models/calendar/month';
import { Week } from 'src/app/models/calendar/week';
import { DateTimeFormatter } from './dateTimeFormatter';

export class CalendarUtilities {
  private static months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  //year:  number 2021 for 2021
  //month:  number 1 for January
  static getCalendar(year: number, month: number): Month {
    const numDaysInMonth = DateTimeFormatter.getDaysInMonth(year, month);
    const weeks: Week[] = [{days: []} as Week];

    for (let dayOfMonth = 1; dayOfMonth <= numDaysInMonth; dayOfMonth++) {
      if (dayOfMonth === 1) {
        const dayOfWeek = DateTimeFormatter.getDayOfWeek(year, month, dayOfMonth);

        if (dayOfWeek > 0) {
          // if first day is not Sunday
          //push blank days in front of first day of month
          for (let i = 0; i < dayOfWeek; i++) {
            weeks[weeks.length - 1].days.push({dayOfMonth: 0, events: []} as Day);
          }
        }
      }

      weeks[weeks.length - 1].days.push(
        {
          dayOfMonth: dayOfMonth,
          events: []
        } as Day,
      );

      if (weeks[weeks.length - 1].days.length === 7 && dayOfMonth < numDaysInMonth) {
        weeks.push({days: []} as Week);
      }

      if (dayOfMonth === numDaysInMonth && weeks[weeks.length - 1].days.length != 7) {
        for (let i = weeks[weeks.length - 1].days.length; i < 7; i++) {
          weeks[weeks.length - 1].days.push({dayOfMonth: 0, events: []} as Day);
        }
      }
    }

    const monthObj: Month = {
      monthOfYear: month,
      year: year,
      weeks: weeks
    };

    return monthObj;
  }

  /// month1BasedIndex: 1 for January
  static getNameOfMonth(month1BasedIndex: number) {
    return CalendarUtilities.months[month1BasedIndex - 1];
  }
}
