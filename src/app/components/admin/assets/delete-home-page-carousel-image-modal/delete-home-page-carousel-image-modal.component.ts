import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteHomePageCarouselImageResponse } from 'src/app/models/responses/deleteHomePageCarouselImageResponse';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-delete-home-page-carousel-image-modal',
  templateUrl: './delete-home-page-carousel-image-modal.component.html',
  styleUrls: ['./delete-home-page-carousel-image-modal.component.scss']
})
export class DeleteHomePageCarouselImageModalComponent implements OnInit, OnDestroy {
  @Input() fileName?: string;
  modalHeaderText: string = 'Confirm Delete';
  deleteImageForm: UntypedFormGroup;
  errorSaving: boolean = false;
  errorMessages: string[] = [];
  private deleteHomePageImageSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private assetsService: AssetsService) {
      this.deleteImageForm = new UntypedFormGroup({});
    }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.deleteHomePageImageSubscription) {
      this.deleteHomePageImageSubscription.unsubscribe();
    }
  }

  onSubmitDeleteFile() {
    if (this.fileName) {
      let imageUploadObserver = {
        next: (response: DeleteHomePageCarouselImageResponse) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Deleting image.", err),
        complete: () => console.log('Image deleted.')
      };
  
      this.deleteHomePageImageSubscription = this.assetsService.deleteHomePageCarouselImage(this.fileName).subscribe(imageUploadObserver);
    }
  }

  private passBackResponse(response: DeleteHomePageCarouselImageResponse) {
    this.activeModal.close(response.success);
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
