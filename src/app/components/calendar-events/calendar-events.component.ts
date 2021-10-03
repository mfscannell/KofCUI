import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address';
import { Month } from 'src/app/models/calendar/month';
import { UpcomingEvent } from 'src/app/models/upcomingEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { CalendarUtilities } from 'src/app/utilities/calendarUtilities';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'kofc-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.css']
})
export class CalendarEventsComponent implements OnInit {
  getAllUpcomingEventsSubscription?: Subscription;
  upcomingEvents: UpcomingEvent[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  currentMonthName: string = CalendarUtilities.getNameOfMonth(this.currentMonth);
  calendarMonth: Month = new Month();

  constructor(private activityEventsService: ActivityEventsService) {

  }

  ngOnInit() {
    // this.upcomingEvents = [
    //   new UpcomingEvent({
    //     eventName: "Pancake Breakfast",
    //     eventDescription: "Join us for pancakes, eggs, and biscuits and gravy!  Proceeds go to 8th grade school trip.",
    //     startDate: "2021-9-11",
    //     startTime: "7:00 AM",
    //     endDate: "2021-9-11",
    //     endTime: "11:00 AM",
    //     locationAddress: new Address({
    //       addressId: 1,
    //       addressName: "School Cafeteria",
    //       address1: "123 Main St.",
    //       address2: "",
    //       addressCity: "Lenexa",
    //       addressStateCode: "KS",
    //       addressPostalCode: "66123",
    //       addressCountryCode: "US"
    //     }),
    //     canceled: false,
    //     canceledReason: "Not Canceled"
    //   }),
    //   new UpcomingEvent({
    //     eventName: "Food Drive",
    //     eventDescription: "This is a monthly canned food drive for Catholic Charities.  Desired items are canned corn and green beans.",
    //     startDate: "2021-10-18",
    //     startTime: "7:00 AM",
    //     endDate: "2021-10-18",
    //     endTime: "11:00 AM",
    //     locationAddress: new Address({
    //       addressId: 1,
    //       addressName: "Main Church",
    //       address1: "123 Main St.",
    //       address2: "",
    //       addressCity: "Lenexa",
    //       addressStateCode: "KS",
    //       addressPostalCode: "66123",
    //       addressCountryCode: "US"
    //     }),
    //     canceled: false,
    //     canceledReason: "Not Canceled"
    //   }),
    //   new UpcomingEvent({
    //     eventName: "Chili Competition",
    //     eventDescription: "Proceeds go to Saint James Academy tuition fund",
    //     startDate: "2021-9-22",
    //     startTime: "5:00 PM",
    //     endDate: "2021-9-22",
    //     endTime: "9:00 PM",
    //     locationAddress: new Address({
    //       addressId: 1,
    //       addressName: "Fr. Quigley Center",
    //       address1: "123 Main St.",
    //       address2: "",
    //       addressCity: "Lenexa",
    //       addressStateCode: "KS",
    //       addressPostalCode: "66123",
    //       addressCountryCode: "US"
    //     }),
    //     canceled: true,
    //     canceledReason: "Not enough participants"
    //   })
    // ];

    this.calendarMonth = CalendarUtilities.getCalendar(this.currentYear, this.currentMonth);
    this.calendarMonth.addEventsToMonth(this.upcomingEvents);
    let something = 5;

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
    let endDate = DateTimeFormatter.ToIso8601Date(endDateDate.getFullYear(), endDateDate.getMonth(), 1);

    this.getAllUpcomingEventsSubscription = this.activityEventsService.getAllUpcomingEvents(beginDate, endDate).subscribe(activityEventsObserver);
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

  openActivitiesModal(dayOfMonth: number) {
    console.log(dayOfMonth);
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
