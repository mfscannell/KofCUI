import { UpcomingEvent } from '../upcomingEvent';

export interface Day {
  dayOfMonth: number;
  events: UpcomingEvent[];
}
