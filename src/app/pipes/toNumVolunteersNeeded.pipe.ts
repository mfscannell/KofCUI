import { Pipe, PipeTransform } from '@angular/core';
import { VolunteerSignUpRole } from '../models/volunteerSignUpRole';
@Pipe({
    name: 'toNumVolunteersNeeded',
    pure: true,
    standalone: false
})
export class ToNumVolunteersNeededPipe implements PipeTransform {
  transform(role: VolunteerSignUpRole | undefined): string {
    if (!role) {
      return '';
    }

    return `${role.numberOfVolunteersNeeded} ${role.roleTitle}(s)`;
  }
}