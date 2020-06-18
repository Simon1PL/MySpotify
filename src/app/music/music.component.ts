import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { YtPlayerService } from '../../services/yt-player.service';
import { Music } from '../music';

@Component({
  selector: 'ms-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  @Input()
  item: Music;
  @Output()
  eventPlay = new EventEmitter<boolean>();
  state = 'ended'; // loading/playing/ended (play button icon depends on that) ENDED=play button PLAYING=pause button LOADING=loading button

  constructor(private ytPlayerService: YtPlayerService) { }

  ngOnInit(): void {
    this.ytPlayerService.getState().subscribe(item => {
      // first option: if getState has item with videoId=null this song state=ended[play icon visible]
      // second: videoId!=null and video needs buffering(state=loading[loading icon visible])
      // third: doesn't need buffering(state=playing[pause icon visible])
      if (item.videoId !== this.item.videoId) { this.state = 'ended'; }
      else if (item.needBuffering === false) { this.state = 'playing'; }
      else if (item.needBuffering === true) { this.state = 'loading'; }
    });
  }

  play() {
    if (this.state === 'ended') {
      this.ytPlayerService.load(this.item);
      this.eventPlay.emit(true); // true means start music
    }
    else {
      this.eventPlay.emit(false); // false means stop music
    }
  }
}
