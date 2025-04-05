import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditActivityEventFormGroup } from 'src/app/forms/editActivityEventFormGroup';
import { EditAddressFormGroup } from 'src/app/forms/editAddressFormGroup';
import { EditEventVolunteersFormGroup } from 'src/app/forms/editEventVolunteersFormGroup';
import { EditVolunteerSignUpRoleFormGroup } from 'src/app/forms/editVolunteerSignUpRoleFormGroup';
import { Activity } from 'src/app/models/activity';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { ChangeActivityEvent } from 'src/app/models/events/changeActivityEvent';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { KnightName } from 'src/app/models/knightName';
import { CreateActivityEventRequest } from 'src/app/models/requests/createActivityEventRequest';
import { CreateStreetAddressRequest } from 'src/app/models/requests/createStreetAddressRequest';
import { CreateVolunteerSignUpRoleRequest } from 'src/app/models/requests/createVolunteerSignUpRoleRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-activity-event-modal',
  templateUrl: './edit-activity-event-modal.component.html',
  styleUrls: ['./edit-activity-event-modal.component.scss'],
})
export class EditActivityEventModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() editModalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() modalHeaderText: string = '';
  @Input() countryFormOptions: CountryFormOption[] = [];
  @Input() councilTimeZone: string = '';
  @Input() activityCategoryFormOptions: GenericFormOption[] = [];
  @Input() selectableActivities: Activity[] = [];
  @Input() allKnights: KnightName[] = [];
  @Output() createActivityEventChanges = new EventEmitter<ActivityEvent>();
  @Output() updateActivityEventChanges = new EventEmitter<ActivityEvent>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public selectedCountry: string = '';
  public editActivityEventForm: FormGroup<EditActivityEventFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private createActivityEventSubscription?: Subscription;
  private updateActivityEventSubscription?: Subscription;

  constructor(private activityEventsService: ActivityEventsService) {
    this.editActivityEventForm = this.initForm();
    console.log(this.editActivityEventForm);
    this.enableDisableAdministrativeDivisions();
  }

  ngOnInit() {
    this.enableDisableAdministrativeDivisions();
  }

  ngOnDestroy() {}

  ngOnChanges() {
  }

  public resetForm(activityEventToEdit?: ActivityEvent) {
    this.editActivityEventForm = this.initForm();
    this.errorSaving = false;
    this.errorMessages = [];

    if (activityEventToEdit) {
      this.patchForm(activityEventToEdit);
    }

    this.enableDisableAdministrativeDivisions();
  }

  public enableDisableAdministrativeDivisions(): void {
    this.selectedCountry = this.editActivityEventForm.controls.locationAddress.controls.countryCode.value;
    const hasCountryCode = this.countryFormOptions.some((cfo) => cfo.value === this.selectedCountry);

    if (hasCountryCode) {
      this.editActivityEventForm.controls.locationAddress.controls.stateCode.enable();
    } else {
      this.editActivityEventForm.controls.locationAddress.controls.stateCode.disable();
    }
  }

  public onChangeActivity(event: ChangeActivityEvent) {
    console.log(event);
    const eventNameIndex = this.selectableActivities.findIndex((x) => x.activityId == event.target?.value);

    if (eventNameIndex >= 0) {
      const eventName = this.selectableActivities[eventNameIndex].activityName;
      this.editActivityEventForm.controls['eventName'].setValue(eventName);

      const activityCategory = this.selectableActivities[eventNameIndex].activityCategory;
      this.editActivityEventForm.controls['activityCategory'].setValue(activityCategory);
    }
  }

  public deleteVolunteerSignUpRole(roleIndex: number) {
    this.editActivityEventForm.controls.volunteerSignUpRoles.removeAt(roleIndex);
  }

  public getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls['eventVolunteers'] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  public deleteEventVolunteer(roleIndex: number, volunteerIndex: number) {
    this.editActivityEventForm.controls.volunteerSignUpRoles.at(roleIndex).controls.eventVolunteers.removeAt(volunteerIndex);
  }

  public addEventVolunteer(volunteerSignUpRoleIndex: number) {
    console.log('addEventVOlunteer');
    console.log(this.editActivityEventForm);
    const eventVolunteerFormGroup = new FormGroup<EditEventVolunteersFormGroup>({
      id: new FormControl<string>('', { nonNullable: true }),
      knightId: new FormControl<string>('', { nonNullable: true }),
    });

    this.editActivityEventForm.controls.volunteerSignUpRoles.at(volunteerSignUpRoleIndex).controls.eventVolunteers.controls.push(eventVolunteerFormGroup);
  }

  public addVolunteerSignUpRole() {
    const volunteerSignUpRole = new FormGroup<EditVolunteerSignUpRoleFormGroup>({
      id: new FormControl<string>('', { nonNullable: true }),
      roleTitle: new FormControl<string>('', { nonNullable: true }),
      startDate: new FormControl<string>(this.getEventStartDate(), { nonNullable: true }),
      startTime: new FormControl<string>(this.getEventStartTime(), { nonNullable: true }),
      endDate: new FormControl<string>(this.getEventEndDate(), { nonNullable: true }),
      endTime: new FormControl<string>(this.getEventEndTime(), { nonNullable: true }),
      numberOfVolunteersNeeded: new FormControl<number>(0, { nonNullable: true }),
      eventVolunteers: new FormArray<FormGroup<EditEventVolunteersFormGroup>>([]),
    });

    this.editActivityEventForm.controls.volunteerSignUpRoles.controls.push(volunteerSignUpRole);
  }

  public onSubmitEditActivityEvent() {
    if (this.editModalAction === ModalActionEnums.Edit) {
      const updateActivityEventRequest = this.mapFormToActivityEvent();

      this.updateActivityEvent(updateActivityEventRequest);
    } else if (this.editModalAction === ModalActionEnums.Create) {
      const createActivityEventRequest = this.mapFormToCreateActivityEventRequest();

      this.createActivityEvent(createActivityEventRequest);
    }
  }

  private mapFormToCreateActivityEventRequest(): CreateActivityEventRequest {
    const volunteerRoles: CreateVolunteerSignUpRoleRequest[] = this.editActivityEventForm.controls.volunteerSignUpRoles.controls.map((roleFormGroup: FormGroup<EditVolunteerSignUpRoleFormGroup>) => {
      return {
        roleTitle: roleFormGroup.controls.roleTitle.value,
        startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(roleFormGroup.controls.startDate.value, roleFormGroup.controls.startTime.value),
        endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(roleFormGroup.controls.startDate.value, roleFormGroup.controls.endTime.value),
        numberOfVolunteersNeeded: roleFormGroup.controls.numberOfVolunteersNeeded.value,
        eventVolunteers: roleFormGroup.controls.eventVolunteers.controls.map((ev: FormGroup<EditEventVolunteersFormGroup>) => {
          return ev.controls.knightId.value;
        }),
      } as CreateVolunteerSignUpRoleRequest;
    });

    const activityEvent: CreateActivityEventRequest = {
      activityId: this.editActivityEventForm.controls.activityId.value,
      activityCategory: this.editActivityEventForm.controls.activityCategory.value,
      eventName: this.editActivityEventForm.controls.eventName.value,
      eventDescription: this.editActivityEventForm.controls.eventDescription.value,
      startDateTime:
        DateTimeFormatter.DateAndTimeToIso8601DateTime(this.editActivityEventForm.controls.startDate.value, this.editActivityEventForm.controls.startTime.value) || '1999-01-01T00:00',
      endDateTime:
        DateTimeFormatter.DateAndTimeToIso8601DateTime(this.editActivityEventForm.controls.startDate.value, this.editActivityEventForm.controls.endTime.value) || '1999-01-01T00:00',
      locationAddress: {
        addressName: this.editActivityEventForm.controls.locationAddress.controls.addressName.value,
        address1: this.editActivityEventForm.controls.locationAddress.controls.address1.value,
        address2: this.editActivityEventForm.controls.locationAddress.controls.address2.value,
        city: this.editActivityEventForm.controls.locationAddress.controls.city.value,
        stateCode: this.editActivityEventForm.controls.locationAddress.controls.stateCode.value,
        postalCode: this.editActivityEventForm.controls.locationAddress.controls.postalCode.value,
        countryCode: this.editActivityEventForm.controls.locationAddress.controls.countryCode.value
      } as CreateStreetAddressRequest,
      volunteerSignUpRoles: volunteerRoles,
      showInCalendar: this.editActivityEventForm.controls.showInCalendar.value,
      canceled: this.editActivityEventForm.controls.canceled.value,
      canceledReason: this.editActivityEventForm.controls.canceledReason.value,
      notes: this.editActivityEventForm.controls.notes.value,
    } as CreateActivityEventRequest;

    return activityEvent;
  }

  private mapFormToActivityEvent(): ActivityEvent {
    const volunteerRoles: VolunteerSignUpRole[] = this.editActivityEventForm.controls.volunteerSignUpRoles.controls.map((roleFormGroup: FormGroup<EditVolunteerSignUpRoleFormGroup>) => {
      return {
        id: roleFormGroup.controls.id.value || '00000000-0000-0000-0000-000000000000',
        roleTitle: roleFormGroup.controls.roleTitle.value,
        startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(roleFormGroup.controls.startDate.value, roleFormGroup.controls.startTime.value),
        endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(roleFormGroup.controls.startDate.value, roleFormGroup.controls.endTime.value),
        numberOfVolunteersNeeded: roleFormGroup.controls.numberOfVolunteersNeeded.value,
        eventVolunteers: roleFormGroup.controls.eventVolunteers.controls.map((ev: FormGroup<EditEventVolunteersFormGroup>) => {
          const eventVolunteer: EventVolunteer = {
            id: ev.controls.id.value || '00000000-0000-0000-0000-000000000000',
            knightId: ev.controls.knightId.value,
          } as EventVolunteer;
          return eventVolunteer;
        }),
      } as VolunteerSignUpRole;
    });

    const activityEvent: ActivityEvent = {
      id: this.editActivityEventForm.controls.id.value,
      activityId: this.editActivityEventForm.controls.activityId.value,
      activityCategory: this.editActivityEventForm.controls.activityCategory.value,
      eventName: this.editActivityEventForm.controls.eventName.value,
      eventDescription: this.editActivityEventForm.controls.eventDescription.value,
      startDateTime:
        DateTimeFormatter.DateAndTimeToIso8601DateTime(this.editActivityEventForm.controls.startDate.value, this.editActivityEventForm.controls.startTime.value) || '1999-01-01T00:00',
      endDateTime:
        DateTimeFormatter.DateAndTimeToIso8601DateTime(this.editActivityEventForm.controls.startDate.value, this.editActivityEventForm.controls.endTime.value) || '1999-01-01T00:00',
      locationAddress: {
        id: this.editActivityEventForm.controls.locationAddress.controls.id.value,
        addressName: this.editActivityEventForm.controls.locationAddress.controls.addressName.value,
        address1: this.editActivityEventForm.controls.locationAddress.controls.address1.value,
        address2: this.editActivityEventForm.controls.locationAddress.controls.address2.value,
        city: this.editActivityEventForm.controls.locationAddress.controls.city.value,
        stateCode: this.editActivityEventForm.controls.locationAddress.controls.stateCode.value,
        postalCode: this.editActivityEventForm.controls.locationAddress.controls.postalCode.value,
        countryCode: this.editActivityEventForm.controls.locationAddress.controls.countryCode.value
      } as StreetAddress,
      volunteerSignUpRoles: volunteerRoles,
      showInCalendar: this.editActivityEventForm.controls.showInCalendar.value,
      canceled: this.editActivityEventForm.controls.canceled.value,
      canceledReason: this.editActivityEventForm.controls.canceledReason.value,
      notes: this.editActivityEventForm.controls.notes.value,
    } as ActivityEvent;

    return activityEvent;
  }

  private createActivityEvent(activityEvent: CreateActivityEventRequest) {
    const activityEventObserver = {
      next: (createdActivityEvent: ActivityEvent) => this.passBackCreatedActivityEvent(createdActivityEvent),
      error: (err: ApiResponseError) => this.logError('Error creating Activity Event', err),
      complete: () => console.log('Activity Event created.'),
    };

    this.createActivityEventSubscription = this.activityEventsService
      .createActivityEvent(activityEvent)
      .subscribe(activityEventObserver);
  }

  private updateActivityEvent(activityEvent: ActivityEvent) {
    const activityEventObserver = {
      next: (activityEvent: ActivityEvent) => this.passBackUpdatedActivityEvent(activityEvent),
      error: (err: ApiResponseError) => this.logError('Error updating Activity Event', err),
      complete: () => console.log('Activity Event updated.'),
    };

    this.updateActivityEventSubscription = this.activityEventsService
      .updateActivityEvent(activityEvent)
      .subscribe(activityEventObserver);
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
    const formControl = this.editActivityEventForm.controls['startDate'] as UntypedFormControl;

    return formControl.value;
  }

  private getEventStartTime() {
    const formControl = this.editActivityEventForm.controls['startTime'] as UntypedFormControl;

    return formControl.value;
  }

  private getEventEndDate() {
    const formControl = this.editActivityEventForm.controls['endDate'] as UntypedFormControl;

    return formControl.value;
  }

  private getEventEndTime() {
    const formControl = this.editActivityEventForm.controls['endTime'] as UntypedFormControl;

    return formControl.value;
  }

  private initForm(): FormGroup<EditActivityEventFormGroup> {
    return new FormGroup<EditActivityEventFormGroup>({
      id: new FormControl<string>('00000000-0000-0000-0000-000000000000', { nonNullable: true }),
      activityId: new FormControl<string>('', { nonNullable: true }),
      activityCategory: new FormControl<string>('', { nonNullable: true }),
      eventName: new FormControl<string>('', { nonNullable: true }),
      eventDescription: new FormControl<string>('', { nonNullable: true }),
      startDate: new FormControl<string>('', { nonNullable: true }),
      startTime: new FormControl<string>('', { nonNullable: true }),
      endDate: new FormControl<string>('', { nonNullable: true }),
      endTime: new FormControl<string>('', { nonNullable: true }),
      locationAddress: new FormGroup<EditAddressFormGroup>({
        id: new FormControl<string>('00000000-0000-0000-0000-000000000000', { nonNullable: true }),
        addressName: new FormControl<string>('', { nonNullable: true }),
        address1: new FormControl<string>('', { nonNullable: true }),
        address2: new FormControl<string>('', { nonNullable: true }),
        city: new FormControl<string>('', { nonNullable: true }),
        stateCode: new FormControl<string>({value: '', disabled: true}, { nonNullable: true }),
        postalCode: new FormControl<string>('', { nonNullable: true }),
        countryCode: new FormControl<string>('', { nonNullable: true }),
      }),
      showInCalendar: new FormControl<boolean>(false, { nonNullable: true }),
      canceled: new FormControl<boolean>(false, { nonNullable: true }),
      canceledReason: new FormControl<string>('', { nonNullable: true }),
      notes: new FormControl<string>('', { nonNullable: true }),
      volunteerSignUpRoles: new FormArray<FormGroup<EditVolunteerSignUpRoleFormGroup>>([]),
    });
  }

  private patchForm(activityEvent: ActivityEvent) {
    console.log('patchForm');
    this.editActivityEventForm.patchValue({
      id: activityEvent.id,
      activityId: activityEvent.activityId,
      activityCategory: activityEvent.activityCategory,
      eventName: activityEvent.eventName,
      eventDescription: activityEvent.eventDescription,
      startDate: DateTimeFormatter.DateTimeToIso8601Date(activityEvent.startDateTime),
      startTime: DateTimeFormatter.DateTimeToIso8601Time(activityEvent.startDateTime),
      endDate: DateTimeFormatter.DateTimeToIso8601Date(activityEvent.endDateTime),
      endTime: DateTimeFormatter.DateTimeToIso8601Time(activityEvent.endDateTime),
      locationAddress: activityEvent.locationAddress,
      showInCalendar: activityEvent.showInCalendar,
      canceled: activityEvent.canceled,
      canceledReason: activityEvent.canceledReason,
      notes: activityEvent.notes,
    });

    console.log('done patching basics');

    activityEvent.volunteerSignUpRoles.forEach((role: VolunteerSignUpRole) => {
      const volunteerSignUpRoleFormGroup = new FormGroup<EditVolunteerSignUpRoleFormGroup>({
        id: new FormControl<string>(role.id, { nonNullable: true }),
        roleTitle: new FormControl<string>(role.roleTitle, { nonNullable: true }),
        startDate: new FormControl<string>(DateTimeFormatter.DateTimeToIso8601Date(role.startDateTime), { nonNullable: true }),
        startTime: new FormControl<string>(DateTimeFormatter.DateTimeToIso8601Time(role.startDateTime), { nonNullable: true }),
        endDate: new FormControl<string>(DateTimeFormatter.DateTimeToIso8601Date(role.endDateTime), { nonNullable: true }),
        endTime: new FormControl<string>(DateTimeFormatter.DateTimeToIso8601Time(role.endDateTime), { nonNullable: true }),
        numberOfVolunteersNeeded: new FormControl<number>(role.numberOfVolunteersNeeded, { nonNullable: true }),
        eventVolunteers: new FormArray<FormGroup<EditEventVolunteersFormGroup>>([]),
      });

      role.eventVolunteers.forEach((eventVolunteer: EventVolunteer) => {
        const eventVolunteerFormGroup = new FormGroup<EditEventVolunteersFormGroup>({
          id: new FormControl<string>(eventVolunteer.id, { nonNullable: true }),
          knightId: new FormControl<string>(eventVolunteer.knightId, { nonNullable: true })
        });
        volunteerSignUpRoleFormGroup.controls.eventVolunteers.controls.push(eventVolunteerFormGroup);
      });

      this.editActivityEventForm.controls.volunteerSignUpRoles.controls.push(volunteerSignUpRoleFormGroup);
    });

    console.log('done patching volunteer sign up roles');
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
