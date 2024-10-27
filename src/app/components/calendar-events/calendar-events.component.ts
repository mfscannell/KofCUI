import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Month } from 'src/app/models/calendar/month';
import { UpcomingEvent } from 'src/app/models/upcomingEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { CalendarUtilities } from 'src/app/utilities/calendarUtilities';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'kofc-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.scss'],
})
export class CalendarEventsComponent implements OnInit {
  getAllUpcomingEventsSubscription?: Subscription;
  upcomingEvents: UpcomingEvent[] = [];
  upcomingEventsOnDate: UpcomingEvent[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  currentMonthName: string = CalendarUtilities.getNameOfMonth(
    this.currentMonth,
  );
  calendarMonth: Month = new Month();
  modalHeaderText: string | undefined;

  constructor(private activityEventsService: ActivityEventsService) {}

  ngOnInit() {
    this.calendarMonth = CalendarUtilities.getCalendar(
      this.currentYear,
      this.currentMonth,
    );
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);

    this.getAllUpcomingEvents();
  }

  ngOnDestroy() {
    if (this.getAllUpcomingEventsSubscription) {
      this.getAllUpcomingEventsSubscription.unsubscribe();
    }
  }

  private getAllUpcomingEvents() {
    const activityEventsObserver = {
      next: (upcomingEvents: UpcomingEvent[]) =>
        this.setEventsForCalendar(upcomingEvents),
      error: (err: unknown) =>
        this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.'),
    };

    const beginDateDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    const endDateDate = new Date(beginDateDate.getTime());
    endDateDate.setMonth(beginDateDate.getMonth() + 6);
    const beginDate = DateTimeFormatter.ToIso8601Date(
      this.currentYear,
      this.currentMonth,
      1,
    );
    const endDate = DateTimeFormatter.ToIso8601Date(
      endDateDate.getFullYear(),
      endDateDate.getMonth() + 1,
      1,
    );

    if (beginDate && endDate) {
      this.getAllUpcomingEventsSubscription = this.activityEventsService
        .getAllUpcomingEvents(beginDate, endDate)
        .subscribe(activityEventsObserver);
    }
  }

  private setEventsForCalendar(upcomingEvents: UpcomingEvent[]) {
    this.upcomingEvents = upcomingEvents;
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  navigateToNextMonth() {
    this.currentMonth++;

    if (this.currentMonth > 12) {
      this.currentYear++;
      this.currentMonth = 1;
    }

    this.calendarMonth = CalendarUtilities.getCalendar(
      this.currentYear,
      this.currentMonth,
    );
    this.currentMonthName = CalendarUtilities.getNameOfMonth(this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  navigateToPreviousMonth() {
    this.currentMonth--;

    if (this.currentMonth < 1) {
      this.currentYear--;
      this.currentMonth = 12;
    }

    this.calendarMonth = CalendarUtilities.getCalendar(
      this.currentYear,
      this.currentMonth,
    );
    this.currentMonthName = CalendarUtilities.getNameOfMonth(this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  viewUpcomingEvents(dayOfMonth: number) {
    const selectedDate = DateTimeFormatter.ToIso8601Date(
      this.currentYear,
      this.currentMonth,
      dayOfMonth,
    );
    const eventsForDate = this.upcomingEvents.filter((upcomingEvent) =>
      DateTimeFormatter.sameDate(upcomingEvent.startDateTime, selectedDate),
    );
    this.upcomingEventsOnDate = eventsForDate;

    const date = new Date(this.currentYear, this.currentMonth - 1, dayOfMonth);
    const dateString = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.modalHeaderText = `Events for ${dateString}`;
  }

  formatTime(dateTime: string | undefined) {
    return DateTimeFormatter.ToDisplayTime(dateTime);
  }

  logError(message: string, err: unknown) {
    console.error(message);
    console.error(err);
  }
}
