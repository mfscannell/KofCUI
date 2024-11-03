import { CreateActivityCoordinatorRequest } from "./createActivityCoordinatorRequest";

export interface CreateActivityRequest{
  activityName: string;
  activityDescription: string;
  activityCategory: string;
  activityCoordinators: CreateActivityCoordinatorRequest[];
  notes: string;
}