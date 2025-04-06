import { Pipe, PipeTransform } from '@angular/core';
import { LeadershipRole } from '../models/leadershipRole';
import { LeadershipRoleCategoryEnums } from '../enums/leadershipRoleCategoryEnums';
@Pipe({
    name: 'filterLeadershipRoles',
    pure: true,
    standalone: false
})
export class FilterLeadershipRolesPipe implements PipeTransform {
  transform(leadershipRoles: LeadershipRole[], leadershipRoleCategory: LeadershipRoleCategoryEnums): LeadershipRole[] {
    return leadershipRoles.filter((x) => x.leadershipRoleCategory === leadershipRoleCategory);
  }
}