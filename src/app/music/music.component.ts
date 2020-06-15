import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // 2. This code loads the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window['onYouTubeIframeAPIReady'.toString()] = () => { this.startVideo(); };
  }

  startVideo() {
    this.player = new window['YT'.toString()].Player('player', {
      height: '360',
      width: '640',
      videoId: 'M7lc1UVf-VE', ///zmienne zrobic
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this)
      }
    });
  }

  player;

  // 4. The API will call this function when the video player is ready.
  onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  stopVideo() {
    this.player.stopVideo();
  }
  done = false;
  onPlayerStateChange(event) {
    if (event.data == window['YT'.toString()].PlayerState.PLAYING && !this.done) {
      setTimeout(this.stopVideo, 6000);
      this.done = true;
    }
  }


}
