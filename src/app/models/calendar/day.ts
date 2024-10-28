import { UpcomingEvent } from '../upcomingEvent';

export class Day {
  // TODO MFS change to interface
  dayOfMonth: number = 0;
  events: UpcomingEvent[] = [];

  public constructor(fields?: { dayOfMonth?: number; events?: UpcomingEvent[] }) {
    if (fields) {
      this.dayOfMonth = fields.dayOfMonth || this.dayOfMonth;
      this.events = fields.events || this.events;
    }
  }
}
