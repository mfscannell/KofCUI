import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Address } from 'src/app/models/address';

@Injectable({
    providedIn: 'root'
})

export class AddressesService {
    constructor(private http: HttpClient) {

    }

    getAllAddressesForEvents(): Observable<Address[]> {
        return this.http.get<Address[]>('addresses/forEvents');
    }

    createAddressForEvent(address: Address): Observable<Address> {
        return this.http.post<Address>('addresses/forEvents', address);
    }

    updateAddressForEvent(updatedAddressForEvent: Address): Observable<Address> {
        return this.http.put<Address>(`addresses/forEvents/${updatedAddressForEvent.addressId}`, updatedAddressForEvent);
    }
}