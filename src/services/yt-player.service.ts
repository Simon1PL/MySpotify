import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Music } from 'src/app/music';

@Injectable({
  providedIn: 'root'
})
export class YtPlayerService {
  private isPlayerLoaded = false; // when YT API are loaded this is changing to true
  private player: any;
  private playerVideoId: string;
  // Observable object, videoId=null means object is paused(has play icon visible)
  private state = new Subject<{videoId: string, needBuffering: boolean}>();
  private videoItemToObserve = new Subject<Music>();
  private isVideoBuffering = false;

  // start or unpause video
  play() {
    if (this.isPlayerLoaded) {
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
  // set isVideoBuffering to true if new videoItem is another than last
  load(videoItem?) {
    if (this.isPlayerLoaded && videoItem?.videoId !== this.playerVideoId) {
      this.playerVideoId = videoItem.videoId;
      this.player.loadVideoById(this.playerVideoId);
      this.videoItemToObserve.next(videoItem);
      this.isVideoBuffering = true;
    }
  }
  getState(): Observable<{videoId: string, needBuffering: boolean}> {
    return this.state.asObservable();
  }
  getCurrentlyPlayingVideoItem(): Observable<Music> {
    return this.videoItemToObserve.asObservable();
  }
  getTime() {
    if (this.isPlayerLoaded && this.player.getCurrentTime()) {
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

  constructor() {
    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window['onYouTubeIframeAPIReady'.toString()] = () => { this.APIReady('100%', '100%', this.playerVideoId); };
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
  }
  // 5. The API calls this function when the player's state changes like PLAYING, PAUSE, ENDED.
  private onPlayerStateChange(event) {
    if (event.data === window['YT'.toString()].PlayerState.ENDED) {
      this.state.next({videoId: null, needBuffering: null});
      this.isVideoBuffering = false;
    }
    else if (this.isVideoBuffering && event.data === window['YT'.toString()].PlayerState.PLAYING) {
      this.state.next({videoId: this.playerVideoId, needBuffering: false});
      this.isVideoBuffering = false;
    }
  }
}
