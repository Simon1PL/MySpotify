import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/services/http.service';
import { Music } from '../music';

@Component({
  selector: 'ms-playlist-checkbox',
  templateUrl: './playlist-checkbox.component.html',
  styleUrls: ['./playlist-checkbox.component.scss']
})
export class PlaylistCheckboxComponent implements OnInit {
  @Input()
  song: Music;
  playlists: { name: string }[];
  songPlaylists: { name: string }[];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getPlaylists().subscribe(result => {
      const index = result.findIndex(i => i.name === 'favorite');
      result.splice(index, 1);
      this.playlists = result;
    });
    this.httpService.getPlaylists(this.song.videoId).subscribe(result => {
      const index = result.findIndex(i => i.name === 'favorite');
      if (index > -1) {
        result.splice(index, 1);
      }
      this.songPlaylists = result;
    });
  }

  isInSongPlaylists( playlist: {name: string} ): boolean {
    return this.songPlaylists?.findIndex(i => i.name === playlist.name) === -1 ? false : true;
  }

  addOrDeleteFromPlaylist(isChecked: boolean, playlist: string) {
    if (isChecked) {
      this.httpService.addSong(this.song, playlist);
    }
    else {
      this.httpService.deleteSong(this.song, playlist);
    }
  }

  onEvent(event) {
    event.stopPropagation();
  }

  createNewPlaylist(playlistName: string) {
    this.httpService.addSong(this.song, playlistName);
  }

}
