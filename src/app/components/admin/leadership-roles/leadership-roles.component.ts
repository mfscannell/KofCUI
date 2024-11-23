import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from "lodash";

import { LeadershipRole } from 'src/app/models/leadershipRole';
import { KnightsService } from 'src/app/services/knights.service';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoryEnums } from 'src/app/enums/leadershipRoleCategoryEnums';
import { EditLeadershipRoleModalComponent } from './edit-leadership-role-modal/edit-leadership-role-modal.component';
import { KnightName } from 'src/app/models/knightName';

@Component({
  selector: 'kofc-leadership-roles',
  templateUrl: './leadership-roles.component.html',
  styleUrls: ['./leadership-roles.component.scss'],
})
export class LeadershipRolesComponent implements OnInit, OnDestroy {
  @ViewChild(EditLeadershipRoleModalComponent) editLeadershipRoleModal: EditLeadershipRoleModalComponent | undefined;

  public allKnights: KnightName[] = [];
  public leadershipRoles: LeadershipRole[] = [];
  public leadershipRoleCategories: LeadershipRoleCategoryEnums[] = Object.values(LeadershipRoleCategoryEnums);
  private knightsSubscription?: Subscription;
  private leadershipRolesSubscription?: Subscription;

  constructor(
    private knightsService: KnightsService,
    private leadershipRolesService: LeadershipRolesService,
  ) {}

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
  }

  private getAllActiveKnightsNames() {
    const knightsObserver = {
      next: (knights: KnightName[]) => this.loadAllKnights(knights),
      error: (err: unknown) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.'),
    };
    this.knightsSubscription = this.knightsService.getAllKnightsNames({restrictToActiveOnly: true}).subscribe(knightsObserver);
  }

  private loadAllKnights(knights: KnightName[]) {
    this.allKnights = knights;
  }

  private getAllLeadershipRoles() {
    const leadershipRolesObserver = {
      next: (leadershipRoles: LeadershipRole[]) => (this.leadershipRoles = leadershipRoles),
      error: (err: unknown) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.'),
    };
    this.leadershipRolesSubscription = this.leadershipRolesService
      .getAllLeadershipRoles()
      .subscribe(leadershipRolesObserver);
  }

  public openEditLeadershipRoleModal(leadershipRole: LeadershipRole) {
    this.editLeadershipRoleModal?.resetForm(leadershipRole);
  }

  cancelModal() {}

  public updateLeadershipRoleInList(leadershipRole: LeadershipRole) {
    console.log(leadershipRole);

    const newList = _.cloneDeep(this.leadershipRoles) as LeadershipRole[];
    const index = newList.findIndex((x) => x.id == leadershipRole.id);

    if (newList && index !== undefined && index >= 0) {
      newList[index] = leadershipRole;

      this.leadershipRoles = newList;
    }
  }
}
