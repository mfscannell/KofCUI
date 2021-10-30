import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Address } from 'src/app/models/address';
import { AddressesService } from 'src/app/services/addresses.service';
import { Country } from 'src/app/models/country';
import { AddressState } from 'src/app/models/addressState';

@Component({
  selector: 'kofc-edit-activity-event-location-modal',
  templateUrl: './edit-activity-event-location-modal.component.html',
  styleUrls: ['./edit-activity-event-location-modal.component.css']
})
export class EditActivityEventLocationModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() locationAddress?: Address;
  editActivityEventLocationFormGroup: FormGroup;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  updateAddressSubscription?: Subscription;
  createAddressSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private addressesService: AddressesService) {
    this.editActivityEventLocationFormGroup = new FormGroup({
      addressId: new FormControl(''),
      addressName: new FormControl(''),
      address1: new FormControl(''),
      address2: new FormControl(''),
      addressCity: new FormControl(''),
      addressStateCode: new FormControl(''),
      addressPostalCode: new FormControl(''),
      addressCountryCode: new FormControl('')
    });
  }

  ngOnInit() {
    if (this.locationAddress) {
      this.editActivityEventLocationFormGroup.patchValue({
        addressId: this.locationAddress.addressId,
          addressName: this.locationAddress.addressName,
          address1: this.locationAddress.address1,
          address2: this.locationAddress.address2,
          addressCity: this.locationAddress.addressCity,
          addressStateCode: this.locationAddress.addressStateCode,
          addressPostalCode: this.locationAddress.addressPostalCode,
          addressCountryCode: this.locationAddress.addressCountryCode
      });
    }
  }

  ngOnDestroy() {
    if (this.createAddressSubscription) {
      this.createAddressSubscription.unsubscribe();
    }

    if (this.updateAddressSubscription) {
      this.updateAddressSubscription.unsubscribe();
    }
  }

  onSubmitEditActivityEventLocation() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updateAddressRequest = this.mapFormToAddress();
      
      this.updateActivityEventAddress(updateAddressRequest);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let createAddressRequest = this.mapFormToAddress();

      this.createActivityEventAddress(createAddressRequest);
    }
  }

  private mapFormToAddress() {
    let rawForm = this.editActivityEventLocationFormGroup.getRawValue();
    let locationAddress = new Address({
      addressId: rawForm.addressId,
      addressName: rawForm.addressName,
      address1: rawForm.address1,
      address2: rawForm.address2,
      addressCity: rawForm.addressCity,
      addressStateCode: rawForm.addressStateCode,
      addressPostalCode: rawForm.addressPostalCode,
      addressCountryCode: rawForm.addressCountryCode
    });

    return locationAddress;
  }

  private createActivityEventAddress(addressForEvent: Address) {
    let addressObserver = {
      next: (createdAddress: Address) => this.passBack(createdAddress),
      error: (err: any) => this.logError('Error creating address for event', err),
      complete: () => console.log('Activity event address created.')
    };

    this.createAddressSubscription = this.addressesService.createAddressForEvent(addressForEvent).subscribe(addressObserver);
  }

  private updateActivityEventAddress(addressForEvent: Address) {
    let addressObserver = {
      next: (updatedAddress: Address) => this.passBack(updatedAddress),
      error: (err: any) => this.logError('Error updating address for event', err),
      complete: () => console.log('Activity event address updated.')
    };

    this.updateAddressSubscription = this.addressesService.updateAddressForEvent(addressForEvent).subscribe(addressObserver);
  }

  private passBack(address: Address) {
    this.activeModal.close(address);
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
