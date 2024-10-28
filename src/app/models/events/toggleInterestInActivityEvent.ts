import { CheckedEventTarget } from './checkedEventTarget';

export interface ToggleInterestInActivityEvent extends Event {
  target: CheckedEventTarget | null;
}
