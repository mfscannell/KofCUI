import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightMemberTypeEnumMapper } from 'src/app/utilities/knightMemberTypeEnumMapper';
import { KnightMemberClassEnumMapper } from 'src/app/utilities/knightMemberClassEnumMapper';
import { KnightExcelUpload } from '../models/fileModels/knightExcelUpload';

@Injectable({
  providedIn: 'root',
})
export class ExcelFileReader {
  static ReadKnightsFromFile(file: Blob) {
    return new Promise<Knight[]>((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workBook = XLSX.read(data, {
            type: 'binary',
          });
          const firstSheetName = workBook.SheetNames[0];
          const worksheet = workBook.Sheets[firstSheetName];
          const rawJson = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as KnightExcelUpload[];
          console.log(rawJson);
          const readKnights: Knight[] = [];

          rawJson.forEach(function (rawKnight: KnightExcelUpload) {
            const firstName = rawKnight['First Name'] === undefined ? '' : `${rawKnight['First Name']}`;
            const middleName = rawKnight['Middle Name'] === undefined ? '' : `${rawKnight['Middle Name']}`;
            const lastName = rawKnight['Last Name'] === undefined ? '' : `${rawKnight['Last Name']}`;
            const nameSuffix = rawKnight['Suffix'] === undefined ? '' : `${rawKnight['Suffix']}`;
            const dateOfBirth = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['Birth Date'], true);
            const emailAddress = rawKnight['Email Address'] === undefined ? '' : `${rawKnight['Email Address']}`;
            const cellPhoneNumber =
              rawKnight['Cell Phone Number'] === undefined ? '' : `${rawKnight['Cell Phone Number']}`;

            const homeAddress1 = rawKnight['Address 1'] === undefined ? '' : `${rawKnight['Address 1']}`;
            const homeAddress2 = rawKnight['Address 2'] === undefined ? '' : `${rawKnight['Address 2']}`;
            const city = rawKnight['City'] === undefined ? '' : `${rawKnight['City']}`;
            const stateCode = rawKnight['State Code'] === undefined ? '' : `${rawKnight['State Code']}`;
            const postalCode = rawKnight['Postal Code'] === undefined ? '' : `${rawKnight['Postal Code']}`;
            const countryCode = rawKnight['Country Code'] === undefined ? '' : `${rawKnight['Country Code']}`;

            const memberNumber = rawKnight['Member Number'];
            const mailReturned = rawKnight['Mail Returned'];
            const degree = rawKnight['Degree'];
            const firstDegreeDate = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['First Degree Date'], true);
            const reentryDate = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['Reentry Date'], true);
            const memberType = KnightMemberTypeEnumMapper.Map(rawKnight['Member Type']);
            const memberClass = KnightMemberClassEnumMapper.Map(rawKnight['Member Class']);
            const knightInfo: KnightInfo = {
              memberNumber: memberNumber,
              mailReturned: mailReturned,
              degree: degree,
              firstDegreeDate: firstDegreeDate,
              reentryDate: reentryDate,
              memberType: memberType,
              memberClass: memberClass,
            };
            const mappedKnight: Knight = {
              firstName: firstName,
              middleName: middleName,
              lastName: lastName,
              nameSuffix: nameSuffix,
              dateOfBirth: dateOfBirth,
              emailAddress: emailAddress,
              cellPhoneNumber: cellPhoneNumber,
              homeAddress: {
                address1: homeAddress1,
                address2: homeAddress2,
                city: city,
                stateCode: stateCode,
                postalCode: postalCode,
                countryCode: countryCode,
              },
              knightInfo: knightInfo,
              activityInterests: [],
              memberDues: [],
            };

            readKnights.push(mappedKnight);
          });

          resolve(readKnights);
        } catch {
          reject();
        }
      };
      // TODO MFS resolve deprecated issue
      // https://medium.com/@developerchandan/how-to-upload-excel-data-in-angular-a-step-by-step-guide-1b1acd1e1ad8
      fileReader.readAsBinaryString(file);
    });
  }
}
