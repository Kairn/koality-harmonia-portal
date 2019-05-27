import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'u8'
})
export class U8Pipe implements PipeTransform {

  transform(chars: string, args?: any): string {
    let result = chars;
    try {
      result = decodeURIComponent(escape(chars));
    } catch (e) {
      return chars;
    }
    return result;
  }

}
