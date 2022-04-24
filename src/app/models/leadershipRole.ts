import { LeadershipRoleCategoryEnums } from "../enums/leadershipRoleCategoryEnums";

export class LeadershipRole {
    leadershipRoleId?: number;
    title: string = "";
    knightId?: number;
    occupied: boolean = false;
    leadershipRoleCategory: LeadershipRoleCategoryEnums = LeadershipRoleCategoryEnums.Director;

    public constructor(
        fields?: {
            leadershipRoleId?: number,
            title?: string,
            knightId?: number,
            occupied: boolean,
            leadershipRoleCategory: LeadershipRoleCategoryEnums
    }) {
        if (fields) {
            this.leadershipRoleId = fields.leadershipRoleId || this.leadershipRoleId;
            this.title = fields.title || this.title;
            this.knightId = fields.knightId || this.knightId;
            this.occupied = fields.occupied || this.occupied;
            this.leadershipRoleCategory = fields.leadershipRoleCategory || this.leadershipRoleCategory;
        }
    }
}