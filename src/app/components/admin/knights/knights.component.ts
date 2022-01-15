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

@Component({
  selector: 'knights',
  templateUrl: './knights.component.html',
  styleUrls: ['./knights.component.css']
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

  openEditKnightModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knight = knight;
    modalRef.componentInstance.modalHeaderText = 'Editing Knight';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result: Knight) => {
      if (result) {
        this.updateKnightInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Modal.');
        console.log(error);
      }
    });
  }

  private updateKnightInList(knight: Knight) {
    let index = this.allKnights?.findIndex(x => x.knightId == knight.knightId)

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index] = knight;
    }
  }

  openCreateKnightModal() {
    const modalRef = this.modalService.open(EditKnightModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.modalHeaderText = 'Adding Knight';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
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
