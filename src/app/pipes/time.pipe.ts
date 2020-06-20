import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0 || !Number.isInteger(value)) { return '0:00'; }
    const min = Math.floor(value / 60);
    let sec = value % 60 + '';
    sec = sec.length === 1 ? '0' + sec : sec;
    return `${min}:${sec}`;
  }

}
