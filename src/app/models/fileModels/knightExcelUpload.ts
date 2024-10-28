import { KnightDegree } from 'src/app/types/knight-degree.type';

export interface KnightExcelUpload {
  'First Name': string;
  'Middle Name': string;
  'Last Name': string;
  Suffix: string;
  'Birth Date': number;
  'Email Address': string;
  'Cell Phone Number': string;
  'Address 1': string;
  'Address 2': string;
  City: string;
  'State Code': string;
  'Postal Code': string;
  'Country Code': string;
  'Member Number': number;
  'Mail Returned': boolean;
  Degree: KnightDegree;
  'First Degree Date': number;
  'Reentry Date': number;
  'Member Type': string;
  'Member Class': string;
}
