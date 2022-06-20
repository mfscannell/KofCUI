import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoryEnums } from 'src/app/enums/leadershipRoleCategoryEnums';

@Component({
  selector: 'kofc-edit-leadership-role-modal',
  templateUrl: './edit-leadership-role-modal.component.html',
  styleUrls: ['./edit-leadership-role-modal.component.scss']
})
export class EditLeadershipRoleModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() leadershipRole?: LeadershipRole = this.getDefaultLeadershipRole();
  @Input() allKnights: Knight[] = [];
  updateLeadershipRoleSubscription?: Subscription;
  createLeadershipRoleSubscription?: Subscription;
  editLeadershipRoleForm: FormGroup;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private leadershipRolesService: LeadershipRolesService) {
    this.editLeadershipRoleForm = this.fb.group({
      leadershipRoleId: [''],
      title: [''],
      occupied: [false],
      knightId: [''],
      leadershipRoleCategory: ['']
     });
  }

  ngOnInit() {
    if (this.leadershipRole) {
      this.editLeadershipRoleForm.patchValue({
        leadershipRoleId: this.leadershipRole.leadershipRoleId,
        title: this.leadershipRole.title,
        occupied: this.leadershipRole.occupied,
        knightId: this.leadershipRole.knightId,
        leadershipRoleCategory: this.leadershipRole.leadershipRoleCategory
       });
    }

    this.sortAllKnightsByName();
  }

  private sortAllKnightsByName() {
    this.allKnights = this.allKnights.sort((knight1, knight2) =>{
      if (knight1.firstName < knight2.firstName) {
        return -1;
      }

      if (knight1.firstName > knight2.firstName) {
        return 1;
      }

      if (knight1.lastName < knight2.lastName) {
        return -1;
      }

      if (knight1.lastName > knight2.lastName) {
        return 1;
      }

      return 0;
    });
  }

  ngOnDestroy() {
    if (this.updateLeadershipRoleSubscription) {
      this.updateLeadershipRoleSubscription.unsubscribe();
    }

    if (this.createLeadershipRoleSubscription) {
      this.createLeadershipRoleSubscription.unsubscribe();
    }
  }

  isReadonly() {
    return this.leadershipRole?.leadershipRoleCategory === LeadershipRoleCategoryEnums.Officer;
  }

  private getDefaultLeadershipRole() {
    return new LeadershipRole({
      leadershipRoleId: 0,
      title: '',
      knightId: 0,
      occupied: false,
      leadershipRoleCategory: LeadershipRoleCategoryEnums.Director
    });
  }

  onSubmitEditLeadershipRole() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updatedLeadershipRole = new LeadershipRole(this.editLeadershipRoleForm.getRawValue());
      this.updateLeadershipRole(updatedLeadershipRole);
    }
  }

  private updateLeadershipRole(leadershipRole: LeadershipRole) {
    let leadershipRoleObserver = {
      next: (updatedLeadershipRole: LeadershipRole) => this.passBack(updatedLeadershipRole),
      error: (err: any) => this.logError('Error updating leadership role.', err),
      complete: () => console.log('Leadership Role updated.')
    };

    this.updateLeadershipRoleSubscription = this.leadershipRolesService.updateLeadershipRole(leadershipRole).subscribe(leadershipRoleObserver);
  }

  passBack(leadershipRole: LeadershipRole) {
    this.activeModal.close(leadershipRole);
  }

  logError(message: string, err: any) {
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
