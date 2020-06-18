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
  actualTime = 0; // used in time measure
  intervalId: any; // used in time measure
  state: string = 'ended'; // loading/playing/ended (play button icon depends on that)
  watchVideo = false; // when true video is visible
  results: Music[] = [];
  videoItem: Music = pinkPanter; // info about playing/loaded song
  playlists: {name: string}[] = [{name: 'impreza1'}, {name: 'rapy2'}, {name: 'hiphop3'}]

  constructor(private ytPlayerService: YtPlayerService, private ytSearchService: YtSearchService) { }

  ngOnInit(): void {
    this.ytPlayerService.getState().subscribe(item => {
      // first option: if getState has item with videoId=null this song state=ended[play icon visible]
      // second: videoId!=null and video needs buffering(state=loading[loading icon visible])
      // third: doesn't need buffering(state=playing[pause icon visible])
      this.state = item.videoId === null ? 'ended' : item.needBuffering === false ? 'playing' : 'loading';
    });
    this.ytPlayerService.getCurrentlyPlayingVideoItem().subscribe(videoItem => this.videoItem = videoItem);
    this.ytSearchService.getResultList().subscribe(result => this.results = result);
    setTimeout(() => { this.ytPlayerService.load(pinkPanter); this.play(false); }, 1000);
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

  play(play = this.state === 'ended') { // argument play: true - start playing / false - stop playing
    if (play) {
      this.ytPlayerService.play();
      this.startTimer();
      console.log(this.videoItem.thumbnails);
  }
    else {
      this.ytPlayerService.stop();
      this.stopTimer();
    }
  }

  search(text: string, token = false) {
    this.ytSearchService.search(text, token);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter')
    {
      const input = document.getElementById('search');
      this.search((input as HTMLInputElement).value);
    }
    if (event.key === ' ')
    {
      event.preventDefault();
      this.play();
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

export const pinkPanter = {
  title: 'Różowa pantera',
  videoId: '5H7bNUFGMs0',
  channelTitle: 'Szpaku',
  thumbnails: 'https://i.ytimg.com/vi/lk70ee3UMAc/hqdefault.jpg',
  date: null,
  duration: 'T2M43S',
  views: null
};
