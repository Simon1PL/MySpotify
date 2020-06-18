import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Music } from '../music';
import { YtPlayerService } from '../../services/yt-player.service';
import { YtSearchService } from 'src/services/yt-search.service';

@Component({
  selector: 'ms-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  theme = 'dark';
  actualTime = 0;
  intervalId: any;
  isPlaying: string; // loading/playing/ended maybe create enum 'playerState' but later:D
  watchVideo = false;
  results: Music[];
  videoItem: Music;

  constructor(private ytPlayerService: YtPlayerService, private ytSearchService: YtSearchService) { }

  ngOnInit(): void {
    this.ytPlayerService.getCurrentlyPlayingVideoId().subscribe(item => {
      // change isPlaying to true if any song is playing right now otherwise false
      this.isPlaying = item.videoId === null ? 'ended' : item.state === 1 ? 'playing' : 'loading';
    });
    this.ytPlayerService.getCurrentlyPlayingVideoItem().subscribe(videoItem => this.videoItem = videoItem);
    this.ytSearchService.getResultList().subscribe(result => this.results = result);
  }

  changeTheme(theme: string) {
    this.theme = theme;
  }

  startTimer() {
    this.actualTime = Math.round(this.ytPlayerService.getTime());
    this.intervalId = setInterval(() => {
      this.actualTime = Math.round(this.ytPlayerService.getTime());
      if (this.ytPlayerService.getPlayerState() === 0 /* PlayerState 0 means ENDED */) { clearInterval(this.intervalId); }
    }, 1000); // i think 1sec is accurate enough
  }
  stopTimer() {
    clearInterval(this.intervalId);
  }

  play(play = this.isPlaying !== 'playing') { // argument play: true - start playing / false - stop playing
    if (play) {
      this.ytPlayerService.play();
      this.startTimer();
    }
    else {
      this.ytPlayerService.stop();
      this.stopTimer();
    }
  }

  load() {
    this.ytPlayerService.play(true);
    this.startTimer();
  }

  search(text: string, token = false) {
    this.ytSearchService.search(text, token);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter')
    {
      const input = document.getElementById('search');
      this.search((input as HTMLInputElement).value);
    }
  }

  /* this block view of elements which wouldn't work before YouTubeIframeAPIReady
    1) *ngIf="hasPlayerLoaded" - add this to element in html
    2) and run checkLoad() in ngOnInit here
    3) uncomment this
    timeoutId: any;
    hasPlayerLoaded = false;
    checkLoad() {
        this.hasPlayerLoaded = this.ytPlayerService?.isLoaded();
        console.log('waiting...');
        this.timeoutId = setTimeout( () => { this.checkLoad(); }, 200);
        if (this.hasPlayerLoaded === true) { console.log('ready!'); clearTimeout(this.timeoutId); }
    } */

}
