import { Week } from 'src/app/models/calendar/week';

export interface Month {
  weeks: Week[];
  monthOfYear: number;
  year: number;
}
