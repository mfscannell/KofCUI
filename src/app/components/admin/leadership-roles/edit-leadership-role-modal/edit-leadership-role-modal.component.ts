import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategory } from 'src/app/models/leadershipRoleCategory';

@Component({
  selector: 'kofc-edit-leadership-role-modal',
  templateUrl: './edit-leadership-role-modal.component.html',
  styleUrls: ['./edit-leadership-role-modal.component.css']
})
export class EditLeadershipRoleModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() leadershipRole?: LeadershipRole = this.getDefaultLeadershipRole();
  @Input() leadershipRoleCategories?: LeadershipRoleCategory[];
  @Input() allKnights: Knight[] = [];
  updateLeadershipRoleSubscription?: Subscription;
  createLeadershipRoleSubscription?: Subscription;
  editLeadershipRoleForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private leadershipRolesService: LeadershipRolesService) {
    this.editLeadershipRoleForm = this.fb.group({
      leadershipRoleId: [''],
      title: [''],
      leadershipRoleCategoryId: [''],
      occupied: [false],
      knightId: ['']
     });
  }

  ngOnInit() {
    if (this.leadershipRole) {
      this.editLeadershipRoleForm.patchValue({
        leadershipRoleId: this.leadershipRole.leadershipRoleId,
        title: this.leadershipRole.title,
        leadershipRoleCategoryId: this.leadershipRole.leadershipRoleCategoryId,
        occupied: this.leadershipRole.occupied,
        knightId: this.leadershipRole.knightId
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

    let something = 5;
  }

  ngOnDestroy() {
    if (this.updateLeadershipRoleSubscription) {
      this.updateLeadershipRoleSubscription.unsubscribe();
    }

    if (this.createLeadershipRoleSubscription) {
      this.createLeadershipRoleSubscription.unsubscribe();
    }
  }

  private getDefaultLeadershipRole() {
    let leadershipRoleCategoryId = 0;

    if (this.leadershipRoleCategories && this.leadershipRoleCategories.length > 0) {
      leadershipRoleCategoryId = this.leadershipRoleCategories[0].leadershipRoleCategoryId;
    }

    return new LeadershipRole({
      leadershipRoleId: 0,
      title: '',
      leadershipRoleCategoryId: leadershipRoleCategoryId || 0,
      knightId: 0,
      occupied: false
    });
  }

  onSubmitEditLeadershipRole() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updatedLeadershipRole = new LeadershipRole(this.editLeadershipRoleForm.getRawValue());
      this.updateLeadershipRole(updatedLeadershipRole);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let newLeadershipRole = new LeadershipRole(this.editLeadershipRoleForm.getRawValue());
      this.createLeadershipRole(newLeadershipRole);
    }
  }

  private updateLeadershipRole(leadershipRole: LeadershipRole) {
    let leadershipRoleObserver = {
      next: (updatedLeadershipRole: LeadershipRole) => this.passBack(updatedLeadershipRole),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Role updated.')
    };

    this.updateLeadershipRoleSubscription = this.leadershipRolesService.updateLeadershipRole(leadershipRole).subscribe(leadershipRoleObserver);
  }

  private createLeadershipRole(leadershipRole: LeadershipRole) {
    let leadershipRoleObserver = {
      next: (createdLeadershipRole: LeadershipRole) => this.passBack(createdLeadershipRole),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Role created.')
    };

    this.createLeadershipRoleSubscription = this.leadershipRolesService.createLeadershipRole(leadershipRole).subscribe(leadershipRoleObserver);
  }

  passBack(leadershipRole: LeadershipRole) {
    this.activeModal.close(leadershipRole);
  }
}
