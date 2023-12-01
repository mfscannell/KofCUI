import { LeadershipRoleCategoryEnums } from "../enums/leadershipRoleCategoryEnums";

export interface LeadershipRole {
    leadershipRoleId?: number;
    title: string;
    knightId?: number;
    occupied: boolean;
    leadershipRoleCategory: LeadershipRoleCategoryEnums;
}