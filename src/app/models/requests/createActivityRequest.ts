export interface CreateActivityRequest{
  activityName: string;
  activityDescription: string;
  activityCategory: string;
  activityCoordinators: string[];
  notes: string;
}