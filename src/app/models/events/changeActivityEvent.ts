import { StringEventTarget } from "./stringEventTarget";

export interface ChangeActivityEvent extends Event {
  target: StringEventTarget | null;
}