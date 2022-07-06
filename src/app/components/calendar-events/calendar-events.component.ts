import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StreetAddress } from 'src/app/models/streetAddress';
import { Month } from 'src/app/models/calendar/month';
import { UpcomingEvent } from 'src/app/models/upcomingEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { CalendarUtilities } from 'src/app/utilities/calendarUtilities';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { ViewUpcomingEventModalComponent } from './view-upcoming-event-modal/view-upcoming-event-modal.component';

@Component({
  selector: 'kofc-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.scss']
})
export class CalendarEventsComponent implements OnInit {
  getAllUpcomingEventsSubscription?: Subscription;
  upcomingEvents: UpcomingEvent[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  currentMonthName: string = CalendarUtilities.getNameOfMonth(this.currentMonth);
  calendarMonth: Month = new Month();

  constructor(
    private activityEventsService: ActivityEventsService,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.calendarMonth = CalendarUtilities.getCalendar(this.currentYear, this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);

    this.getAllUpcomingEvents();
  }

  ngOnDestroy() {
    if (this.getAllUpcomingEventsSubscription) {
      this.getAllUpcomingEventsSubscription.unsubscribe();
    }
  }

  private getAllUpcomingEvents() {
    let activityEventsObserver = {
      next: (upcomingEvents: UpcomingEvent[]) => this.setEventsForCalendar(upcomingEvents),
      error: (err: any) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.')
    };
    
    let beginDateDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    let endDateDate = new Date(beginDateDate.getTime());
    endDateDate.setMonth(beginDateDate.getMonth() + 6);
    let beginDate = DateTimeFormatter.ToIso8601Date(this.currentYear, this.currentMonth, 1);
    let endDate = DateTimeFormatter.ToIso8601Date(endDateDate.getFullYear(), endDateDate.getMonth() + 1, 1);

    if (beginDate && endDate) {
      this.getAllUpcomingEventsSubscription = this.activityEventsService.getAllUpcomingEvents(beginDate, endDate).subscribe(activityEventsObserver);
    }
  }

  private setEventsForCalendar(upcomingEvents: UpcomingEvent[]) {
    this.upcomingEvents = upcomingEvents
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  navigateToNextMonth() {
    this.currentMonth++;

    if (this.currentMonth > 12) {
      this.currentYear++;
      this.currentMonth = 1;
    }

    this.calendarMonth = CalendarUtilities.getCalendar(this.currentYear, this.currentMonth);
    this.currentMonthName = CalendarUtilities.getNameOfMonth(this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  navigateToPreviousMonth() {
    this.currentMonth--;

    if (this.currentMonth < 1) {
      this.currentYear--;
      this.currentMonth = 12;
    }

    this.calendarMonth = CalendarUtilities.getCalendar(this.currentYear, this.currentMonth);
    this.currentMonthName = CalendarUtilities.getNameOfMonth(this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
  }

  viewUpcomingEvents(dayOfMonth: number) {
    let selectedDate = DateTimeFormatter.ToIso8601Date(this.currentYear, this.currentMonth, dayOfMonth);
    let eventsForDate = this.upcomingEvents.filter(upcomingEvent => DateTimeFormatter.sameDate(upcomingEvent.startDateTime, selectedDate));

    const modalRef = this.modalService.open(ViewUpcomingEventModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.upcomingEvents = eventsForDate;
    let date = new Date(this.currentYear, this.currentMonth - 1, dayOfMonth);
    let dateString = date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    modalRef.componentInstance.modalHeaderText = `Events for ${dateString}`;
    modalRef.result.then((result) => {
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from View Upcoming Events Modal');
        console.log(error);
      }
    });
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
