import { LeadershipRoleCategory } from '../types/leadership-role-category.type';

export interface LeadershipRole {
  id: string;
  title: string;
  knightId: string;
  occupied: boolean;
  leadershipRoleCategory: LeadershipRoleCategory;
}
