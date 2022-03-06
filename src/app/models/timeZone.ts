import { StringDropDownOption } from "./stringDropDownOption";

export class TimeZone extends StringDropDownOption {
  constructor(fields?: {
    id: string,
    displayName: string
  }) {
    super(fields);
  }
}