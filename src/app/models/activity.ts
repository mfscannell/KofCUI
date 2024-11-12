import { ActivityEventNotes } from './activityEventNotes';

export interface Activity {
  activityId?: string;
  activityName: string;
  activityDescription: string;
  activityCategory: string;
  activityCoordinators: string[];
  activityEventNotes: ActivityEventNotes[];
  notes: string;
}
