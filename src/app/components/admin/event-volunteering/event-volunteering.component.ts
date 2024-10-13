import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { VolunteerForActivityEventRequest } from 'src/app/models/requests/volunteerForActivityEventRequest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';

@Component({
  selector: 'kofc-event-volunteering',
  templateUrl: './event-volunteering.component.html',
  styleUrls: ['./event-volunteering.component.scss']
})
export class EventVolunteeringComponent implements OnInit, OnDestroy {
  private activityEventsSubscription?: Subscription;
  private getAllKnightsSubscription?: Subscription;
  private getAllActivitiesSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  allActivities: Activity[] = [];
  allKnights: Knight[] = [];
  fromDate: string | undefined;
  toDate: string | undefined;
  hoveredDate: NgbDate | null = null;
  page = 1;
  pageSize = 5;
  maxSize = 10;
  activityEvent: ActivityEvent | undefined;
  volunteerForActivityEventForm: UntypedFormGroup;
  private updateVolunteerForActivityEventSubscription?: Subscription;
  private knightId: number | undefined;
  @ViewChild('cancelEditActiveModal', {static: false}) cancelEditActiveModal: ElementRef | undefined;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private accountsService: AccountsService,
    private activityEventsService: ActivityEventsService,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private permissionsService: PermissionsService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {
      var initialDate = new Date();
      initialDate.setMonth(initialDate.getMonth() - 3);
      var finalDate = new Date(initialDate);
      finalDate.setMonth(finalDate.getMonth() + 6);
      this.fromDate = DateTimeFormatter.ToIso8601Date(initialDate.getFullYear(), initialDate.getMonth() + 1, initialDate.getDate());
      this.toDate = DateTimeFormatter.ToIso8601Date(finalDate.getFullYear(), finalDate.getMonth() + 1, finalDate.getDate());

      var today = new Date();
      this.volunteerForActivityEventForm = new UntypedFormGroup({
        activityEventId: new UntypedFormControl(''),
        activityId: new UntypedFormControl(''),
        activityCategory: new UntypedFormControl(''),
        eventName: new UntypedFormControl(''),
        eventDescription: new UntypedFormControl(''),
        startDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        startTime: new UntypedFormControl({
          "hour": 6,
          "minute": 0
        }),
        endDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        endTime: new UntypedFormControl({
          "hour": 7,
          "minute": 0
        }),
        locationAddress: new UntypedFormGroup({
          streetAddressId: new UntypedFormControl(''),
          addressName: new UntypedFormControl(''),
          address1: new UntypedFormControl(''),
          address2: new UntypedFormControl(''),
          city: new UntypedFormControl(''),
          stateCode: new UntypedFormControl(''),
          postalCode: new UntypedFormControl(''),
          countryCode: new UntypedFormControl('')
        }),
        showInCalendar: new UntypedFormControl(null),
        canceled: new UntypedFormControl({value: null, disabled: true}),
        canceledReason: new UntypedFormControl(''),
        volunteerSignUpRoles: new UntypedFormArray([])
      });

      this.knightId = this.accountsService.getKnightId();
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllActiveKnightsNames();
    this.getAllActivities();
  }

  private initializeForm() {
    var today = new Date();
    this.volunteerForActivityEventForm = new UntypedFormGroup({
      activityEventId: new UntypedFormControl(''),
      activityId: new UntypedFormControl(''),
      activityCategory: new UntypedFormControl(''),
      eventName: new UntypedFormControl(''),
      eventDescription: new UntypedFormControl(''),
      startDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      startTime: new UntypedFormControl({
        "hour": 6,
        "minute": 0
      }),
      endDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      endTime: new UntypedFormControl({
        "hour": 7,
        "minute": 0
      }),
      locationAddress: new UntypedFormGroup({
        streetAddressId: new UntypedFormControl(''),
        addressName: new UntypedFormControl(''),
        address1: new UntypedFormControl(''),
        address2: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        stateCode: new UntypedFormControl(''),
        postalCode: new UntypedFormControl(''),
        countryCode: new UntypedFormControl('')
      }),
      showInCalendar: new UntypedFormControl(null),
      canceled: new UntypedFormControl({value: null, disabled: true}),
      canceledReason: new UntypedFormControl(''),
      volunteerSignUpRoles: new UntypedFormArray([])
     });
  }

  ngOnDestroy() {
    if (this.activityEventsSubscription) {
      this.activityEventsSubscription.unsubscribe();
    }

    if (this.getAllKnightsSubscription) {
      this.getAllKnightsSubscription.unsubscribe();
    }

    if (this.getAllActivitiesSubscription) {
      this.getAllActivitiesSubscription.unsubscribe();
    }

    if (this.updateVolunteerForActivityEventSubscription) {
      this.updateVolunteerForActivityEventSubscription.unsubscribe();
    }
  }

  formatDate(date: string | undefined) {
    return DateTimeFormatter.ToDisplayedDate(date);
  }

  canAddEvent() {
    return this.permissionsService.canAddEvent(this.allActivities);
  }

  canEditEvent(activityId: number) {
    return this.permissionsService.canEditEvent(activityId);
  }

  getAllActivityEvents() {
    console.log(this.fromDate);
    console.log(this.toDate);

    let activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => this.activityEvents = activityEvents,
      error: (err: any) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.')
    };

    if (this.fromDate && this.toDate) {
      this.activityEventsSubscription = this.activityEventsService.getAllActivityEvents(this.fromDate, this.toDate).subscribe(activityEventsObserver);
    }
  }

  private getAllActivities() {
    let activitiesObserver = {
      next: (getAllActivitiesResponse: Activity[]) => this.allActivities = getAllActivitiesResponse.sort((a, b)=> a.activityName.localeCompare(b.activityName)),
      error: (err: any) => this.logError('Error getting all activities', err),
      complete: () => console.log('All activities loaded.')
    };
    this.getAllActivitiesSubscription = this.activitiesService.getAllActivities().subscribe(activitiesObserver);
  }

  private getAllActiveKnightsNames() {
    let knightsObserver = {
      next: (getAllKnightsResponse: Knight[]) => this.allKnights = getAllKnightsResponse,
      error: (err: any) => this.logError('Error getting all knights.', err),
      complete: () => console.log('All knights loaded.')
    };

    this.getAllKnightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  openVolunteerForActivityEventModal(activityEvent: ActivityEvent) {
    this.initializeForm();
    this.activityEvent = activityEvent;

    this.volunteerForActivityEventForm.patchValue({
      activityEventId: this.activityEvent.activityEventId,
      activityId: this.activityEvent.activityId,
      activityCategory: this.activityEvent.activityCategory,
      eventName: this.activityEvent.eventName,
      eventDescription: this.activityEvent.eventDescription,
      startDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.startDateTime),
      startTime: {
        hour: DateTimeFormatter.getHour(this.activityEvent.startDateTime),
        minute: DateTimeFormatter.getMinute(this.activityEvent.startDateTime)
      },
      endDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.endDateTime),
      endTime: {
        hour: DateTimeFormatter.getHour(this.activityEvent.endDateTime),
        minute: DateTimeFormatter.getMinute(this.activityEvent.endDateTime)
      },
      locationAddress: this.activityEvent.locationAddress,
      showInCalendar: this.activityEvent.showInCalendar,
      canceled: this.activityEvent.canceled,
      canceledReason: this.activityEvent.canceledReason
     });

     this.activityEvent.volunteerSignUpRoles?.forEach((role: VolunteerSignUpRole) => {
      const volunteerSignUpRole = new UntypedFormGroup({
        volunteerSignUpRoleId: new UntypedFormControl(role.volunteerSignupRoleId),
        roleTitle: new UntypedFormControl(role.roleTitle),
        startDate: new UntypedFormControl({
          year: DateTimeFormatter.getYear(role.startDateTime),
          month: DateTimeFormatter.getMonth(role.startDateTime),
          day: DateTimeFormatter.getDay(role.startDateTime)
        }),
        startTime: new UntypedFormControl({
          hour: DateTimeFormatter.getHour(role.startDateTime),
          minute: DateTimeFormatter.getMinute(role.startDateTime)
        }),
        endDate: new UntypedFormControl({
          year: DateTimeFormatter.getYear(role.endDateTime),
          month: DateTimeFormatter.getMonth(role.endDateTime),
          day: DateTimeFormatter.getDay(role.endDateTime)
        }),
        endTime: new UntypedFormControl({
          hour: DateTimeFormatter.getHour(role.endDateTime),
          minute: DateTimeFormatter.getMinute(role.endDateTime)
        }),
        numberOfVolunteersNeeded: new UntypedFormControl(role.numberOfVolunteersNeeded),
        volunteerForRole: new UntypedFormControl({
          value: role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) >= 0,
          disabled: role.eventVolunteers.length >= role.numberOfVolunteersNeeded && role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) < 0
        }),
        eventVolunteers: new UntypedFormArray(this.initEventVolunteersForm(role.eventVolunteers))
      });
  
      this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
     });
  }

  private initEventVolunteersForm(eventVolunteers: EventVolunteer[] | undefined) {
    let eventVolunteersArray: UntypedFormGroup[] = [];

    if (eventVolunteers) {
      eventVolunteers.forEach((eventVolunteer) => {
        const eventVolunteerFormGroup = new UntypedFormGroup({
          eventVolunteerId: new UntypedFormControl(eventVolunteer.eventVolunteerId),
          knightId: new UntypedFormControl(eventVolunteer.knightId)
        });

        eventVolunteersArray.push(eventVolunteerFormGroup);
      });
    }

    return eventVolunteersArray;
  }

  formatEventStartDate() {
    return DateTimeFormatter.ToDisplayedDate(this.activityEvent?.startDateTime);
  }

  formatEventStartTime() {
    return DateTimeFormatter.ToDisplayTime(this.activityEvent?.startDateTime);
  }

  formatEventEndTime() {
    return DateTimeFormatter.ToDisplayTime(this.activityEvent?.endDateTime);
  }

  formatVolunteerRole(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      let role = this.activityEvent.volunteerSignUpRoles[index];
      let volunteerRole = `${role.numberOfVolunteersNeeded} ${role.roleTitle}(s)`;

      return volunteerRole;
    }

    return '';
  }

  formatVolunteerRoleStartTime(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      let role = this.activityEvent.volunteerSignUpRoles[index];
      let formattedTime = DateTimeFormatter.ToDisplayTime(role.startDateTime);

      return formattedTime;
    }

    return '';
  }

  formatVolunteerRoleEndTime(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      let role = this.activityEvent.volunteerSignUpRoles[index];
      let formattedTime = DateTimeFormatter.ToDisplayTime(role.endDateTime);

      return formattedTime;
    }

    return '';
  }

  getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  changeVolunteerForRole($event: any, volunteerSignUpRoleIndex: number) {
    if ($event.target.checked) {
      console.log(`Check box checked:${this.knightId}`);
      const eventVolunteerFormGroup = new UntypedFormGroup({
        eventVolunteerId: new UntypedFormControl(''),
        knightId: new UntypedFormControl(this.knightId)
      });

      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      console.log(eventVolunteerFormArray);
      eventVolunteerFormArray.push(eventVolunteerFormGroup);
    } else {
      console.log("Check box unchecked");
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      let volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        eventVolunteerFormArray.removeAt(volunteerIndex);
      }
    }
  }

  get volunteerSignUpRolesForm() {
    return this.volunteerForActivityEventForm.controls["volunteerSignUpRoles"] as UntypedFormArray;
  }

  onSubmitVolunteerForActivityEvent() {
    if (!this.knightId) {
      return;
    }
    
    let activityEventId = this.activityEvent?.activityEventId || 0;
    let volunteerSignUpRoles: number[] = [];

    for (let i = 0; i < this.volunteerSignUpRolesForm.length; i++) {
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(i) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      let volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        let volunteerSignUpRoleId = volunteerSignUpRoleControl.value.volunteerSignUpRoleId as number;
        volunteerSignUpRoles.push(volunteerSignUpRoleId);
      }
    }

    let request: VolunteerForActivityEventRequest = {
      activityEventId: activityEventId,
      knightId: this.knightId,
      volunteerSignUpRoles: volunteerSignUpRoles
    };

    let activityEvent = this.mapFormToActivityEvent();

    let activityEventObserver = {
      next: (eventVolunteers: EventVolunteer[]) => this.passBack(activityEvent, eventVolunteers),
      error: (err: any) => this.logError('Error volunteering for Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateVolunteerForActivityEventSubscription = this.activityEventsService.volunteerForActivityEvent(request).subscribe(activityEventObserver);
  }

  private mapFormToActivityEvent() {
    let rawForm = this.volunteerForActivityEventForm.getRawValue();
      let volunteerRoles: VolunteerSignUpRole[] = rawForm?.volunteerSignUpRoles?.map(function(role: any) {
        let volunteerSignUpRole: VolunteerSignUpRole = {
          volunteerSignupRoleId: role.volunteerSignUpRoleId,
          roleTitle: role.roleTitle,
          startDateTime: DateTimeFormatter.DateToIso8601DateTime(role.startDate, role.startTime.hour, role.startTime.minute),
          endDateTime: DateTimeFormatter.DateToIso8601DateTime(role.endDate, role.endTime.hour, role.endTime.minute),
          numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
          eventVolunteers: role.eventVolunteers.map(function(ev: any) {
            let eventVolunteer: EventVolunteer = {
              eventVolunteerId: ev.eventVolunteerId,
              knightId: ev.knightId
            };
            return eventVolunteer;
          })
        };

        return volunteerSignUpRole;
      });
      let locationAddress: StreetAddress = {
        streetAddressId: rawForm.locationAddress.streetAddressId,
        addressName: rawForm.locationAddress.addressName,
        address1: rawForm.locationAddress.address1,
        address2: rawForm.locationAddress.address2,
        city: rawForm.locationAddress.city,
        stateCode: rawForm.locationAddress.stateCode,
        postalCode: rawForm.locationAddress.postalCode,
        countryCode: rawForm.locationAddress.countryCode
      };
      let activityEvent: ActivityEvent = {
        activityEventId: rawForm.activityEventId,
        activityId: rawForm.activityId,
        activityCategory: rawForm.activityCategory,
        eventName: rawForm.eventName,
        eventDescription: rawForm.eventDescription,
        startDateTime: DateTimeFormatter.ToIso8601DateTime(rawForm.startDate.year, rawForm.startDate.month, rawForm.startDate.day, rawForm.startTime.hour, rawForm.startTime.minute) || '1999-01-01T00:00',
        endDateTime: DateTimeFormatter.ToIso8601DateTime(rawForm.endDate.year, rawForm.endDate.month, rawForm.endDate.day, rawForm.endTime.hour, rawForm.endTime.minute) || '1999-01-01T00:00',
        locationAddress: locationAddress,
        volunteerSignUpRoles: volunteerRoles,
        showInCalendar: rawForm.showInCalendar,
        canceled: rawForm.canceled,
        canceledReason: rawForm.canceledReason
      };

      return activityEvent;
  }

  private passBack(activityEvent: ActivityEvent, eventVolunteers: EventVolunteer[]) {
    if (activityEvent.volunteerSignUpRoles) {
      activityEvent.volunteerSignUpRoles.forEach((role) => {
        if (eventVolunteers.findIndex(ev => ev.volunteerSignUpRoleId === role.volunteerSignupRoleId) >= 0) {
          role.eventVolunteers.forEach((volunteer) => {
            if (volunteer.knightId === this.knightId) {
              let eventVolunteerId = eventVolunteers.filter(ev => ev.volunteerSignUpRoleId === role.volunteerSignupRoleId)[0].eventVolunteerId;
              volunteer.eventVolunteerId = eventVolunteerId;
            }
          });
        }
      });
    }

    this.cancelEditActiveModal?.nativeElement.click();
    this.updateActivityEventInList(activityEvent);
  }

  private updateActivityEventInList(activityEvent: ActivityEvent) {
    let index = this.activityEvents?.findIndex(x => x.activityEventId === activityEvent.activityEventId)

    if (this.activityEvents && index !== undefined && index >= 0) {
      this.activityEvents[index] = activityEvent;
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorSaving = true;
  }
}
