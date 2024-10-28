import { StringEventTarget } from './stringEventTarget';

export interface SearchPartialNameEvent extends Event {
  target: StringEventTarget | null;
}
