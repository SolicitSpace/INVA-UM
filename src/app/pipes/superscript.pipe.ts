import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'superscript',
})
export class SuperscriptPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return value.replace(/(\d)(st|nd|rd|th)/g, '$1<sup>$2</sup>');
  }
}
