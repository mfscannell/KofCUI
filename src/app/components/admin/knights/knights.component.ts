import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, Routes, RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { EditKnightModalComponent } from 'src/app/components/admin/knights/edit-knight-modal/edit-knight-modal.component';
import { UploadKnightsModalComponent } from 'src/app/components/admin/knights/upload-knights-modal/upload-knights-modal.component';
import { EditKnightPasswordModalComponent } from './edit-knight-password-modal/edit-knight-password-modal.component';
import { KnightUser } from 'src/app/models/knightUser';
import { EditKnightPersonalInfoModalComponent } from './edit-knight-personal-info-modal/edit-knight-personal-info-modal.component';
import { EditKnightActivityInterestsModalComponent } from './edit-knight-activity-interests-modal/edit-knight-activity-interests-modal.component';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { EditKnightMemberDuesModalComponent } from './edit-knight-member-dues-modal/edit-knight-member-dues-modal.component';
import { MemberDues } from 'src/app/models/memberDues';
import { EditKnightMemberInfoModalComponent } from './edit-knight-member-info-modal/edit-knight-member-info-modal.component';
import { KnightInfo } from 'src/app/models/knightInfo';

@Component({
  selector: 'knights',
  templateUrl: './knights.component.html',
  styleUrls: ['./knights.component.scss']
})
export class KnightsComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  displayedKnights: Knight[] = [];
  displayedKnightsCount: number = 0;
  knightsSubscription?: Subscription;
  knightsLoaded: boolean = false;
  page = 1;
  pageSize = 20;
  maxSize = 10;

  private _search$ = new Subject<void>();

  constructor(private knightsService: KnightsService,
    private modalService: NgbModal) {
      let something = 4;
  }

  ngOnInit() {
    this.getAllKnights();
  }

  ngOnDestroy() {
    if (this.knightsSubscription) {
      this.knightsSubscription.unsubscribe();
    }
  }

  private getAllKnights() {
    let knightsObserver = {
      next: (knights: Knight[]) => this.applySearchFilter(knights),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.')
    };
    this.knightsSubscription = this.knightsService.getAllKnights().subscribe(knightsObserver);
  }

  private applySearchFilter(knights: Knight[]) {
    this.allKnights = knights;
    this.displayedKnights = knights;
    this.displayedKnightsCount = this.allKnights.length;
    this.knightsLoaded = true;
  }

  searchPartialName(event: any) {
    let text = event.target.value.toLowerCase();
    this.page = 1;
    this.displayedKnights = this.allKnights.filter(knight => 
      (knight.firstName && knight.firstName.toLowerCase().includes(text)) || (knight.lastName && knight.lastName.toLowerCase().includes(text)));
  }

  openEditKnightPersonalInfoModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightPersonalInfoModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knight = knight;
    modalRef.componentInstance.modalHeaderText = 'Editing Knight';
    modalRef.result.then((result: Knight) => {
      if (result) {
        this.updateKnightPersonalInfoInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Personal Info Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightActivityInterestsModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightActivityInterestsModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.activityInterests = knight.activityInterests;
    modalRef.componentInstance.knightId = knight.knightId;
    modalRef.componentInstance.modalHeaderText = `Editing Activity Interests for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: ActivityInterest[]) => {
      if (result) {
        this.updateKnightActivityInterestsInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Activity Interests Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightMemberDuesModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightMemberDuesModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.memberDues = knight.memberDues;
    modalRef.componentInstance.knightId = knight.knightId;
    modalRef.componentInstance.modalHeaderText = `Editing Member Dues for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: MemberDues[]) => {
      if (result) {
        this.updateKnightMemberDuesInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Member Dues Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightMemberInfoModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightMemberInfoModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightInfo = knight.knightInfo;
    modalRef.componentInstance.knightId = knight.knightId;
    modalRef.componentInstance.modalHeaderText = `Editing Member Info for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: KnightInfo) => {
      if (result) {
        this.updateKnightMemberInfoInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Member Info Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightPassword(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightPasswordModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightUser = knight.knightUser;
    modalRef.componentInstance.modalHeaderText = `Editing Knight Password for ${knight.firstName} ${knight.lastName}`;
    modalRef.componentInstance.knightsFullName = `${knight.firstName} ${knight.lastName}`;
    modalRef.componentInstance.knightId = knight.knightId;
    modalRef.result.then((result: KnightUser) => {
      if (result) {
        this.updateKnightUserInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Password Modal.');
        console.log(error);
      }
    });
  }

  private updateKnightPersonalInfoInList(knight: Knight) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      knight.knightInfo = this.allKnights[index].knightInfo;
      knight.memberDues = this.allKnights[index].memberDues;
      knight.activityInterests = this.allKnights[index].activityInterests;
      knight.knightUser = this.allKnights[index].knightUser;

      this.allKnights[index] = knight;
    }
  }

  private updateKnightActivityInterestsInList(knight: Knight, activityInterests: ActivityInterest[]) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].activityInterests = activityInterests;
    }
  }

  private updateKnightMemberDuesInList(knight: Knight, memberDues: MemberDues[]) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].memberDues = memberDues;
    }
  }

  private updateKnightMemberInfoInList(knight: Knight, knightMemberInfo: KnightInfo) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightInfo = knightMemberInfo;
    }
  }

  private updateKnightUserInList(knight: Knight, knightUser: KnightUser) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId)

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightUser = knightUser;
    }
  }

  openCreateKnightModal() {
    const modalRef = this.modalService.open(EditKnightModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.result.then((result: Knight) => {
      if (result) {
        this.addKnightToAllKnights(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Create Knight Modal.', error);
      }
    });
  }

  openUploadKnightsModal() {
    const modalRef = this.modalService.open(UploadKnightsModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.modalHeaderText = 'Upload Knights From File';
    modalRef.result.then((result: Knight[]) => {
      if (result) {
        this.addKnights(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from uploading knights modal.', error);
      }
    });
  }

  private addKnightToAllKnights(knight: Knight) {
    this.allKnights?.push(knight);
  }

  private addKnights(knights: Knight[]) {
    knights.forEach(k => this.allKnights.push(k));
  }

  private logError(errorMessage: string, error: any) {

  }
}
