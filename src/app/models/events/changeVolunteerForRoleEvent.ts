import { CheckedEventTarget } from "./checkedEventTarget";

export interface ChangeVolunteerForRoleEvent extends Event {
  target: CheckedEventTarget | null;
}