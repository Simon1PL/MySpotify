import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Music } from 'src/app/music';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class YtPlayerService {
  private isPlayerLoaded = false; // when YT API are loaded this is changing to true
  private player: any;
  playerVideoId: string;
  // Observable object, videoId=null means object is paused(has play icon visible)
  private state = new Subject<{videoId: string, needBuffering: boolean}>();
  private videoItemToObserve = new Subject<Music>();
  private fullScreen = new Subject<boolean>();
  private isVideoBuffering = false;
  private currentPlaylist: Music[] = null;
  private history: Music[] = [];

  // start or unpause video
  play(playlist: Music[]) {
    if (this.isPlayerLoaded) {
      if (this.isVideoBuffering) {
        this.currentPlaylist = playlist;
      }
      this.player.playVideo();
      this.state.next({videoId: this.playerVideoId, needBuffering: this.isVideoBuffering ? true : false});
    }
    else {
      console.log('probably no internet connection');
    }
  }
  // pause video
  stop() {
    if (this.isPlayerLoaded) {
      this.player.pauseVideo();
      this.state.next({videoId: null, needBuffering: null});
    }
  }
  // load video(set isVideoBuffering to true if new videoItem is another than last)
  load(videoItem?) {
    if (this.isPlayerLoaded && videoItem?.videoId !== this.playerVideoId) {
      this.playerVideoId = videoItem.videoId;
      this.player.loadVideoById(this.playerVideoId);
      this.videoItemToObserve.next(videoItem);
      this.isVideoBuffering = true;
      this.setHistory(videoItem);
    }
  }
  private setHistory(item: Music) {
    if (this.history.length === 0 || this.history[this.history.length - 1].videoId !== item.videoId) {
      this.history.push(item); // to do: ograniczenie na wielkosc historii
    }
    this.httpService.setHistory(this.history);
  }
  getState(): Observable<{videoId: string, needBuffering: boolean}> {
    return this.state.asObservable();
  }
  getCurrentlyPlayingVideoItem(): Observable<Music> {
    return this.videoItemToObserve.asObservable();
  }
  getTime() {
    if (this.isPlayerLoaded) {
      return this.player.getCurrentTime();
    }
    return 0;
  }
  // return true if YouTube Iframe API is ready
  isLoaded() {
    return this.isPlayerLoaded;
  }
  getPlayerState() {
    if (this.isPlayerLoaded) {
      return this.player.getPlayerState();
    }
  }
  observeWhenFullScreen(): Observable<boolean> {
    return this.fullScreen.asObservable();
  }
  watchVideo() {
    this.fullScreen.next(true);
  }

  constructor(private httpService: HttpService) {
    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window['onYouTubeIframeAPIReady'.toString()] = () => { this.APIReady('100%', '100%', this.playerVideoId); };

    this.httpService.getHistory().subscribe((history) => {
      this.history = JSON.parse(history.history);
    });
  }

  private APIReady(playerHeight: string, playerWidth: string, playerVideoId: string) {
    this.player = new window['YT'.toString()].Player('player', {
      height: playerHeight,
      width: playerWidth,
      videoId: playerVideoId,
      playerVars: { autoplay: 0, iv_load_policy: 3, fs: 0, modestbranding: 1, rel: 0, showinfo: 0/* , controls: 0 */ },
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this)
      }
    });
  }
  // 4. The API will call this function when the video player is ready.
  private onPlayerReady(event) {
    this.isPlayerLoaded = true;
    console.log('YtPlayerService done');
    this.load(this.history[this.history.length - 1]);
    this.stop();
  }
  // 5. The API calls this function when the player's state changes like PLAYING, PAUSE, ENDED.
  private onPlayerStateChange(event) {
    if (event.data === window['YT'.toString()].PlayerState.ENDED) {
      this.state.next({videoId: null, needBuffering: null});
      this.isVideoBuffering = false;
    }
    if (!this.isVideoBuffering && event.data === window['YT'.toString()].PlayerState.PAUSED) {
      this.state.next({videoId: null, needBuffering: null});
      // jesli puscimy muzyke w innym oknie podczas ladowania nowej w tym to sie zepsuje ._. ale to bylo najlepsze wyjscie bo:
      // jak wlacze ze moze podczas buforowania zatrzymac to ladowanie nowej piosenki zatrzymuje stara
      // i najpierw widac stop a dopiero potem start co bardzo psuje wyglad bo
      // ta funkcja onPlayerStateChange dziala jakos z opoznieniem wiec chwile widac tego useless stopa
    }
    else if (this.isVideoBuffering && event.data === window['YT'.toString()].PlayerState.PLAYING) {
      this.state.next({videoId: this.playerVideoId, needBuffering: false});
      this.isVideoBuffering = false;
    }
  }
}
