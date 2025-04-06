import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LeadershipRoleFormGroup } from 'src/app/forms/leadershipRoleFormGroup';
import { KnightName } from 'src/app/models/knightName';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { UpdateLeadershipRoleRequest } from 'src/app/models/requests/updateLeadershipRoleRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';

@Component({
    selector: 'edit-leadership-role-modal',
    templateUrl: './edit-leadership-role-modal.component.html',
    styleUrls: ['./edit-leadership-role-modal.component.scss'],
    standalone: false
})
export class EditLeadershipRoleModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() allKnights: KnightName[] = [];
  @Output() editLeadershipRoleChanges = new EventEmitter<LeadershipRole>();
  @ViewChild('cancelCustomEditActiveModal', { static: false }) cancelCustomEditActiveModal: ElementRef | undefined;
  public editLeadershipRoleForm: FormGroup<LeadershipRoleFormGroup>;
  public errorSaving: boolean = true;
  public errorMessages: string[] = [];
  public leadershipRole?: LeadershipRole;
  private updateLeadershipRoleSubscription?: Subscription;

  constructor(private leadershipRolesService: LeadershipRolesService) {
    console.log('EditLeadershipRoleModalComponent constructor');
    this.editLeadershipRoleForm = this.initForm();
  }

  ngOnInit() {
    console.log('EditLeadershipRoleModalComponent ngOnInit');
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    console.log('EditLeadershipRoleModalComponent ngOnChanges');
  }

  public resetForm(leadershipRole: LeadershipRole) {
    this.leadershipRole = leadershipRole;
    this.editLeadershipRoleForm = this.initForm();

    if (leadershipRole) {
      this.editLeadershipRoleForm.patchValue({
        id: leadershipRole.id,
        title: leadershipRole.title,
        occupied: leadershipRole.occupied,
        knightId: leadershipRole.knightId,
        leadershipRoleCategory: leadershipRole.leadershipRoleCategory,
      });
    }

    console.log('editLeadershipRoleModal resetForm');
  }

  private initForm(): FormGroup<LeadershipRoleFormGroup> {
    return new FormGroup<LeadershipRoleFormGroup>({
      id: new FormControl<string>('00000000-0000-0000-0000-000000000000', {nonNullable: true}),
      title: new FormControl<string>('', {nonNullable: true}),
      occupied: new FormControl<boolean>(false, {nonNullable: true}),
      knightId: new FormControl<string | undefined>(undefined, {nonNullable: true}),
      leadershipRoleCategory: new FormControl<string>('', {nonNullable: true}),
    });
  }

  public cancelModal() {}

  public onSubmitEditLeadershipRole() {
    const rawForm = this.editLeadershipRoleForm.getRawValue();
    const updatedLeadershipRole: UpdateLeadershipRoleRequest = {
      id: rawForm.id,
      knightId: rawForm.occupied ? rawForm.knightId : undefined,
      occupied: rawForm.occupied
    };

    this.updateLeadershipRole(updatedLeadershipRole);
  }

  private updateLeadershipRole(leadershipRole: UpdateLeadershipRoleRequest) {
    const leadershipRoleObserver = {
      next: (updatedLeadershipRole: LeadershipRole) => this.passBack(updatedLeadershipRole),
      error: (err: ApiResponseError) => this.logError('Error updating leadership role.', err),
      complete: () => console.log('Leadership Role updated.'),
    };

    this.updateLeadershipRoleSubscription = this.leadershipRolesService
      .updateLeadershipRole(leadershipRole)
      .subscribe(leadershipRoleObserver);
  }

  private passBack(updatedLeadershipRole: LeadershipRole) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editLeadershipRoleChanges.emit(updatedLeadershipRole);

    this.updateLeadershipRoleSubscription?.unsubscribe();
    this.cancelCustomEditActiveModal?.nativeElement.click();
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
