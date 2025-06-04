import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightsService } from 'src/app/services/knights.service';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ConfigsService } from 'src/app/services/configs.service';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { EditActivityEventModalComponent } from './edit-activity-event-modal/edit-activity-event-modal.component';
import { KnightName } from 'src/app/models/knightName';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { ModalActionType } from 'src/app/types/modal-action.type';

@Component({
    selector: 'kofc-activity-events',
    templateUrl: './activity-events.component.html',
    styleUrls: ['./activity-events.component.scss'],
    standalone: false
})
export class ActivityEventsComponent implements OnInit, OnDestroy {
  @ViewChild(EditActivityEventModalComponent) editActivityEventModal: EditActivityEventModalComponent | undefined;
  activityEventsSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  selectableActivities: Activity[] = [];
  allActivities: Activity[] = [];
  activityEventToEdit?: ActivityEvent;
  allKnights: KnightName[] = [];
  startDate: string;
  endDate: string;
  page = 1;
  pageSize = 5;
  maxSize = 10;
  public councilTimeZone: string = '';
  editActivityEventForm: UntypedFormGroup;

  errorSaving: boolean = false;
  errorMessages: string[] = [];
  public activityEventToEmailAbout: ActivityEvent | undefined;

  private getFormOptionsSubscriptions?: Subscription;
  public countryFormOptions: CountryFormOption[] = [];
  public activityCategoryFormOptions: GenericFormOption[] = [];
  public editModalHeaderText: string = '';
  public editModalAction: ModalActionType = 'Create';

  constructor(
    private activityEventsService: ActivityEventsService,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private permissionsService: PermissionsService,
    private configsService: ConfigsService,
    private formsService: FormsService,
  ) {
    const initialDate = new Date();
    initialDate.setMonth(initialDate.getMonth() - 3);
    const finalDate = new Date(initialDate);
    finalDate.setMonth(finalDate.getMonth() + 6);
    this.startDate = DateTimeFormatter.ToIso8601Date(
      initialDate.getFullYear(),
      initialDate.getMonth() + 1,
      initialDate.getDate(),
    );
    this.endDate = DateTimeFormatter.ToIso8601Date(
      finalDate.getFullYear(),
      finalDate.getMonth() + 1,
      finalDate.getDate(),
    );
    console.log('Exiting constructor');
    console.log(this.startDate);
    console.log(this.endDate);

    this.editActivityEventForm = new UntypedFormGroup({
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
        countryCode: new UntypedFormControl(''),
      }),
      showInCalendar: new UntypedFormControl(null),
      canceled: new UntypedFormControl(null),
      canceledReason: new UntypedFormControl(''),
      notes: new UntypedFormControl(''),
      volunteerSignUpRoles: new UntypedFormArray([]),
    });
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getFormOptions();
  }

  ngOnDestroy() {
    if (this.activityEventsSubscription) {
      this.activityEventsSubscription.unsubscribe();
    }

    if (this.getFormOptionsSubscriptions) {
      this.getFormOptionsSubscriptions.unsubscribe();
    }
  }

  canAddEvent() {
    return this.permissionsService.canAddEvent(this.allActivities);
  }

  canEditEvent(activityId: string) {
    return this.permissionsService.canEditEvent(activityId);
  }

  public getAllActivityEvents() {
    console.log('getAllActivityEvents');
    console.log(this.startDate);
    console.log(this.endDate);

    const activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => this.handleGetActivityEvents(activityEvents),
      error: (err: ApiResponseError) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.'),
    };

    if (this.startDate && this.endDate) {
      this.activityEventsSubscription = this.activityEventsService
        .getAllActivityEvents(this.startDate, this.endDate)
        .subscribe(activityEventsObserver);
    }
  }

  private handleGetActivityEvents(activityEvents: ActivityEvent[]) {
    this.activityEvents = activityEvents;
  }

  private handleGetActivities(response: Activity[]) {
    this.allActivities = response.sort((a, b) => a.activityName.localeCompare(b.activityName));
    this.selectableActivities = this.permissionsService.filterActivitiesByEventCreation(this.allActivities);
  }

  private getFormOptions() {
    const formsObserver = {
      next: ([
        activityCategoriesResponse,
        countryResponse,
        websiteContent,
        getAllActivitiesResponse,
        getAllKnightsResponse,
      ]: [GenericFormOption[], CountryFormOption[], WebsiteContent, Activity[], KnightName[]]) => {
        this.activityCategoryFormOptions = activityCategoriesResponse;
        this.countryFormOptions = countryResponse;
        this.councilTimeZone = websiteContent.councilTimeZone;
        this.handleGetActivities(getAllActivitiesResponse);
        this.allKnights = getAllKnightsResponse;
      },
      error: (err: ApiResponseError) => this.logError('Error getting Activity Events Form Options', err),
      complete: () => console.log('Activity Events Form Options retrieved.'),
    };

    this.getFormOptionsSubscriptions = forkJoin([
      this.formsService.getActivityCategoryFormOptions(),
      this.formsService.getCountryFormOptions(),
      this.configsService.getWebsiteContent(),
      this.activitiesService.getAllActivities(),
      this.knightsService.getAllKnightsNames({restrictToActiveOnly: true}),
    ]).subscribe(formsObserver);
  }

  public openSendEmailModal(activityEvent: ActivityEvent) {
    this.activityEventToEmailAbout = activityEvent;
  }

  public openCreateActivityEventModal() {
    this.activityEventToEdit = undefined;
    this.editModalAction = 'Create';
    this.editModalHeaderText = 'Adding Activity Event';
    this.editActivityEventModal?.resetForm();
  }

  public openEditActivityEventModal(activityEvent: ActivityEvent) {
    this.activityEventToEdit = activityEvent;
    this.editModalAction = 'Edit';
    this.editModalHeaderText = 'Editing Activity Event';
    this.editActivityEventModal?.resetForm(activityEvent);
  }

  public appendActivityEventToList(activityEvent: ActivityEvent) {
    this.activityEvents?.push(activityEvent);
  }

  public updateActivityEventInList(activityEvent: ActivityEvent) {
    const index = this.activityEvents?.findIndex((x) => x.id === activityEvent.id);

    if (this.activityEvents && index !== undefined && index >= 0) {
      this.activityEvents[index] = activityEvent;
    }
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
