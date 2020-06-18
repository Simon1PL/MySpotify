import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class Duration implements PipeTransform {

  transform(value: string): string {
    if (value.indexOf('H') === -1) {
      const minutes = value.substring(value.indexOf('T') + 1, value.indexOf('M'));
      let seconds = value.substring(value.indexOf('M') + 1, value.indexOf('S'));
      if (seconds.length === 1) {seconds = 0 + seconds; }
      return `${minutes}:${seconds}`;
  }
    if (value.indexOf('M') === -1) {
      let seconds = value.substring(value.indexOf('T') + 1, value.indexOf('S'));
      if (seconds.length === 1) {seconds = 0 + seconds; }
      return `0:${seconds}`;
  }
    const hours = value.substring(value.indexOf('T') + 1, value.indexOf('H'));
    let minutes = value.substring(value.indexOf('H') + 1, value.indexOf('M'));
    let seconds = value.substring(value.indexOf('M') + 1, value.indexOf('S'));
    if (minutes.length === 1) {minutes = 0 + minutes; }
    if (seconds.length === 1) {seconds = 0 + seconds; }
    return `${hours}:${minutes}:${seconds}`;
  }

}
