import { Pipe, PipeTransform } from '@angular/core';
import { LeadershipRole } from '../models/leadershipRole';
import { LeadershipRoleCategory } from '../types/leadership-role-category.type';
@Pipe({
    name: 'filterLeadershipRoles',
    pure: true,
    standalone: false
})
export class FilterLeadershipRolesPipe implements PipeTransform {
  transform(leadershipRoles: LeadershipRole[], leadershipRoleCategory: LeadershipRoleCategory): LeadershipRole[] {
    return leadershipRoles.filter((x) => x.leadershipRoleCategory === leadershipRoleCategory);
  }
}