import { LeadershipRoleCategoryEnums } from '../enums/leadershipRoleCategoryEnums';

export interface LeadershipRole {
  id: string;
  title: string;
  knightId: string;
  occupied: boolean;
  leadershipRoleCategory: LeadershipRoleCategoryEnums;
}
