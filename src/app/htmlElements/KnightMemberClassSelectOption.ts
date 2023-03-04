import {KnightMemberClassEnums} from 'src/app/enums/knightMemberClassEnums';

export class KnightMemberClassSelectOption {
    public value: KnightMemberClassEnums = KnightMemberClassEnums.Paying;
    public displayName: string = '';

    static Paying = new KnightMemberClassSelectOption({
        value: KnightMemberClassEnums.Paying,
        displayName: 'Paying'
    });
    static HonoraryLife = new KnightMemberClassSelectOption({
        value: KnightMemberClassEnums.HonoraryLife,
        displayName: 'Honorary Life'
    });
    static AllOptions: KnightMemberClassSelectOption[] = [
        KnightMemberClassSelectOption.Paying,
        KnightMemberClassSelectOption.HonoraryLife
    ];

    constructor(fields: {
        value: KnightMemberClassEnums, 
        displayName: string}) {
            if (fields) {
                this.value = fields.value || this.value;
                this.displayName = fields.displayName || this.displayName;
            }
    }
}