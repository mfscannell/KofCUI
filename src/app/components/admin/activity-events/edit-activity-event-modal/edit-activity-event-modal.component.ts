import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { Activity } from 'src/app/models/activity';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { StreetAddress } from 'src/app/models/streetAddress';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { Knight } from 'src/app/models/knight';
import { TimeZone } from 'src/app/models/timeZone';
import { ConfigsService } from 'src/app/services/configs.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { FormsService } from 'src/app/services/forms.service';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';

@Component({
  selector: 'kofc-edit-activity-event-modal',
  templateUrl: './edit-activity-event-modal.component.html',
  styleUrls: ['./edit-activity-event-modal.component.scss']
})
export class EditActivityEventModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() activityEvent?: ActivityEvent;
  @Input() allKnights: Knight[] = [];
  @Input() allActivities: Activity[] = [];
  selectableActivities: Activity[] = [];
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  private updateActivityEventSubscription?: Subscription;
  private createActivityEventSubscription?: Subscription;
  private getCouncilTImeZoneSubscription?: Subscription;
  private getCountryFormOptionsSubscription?: Subscription;
  councilTimeZone: TimeZone = new TimeZone();
  editActivityEventForm: UntypedFormGroup;
  countryFormOptions: CountryFormOption[] = [];
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private activityEventsService: ActivityEventsService,
    private formsService: FormsService,
    private configsService: ConfigsService,
    private permissionsService: PermissionsService) {
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

       this.getCouncilTimeZone();
    }

  ngOnInit() {
    this.selectableActivities = this.permissionsService.filterActivitiesByEventCreation(this.allActivities);
    this.getCountryFormOptions();
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

  public filterAdministrativeDivisionsByCountry(): AdministrativeDivisionFormOption[] {
    let countryCode = this.getCountryCode();

    let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
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

    if (this.activityEvent) {
      this.editActivityEventForm.patchValue({
        activityEventId: this.activityEvent.activityEventId,
        activityId: this.activityEvent.activityId,
        activityCategory: this.activityEvent.activityCategory,
        eventName: this.activityEvent.eventName,
        eventDescription: this.activityEvent.eventDescription,
        startDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.startDateTime),
        startTime: DateTimeFormatter.DateTimeToIso8601Time(this.activityEvent.startDateTime),
        // startTime: {
        //   hour: DateTimeFormatter.getHour(this.activityEvent.startDateTime),
        //   minute: DateTimeFormatter.getMinute(this.activityEvent.startDateTime)
        // },
        endDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.endDateTime),
        endTime: DateTimeFormatter.DateTimeToIso8601Time(this.activityEvent.endDateTime),
        // endTime: {
        //   hour: DateTimeFormatter.getHour(this.activityEvent.endDateTime),
        //   minute: DateTimeFormatter.getMinute(this.activityEvent.endDateTime)
        // },
        locationAddress: this.activityEvent.locationAddress,
        showInCalendar: this.activityEvent.showInCalendar,
        canceled: this.activityEvent.canceled,
        canceledReason: this.activityEvent.canceledReason,
        notes: this.activityEvent.notes
       });

       this.activityEvent.volunteerSignUpRoles?.forEach((role: VolunteerSignUpRole) => {
        const volunteerSignUpRole = new UntypedFormGroup({
          volunteerSignUpRoleId: new UntypedFormControl(role.volunteerSignupRoleId),
          roleTitle: new UntypedFormControl(role.roleTitle),
          startDate: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Date(role.startDateTime)),
          startTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time(role.startDateTime)),
          // startTime: new UntypedFormControl({
          //   hour: DateTimeFormatter.getHour(role.startDateTime),
          //   minute: DateTimeFormatter.getMinute(role.startDateTime)
          // }),
          endDate: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Date(role.endDateTime)),
          endTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time(role.endDateTime)),
          // endTime: new UntypedFormControl({
          //   hour: DateTimeFormatter.getHour(role.endDateTime),
          //   minute: DateTimeFormatter.getMinute(role.endDateTime)
          // }),
          numberOfVolunteersNeeded: new UntypedFormControl(role.numberOfVolunteersNeeded),
          eventVolunteers: new UntypedFormArray(this.initEventVolunteersForm(role.eventVolunteers))
        });

        this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
       });
    }

    this.enableDisableAdministrativeDivisions();
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

  ngOnDestroy() {
    if (this.createActivityEventSubscription) {
      this.createActivityEventSubscription.unsubscribe();
    }

    if (this.updateActivityEventSubscription) {
      this.updateActivityEventSubscription.unsubscribe();
    }

    if (this.getCouncilTImeZoneSubscription) {
      this.getCouncilTImeZoneSubscription.unsubscribe();
    }

    if (this.getCountryFormOptionsSubscription) {
      this.getCountryFormOptionsSubscription.unsubscribe();
    }
  }

  private getCouncilTimeZone() {
    let getCouncilTimeZoneObserver = {
      next: (councilTimeZone: TimeZone) => this.councilTimeZone = councilTimeZone,
      error: (err: any) => this.logError('Error getting council time zone.', err),
      complete: () => console.log('Council time zone loaded.')
    };

    this.getCouncilTImeZoneSubscription = this.configsService.getCouncilTimeZone().subscribe(getCouncilTimeZoneObserver);
  }

  onChangeShowInCalendar(isChecked: boolean) {
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

  onChangeEventStartDate(event: any) {
    console.log("onChangeEventStartDate");
    console.log(event);
    // this.editActivityEventForm.patchValue({
    //   endDate: {
    //     year: event.year,
    //     month: event.month,
    //     day: event.day
    //   }
    // });

    // this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: UntypedFormGroup) {
    //   vsurControl.patchValue({
    //     startDate: {
    //       year: event.year,
    //       month: event.month,
    //       day: event.day
    //     },
    //     endDate: {
    //       year: event.year,
    //       month: event.month,
    //       day: event.day
    //     }
    //   });
    // });
  }

  onChangeEventStartTime(event: any) {
    console.log("onChangeEventStartTime");
    console.log(event);
    // this.editActivityEventForm.patchValue({
    //   endTime: {
    //     hour: event.hour + 1,
    //     minute: event.minute
    //   }
    // });

    // this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: UntypedFormGroup) {
    //   vsurControl.patchValue({
    //     startTime: {
    //       hour: event.hour,
    //       minute: event.minute
    //     },
    //     endTime: {
    //       hour: event.hour + 1,
    //       minute: event.minute,
    //     }
    //   });
    // });
  }

  onChangeEventEndTime(event: any) {
    console.log("onChangeEventEndTime");
    console.log(event);
    //TODO need to limit end time to one hour past start time
    // this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: UntypedFormGroup) {
    //   vsurControl.patchValue({
    //     endTime: {
    //       hour: event.hour,
    //       minute: event.minute,
    //     }
    //   });
    // });
  }

  onChangeVolunteerRoleStartTime(event: any, index: number) {
    console.log("onChangeVolunteerRoleStartTime");
    console.log(event);
    // this.volunteerSignUpRolesForm.at(index).patchValue({
    //   endTime: {
    //     hour: event.hour,
    //     minute: event.minute
    //   }
    // });
  }

  onChangeVolunteerRoleEndTime(event: any, index: number) {
    console.log("onChangeVolunteerRoleEndTime");
    console.log(event);
    let something = 5;

    //TODO need to limit end time to be after start time.
  }

  getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  get volunteerSignUpRolesForm() {
    return this.editActivityEventForm.controls["volunteerSignUpRoles"] as UntypedFormArray;
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

  addVolunteerSignUpRole() {
    const volunteerSignUpRole = new UntypedFormGroup({
      volunteerSignUpRoleId: new UntypedFormControl(''),
      roleTitle: new UntypedFormControl(''),
      startDate: new UntypedFormControl(this.getEventStartDate()),
      startTime: new UntypedFormControl(this.getEventStartTime()),
      // startTime: new UntypedFormControl({
      //   "hour": this.getEventStartTime().hour,
      //   "minute": this.getEventStartTime().minute
      // }),
      endDate: new UntypedFormControl(this.getEventEndDate()),
      endTime: new UntypedFormControl(this.getEventEndTime()),
      // endTime: new UntypedFormControl({
      //   "hour": this.getEventEndTime().hour,
      //   "minute": this.getEventEndTime().minute
      // }),
      numberOfVolunteersNeeded: new UntypedFormControl(''),
      eventVolunteers: new UntypedFormArray([])
    });

    this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
  }

  deleteVolunteerSignUpRole(roleIndex: number) {
    this.volunteerSignUpRolesForm.removeAt(roleIndex);
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

  deleteEventVolunteer(roleIndex: number, volunteerIndex: number) {
    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(roleIndex) as UntypedFormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
    eventVolunteerFormArray.removeAt(volunteerIndex);
  }

  onSubmitEditActivityEvent() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updateActivityEventRequest = this.mapFormToActivityEvent();
      
      this.updateActivityEvent(updateActivityEventRequest);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let createActivityEventRequest = this.mapFormToActivityEvent();

      this.createActivityEvent(createActivityEventRequest);
    }
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

  private createActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (createdActivityEvent: ActivityEvent) => this.passBack(createdActivityEvent),
      error: (err: any) => this.logError('Error creating Activity Event', err),
      complete: () => console.log('Activity Event created.')
    };

    this.createActivityEventSubscription = this.activityEventsService.createActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private updateActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (activityEvent: ActivityEvent) => this.passBack(activityEvent),
      error: (err: any) => this.logError('Error updating Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateActivityEventSubscription = this.activityEventsService.updateActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private passBack(activityEvent: ActivityEvent) {
    this.activeModal.close(activityEvent);
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
