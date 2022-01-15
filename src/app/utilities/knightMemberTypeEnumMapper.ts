import { KnightMemberTypeEnums } from "../enums/knightMemberTypeEnums";

export class KnightMemberTypeEnumMapper {
    public static Map(value: string | undefined) {
        if (value === undefined) {
            return KnightMemberTypeEnums.Associate;
        }

        if (value.toLowerCase() === "insurance") {
            return KnightMemberTypeEnums.Insurance;
        }

        return KnightMemberTypeEnums.Associate;
    }
}