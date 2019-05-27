import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'u8'
})
export class U8Pipe implements PipeTransform {

  transform(chars: string, args?: any): string {
    return decodeURIComponent(escape(chars));
  }

}
