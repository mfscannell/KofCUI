import { KnightMemberClassType } from '../types/knight-member-class.type';

export class KnightMemberClassEnumMapper {
  public static Map(value: string | undefined): KnightMemberClassType {
    if (value === undefined) {
      return 'Paying';
    }

    if (value.toLowerCase() === 'honorarylife' || value.toLowerCase() === 'honorary life') {
      return 'HonoraryLife';
    }

    return 'Paying';
  }
}
