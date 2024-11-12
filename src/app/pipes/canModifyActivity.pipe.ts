import { Pipe, PipeTransform } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
@Pipe({
  name: 'canModifyActivity',
  pure: true
})
export class CanModifyActivityPipe implements PipeTransform {
  constructor(private permissionsService: PermissionsService) {

  }
  transform(action: 'add' | 'edit', activityId?: string): boolean {
    if (action === 'add') {
      return this.permissionsService.canAddActivity();
    }

    if (action === 'edit') {
      return this.permissionsService.canEditActivity(activityId);
    }

    return false;
  }
}