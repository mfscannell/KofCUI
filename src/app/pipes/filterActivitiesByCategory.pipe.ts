import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../models/activity';
@Pipe({
    name: 'filterActivitiesByCategory',
    pure: true,
    standalone: false
})
export class FilterActivitiesByCategoryPipe implements PipeTransform {
  transform(activities: Activity[], activityCategoryValue: string): Activity[] {
    if (!activities) {
      return [];
    }

    console.log(`FilterActivitiesPipe:[${activityCategoryValue}]`);
    console.log(activities);

    return activities
        .filter((x) => x.activityCategory === activityCategoryValue)
        .sort(function (a, b) {
          if (a.activityName.toLowerCase() < b.activityName.toLowerCase()) {
            return -1;
          }

          if (a.activityName.toLowerCase() > b.activityName.toLowerCase()) {
            return 1;
          }

          return 0;
        });
  }
}