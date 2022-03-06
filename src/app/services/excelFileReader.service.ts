import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

import { StreetAddress } from 'src/app/models/streetAddress';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { KnightDegreeEnumMapper } from 'src/app/utilities/knightDegreeEnumMapper'
import { KnightMemberTypeEnumMapper } from 'src/app/utilities/knightMemberTypeEnumMapper';
import { KnightMemberClassEnumMapper } from 'src/app/utilities/knightMemberClassEnumMapper';

@Injectable({
    providedIn: 'root'
})

export class ExcelFileReader {
    static ReadKnightsFromFile(file: Blob) {
        return new Promise<Knight[]>((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                let data = e.target?.result;
                let workBook = XLSX.read(
                    data, 
                    {
                        type: 'binary'
                    });
                let firstSheetName = workBook.SheetNames[0];
                let worksheet = workBook.Sheets[firstSheetName];
                let rawJson = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                let readKnights: Knight[] = [];

                rawJson.forEach(function(rawKnight: any) {
                    let firstName = rawKnight['First Name'] === undefined ? "" : `${rawKnight['First Name']}`;
                    let middleName = rawKnight['Middle Name'] === undefined ? "" : `${rawKnight['Middle Name']}`;
                    let lastName = rawKnight['Last Name'] === undefined ? "" : `${rawKnight['Last Name']}`;
                    let nameSuffix = rawKnight['Suffix'] === undefined ? "" : `${rawKnight['Suffix']}`;
                    let dateOfBirth = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['Birth Date'], true);
                    let emailAddress = rawKnight['Email Address'] === undefined ? "" : `${rawKnight['Email Address']}`;
                    let cellPhoneNumber = rawKnight['Cell Phone Number'] === undefined ? "" : `${rawKnight['Cell Phone Number']}`;

                    let homeAddress1 = rawKnight['Address 1'] === undefined ? "" : `${rawKnight['Address 1']}`;
                    let homeAddress2 = rawKnight['Address 2'] === undefined ? "" : `${rawKnight['Address 2']}`;
                    let city = rawKnight['City'] === undefined ? "" : `${rawKnight['City']}`;
                    let stateCode = rawKnight['State Code'] === undefined ? "" : `${rawKnight['State Code']}`;
                    let postalCode = rawKnight['Postal Code'] === undefined ? "" : `${rawKnight['Postal Code']}`;
                    let countryCode = rawKnight['Country Code'] === undefined ? "" : `${rawKnight['Country Code']}`;

                    let memberNumber = rawKnight['Member Number'];
                    let mailReturned = rawKnight['Mail Returned'];
                    let degree = KnightDegreeEnumMapper.Map(rawKnight['Degree']);
                    let firstDegreeDate = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['First Degree Date'], true);
                    let reentryDate = DateTimeFormatter.MapNumberToIso8601Date(rawKnight['Reentry Date'], true);
                    let memberType = KnightMemberTypeEnumMapper.Map(rawKnight['Member Type']);
                    let memberClass = KnightMemberClassEnumMapper.Map(rawKnight['Member Class']);
                    let mappedKnight = new Knight({
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        nameSuffix: nameSuffix,
                        dateOfBirth: dateOfBirth,
                        emailAddress: emailAddress,
                        cellPhoneNumber: cellPhoneNumber,
                        homeAddress: new StreetAddress({
                            address1: homeAddress1,
                            address2: homeAddress2,
                            city: city,
                            stateCode: stateCode,
                            postalCode: postalCode,
                            countryCode: countryCode
                        }),
                        knightInfo: new KnightInfo({
                            memberNumber: memberNumber,
                            mailReturned: mailReturned,
                            degree: degree,
                            firstDegreeDate: firstDegreeDate,
                            reentryDate: reentryDate,
                            memberType: memberType,
                            memberClass: memberClass
                        })
                    });

                    readKnights.push(mappedKnight);
                });

                resolve(readKnights);
            }
            fileReader.readAsBinaryString(file);
        });
    }
}