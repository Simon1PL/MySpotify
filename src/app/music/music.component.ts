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
  isPlaying = 'ended'; // loading/playing/ended maybe create enum 'playerState' but later:D

  constructor(private ytPlayerService: YtPlayerService) { }

  ngOnInit(): void {
    this.ytPlayerService.getCurrentlyPlayingVideoId().subscribe(item => {
      // change isPlaying to true if that song is playing right now otherwise false
      this.isPlaying = item.videoId !== this.item.videoId ? 'ended' : item.state === 1 ? 'playing' : 'loading';
    });
  }

  play() {
    if (this.isPlaying === 'ended') {
      this.ytPlayerService.load(this.item);
      this.eventPlay.emit(true); // true means start music
    }
    else {
      this.eventPlay.emit(false); // false means stop music
    }
  }
}
