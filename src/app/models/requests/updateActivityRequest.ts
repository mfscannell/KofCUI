export interface UpdateActivityRequest {
  activityId: string;
  activityName: string;
  activityDescription: string;
  activityCategory: string;
  activityCoordinators: string[];
  notes: string;
}