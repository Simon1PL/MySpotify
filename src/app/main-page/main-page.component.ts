import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Music } from '../music';
import { YtPlayerService } from '../../services/yt-player.service';
import { YtSearchService } from 'src/services/yt-search.service';
import { HttpService } from 'src/services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ms-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  theme = 'dark';
  actualTime = 0; // used in time measure
  intervalId: any; // used in time measure
  state = 'ended'; // loading/playing/ended (play button icon depends on that)
  watchVideo = false; // when true video is visible
  results: Music[] = [];
  videoItem: Music; // info about playing/loaded song
  playlists: {name: string}[];
  currentPlaylist: Music[] = null; // bedzie dostawala informacje jesli zostanie puszczona muzyka
  hasNext = false;
  hasPrev = false;
  add = false;
  loadMore = false;
  artists: {name: string}[] = null;
  editing = false;

  private subscription: Subscription;


  constructor(private ytPlayerService: YtPlayerService, private ytSearchService: YtSearchService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getHistory().subscribe(history => {
      this.videoItem = JSON.parse(history.history)[JSON.parse(history.history).length - 1];
    });
    this.ytPlayerService.getState().subscribe(item => {
      // first option: if getState has item with videoId=null this song state=ended[play icon visible]
      // second: videoId!=null and video needs buffering(state=loading[loading icon visible])
      // third: doesn't need buffering(state=playing[pause icon visible])
      this.state = item.videoId === null ? 'ended' : item.needBuffering === false ? 'playing' : 'loading';
    });
    this.ytPlayerService.observeWhenFullScreen().subscribe(letsWatch => {
      this.watch();
    });
    this.ytPlayerService.getCurrentlyPlayingVideoItem().subscribe(videoItem => this.videoItem = videoItem);
    this.subscription = this.httpService.getSongs().subscribe(result => this.results = result);
    this.httpService.getPlaylists().subscribe(result => {
      const index = result.findIndex(i => i.name === 'favorite');
      result.splice(index, 1);
      this.playlists = result;
    });
  }

  changeTheme(theme: string) {
    this.theme = theme;
  }

  startTimer() {
    this.actualTime = Math.round(this.ytPlayerService.getTime());
    this.intervalId = setInterval(() => {
      this.actualTime = Math.round(this.ytPlayerService.getTime());
      if (this.ytPlayerService.getPlayerState() === 0 /* PlayerState 0 means ENDED */) {
        clearInterval(this.intervalId);
        this.watchVideo = false;
        // jesli ma nexta to play next, strzalki to samo tylko next lub prev
      }
    }, 1000); // i think 1sec is accurate enough
  }
  stopTimer() {
      clearInterval(this.intervalId);
  }

  play(play = this.state === 'ended') { // argument play: true - start playing / false - stop playing
    this.add = false;
    if (play) {
      this.ytPlayerService.play(this.currentPlaylist);
      this.startTimer();
      if (this.currentPlaylist === null) {
        this.hasNext = false;
        this.hasPrev = false;
      }
      else {
        const currentIndexInPlaylist = this.currentPlaylist.findIndex(music => music.videoId === this.videoItem.videoId);
        this.hasNext = currentIndexInPlaylist === this.currentPlaylist.length - 1 ? false : true;
        this.hasPrev = currentIndexInPlaylist === 0 ? false : true;
      }
  }
    else {
      this.ytPlayerService.stop();
      this.stopTimer();
    }
  }

  search(text: string, token = false) {
    this.loadMore = true;
    this.ytSearchService.search(text, token);
    this.subscription?.unsubscribe();
    this.subscription = this.ytSearchService.getResultList().subscribe(result => this.results = result);
  }

  searchInSave(text: string) {
    this.loadMore = false;
    this.subscription?.unsubscribe();
    this.subscription = this.httpService.searchSongs(text).subscribe(songs => this.results = songs);
  }

  showPlaylist(playlist: string) {
    this.loadMore = false;
    this.subscription?.unsubscribe();
    this.subscription = this.httpService.getPlaylist(playlist).subscribe(songs => {
      this.results = songs;
      this.currentPlaylist = songs;
    });
  }

  showHistory() {
    this.loadMore = false;
    this.subscription?.unsubscribe();
    this.subscription = this.httpService.getHistory().subscribe(history => {
      this.results = JSON.parse(history.history).reverse();
    });
  }

  showArtist(artist: string) {
    this.loadMore = false;
    this.subscription?.unsubscribe();
    this.subscription = this.httpService.getArtist(artist).subscribe(songs => {
      this.results = songs;
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ')
    {
      event.preventDefault();
      this.play();
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent2(event: KeyboardEvent) {
    if (event.key === ' ')
    {
      event.preventDefault();
    }
  }

  like() {
    this.videoItem.like = !this.videoItem.like;
    if (this.videoItem.like) {
      this.httpService.addSong(this.videoItem, 'favorite');
    }
    else {
      this.httpService.deleteSong(this.videoItem, 'favorite');
    }
    this.httpService.setSong(this.videoItem);
  }

  download(){
  }

  toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display !== 'block' ? 'block' : 'none';
  }

  watch() {
    this.play(true);
    this.watchVideo = true;
  }
  closeVideo() {
    this.watchVideo = false;
  }
  onEvent(event) {
    event.stopPropagation();
    event.target.value += ' ';
  }
  addSpace(input) {
    input += ' ';
  }
  next() {
    const currentIndexInPlaylist = this.currentPlaylist.findIndex(music => music.videoId === this.videoItem.videoId);
    if (currentIndexInPlaylist < this.currentPlaylist.length - 1) {
      this.videoItem = this.currentPlaylist[currentIndexInPlaylist + 1];
      this.ytPlayerService.load(this.videoItem);
      this.play(true);
    }
  }

  last() {
    const currentIndexInPlaylist = this.currentPlaylist.findIndex(music => music.videoId === this.videoItem.videoId);
    if (currentIndexInPlaylist > 0) {
      this.videoItem = this.currentPlaylist[currentIndexInPlaylist - 1];
      this.ytPlayerService.load(this.videoItem);
      this.play(true);
    }
  }

  showArtists() {
    this.loadMore = false;
    this.subscription?.unsubscribe();
    this.results = null;
    this.httpService.getArtists().subscribe(res => this.artists = res);
  }

  changeChannel(newTitle: string) {
    this.videoItem.channelTitle = newTitle;
    this.editing = false;
    this.httpService.setSong(this.videoItem);
    this.httpService.changeArtist(this.videoItem);
  }

  focus(el: any) {
    this.editing = true;
    setTimeout(() => el.focus(), 1);
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
