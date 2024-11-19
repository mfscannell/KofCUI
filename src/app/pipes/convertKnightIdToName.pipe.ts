import { Pipe, PipeTransform } from '@angular/core';
import { Knight } from '../models/knight';
@Pipe({
  name: 'convertKnightIdToName',
  pure: true
})
export class ConvertKnightIdToNamePipe implements PipeTransform {
  transform(knightId: string, knights: Knight[]): string {
    let name = '';

    const foundKnight = knights.find(knight => knight.id === knightId);

    if (foundKnight) {
      name = name + `${foundKnight.firstName} ${foundKnight.lastName}`
    }

    return name;
  }
}