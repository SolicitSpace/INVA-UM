import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitDecimals'
})
export class LimitDecimalsPipe implements PipeTransform {

  transform(value: number, numPlaces: number): unknown {
    return value.toFixed(numPlaces);
  }

}
