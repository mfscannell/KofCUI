import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { UpdateLeadershipRoleRequest } from 'src/app/models/requests/updateLeadershipRoleRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';

@Component({
  selector: 'edit-leadership-role-modal',
  templateUrl: './edit-leadership-role-modal.component.html',
  styleUrls: ['./edit-leadership-role-modal.component.scss'],
})
export class EditLeadershipRoleModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() leadershipRole: LeadershipRole | undefined;
  @Input() allKnights: Knight[] = [];
  @Output() editLeadershipRoleChanges = new EventEmitter<LeadershipRole>();
  @ViewChild('cancelCustomEditActiveModal', { static: false })
  cancelCustomEditActiveModal: ElementRef | undefined;
  public editLeadershipRoleForm: UntypedFormGroup;
  public errorSaving: boolean = true;
  public errorMessages: string[] = [];
  private updateLeadershipRoleSubscription?: Subscription;

  constructor(private leadershipRolesService: LeadershipRolesService) {
    console.log('EditLeadershipRoleModalComponent constructor');
    this.editLeadershipRoleForm = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      title: new UntypedFormControl(''),
      occupied: new UntypedFormControl(false),
      knightId: new UntypedFormControl(''),
      leadershipRoleCategory: new UntypedFormControl(''),
    });
  }

  ngOnInit() {
    console.log('EditLeadershipRoleModalComponent ngOnInit');
  }

  ngOnDestroy() {
    if (this.updateLeadershipRoleSubscription) {
      this.updateLeadershipRoleSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    console.log('EditLeadershipRoleModalComponent ngOnChanges');

    this.editLeadershipRoleForm = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      title: new UntypedFormControl(''),
      occupied: new UntypedFormControl(false),
      knightId: new UntypedFormControl(''),
      leadershipRoleCategory: new UntypedFormControl(''),
    });

    if (this.leadershipRole) {
      this.editLeadershipRoleForm.patchValue({
        id: this.leadershipRole.id,
        title: this.leadershipRole.title,
        occupied: this.leadershipRole.occupied,
        knightId: this.leadershipRole.knightId,
        leadershipRoleCategory: this.leadershipRole.leadershipRoleCategory,
      });
    }
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
    this.editLeadershipRoleChanges.emit(updatedLeadershipRole);
    this.cancelCustomEditActiveModal?.nativeElement.click();
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
