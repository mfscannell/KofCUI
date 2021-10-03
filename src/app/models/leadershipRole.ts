export class LeadershipRole {
    leadershipRoleId?: number;
    title: string = "";
    leadershipRoleCategoryId: number = 0;
    knightId?: number;
    occupied: boolean = false;

    public constructor(
        fields?: {
            leadershipRoleId?: number,
            title?: string,
            leadershipRoleCategoryId?: number,
            knightId?: number,
            occupied: boolean
    }) {
        if (fields) {
            this.leadershipRoleId = fields.leadershipRoleId || this.leadershipRoleId;
            this.title = fields.title || this.title;
            this.leadershipRoleCategoryId = fields.leadershipRoleCategoryId || this.leadershipRoleCategoryId;
            this.knightId = fields.knightId || this.knightId;
            this.occupied = fields.occupied || this.occupied;
        }
    }
}