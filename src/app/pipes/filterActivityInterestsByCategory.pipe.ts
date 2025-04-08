import { Pipe, PipeTransform } from '@angular/core';
import { EditActivityInterestFormGroup } from '../forms/editActivityInterestFormGroup';
import { FormGroup } from '@angular/forms';
@Pipe({
    name: 'filterActivityInterestsByCategoryPipe',
    pure: true,
    standalone: false
})
export class FilterActivityInterestsByCategoryPipe implements PipeTransform {
  transform(activities: FormGroup<EditActivityInterestFormGroup>[], activityCategoryValue: string): FormGroup<EditActivityInterestFormGroup>[] {
    if (!activities) {
      return [];
    }

    return activities
        .filter((x) => x.controls.activityCategory.value === activityCategoryValue)
        .sort(function (a, b) {
          if (a.controls.activityName.value.toLowerCase() < b.controls.activityName.value.toLowerCase()) {
            return -1;
          }

          if (a.controls.activityName.value.toLowerCase() > b.controls.activityName.value.toLowerCase()) {
            return 1;
          }

          return 0;
        });
  }
}