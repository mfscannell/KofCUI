import { ActivityInterest } from "../activityInterest";

export interface UpdateKnightActivityInterestsRequest {
  knightId: string;
  activityInterests: ActivityInterest[];
}