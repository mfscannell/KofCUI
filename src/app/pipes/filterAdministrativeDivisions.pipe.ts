import { Pipe, PipeTransform } from '@angular/core';
import { CountryFormOption } from '../models/inputOptions/countryFormOption';
import { GenericFormOption } from '../models/inputOptions/genericFormOption';
@Pipe({
    name: 'filterAdministrativeDivisions',
    pure: true,
    standalone: false
})
export class FilterAdministrativeDivisionsPipe implements PipeTransform {
  transform(countryFormOptions: CountryFormOption[], countryCode?: string): GenericFormOption[] {
    if (!countryCode) {
      return [];
    }

    const filteredCountryFormOptions = countryFormOptions.filter((cfo) => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }
}