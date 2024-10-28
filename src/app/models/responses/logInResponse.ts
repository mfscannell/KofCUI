import { Knight } from '../knight';

export interface LogInResponse {
  webToken: string;
  knight?: Knight;
  roles: string[];
}
