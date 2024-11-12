import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';

@Component({
  selector: 'kofc-event-volunteering',
  templateUrl: './event-volunteering.component.html',
  styleUrls: ['./event-volunteering.component.scss'],
})
export class EventVolunteeringComponent implements OnInit, OnDestroy {
  private activityEventsSubscription?: Subscription;
  private getAllKnightsSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  allKnights: Knight[] = [];
  fromDate: string;
  toDate: string;
  hoveredDate: NgbDate | null = null;
  page = 1;
  pageSize = 5;
  maxSize = 10;
  activityEvent: ActivityEvent | undefined;
  volunteerForActivityEventForm: UntypedFormGroup;
  public knightId: string = '';
  @ViewChild('cancelEditActiveModal', { static: false }) cancelEditActiveModal: ElementRef | undefined;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private accountsService: AccountsService,
    private activityEventsService: ActivityEventsService,
    private knightsService: KnightsService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) {
    const initialDate = new Date();
    initialDate.setMonth(initialDate.getMonth() - 3);
    const finalDate = new Date(initialDate);
    finalDate.setMonth(finalDate.getMonth() + 6);
    this.fromDate =
      DateTimeFormatter.ToIso8601Date(initialDate.getFullYear(), initialDate.getMonth() + 1, initialDate.getDate()) ||
      '';
    this.toDate =
      DateTimeFormatter.ToIso8601Date(finalDate.getFullYear(), finalDate.getMonth() + 1, finalDate.getDate()) || '';

    const today = new Date();
    this.volunteerForActivityEventForm = new UntypedFormGroup({
      activityEventId: new UntypedFormControl(''),
      activityId: new UntypedFormControl(''),
      activityCategory: new UntypedFormControl(''),
      eventName: new UntypedFormControl(''),
      eventDescription: new UntypedFormControl(''),
      startDate: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      ),
      startTime: new UntypedFormControl({
        hour: 6,
        minute: 0,
      }),
      endDate: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      ),
      endTime: new UntypedFormControl({
        hour: 7,
        minute: 0,
      }),
      locationAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        addressName: new UntypedFormControl(''),
        address1: new UntypedFormControl(''),
        address2: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        stateCode: new UntypedFormControl(''),
        postalCode: new UntypedFormControl(''),
        countryCode: new UntypedFormControl(''),
      }),
      showInCalendar: new UntypedFormControl(null),
      canceled: new UntypedFormControl({ value: null, disabled: true }),
      canceledReason: new UntypedFormControl(''),
      volunteerSignUpRoles: new UntypedFormArray([]),
    });

    this.knightId = this.accountsService.getKnightId() || '';
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllActiveKnightsNames();
  }

  ngOnDestroy() {
    if (this.activityEventsSubscription) {
      this.activityEventsSubscription.unsubscribe();
    }

    if (this.getAllKnightsSubscription) {
      this.getAllKnightsSubscription.unsubscribe();
    }
  }

  getAllActivityEvents() {
    console.log(this.fromDate);
    console.log(this.toDate);

    const activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => (this.activityEvents = activityEvents),
      error: (err: ApiResponseError) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.'),
    };

    if (this.fromDate && this.toDate) {
      this.activityEventsSubscription = this.activityEventsService
        .getAllActivityEvents(this.fromDate, this.toDate)
        .subscribe(activityEventsObserver);
    }
  }

  private getAllActiveKnightsNames() {
    const knightsObserver = {
      next: (getAllKnightsResponse: Knight[]) => (this.allKnights = getAllKnightsResponse),
      error: (err: ApiResponseError) => this.logError('Error getting all knights.', err),
      complete: () => console.log('All knights loaded.'),
    };

    this.getAllKnightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  openVolunteerForActivityEventModal(activityEvent: ActivityEvent) {
    this.activityEvent = activityEvent;
  }

  public updateActivityEventInList(activityEvent: ActivityEvent) {
    const index = this.activityEvents?.findIndex((x) => x.id === activityEvent.id);

    if (this.activityEvents && index !== undefined && index >= 0) {
      this.activityEvents[index] = activityEvent;
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorSaving = true;
  }
}
