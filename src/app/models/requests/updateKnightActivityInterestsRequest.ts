import { ActivityInterest } from '../activityInterest';

export interface UpdateKnightActivityInterestsRequest {
  knightId: string;
  // TODO MFS need to change this 
  activityInterests: ActivityInterest[];
}
