import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { TimeZoneFormOption } from 'src/app/models/inputOptions/timeZoneFormOption';
import { Knight } from 'src/app/models/knight';
import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-activity-event-modal',
  templateUrl: './edit-activity-event-modal.component.html',
  styleUrls: ['./edit-activity-event-modal.component.scss']
})
export class EditActivityEventModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() editModalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() activityEventToEdit?: ActivityEvent;
  @Input() modalHeaderText: string = '';
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Input() councilTimeZone?: TimeZoneFormOption;
  @Input() activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  @Input() selectableActivities: Activity[] = [];
  @Input() allKnights: Knight[] = [];
  @Output() createActivityEventChanges = new EventEmitter<ActivityEvent>();
  @Output() updateActivityEventChanges = new EventEmitter<ActivityEvent>();
  @ViewChild('closeModal', {static: false}) closeModal: ElementRef | undefined;
  
  public editActivityEventForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private createActivityEventSubscription?: Subscription;
  private updateActivityEventSubscription?: Subscription;

  constructor(private activityEventsService: ActivityEventsService) {
    this.editActivityEventForm = this.initForm();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editActivityEventForm = this.initForm();

    if (this.editModalAction == ModalActionEnums.Edit && this.activityEventToEdit) {
      this.patchForm();
    }
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

  public onChangeActivity(event: any) {
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

  public deleteVolunteerSignUpRole(roleIndex: number) {
    this.volunteerSignUpRolesForm.removeAt(roleIndex);
  }

  public getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  public deleteEventVolunteer(roleIndex: number, volunteerIndex: number) {
    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(roleIndex) as UntypedFormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
    eventVolunteerFormArray.removeAt(volunteerIndex);
  }

  public addEventVolunteer(volunteerSignUpRoleIndex: number) {
    const eventVolunteerFormGroup = new UntypedFormGroup({
      id: new UntypedFormControl(''),
      knightId: new UntypedFormControl('')
    })

    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
    eventVolunteerFormArray.push(eventVolunteerFormGroup);
  }

  public addVolunteerSignUpRole() {
    const volunteerSignUpRole = new UntypedFormGroup({
      id: new UntypedFormControl(''),
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

  public onSubmitEditActivityEvent() {
    if (this.editModalAction === ModalActionEnums.Edit) {
      let updateActivityEventRequest = this.mapFormToActivityEvent();
      
      this.updateActivityEvent(updateActivityEventRequest);
    } else if (this.editModalAction === ModalActionEnums.Create) {
      let createActivityEventRequest = this.mapFormToActivityEvent();

      this.createActivityEvent(createActivityEventRequest);
    }
  }

  private mapFormToActivityEvent(): ActivityEvent {
    let rawForm = this.editActivityEventForm.getRawValue();
    let volunteerRoles: VolunteerSignUpRole[] = rawForm?.volunteerSignUpRoles?.map(function(role: any) {
      let volunteerSignUpRole: VolunteerSignUpRole = {
        id: role.id || '00000000-0000-0000-0000-000000000000',
        roleTitle: role.roleTitle,
        startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.startDate, role.startTime),
        endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.startDate, role.endTime),
        numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
        eventVolunteers: role.eventVolunteers.map(function(ev: any) {
          let eventVolunteer: EventVolunteer = {
            id: ev.id || '00000000-0000-0000-0000-000000000000',
            knightId: ev.knightId
          } as EventVolunteer;
          return eventVolunteer;
        })
      } as VolunteerSignUpRole;

      return volunteerSignUpRole;
    });
    let locationAddress: StreetAddress = {
      id: rawForm.locationAddress.id || '00000000-0000-0000-0000-000000000000',
      addressName: rawForm.locationAddress.addressName,
      address1: rawForm.locationAddress.address1,
      address2: rawForm.locationAddress.address2,
      city: rawForm.locationAddress.city,
      stateCode: rawForm.locationAddress.stateCode,
      postalCode: rawForm.locationAddress.postalCode,
      countryCode: rawForm.locationAddress.countryCode
    } as StreetAddress;
    let activityEvent: ActivityEvent = {
      id: rawForm.id || '',
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
      next: (createdActivityEvent: ActivityEvent) => this.passBackCreatedActivityEvent(createdActivityEvent),
      error: (err: any) => this.logError('Error creating Activity Event', err),
      complete: () => console.log('Activity Event created.')
    };

    this.createActivityEventSubscription = this.activityEventsService.createActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private updateActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (activityEvent: ActivityEvent) => this.passBackUpdatedActivityEvent(activityEvent),
      error: (err: any) => this.logError('Error updating Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateActivityEventSubscription = this.activityEventsService.updateActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private passBackCreatedActivityEvent(createdActivityEvent: ActivityEvent) {
    this.createActivityEventChanges.emit(createdActivityEvent);
    this.createActivityEventSubscription?.unsubscribe();
    this.closeModal?.nativeElement.click();
  }

  private passBackUpdatedActivityEvent(updatedActivityEvent: ActivityEvent) {
    this.updateActivityEventChanges.emit(updatedActivityEvent);
    this.updateActivityEventSubscription?.unsubscribe();
    this.closeModal?.nativeElement.click();
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

  private getCountryCode(): string {
    return this.editActivityEventForm.get('locationAddress.countryCode')?.value;
  }

  private initForm() {
    return new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      activityId: new UntypedFormControl(''),
      activityCategory: new UntypedFormControl(''),
      eventName: new UntypedFormControl(''),
      eventDescription: new UntypedFormControl(''),
      startDate: new UntypedFormControl(''),
      startTime: new UntypedFormControl(''),
      endDate: new UntypedFormControl(''),
      endTime: new UntypedFormControl(''),
      locationAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
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

  private patchForm() {
    if (this.activityEventToEdit) {
      this.editActivityEventForm.patchValue({
        id: this.activityEventToEdit.id,
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
          id: new UntypedFormControl(role.id),
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
  }

  private initEventVolunteersForm(eventVolunteers: EventVolunteer[] | undefined) {
    let eventVolunteersArray: UntypedFormGroup[] = [];

    if (eventVolunteers) {
      eventVolunteers.forEach((eventVolunteer) => {
        const eventVolunteerFormGroup = new UntypedFormGroup({
          id: new UntypedFormControl(eventVolunteer.id),
          knightId: new UntypedFormControl(eventVolunteer.knightId)
        });

        eventVolunteersArray.push(eventVolunteerFormGroup);
      });
    }

    return eventVolunteersArray;
  }

  get volunteerSignUpRolesForm() {
    return this.editActivityEventForm.controls["volunteerSignUpRoles"] as UntypedFormArray;
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
