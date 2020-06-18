import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Music } from 'src/app/music';

@Injectable({
  providedIn: 'root'
})
export class YtPlayerService {
  private player: any;
  private playerVideoId: string;
  private isPlayerLoaded = false;
  private isPlaying = new Subject<{videoId: string, state: any}>(); // Observable object
  private videoItemToObserve = new Subject<Music>();
  private lastStateWasBuffering = false;

  // start or unpause video with given id
  play(newSong = false) {
    if (this.isPlayerLoaded) {
      this.player.playVideo();
      this.isPlaying.next({videoId: this.playerVideoId, state: newSong ? 3 : 1}); // 1 means playing, 3 means buffering
      if (newSong) { this.lastStateWasBuffering = true; }
    }
    else {
      console.log('probably no internet connection');
    }
  }
  stop() {
    if (this.isPlayerLoaded) {
      this.player.pauseVideo();
      this.isPlaying.next({videoId: null, state: 2}); // 2 means paused
    }
  }
  load(videoItem?) {
    const id = videoItem ? videoItem.videoId : this.playerVideoId;
    if (this.isPlayerLoaded && this.playerVideoId !== id) {
      this.playerVideoId = id;
      this.player.loadVideoById(this.playerVideoId);
      if (videoItem) { this.videoItemToObserve.next(videoItem); }
    }
  }
  getCurrentlyPlayingVideoId(): Observable<{videoId: string, state: any}> {
    return this.isPlaying.asObservable();
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
      this.isPlaying.next({videoId: this.playerVideoId, state: window['YT'.toString()].PlayerState.ENDED});
      this.lastStateWasBuffering = false;
    }
    else if (this.lastStateWasBuffering && event.data === window['YT'.toString()].PlayerState.PLAYING) {
      this.isPlaying.next({videoId: this.playerVideoId, state: window['YT'.toString()].PlayerState.PLAYING});
      this.lastStateWasBuffering = false;
    }
  }
}
