import { Pipe, PipeTransform } from '@angular/core';
import { KnightName } from '../models/knightName';
@Pipe({
    name: 'convertKnightIdToName',
    pure: true,
    standalone: false
})
export class ConvertKnightIdToNamePipe implements PipeTransform {
  transform(knightId: string, knights: KnightName[]): string {
    let name = '';

    const foundKnight = knights.find(knight => knight.id === knightId);

    if (foundKnight) {
      name = name + `${foundKnight.firstName} ${foundKnight.lastName}`
    }

    return name;
  }
}