import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Music } from 'src/app/music';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  serverAddress = 'https://myspotify-app.herokuapp.com';
  constructor(private http: HttpClient) { }

  getSongs(): Observable<Music[]> {
    return this.http.get<Music[]>(this.serverAddress + '/songs'); //http://localhost:8080
  }

  searchSongs(text: string): Observable<Music[]> {
    return this.http.get<Music[]>(this.serverAddress + '/songs/' + text);
  }

  addSong(music: Music, playlistname: string) {
    this.http.post<any>(this.serverAddress + '/addYTVideoToPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  getPlaylists(videoId: string = null){
    if (videoId) {
      return this.http.get<any[]>(this.serverAddress + '/songPlaylists/' + videoId);
    }
    else {
      return this.http.get<any[]>(this.serverAddress + '/playlists');
    }
  }

  getArtists(){
    return this.http.get<any[]>(this.serverAddress + '/artists');
  }

  getArtist(artist: string){
    return this.http.get<any[]>(this.serverAddress + '/artist/' + artist);
  }

  getPlaylist(playlist: string){
    return this.http.get<any[]>(this.serverAddress + '/playlist/' + playlist);
  }

  setSong(song: Music){
    this.http.post<any>(this.serverAddress + '/setSong', { song })
    .subscribe();
  }

  deleteSong(music: Music, playlistname: string){
    this.http.post<any>(this.serverAddress + '/deleteYTVideoFromPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  changeArtist(music: Music) {
    this.http.post<any>(this.serverAddress + '/changeArtist', { music })
    .subscribe();
  }

  getHistory(){
    return this.http.get<any>(this.serverAddress + '/getHistory');
  }

  setHistory(historyArray: Music[]){
    const history = { history: JSON.stringify(historyArray) };
    this.http.post<any>(this.serverAddress + '/setHistory', { history })
    .subscribe();
  }
}
