import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatter } from '../utilities/dateTimeFormatter';
@Pipe({
    name: 'toDisplayTime',
    pure: true,
    standalone: false
})
export class ToDisplayTimePipe implements PipeTransform {
  transform(dateTime: string | undefined): string {
    if (!dateTime) {
      return '';
    }

    return DateTimeFormatter.ToDisplayTime(dateTime);
  }
}