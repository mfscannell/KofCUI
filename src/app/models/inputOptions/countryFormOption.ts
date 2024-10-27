import { GenericFormOption } from "./genericFormOption";

export interface CountryFormOption extends GenericFormOption {
  administrativeDivisionLabel: string;
  administrativeDivisions: GenericFormOption[];
}