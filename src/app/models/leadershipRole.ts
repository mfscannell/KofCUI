import { LeadershipRoleCategoryEnums } from '../enums/leadershipRoleCategoryEnums';

export interface LeadershipRole {
  id?: string;
  title: string;
  knightId?: number;
  occupied: boolean;
  leadershipRoleCategory: LeadershipRoleCategoryEnums;
}
