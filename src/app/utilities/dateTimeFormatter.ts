export class DateTimeFormatter {
    private static AllMonths: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    static getYearFromDateTime(dateTime: string | undefined) {
        let year = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let date = dateTimeArray[0];
        let dateArray = date.split('-');
        year = dateArray[0];

        let yearNumber = Number(year);

        return yearNumber;
    }

    static getYear(dateTime: string | undefined) {
        // let year = '';

        // if (date === undefined || date === null) {
        //     return undefined;
        // }

        // let dateArray = date.split('-');
        // year = dateArray[0];

        // let yearNumber = Number(year);

        // return yearNumber;
        let year = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let date = dateTimeArray[0];
        let dateArray = date.split('-');
        year = dateArray[0];

        let yearNumber = Number(year);

        return yearNumber;
    }

    /// date: string 'yyyy-mm-dd'
    /// returns month: number January = 1
    static getMonth(dateTime: string | undefined) {
        // let month = '';

        // if (date === undefined || date === null) {
        //     return undefined;
        // }

        // let dateArray = date.split('-');
        // month = dateArray[1];

        // let monthNumber = Number(month);

        // return monthNumber;
        let month = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let date = dateTimeArray[0];
        let dateArray = date.split('-');
        month = dateArray[1];

        let monthNumber = Number(month);

        return monthNumber;
    }

    static getDay(dateTime: string | undefined) {
        // let day = '';

        // if (date === undefined || date === null) {
        //     return undefined;
        // }

        // let dateArray = date.split('-');

        // day = dateArray[2];

        // let indexOfT = day.indexOf('T');

        // if (indexOfT >= 0) {
        //     day = day.substr(0, indexOfT);
        // }

        // let dayNumber = Number(day);

        // return dayNumber;
        let day = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let date = dateTimeArray[0];
        let dateArray = date.split('-');
        day = dateArray[2];

        let dayNumber = Number(day);

        return dayNumber;
    }

    static getHour(dateTime: string | undefined) {
        // let hour = '';

        // if (time) {
        //     let dateArray = time.split(':');
        //     hour = dateArray[0];
        // }

        // let hourNumber = Number(hour);

        // return hourNumber;
        let hour = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let time = dateTimeArray[1];
        let timeArray = time.split(':');
        hour = timeArray[0];

        let hourNumber = Number(hour);

        return hourNumber;
    }

    static getMinute(dateTime: string | undefined) {
        // let minute = '';

        // if (time) {
        //     var dateArray = time.split(':');
        //     minute = dateArray[1];
        // }

        // let minuteNumber = Number(minute);

        // return minuteNumber;
        let minute = '';

        if (dateTime === undefined || dateTime === null) {
            return undefined;
        }

        let dateTimeArray = dateTime.split('T');
        let time = dateTimeArray[1];
        let timeArray = time.split(':');
        minute = timeArray[1];

        let minuteNumber = Number(minute);

        return minuteNumber;
    }

    /// converts an ISO-8601 date to Month DD, YYYY
    /// date: string 'yyyy-mm-dd'
    static ToDisplayedDate(date: string | undefined) {
        let displayedDate = '';

        let year = DateTimeFormatter.getYear(date);
        let month = DateTimeFormatter.getMonth(date);
        let day = DateTimeFormatter.getDay(date);
        let monthName = ''

        if (year === undefined || month === undefined || day === undefined || year === null || month === null || day === null) {
            return undefined;
        }

        if (1 <= month && month <= 12) {
            monthName = DateTimeFormatter.AllMonths[month - 1];
        }

        displayedDate = `${monthName} ${day}, ${year}`;

        return displayedDate;
    }

    static ToDisplayTime(hour: number, minute: number) {
        let displayedTime = '';
        let meridian = 'AM';

        if (hour > 12) {
            hour = hour - 12;
            meridian = 'PM';
        }

        return `${hour}:${minute} ${meridian}`;
    }

    static ToIso8601Date(year: number, month: number, day: number) {
        if (year === undefined || month === undefined || day === undefined || year === null || month === null || day === null) {
            return undefined;
        }

        let yearString = '';

        if (year < 10) {
            yearString = `000${year}`;
        } else if (year < 100) {
            yearString = `00${year}`;
        } else if (year < 1000) {
            yearString = `0${year}`;
        } else {
            yearString = `${year}`;
        }

        let monthString = month < 10 ? `0${month}` : `${month}`;
        let dayString = day < 10 ? `0${day}` : `${day}`;
        let iso8601Date = `${yearString}-${monthString}-${dayString}`;

        return iso8601Date;
    }

    static ToIso8601Time(hour: number, minute: number) {
        let hourString = hour < 10 ? `0${hour}` : `${hour}`;
        let minuteString = minute < 10 ? `0${minute}` : `${minute}`;
        let iso8601Time = `${hourString}:${minuteString}`;

        return iso8601Time;
    }

    static ToIso8601DateTime(year: number, month: number, day: number, hour: number, minute: number) {
        if (year === undefined || month === undefined || day === undefined || year === null || month === null || day === null) {
            return undefined;
        }

        let yearString = '';

        if (year < 10) {
            yearString = `000${year}`;
        } else if (year < 100) {
            yearString = `00${year}`;
        } else if (year < 1000) {
            yearString = `0${year}`;
        } else {
            yearString = `${year}`;
        }

        let monthString = month < 10 ? `0${month}` : `${month}`;
        let dayString = day < 10 ? `0${day}` : `${day}`;
        let hourString = hour < 10 ? `0${hour}` : `${hour}`;
        let minuteString = minute < 10 ? `0${minute}` : `${minute}`;
        let iso8601DateTime = `${yearString}-${monthString}-${dayString}T${hourString}:${minuteString}`;

        return iso8601DateTime;
    }

    /// converts a number to a date in 'YYYY-MM-DD' format. 
    /// 1 equates to 1900-01-01.
    /// Excel has a bug thinking 1900 is a leap year.
    static MapNumberToIso8601Date(dateNumber: number | undefined, excelBugExists: boolean) {
        let year = 1900;
        let date: string | undefined = '';

        if (dateNumber === undefined || dateNumber === null) {
            return undefined;
        }

        let yearFound = false;

        while (!yearFound) {
            if (dateNumber <= 365 && !DateTimeFormatter.isYearLeapYear(year, excelBugExists)) {
                yearFound = true;
            }

            if (dateNumber <= 366 && DateTimeFormatter.isYearLeapYear(year, excelBugExists)) {
                yearFound = true;
            }

            if (!yearFound) {
                if (DateTimeFormatter.isYearLeapYear(year, excelBugExists)) {
                    dateNumber = dateNumber - 366;
                } else {
                    dateNumber = dateNumber - 365;
                }

                year++;
            }
        }

        //find month
        let monthFound = false;
        let month = 1;
        let day = 1;

        while (!monthFound) {
            if (month === 1 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 2 && 
                ((dateNumber <= 29 && DateTimeFormatter.isYearLeapYear(year, excelBugExists)) || 
                    (dateNumber <= 28 && !DateTimeFormatter.isYearLeapYear(year, excelBugExists)))) {
                monthFound = true;
                day = dateNumber;
            }  else if (month === 3 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 4 && dateNumber <= 30) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 5 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 6 && dateNumber <= 30) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 7 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 8 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 9 && dateNumber <= 30) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 10 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 11 && dateNumber <= 30) {
                monthFound = true;
                day = dateNumber;
            } else if (month === 12 && dateNumber <= 31) {
                monthFound = true;
                day = dateNumber;
            } else if (dateNumber <= 31) {
                //TODO error!!! No month found!
            } else {
                dateNumber = dateNumber - DateTimeFormatter.getDaysInMonth(year, month, excelBugExists);
                month++;
            }
        }

        date = DateTimeFormatter.ToIso8601Date(year, month, day);

        return date;
    }

    static getDaysInMonth(year: number, month: number, excelBugExists: boolean = false) {
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
        } else if (month === 2 && DateTimeFormatter.isYearLeapYear(year, excelBugExists)) {
            return 29;
        } else if (month === 2 && !DateTimeFormatter.isYearLeapYear(year, excelBugExists)) {
            return 28;
        } else {
            return 0;
        }
    }

    static isYearLeapYear(year: number, excelBugExists: boolean = false) {
        let isLeapYear = false;

        if (excelBugExists && year === 1900) {
            isLeapYear = true;
        } else if (year % 4 === 0) {
            isLeapYear = true;

            if (year % 100 === 0 && year % 400 !== 0) {
                isLeapYear = false;
            }
        }

        return isLeapYear;
    }

    //day: 1-31
    //month: 1-12
    //year: 2021 for 2021
    //returns day of week with Sunday = 0 and Saturday = 6
    static getDayOfWeek(year: number, month: number, day: number) {
        const numbers = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        const commonYearMonthOffsets = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
        const leapYearMonthOffsets = [0, 3, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6];

        let adjustedYear = year - 1;

        let dayOfWeek = (day + 
                (DateTimeFormatter.isYearLeapYear(year) ? leapYearMonthOffsets[month - 1] : commonYearMonthOffsets[month - 1]) + 
                5 * ((year - 1) % 4) + 
                4 * ((year - 1) % 100) +
                6 * ((year - 1) % 400)
               ) % 7;

        return dayOfWeek;
    }
}