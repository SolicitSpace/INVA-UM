import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitDecimals'
})
export class LimitDecimalsPipe implements PipeTransform {

  transform(value: number, ...args: number[]): unknown {
    return value.toFixed(args[0]);
  }

}
