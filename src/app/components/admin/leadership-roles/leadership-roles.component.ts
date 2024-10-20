import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { KnightsService } from 'src/app/services/knights.service';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoryEnums } from 'src/app/enums/leadershipRoleCategoryEnums';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'kofc-leadership-roles',
  templateUrl: './leadership-roles.component.html',
  styleUrls: ['./leadership-roles.component.scss']
})
export class LeadershipRolesComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  leadershipRoles: LeadershipRole[] = [];
  leadershipRoleCategories: LeadershipRoleCategoryEnums[] = Object.values(LeadershipRoleCategoryEnums);
  knightsLoaded: boolean = false;
  knightsSubscription?: Subscription;
  leadershipRolesSubscription?: Subscription;
  updateLeadershipRoleSubscription?: Subscription;
  closeModalResult = '';
  editLeadershipRoleForm: UntypedFormGroup;
  leadershipRole: LeadershipRole | undefined;
  errorSaving: boolean = false;
  errorMessages: string[] = [];
  @ViewChild('cancelEditActiveModal', {static: false}) cancelEditActiveModal: ElementRef | undefined;

  constructor(
    private knightsService: KnightsService,
    private leadershipRolesService: LeadershipRolesService) {
      this.editLeadershipRoleForm = new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        title: new UntypedFormControl(''),
        occupied: new UntypedFormControl(false),
        knightId: new UntypedFormControl(''),
        leadershipRoleCategory: new UntypedFormControl('')
       });
    }

  ngOnInit() {
    this.getAllActiveKnightsNames();
    this.getAllLeadershipRoles();
  }

  ngOnDestroy() {
    if (this.leadershipRolesSubscription) {
      this.leadershipRolesSubscription.unsubscribe();
    }

    if (this.knightsSubscription) {
      this.knightsSubscription.unsubscribe();
    }

    if (this.updateLeadershipRoleSubscription) {
      this.updateLeadershipRoleSubscription.unsubscribe();
    }
  }

  private getAllActiveKnightsNames() {
    let knightsObserver = {
      next: (knights: Knight[]) => this.loadAllKnights(knights),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.')
    };
    this.knightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  private loadAllKnights(knights: Knight[]) {
    this.allKnights = knights;
    this.knightsLoaded = true;
  }

  private getAllLeadershipRoles() {
    let leadershipRolesObserver = {
      next: (leadershipRoles: LeadershipRole[]) => this.leadershipRoles = leadershipRoles,
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.')
    };
    this.leadershipRolesSubscription = this.leadershipRolesService.getAllLeadershipRoles().subscribe(leadershipRolesObserver);
  }

  filterLeadershipRoles(leadershipRoleCategory: LeadershipRoleCategoryEnums) {
    if (this.leadershipRoles) {
      return this.leadershipRoles.filter(x => x.leadershipRoleCategory === leadershipRoleCategory);
    }

    return [];
  }

  openEditLeadershipRoleModal(leadershipRole: LeadershipRole) {
    this.leadershipRole = leadershipRole;
    this.editLeadershipRoleForm.patchValue({
      id: this.leadershipRole.id,
      title: this.leadershipRole.title,
      occupied: this.leadershipRole.occupied,
      knightId: this.leadershipRole.knightId,
      leadershipRoleCategory: this.leadershipRole.leadershipRoleCategory
     });
  }

  cancelModal() {

  }

  onSubmitEditLeadershipRole() {
    let rawForm = this.editLeadershipRoleForm.getRawValue();
    let updatedLeadershipRole: LeadershipRole = {
      id: rawForm.id,
      title: rawForm.title,
      knightId: rawForm.knightId,
      occupied: rawForm.occupied,
      leadershipRoleCategory: rawForm.leadershipRoleCategory
    };

    this.updateLeadershipRole(updatedLeadershipRole);
  }

  private updateLeadershipRole(leadershipRole: LeadershipRole) {
    let leadershipRoleObserver = {
      next: (updatedLeadershipRole: LeadershipRole) => this.updateLeadershipRoleInList(updatedLeadershipRole),
      error: (err: any) => this.logError('Error updating leadership role.', err),
      complete: () => console.log('Leadership Role updated.')
    };

    this.updateLeadershipRoleSubscription = this.leadershipRolesService.updateLeadershipRole(leadershipRole).subscribe(leadershipRoleObserver);
  }

  private updateLeadershipRoleInList(leadershipRole: LeadershipRole) {
    let index = this.leadershipRoles?.findIndex(x => x.id == leadershipRole.id)

    if (this.leadershipRoles && index !== undefined && index >= 0) {
      this.leadershipRoles[index] = leadershipRole;
    }

    this.cancelEditActiveModal?.nativeElement.click();
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
