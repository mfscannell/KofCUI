import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryFormOption } from '../models/inputOptions/countryFormOption';

@Injectable({
  providedIn: 'root'
})

export class FormsService {
  constructor(private http: HttpClient) {

  }

  getCountryFormOptions(): Observable<CountryFormOption[]> {
    return this.http.get<CountryFormOption[]>('forms/countryFormOptions');
  }
}