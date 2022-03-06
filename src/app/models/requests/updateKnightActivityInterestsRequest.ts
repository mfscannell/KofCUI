import { ActivityInterest } from "../activityInterest";

export class UpdateKnightActivityInterestsRequest{
  knightId: number = 0;
  activityInterests: ActivityInterest[] = [];

  constructor(fields?: {
    knightId: number,
    activityInterests: ActivityInterest[]}) {
      if (fields) {
        this.knightId = fields.knightId || this.knightId;
        this.activityInterests = fields.activityInterests || this.activityInterests;
      }
  }
}