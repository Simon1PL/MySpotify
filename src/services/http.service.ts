import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Music } from 'src/app/music';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getSongs(): Observable<Music[]> {
    return this.http.get<Music[]>('https://myspotify-app.herokuapp.com/songs');
  }

  searchSongs(text: string): Observable<Music[]> {
    return this.http.get<Music[]>('https://myspotify-app.herokuapp.com/songs/' + text);
  }

  addSong(music: Music, playlistname: string) {
    this.http.post<any>('https://myspotify-app.herokuapp.com/addYTVideoToPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  getPlaylists(videoId: string = null){
    if (videoId) {
      return this.http.get<any[]>('https://myspotify-app.herokuapp.com/songPlaylists/' + videoId);
    }
    else {
      return this.http.get<any[]>('https://myspotify-app.herokuapp.com/playlists');
    }
  }

  getArtists(){
    return this.http.get<any[]>('https://myspotify-app.herokuapp.com/artists');
  }

  getArtist(artist: string){
    return this.http.get<any[]>('https://myspotify-app.herokuapp.com/artist/' + artist);
  }

  getPlaylist(playlist: string){
    return this.http.get<any[]>('https://myspotify-app.herokuapp.com/playlist/' + playlist);
  }

  setSong(song: Music){
    this.http.post<any>('https://myspotify-app.herokuapp.com/setSong', { song })
    .subscribe();
  }

  deleteSong(music: Music, playlistname: string){
    this.http.post<any>('https://myspotify-app.herokuapp.com/deleteYTVideoFromPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  changeArtist(music: Music) {
    this.http.post<any>('https://myspotify-app.herokuapp.com/changeArtist', { music })
    .subscribe();
  }

  getHistory(){
    return this.http.get<any>('https://myspotify-app.herokuapp.com/getHistory');
  }

  setHistory(historyArray: Music[]){
    const history = { history: JSON.stringify(historyArray) };
    this.http.post<any>('https://myspotify-app.herokuapp.com/setHistory', { history })
    .subscribe();
  }
}
