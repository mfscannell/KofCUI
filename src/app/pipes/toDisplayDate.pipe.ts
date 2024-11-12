import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatter } from '../utilities/dateTimeFormatter';
@Pipe({
  name: 'toDisplayDate',
  pure: true
})
export class ToDisplayDatePipe implements PipeTransform {
  transform(dateTime: string | undefined): string {
    if (!dateTime) {
      return '';
    }

    return DateTimeFormatter.ToDisplayDate(dateTime);
  }
}