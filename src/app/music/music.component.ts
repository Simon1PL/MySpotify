import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { YtPlayerService } from '../../services/yt-player.service';
import { Music } from '../music';
import { HttpService } from 'src/services/http.service';

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
  add = false;

  constructor(private ytPlayerService: YtPlayerService, private httpService: HttpService) { }

  ngOnInit(): void {
    if (this.ytPlayerService.playerVideoId === this.item.videoId) {
      if (this.ytPlayerService.getPlayerState() === 1) {this.state = 'playing'; }
    }
    this.ytPlayerService.getState().subscribe(item => {
      // first option: if getState has item with videoId=null this song state=ended[play icon visible]
      // second: videoId!=null and video needs buffering(state=loading[loading icon visible])
      // third: doesn't need buffering(state=playing[pause icon visible])
      if (item.videoId !== this.item.videoId) { this.state = 'ended'; }
      else if (item.needBuffering === false) { this.state = 'playing'; }
      else if (item.needBuffering === true) { this.state = 'loading'; }
    });
    this.httpService.getPlaylists(this.item.videoId).subscribe((res) => {
      if (res.includes({name: 'polskie'})) { this.item.like = true; console.log(this.item.like); }
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

  like() {
    this.item.like = !this.item.like;
    if (this.item.like) {
      this.httpService.addSong(this.item, 'favorite');
    }
    else {
      this.httpService.deleteSong(this.item, 'favorite');
    }
    this.httpService.setSong(this.item);
    // change in database and this.item
  }

  download(){
    // change in database and this.item
  }

  watchVideo() {
    this.play();
    this.ytPlayerService.watchVideo();
  }
}
