import { ActivityInterest } from "../activityInterest";

export interface UpdateKnightActivityInterestsRequest {
  knightId: number;
  activityInterests: ActivityInterest[];
}