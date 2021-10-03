import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

import { Address } from 'src/app/models/address';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { KnightDegreeEnums } from '../enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from '../enums/knightMemberTypeEnums';
import { DateTimeFormatter } from '../utilities/dateTimeFormatter';

@Injectable({
    providedIn: 'root'
})

export class ExcelFileReader {
    static ReadKnightsFromFile(file: Blob) {
        let knights: Knight[] = [];
        const fileReader = new FileReader();

        //fileReader.readAsArrayBuffer(filePath);
        fileReader.onload = (e) => {
            //let data = fileReader.result;
            let data = e.target?.result;
            let workBook = XLSX.read(
                data, 
                {
                    type: 'binary'
                });
            let firstSheetName = workBook.SheetNames[0];
            let worksheet = workBook.Sheets[firstSheetName];
            let rawJson = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            // let jsonData = workBook.SheetNames.reduce((initial, name) => {
            //     const sheet = workBook.Sheets[name];
            //     initial[name] = XLSX.utils.sheet_to_json(sheet);
            //     return initial;
            // }, {});
            console.log(rawJson);

            rawJson.forEach(function(rawKnight: any) {
                let mappedKnight = new Knight({
                    firstName: rawKnight['First Name'],
                    middleName: rawKnight['Middle Name'],
                    lastName: rawKnight['Last Name'],
                    nameSuffix: rawKnight['Suffix'],
                    dateOfBirth: DateTimeFormatter.MapNumberToDate(rawKnight['Birth Date']),
                    emailAddress: rawKnight['Email Address'], //TODO needed in excel file
                    cellPhoneNumber: rawKnight['Cell Phone Number'], //TODO needed in excel file
                    homeAddress: new Address({
                        address1: rawKnight['Street Address'],
                        address2: '',
                        addressCity: rawKnight['City'],
                        addressStateCode: rawKnight['State'],
                        addressPostalCode: rawKnight['Postal Code'],
                        addressCountryCode: 'US'
                    }),
                    knightInfo: new KnightInfo({
                        memberNumber: rawKnight['Member Number'],
                        mailReturned: rawKnight['Mail Returned'],
                        degree: KnightDegreeEnums.First, //TODO need to read from raw Knight
                        firstDegreeDate: '', //TODO need in file
                        reentryDate: rawKnight['Reentry Date'], //TODO need to map from number 1 to January 1, 1900
                        memberType: rawKnight['Member Type'] == 'Insurance' ? KnightMemberTypeEnums.Insurance : KnightMemberTypeEnums.Associate
                    })
                });
            });

            let readKnights: Knight[] = [];


            let something = 5;
        }
        fileReader.readAsBinaryString(file);
    }
}