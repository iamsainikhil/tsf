import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordExtract'
})
export class WordExtractPipe implements PipeTransform {

  transform(data: string): string {
    let word: string;
    if (data !== undefined) {
      const words = data.split(' ').length;
      if (words <= 2) {
        word = data.replace(/ .*/, '');
      } else {
        word = data.split(' ').slice(0, 2).join(' ');
      }
    } else {
      word = '';
    }
    return word;
  }

}
