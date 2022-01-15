import { KnightMemberClassEnums } from "../enums/knightMemberClassEnums";

export class KnightMemberClassEnumMapper {
    public static Map(value: string | undefined) {
        if (value === undefined) {
            return KnightMemberClassEnums.Paying;
        }

        if (value.toLowerCase() === "honorarylife" || value.toLowerCase() === "honorary life") {
            return KnightMemberClassEnums.HonoraryLife;
        }

        return KnightMemberClassEnums.Paying;
    }
}