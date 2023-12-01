import { KnightMemberTypeType } from "../types/knight-member-type.type";

export class KnightMemberTypeEnumMapper {
    public static Map(value: string | undefined): KnightMemberTypeType {
        if (value === undefined) {
            return 'Associate';
        }

        if (value.toLowerCase() === "insurance") {
            return 'Insurance';
        }

        return 'Associate';
    }
}