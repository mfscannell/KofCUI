import { Pipe, PipeTransform } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
@Pipe({
    name: 'canModifyMemberDuesAmounts',
    pure: true,
    standalone: false
})
export class CanModifyMemberDuesAmountsPipe implements PipeTransform {
  constructor(private permissionsService: PermissionsService) {

  }
  transform(action: 'add' | 'edit'): boolean {
    if (action === 'add') {
      return this.permissionsService.canAddMemberDuesAmounts();
    }

    if (action === 'edit') {
      return this.permissionsService.canEditMemberDuesAmounts();
    }

    return false;
  }
}