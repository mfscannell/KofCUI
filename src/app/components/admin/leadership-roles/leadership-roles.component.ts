import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditLeadershipRoleCategoryModalComponent } from 'src/app/components/admin/leadership-roles/edit-leadership-role-category-modal/edit-leadership-role-category-modal.component';
import { EditLeadershipRoleModalComponent } from 'src/app/components/admin/leadership-roles/edit-leadership-role-modal/edit-leadership-role-modal.component';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { LeadershipRoleCategory } from 'src/app/models/leadershipRoleCategory';
import { KnightsService } from 'src/app/services/knights.service';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoriesService } from 'src/app/services/leadershipRoleCategories.service';


@Component({
  selector: 'kofc-leadership-roles',
  templateUrl: './leadership-roles.component.html',
  styleUrls: ['./leadership-roles.component.css']
})
export class LeadershipRolesComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  leadershipRoleCategories: LeadershipRoleCategory[] = [];
  leadershipRoles?: LeadershipRole[];
  knightsLoaded: boolean = false;
  knightsSubscription?: Subscription;
  leadershipRolesSubscription?: Subscription;
  leadershipRoleCategoriesSubscription?: Subscription;
  closeModalResult = '';

  constructor(private knightsService: KnightsService,
    private leadershipRoleCategoriesService: LeadershipRoleCategoriesService,
    private leadershipRolesService: LeadershipRolesService,
    private modalService: NgbModal) {

    }

  ngOnInit() {
    this.getAllKnights();
    this.getAllLeadershipRoleCategories();
    this.getAllLeadershipRoles();
  }

  ngOnDestroy() {
    if (this.leadershipRolesSubscription) {
      this.leadershipRolesSubscription.unsubscribe();
    }

    if (this.leadershipRoleCategoriesSubscription) {
      this.leadershipRoleCategoriesSubscription.unsubscribe();
    }
  }

  private getAllKnights() {
    let knightsObserver = {
      next: (knights: Knight[]) => this.loadAllKnights(knights),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.')
    };
    this.knightsSubscription = this.knightsService.getAllKnights().subscribe(knightsObserver);
  }

  private loadAllKnights(knights: Knight[]) {
    this.allKnights = knights;
    this.knightsLoaded = true;
  }

  private getAllLeadershipRoleCategories() {
    let leadershipRoleCategoriesObserver = {
      next: (leadershipRoleCategories: LeadershipRoleCategory[]) => this.leadershipRoleCategories = leadershipRoleCategories,
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Role Categories loaded.')
    };
    this.leadershipRoleCategoriesSubscription = this.leadershipRoleCategoriesService.getAllLeadershipRoleCategories().subscribe(leadershipRoleCategoriesObserver);
  }

  private getAllLeadershipRoles() {
    let leadershipRolesObserver = {
      next: (leadershipRoles: LeadershipRole[]) => this.leadershipRoles = leadershipRoles,
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.')
    };
    this.leadershipRolesSubscription = this.leadershipRolesService.getAllLeadershipRoles().subscribe(leadershipRolesObserver);
  }

  openEditLeadershipRoleCategoryModal(leadershipRoleCategory: LeadershipRoleCategory) {
    const modalRef = this.modalService.open(EditLeadershipRoleCategoryModalComponent, {ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.leadershipRoleCategory = leadershipRoleCategory;
    modalRef.componentInstance.modalHeaderText = 'Editing Leadership Role Category';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result) => {
      if (result) {
        this.updateLeadershipRoleCategoryInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Leadership Role Category Modal.');
        console.log(error);
      }
    });
  }

  private updateLeadershipRoleCategoryInList(leadershipRoleCategory: LeadershipRoleCategory) {
    let index = this.leadershipRoleCategories?.findIndex(x => x.leadershipRoleCategoryId == leadershipRoleCategory.leadershipRoleCategoryId)

    if (this.leadershipRoleCategories && index !== undefined && index >= 0) {
      this.leadershipRoleCategories[index] = leadershipRoleCategory;
    }
  }

  openCreateLeadershipRoleCategoryModal() {
    const modalRef = this.modalService.open(EditLeadershipRoleCategoryModalComponent, {ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.modalHeaderText = 'Adding Leadership Role Category';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: LeadershipRoleCategory) => {
      if (result) {
        this.leadershipRoleCategories?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Create Leadership Role Category Modal.');
        console.log(error);
      }
    });
  }

  openEditLeadershipRoleModal(leadershipRole: LeadershipRole) {
    const modalRef = this.modalService.open(EditLeadershipRoleModalComponent, {ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.allKnights = this.allKnights;
    modalRef.componentInstance.leadershipRole = leadershipRole;
    modalRef.componentInstance.leadershipRoleCategories = this.leadershipRoleCategories;
    modalRef.componentInstance.modalHeaderText = 'Editing Leadership Role';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result: LeadershipRole) => {
      if (result) {
        this.updateLeadershipRoleInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Leadership Role Modal.');
        console.log(error);
      }
    });
  }

  private updateLeadershipRoleInList(leadershipRole: LeadershipRole) {
    let index = this.leadershipRoles?.findIndex(x => x.leadershipRoleId == leadershipRole.leadershipRoleId)

    if (this.leadershipRoles && index !== undefined && index >= 0) {
      this.leadershipRoles[index] = leadershipRole;
    }
  }

  openCreateLeadershipRoleModal() {
    const modalRef = this.modalService.open(EditLeadershipRoleModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    
    modalRef.componentInstance.allKnights = this.allKnights;
    modalRef.componentInstance.leadershipRole = new LeadershipRole({
      leadershipRoleCategoryId: this.leadershipRoleCategories[0].leadershipRoleCategoryId || 0,
      occupied: false
    });
    modalRef.componentInstance.leadershipRoleCategories = this.leadershipRoleCategories;
    modalRef.componentInstance.modalHeaderText = 'Creating Leadership Role';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: LeadershipRole) => {
      if (result) {
        this.leadershipRoles?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Leadership Role Modal.');
        console.log(error);
      }
    });
  }

  filterLeadershipRolesByCategory(leadershipRoleCategoryId?: number) {
    if (this.leadershipRoles && leadershipRoleCategoryId !== undefined) {
      return this.leadershipRoles.filter(x => x.leadershipRoleCategoryId == leadershipRoleCategoryId);
    }

    return [];
  }
}
