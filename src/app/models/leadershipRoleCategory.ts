import { LeadershipRoleCategoryEnums } from "../enums/leadershipRoleCategoryEnums";
import { LeadershipRole } from "./leadershipRole";

export class LeadershipRoleCategory {
    categoryName: LeadershipRoleCategoryEnums = LeadershipRoleCategoryEnums.Director;
    leadershipRoles: LeadershipRole[] = [];

    public constructor(
        fields?: {
            categoryName?: LeadershipRoleCategoryEnums,
            leadershipRoles: LeadershipRole[]
    }) {
        if (fields) {
            this.categoryName = fields.categoryName || this.categoryName;
            this.leadershipRoles = fields.leadershipRoles || this.leadershipRoles;
        }
    }
}