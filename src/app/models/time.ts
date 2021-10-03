export class Time {
    displayedTime: string = '';
    hourOfDay: number = 0;
    minuteOfHour: number = 0;

    public constructor(
        fields?: {
            displayedTime? : string
            hourOfDay? : number
            minuteOfHour? : number
    }) {
        if (fields) {
            this.displayedTime = fields.displayedTime || this.displayedTime;
            this.hourOfDay = fields.hourOfDay || this.hourOfDay;
            this.minuteOfHour = fields.minuteOfHour || this.minuteOfHour;
        }
    }

    static Midnight: Time = new Time({
        displayedTime: '12:00 AM',
        hourOfDay: 0
    });
    static OneAm: Time = new Time({
        displayedTime: '1:00 AM',
        hourOfDay: 1
    });
    static TwoAm: Time = new Time({
        displayedTime: '2:00 AM',
        hourOfDay: 2
    });
    static ThreeAm: Time = new Time({
        displayedTime: '3:00 AM',
        hourOfDay: 3
    });
    static FourAm: Time = new Time({
        displayedTime: '4:00 AM',
        hourOfDay: 4
    });
    static FiveAm: Time = new Time({
        displayedTime: '5:00 AM',
        hourOfDay: 5
    });
    static SixAm: Time = new Time({
        displayedTime: '6:00 AM',
        hourOfDay: 6
    });
    static SevenAm: Time = new Time({
        displayedTime: '7:00 AM',
        hourOfDay: 7
    });
    static EightAm: Time = new Time({
        displayedTime: '8:00 AM',
        hourOfDay: 8
    });
    static NineAm: Time = new Time({
        displayedTime: '9:00 AM',
        hourOfDay: 9
    });
    static TenAm: Time = new Time({
        displayedTime: '10:00 AM',
        hourOfDay: 10
    });
    static ElevenAm: Time = new Time({
        displayedTime: '11:00 AM',
        hourOfDay: 11
    });
    static Noon: Time = new Time({
        displayedTime: '12:00 PM',
        hourOfDay: 12
    });
    static OnePm: Time = new Time({
        displayedTime: '1:00 PM',
        hourOfDay: 13
    });
    static TwoPm: Time = new Time({
        displayedTime: '2:00 PM',
        hourOfDay: 14
    });
    static ThreePm: Time = new Time({
        displayedTime: '3:00 PM',
        hourOfDay: 15
    });
    static FourPm: Time = new Time({
        displayedTime: '4:00 PM',
        hourOfDay: 16
    });
    static FivePm: Time = new Time({
        displayedTime: '5:00 PM',
        hourOfDay: 17
    });
    static SixPm: Time = new Time({
        displayedTime: '6:00 PM',
        hourOfDay: 18
    });
    static SevenPm: Time = new Time({
        displayedTime: '7:00 PM',
        hourOfDay: 19
    });
    static EightPm: Time = new Time({
        displayedTime: '8:00 PM',
        hourOfDay: 20
    });
    static NinePm: Time = new Time({
        displayedTime: '9:00 PM',
        hourOfDay: 21
    });
    static TenPm: Time = new Time({
        displayedTime: '10:00 PM',
        hourOfDay: 22
    });
    static ElevenPm: Time = new Time({
        displayedTime: '11:00 PM',
        hourOfDay: 23
    });

    static AllTimes: Time[] = [
        Time.Midnight,
        Time.OneAm,
        Time.TwoAm,
        Time.ThreeAm,
        Time.FourAm,
        Time.FiveAm,
        Time.SixAm,
        Time.SevenAm,
        Time.EightAm,
        Time.NineAm,
        Time.TenAm,
        Time.ElevenAm,
        Time.Noon,
        Time.OnePm,
        Time.TwoPm,
        Time.ThreePm,
        Time.FourPm,
        Time.FivePm,
        Time.SixPm,
        Time.SevenPm,
        Time.EightPm,
        Time.NinePm,
        Time.TenPm,
        Time.ElevenPm
    ];
}