export class LeadershipRoleCategory {
    leadershipRoleCategoryId: number = 0;
    categoryName: string = '';

    public constructor(
        fields?: {
            leadershipRoleCategoryId? : number,
            categoryName?: string
    }) {
        if (fields) {
            this.leadershipRoleCategoryId = fields.leadershipRoleCategoryId || this.leadershipRoleCategoryId;
            this.categoryName = fields.categoryName || this.categoryName;
        }
    }
}