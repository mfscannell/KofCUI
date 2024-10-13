import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SendEmailResponse } from 'src/app/models/responses/sendEmailResponse';
import { SendEmailRequest } from 'src/app/models/requests/sendEmailRequest';
import { TimeZone } from 'src/app/models/timeZone';
import { ConfigsService } from 'src/app/services/configs.service';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { StreetAddress } from 'src/app/models/streetAddress';

@Component({
  selector: 'kofc-activity-events',
  templateUrl: './activity-events.component.html',
  styleUrls: ['./activity-events.component.scss']
})
export class ActivityEventsComponent implements OnInit, OnDestroy {
  activityEventsSubscription?: Subscription;
  getAllKnightsSubscription?: Subscription;
  getAllActivitiesSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  selectableActivities: Activity[] = [];
  allActivities: Activity[] = [];
  activityEventToEdit?: ActivityEvent;
  allKnights: Knight[] = [];
  fromDate: string | undefined;
  toDate: string | undefined;
  page = 1;
  pageSize = 5;
  maxSize = 10;
  public councilTimeZone: TimeZone | undefined;
  editActivityEventForm: UntypedFormGroup;

  errorSending: boolean = false;
  errorMessages: string[] = [];
  public sendEmailForm: UntypedFormGroup;
  public activityEventToEmailAbout: ActivityEvent | undefined;
  private activitiesSubscription?: Subscription;
  @ViewChild('closeSendEmailModal', {static: false}) closeSendEmailModal: ElementRef | undefined;

  private updateActivityEventSubscription?: Subscription;
  private createActivityEventSubscription?: Subscription;
  private getCouncilTimeZoneSubscription?: Subscription;
  private getCountryFormOptionsSubscription?: Subscription;
  countryFormOptions: CountryFormOption[] = [];
  editModalHeaderText: string = '';
  editModalAction: ModalActionEnums = ModalActionEnums.Create;
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;

  constructor(
    private activityEventsService: ActivityEventsService,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private permissionsService: PermissionsService,
    private configsService: ConfigsService,
    private formsService: FormsService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {
      var initialDate = new Date();
      initialDate.setMonth(initialDate.getMonth() - 3);
      var finalDate = new Date(initialDate);
      finalDate.setMonth(finalDate.getMonth() + 6);
      this.fromDate = DateTimeFormatter.ToIso8601Date(initialDate.getFullYear(), initialDate.getMonth() + 1, initialDate.getDate());
      this.toDate = DateTimeFormatter.ToIso8601Date(finalDate.getFullYear(), finalDate.getMonth() + 1, finalDate.getDate());
      console.log("Exiting constructor");
      console.log(this.fromDate);
      console.log(this.toDate);
      this.sendEmailForm = new UntypedFormGroup({
        subject: new UntypedFormControl(''),
        body: new UntypedFormControl('')
      });

      var today = new Date();
      this.editActivityEventForm = new UntypedFormGroup({
        activityEventId: new UntypedFormControl(''),
        activityId: new UntypedFormControl(''),
        activityCategory: new UntypedFormControl(''),
        eventName: new UntypedFormControl(''),
        eventDescription: new UntypedFormControl(''),
        startDate: new UntypedFormControl(''),
        startTime: new UntypedFormControl(''),
        // startTime: new UntypedFormControl({
        //   "hour": 6,
        //   "minute": 0
        // }),
        endDate: new UntypedFormControl(''),
        endTime: new UntypedFormControl(''),
        // endTime: new UntypedFormControl({
        //   "hour": 7,
        //   "minute": 0
        // }),
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
        canceled: new UntypedFormControl(null),
        canceledReason: new UntypedFormControl(''),
        notes: new UntypedFormControl(''),
        volunteerSignUpRoles: new UntypedFormArray([])
       });
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllActiveKnightsNames();
    this.getAllActivities();
    this.getCouncilTimeZone();
    this.getCountryFormOptions();
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

    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }

    if (this.updateActivityEventSubscription) {
      this.updateActivityEventSubscription.unsubscribe();
    }

    if (this.createActivityEventSubscription) {
      this.createActivityEventSubscription.unsubscribe();
    }

    if (this.getCouncilTimeZoneSubscription) {
      this.getCouncilTimeZoneSubscription.unsubscribe();
    }

    if (this.getCountryFormOptionsSubscription) {
      this.getCountryFormOptionsSubscription.unsubscribe();
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
    console.log("getAllActivityEvents");
    console.log(this.fromDate);
    console.log(this.toDate);

    let activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => this.handleGetActivityEvents(activityEvents),
      error: (err: any) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.')
    };

    if (this.fromDate && this.toDate) {
      this.activityEventsSubscription = this.activityEventsService.getAllActivityEvents(this.fromDate, this.toDate).subscribe(activityEventsObserver);
    }
  }

  private handleGetActivityEvents(activityEvents: ActivityEvent[]) {
    this.activityEvents = activityEvents;
    this.selectableActivities = this.permissionsService.filterActivitiesByEventCreation(this.allActivities);
  }

  private getAllActivities() {
    let activitiesObserver = {
      next: (getAllActivitiesResponse: Activity[]) => this.allActivities = getAllActivitiesResponse.sort((a, b)=> a.activityName.localeCompare(b.activityName)),
      error: (err: any) => this.logError('Error getting all activities', err),
      complete: () => console.log('All activities loaded.')
    };
    this.getAllActivitiesSubscription = this.activitiesService.getAllActivities().subscribe(activitiesObserver);
  }

  private getCouncilTimeZone() {
    let getCouncilTimeZoneObserver = {
      next: (councilTimeZone: TimeZone) => this.councilTimeZone = councilTimeZone,
      error: (err: any) => this.logError('Error getting council time zone.', err),
      complete: () => console.log('Council time zone loaded.')
    };

    this.getCouncilTimeZoneSubscription = this.configsService.getCouncilTimeZone().subscribe(getCouncilTimeZoneObserver);
  }

  private getCountryFormOptions() {
    let getCountryFormOptionsObserver = {
      next: (response: CountryFormOption[]) => this.handleGetCountryFormOptions(response),
      error: (err: any) => this.logError("Error getting Country Form Options", err),
      complete: () => console.log('Country Form Options retrieved.')
    }

    this.getCountryFormOptionsSubscription = this.formsService.getCountryFormOptions().subscribe(getCountryFormOptionsObserver);
  }

  private handleGetCountryFormOptions(response: CountryFormOption[]) {
    this.countryFormOptions = response;
  }

  private initEditEventForm() {
    var today = new Date();
      this.editActivityEventForm = new UntypedFormGroup({
        activityEventId: new UntypedFormControl(''),
        activityId: new UntypedFormControl(''),
        activityCategory: new UntypedFormControl(''),
        eventName: new UntypedFormControl(''),
        eventDescription: new UntypedFormControl(''),
        startDate: new UntypedFormControl(''),
        startTime: new UntypedFormControl(''),
        endDate: new UntypedFormControl(''),
        endTime: new UntypedFormControl(''),
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
        canceled: new UntypedFormControl(null),
        canceledReason: new UntypedFormControl(''),
        notes: new UntypedFormControl(''),
        volunteerSignUpRoles: new UntypedFormArray([])
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

  public enableDisableAdministrativeDivisions(): void {
    let countryCode = this.getCountryCode();
    let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

    if (hasCountryCode) {
      this.editActivityEventForm.get('locationAddress.stateCode')?.enable();
    } else {
      this.editActivityEventForm.get('locationAddress.stateCode')?.disable();
    }
  }

  private getCountryCode(): string {
    return this.editActivityEventForm.get('locationAddress.countryCode')?.value;
  }

  get volunteerSignUpRolesForm() {
    return this.editActivityEventForm.controls["volunteerSignUpRoles"] as UntypedFormArray;
  }

  private getAllActiveKnightsNames() {
    let knightsObserver = {
      next: (getAllKnightsResponse: Knight[]) => this.allKnights = getAllKnightsResponse,
      error: (err: any) => this.logError('Error getting all knights.', err),
      complete: () => console.log('All knights loaded.')
    };

    this.getAllKnightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  openEditActivityEventModal(activityEvent: ActivityEvent) {
    this.errorSending = false;
    this.errorMessages = [];
    this.activityEventToEdit = activityEvent;
    this.editModalAction = ModalActionEnums.Edit;
    this.editModalHeaderText = 'Editing Activity Event';
    this.initEditEventForm();

    this.editActivityEventForm.patchValue({
      activityEventId: this.activityEventToEdit.activityEventId,
      activityId: this.activityEventToEdit.activityId,
      activityCategory: this.activityEventToEdit.activityCategory,
      eventName: this.activityEventToEdit.eventName,
      eventDescription: this.activityEventToEdit.eventDescription,
      startDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEventToEdit.startDateTime),
      startTime: DateTimeFormatter.DateTimeToIso8601Time(this.activityEventToEdit.startDateTime),
      endDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEventToEdit.endDateTime),
      endTime: DateTimeFormatter.DateTimeToIso8601Time(this.activityEventToEdit.endDateTime),
      locationAddress: this.activityEventToEdit.locationAddress,
      showInCalendar: this.activityEventToEdit.showInCalendar,
      canceled: this.activityEventToEdit.canceled,
      canceledReason: this.activityEventToEdit.canceledReason,
      notes: this.activityEventToEdit.notes
     });

     this.activityEventToEdit.volunteerSignUpRoles?.forEach((role: VolunteerSignUpRole) => {
      const volunteerSignUpRole = new UntypedFormGroup({
        volunteerSignUpRoleId: new UntypedFormControl(role.volunteerSignupRoleId),
        roleTitle: new UntypedFormControl(role.roleTitle),
        startDate: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Date(role.startDateTime)),
        startTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time(role.startDateTime)),
        endDate: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Date(role.endDateTime)),
        endTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time(role.endDateTime)),
        numberOfVolunteersNeeded: new UntypedFormControl(role.numberOfVolunteersNeeded),
        eventVolunteers: new UntypedFormArray(this.initEventVolunteersForm(role.eventVolunteers))
      });

      this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
     });

     this.enableDisableAdministrativeDivisions();
  }

  onChangeActivity(event: any) {
    console.log(event);
    let eventNameIndex = this.selectableActivities.findIndex(x => x.activityId == event.target.value);

    if (eventNameIndex >= 0) {
      let eventName = this.selectableActivities[eventNameIndex].activityName;
      this.editActivityEventForm.controls["eventName"].setValue(eventName);

      let activityCategory = this.selectableActivities[eventNameIndex].activityCategory;
      this.editActivityEventForm.controls["activityCategory"].setValue(activityCategory);
    }
  }

  public filterAdministrativeDivisionsByCountry(): AdministrativeDivisionFormOption[] {
    let countryCode = this.getCountryCode();

    let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  deleteVolunteerSignUpRole(roleIndex: number) {
    this.volunteerSignUpRolesForm.removeAt(roleIndex);
  }

  getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  deleteEventVolunteer(roleIndex: number, volunteerIndex: number) {
    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(roleIndex) as UntypedFormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
    eventVolunteerFormArray.removeAt(volunteerIndex);
  }

  addEventVolunteer(volunteerSignUpRoleIndex: number) {
    const eventVolunteerFormGroup = new UntypedFormGroup({
      eventVolunteerId: new UntypedFormControl(''),
      knightId: new UntypedFormControl('')
    })

    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
    eventVolunteerFormArray.push(eventVolunteerFormGroup);
  }

  addVolunteerSignUpRole() {
    const volunteerSignUpRole = new UntypedFormGroup({
      volunteerSignUpRoleId: new UntypedFormControl(''),
      roleTitle: new UntypedFormControl(''),
      startDate: new UntypedFormControl(this.getEventStartDate()),
      startTime: new UntypedFormControl(this.getEventStartTime()),
      endDate: new UntypedFormControl(this.getEventEndDate()),
      endTime: new UntypedFormControl(this.getEventEndTime()),
      numberOfVolunteersNeeded: new UntypedFormControl(''),
      eventVolunteers: new UntypedFormArray([])
    });

    this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
  }

  private getEventStartDate() {
    let formControl = this.editActivityEventForm.controls["startDate"] as UntypedFormControl;

    return formControl.value;
  }

  private getEventStartTime() {
    let formControl = this.editActivityEventForm.controls["startTime"] as UntypedFormControl;

    return formControl.value;
  }

  private getEventEndDate() {
    let formControl = this.editActivityEventForm.controls["endDate"] as UntypedFormControl;

    return formControl.value;
  }

  private getEventEndTime() {
    let formControl = this.editActivityEventForm.controls["endTime"] as UntypedFormControl;

    return formControl.value;
  }

  onSubmitEditActivityEvent() {
    if (this.editModalAction === ModalActionEnums.Edit) {
      let updateActivityEventRequest = this.mapFormToActivityEvent();
      
      this.updateActivityEvent(updateActivityEventRequest);
    } else if (this.editModalAction === ModalActionEnums.Create) {
      let createActivityEventRequest = this.mapFormToActivityEvent();

      this.createActivityEvent(createActivityEventRequest);
    }
  }

  private createActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (createdActivityEvent: ActivityEvent) => this.activityEvents?.push(createdActivityEvent),
      error: (err: any) => this.logError('Error creating Activity Event', err),
      complete: () => console.log('Activity Event created.')
    };

    this.createActivityEventSubscription = this.activityEventsService.createActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private updateActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (activityEvent: ActivityEvent) => this.updateActivityEventInList(activityEvent),
      error: (err: any) => this.logError('Error updating Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateActivityEventSubscription = this.activityEventsService.updateActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private mapFormToActivityEvent(): ActivityEvent {
    let rawForm = this.editActivityEventForm.getRawValue();
    let volunteerRoles: VolunteerSignUpRole[] = rawForm?.volunteerSignUpRoles?.map(function(role: any) {
      let volunteerSignUpRole: VolunteerSignUpRole = {
        volunteerSignupRoleId: role.volunteerSignUpRoleId | 0,
        roleTitle: role.roleTitle,
        startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.startDate, role.startTime),
        endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.startDate, role.endTime),
        numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
        eventVolunteers: role.eventVolunteers.map(function(ev: any) {
          let eventVolunteer: EventVolunteer = {
            eventVolunteerId: ev.eventVolunteerId | 0,
            knightId: ev.knightId
          } as EventVolunteer;
          return eventVolunteer;
        })
      } as VolunteerSignUpRole;

      return volunteerSignUpRole;
    });
    let locationAddress: StreetAddress = {
      streetAddressId: rawForm.locationAddress.streetAddressId | 0,
      addressName: rawForm.locationAddress.addressName,
      address1: rawForm.locationAddress.address1,
      address2: rawForm.locationAddress.address2,
      city: rawForm.locationAddress.city,
      stateCode: rawForm.locationAddress.stateCode,
      postalCode: rawForm.locationAddress.postalCode,
      countryCode: rawForm.locationAddress.countryCode
    } as StreetAddress;
    let activityEvent: ActivityEvent = {
      activityEventId: rawForm.activityEventId | 0,
      activityId: rawForm.activityId,
      activityCategory: rawForm.activityCategory,
      eventName: rawForm.eventName,
      eventDescription: rawForm.eventDescription,
      startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(rawForm.startDate, rawForm.startTime) || '1999-01-01T00:00',
      endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(rawForm.startDate, rawForm.endTime) || '1999-01-01T00:00',
      locationAddress: locationAddress,
      volunteerSignUpRoles: volunteerRoles,
      showInCalendar: rawForm.showInCalendar? rawForm.showInCalendar : false,
      canceled: rawForm.canceled? rawForm.canceled : false,
      canceledReason: rawForm.canceledReason,
      notes: rawForm.notes
    } as ActivityEvent;

    console.log("mapFormToActivityEvent");
    console.log(activityEvent);

    return activityEvent;
  }

  openSendEmailModal(activityEvent: ActivityEvent) {
    this.sendEmailForm = new UntypedFormGroup({
      subject: new UntypedFormControl(''),
      body: new UntypedFormControl('')
    });
    this.errorSending = false;
    this.errorMessages = [];
    this.activityEventToEmailAbout = activityEvent;
  }

  onSubmitSendEmail() {
    let sendEmailObserver = {
      next: (sendEmailResponse: SendEmailResponse) => this.showSendEmailResponse(sendEmailResponse),
      error: (err: any) => this.logError('Error sending email', err),
      complete: () => console.log('Email sent.')
    };

    let sendEmailRequest = this.mapEmailFormToRequest();

    this.activitiesSubscription = this.activitiesService.sendEmailAboutActivity(sendEmailRequest).subscribe(sendEmailObserver);
  }

  private mapEmailFormToRequest() {
    let rawForm = this.sendEmailForm.getRawValue();

    let request: SendEmailRequest = {
      activityId: this.activityEventToEmailAbout?.activityId || 0,
      subject: rawForm.subject,
      body: rawForm.body
    };

    return request;
  }

  private showSendEmailResponse(sendEmailResponse: SendEmailResponse) {
    this.closeSendEmailModal?.nativeElement.click();
  }

  private updateActivityEventInList(activityEvent: ActivityEvent) {
    let index = this.activityEvents?.findIndex(x => x.activityEventId === activityEvent.activityEventId)

    if (this.activityEvents && index !== undefined && index >= 0) {
      this.activityEvents[index] = activityEvent;
    }
  }

  openCreateActivityEventModal() {
    this.errorSending = false;
    this.errorMessages = [];
    this.activityEventToEdit = undefined;
    this.editModalAction = ModalActionEnums.Create;
    this.editModalHeaderText = 'Adding Activity Event';
    this.initEditEventForm();
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
    
    this.errorSending = true;
  }
}
