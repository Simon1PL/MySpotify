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
    return this.http.get<Music[]>('http://localhost:8080/songs');
  }

  searchSongs(text: string): Observable<Music[]> {
    return this.http.get<Music[]>('http://localhost:8080/songs/' + text);
  }

  addSong(music: Music, playlistname: string) {
    this.http.post<any>('http://localhost:8080/addYTVideoToPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  getPlaylists(videoId: string = null){
    if (videoId) {
      return this.http.get<any[]>('http://localhost:8080/songPlaylists/' + videoId);
    }
    else {
      return this.http.get<any[]>('http://localhost:8080/playlists');
    }
  }

  getArtists(){
    return this.http.get<any[]>('http://localhost:8080/artists');
  }

  getArtist(artist: string){
    return this.http.get<any[]>('http://localhost:8080/artist/' + artist);
  }

  getPlaylist(playlist: string){
    return this.http.get<any[]>('http://localhost:8080/playlist/' + playlist);
  }

  setSong(song: Music){
    this.http.post<any>('http://localhost:8080/setSong', { song })
    .subscribe();
  }

  deleteSong(music: Music, playlistname: string){
    this.http.post<any>('http://localhost:8080/deleteYTVideoFromPlaylist', { song: music, playlist: playlistname })
    .subscribe();
  }

  changeArtist(music: Music) {
    this.http.post<any>('http://localhost:8080/changeArtist', { music })
    .subscribe();
  }

  getHistory(){
    return this.http.get<any>('http://localhost:8080/getHistory');
  }

  setHistory(historyArray: Music[]){
    const history = { history: JSON.stringify(historyArray) };
    this.http.post<any>('http://localhost:8080/setHistory', { history })
    .subscribe();
  }
}
