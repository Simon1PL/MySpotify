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
    return this.http.get<Music[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/songs');
  }

  searchSongs(text: string): Observable<Music[]> {
    return this.http.get<Music[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/songs/' + text);
  }

  addSong(music: Music, playlistname: string) {
    this.http.post<any>(
      'https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/addYTVideoToPlaylist',
      { song: music, playlist: playlistname })
    .subscribe();
  }

  getPlaylists(videoId: string = null){
    if (videoId) {
      return this.http.get<any[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/songPlaylists/' + videoId);
    }
    else {
      return this.http.get<any[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/playlists');
    }
  }

  getArtists(){
    return this.http.get<any[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/artists');
  }

  getArtist(artist: string){
    return this.http.get<any[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/artist/' + artist);
  }

  getPlaylist(playlist: string){
    return this.http.get<any[]>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/playlist/' + playlist);
  }

  setSong(song: Music){
    this.http.post<any>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/setSong', { song })
    .subscribe();
  }

  deleteSong(music: Music, playlistname: string){
    this.http.post<any>(
      'https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/deleteYTVideoFromPlaylist',
      { song: music, playlist: playlistname })
    .subscribe();
  }

  changeArtist(music: Music) {
    this.http.post<any>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/changeArtist', { music })
    .subscribe();
  }

  getHistory(){
    return this.http.get<any>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/getHistory');
  }

  setHistory(historyArray: Music[]){
    const history = { history: JSON.stringify(historyArray) };
    this.http.post<any>('https://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24780/db/data/setHistory', { history })
    .subscribe();
  }
}
