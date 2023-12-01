import { AdministrativeDivisionFormOption } from "./administrativeDivisionFormOption";
import { GenericFormOption } from "./genericFormOption";

export interface CountryFormOption extends GenericFormOption {
  administrativeDivisionLabel: string;
  administrativeDivisions: AdministrativeDivisionFormOption[];
}