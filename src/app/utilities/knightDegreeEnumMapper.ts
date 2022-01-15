import { KnightDegreeEnums } from "../enums/knightDegreeEnums";

export class KnightDegreeEnumMapper {
    public static Map(value: string | undefined) {
        if (value === undefined) {
            return KnightDegreeEnums.First;
        }

        if (value.toLowerCase() === "fourth") {
            return KnightDegreeEnums.Fourth;
        }

        if (value.toLowerCase() === "third") {
            return KnightDegreeEnums.Third;
        }

        if (value.toLowerCase() === "second") {
            return KnightDegreeEnums.Second;
        }

        return KnightDegreeEnums.First;
    }
}