import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { UploadHomePageImageResponse } from 'src/app/models/responses/uploadHomePageImageResponse';
import { AssetsService } from 'src/app/services/assets.service';
import { DeleteHomePageCarouselImageModalComponent } from './delete-home-page-carousel-image-modal/delete-home-page-carousel-image-modal.component';
import { UploadHomePageCarouselImageModalComponent } from './upload-home-page-carousel-image-modal/upload-home-page-carousel-image-modal.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnDestroy {
  showErrorMessage: boolean = false;
  errorMessages: string[] = [];
  showSuccessMessage: boolean = false;
  private uploadHomePageImageSubscription?: Subscription;

  constructor(
    public assetsService: AssetsService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.uploadHomePageImageSubscription) {
      this.uploadHomePageImageSubscription.unsubscribe();
    }
  }

  imageSource(image: EncodedFile) {
    let imgSrc = `data:${image.fileType};${image.encoding},${image.data}`;
    return imgSrc;
  }

  openUploadHomePageCarouselImageModal() {
    const modalRef = this.modalService.open(UploadHomePageCarouselImageModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.result.then((result: EncodedFile) => {
      if (result) {
        this.handleUploadHomePageImageResponse(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from uploading home page carousel modal.', error);
      }
    });
  }

  openConfirmDeleteHomePageCarouselImage(index: number) {
    const modalRef = this.modalService.open(DeleteHomePageCarouselImageModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    let homePageImage = this.assetsService.getHomePageCarouselImages()[index];
    let fileName = homePageImage.fileName;
    modalRef.componentInstance.fileName = fileName;
    modalRef.result.then((result: boolean) => {
      if (result) {
        this.assetsService.removeHomePageCarouselImage(index);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from deleting home page carousel modal.', error);
      }
    });
  }

  private handleUploadHomePageImageResponse(response: EncodedFile) {
    this.assetsService.appendHomePageCarouselImage(response);
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
    
    this.showErrorMessage = true;
  }
}
