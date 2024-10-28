import { ActivityCoordinator } from 'src/app/models/activityCoordinator';
import { ActivityEventNotes } from './activityEventNotes';

export interface Activity {
  activityId?: string;
  activityName: string;
  activityDescription: string;
  activityCategory: string;
  activityCoordinators: ActivityCoordinator[];
  activityEventNotes: ActivityEventNotes[];
  notes: string;
}
