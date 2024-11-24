import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatter } from '../utilities/dateTimeFormatter';
@Pipe({
  name: 'isEndDateAfterStartDate',
  pure: true
})
export class IsEndDateAfterStartDatePipe implements PipeTransform {
  transform(startDate: string, endDate: string, startTime?: string, endTime?: string): boolean {
    if (!startDate || !endDate) {
      return false;
    }

    if (!startTime) {
      startTime = '';
    }

    if (!endTime) {
      endTime = '';
    }

    const isoStartDateTime = DateTimeFormatter.DateAndTimeToIso8601DateTime(startDate, startTime);
    const isoEndDateTime = DateTimeFormatter.DateAndTimeToIso8601DateTime(endDate, endTime);

    const startDateTime = new Date(isoStartDateTime);
    const endDateTime = new Date(isoEndDateTime);

    return endDateTime > startDateTime;
  }
}