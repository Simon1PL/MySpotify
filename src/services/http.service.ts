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
    this.http.post<Music>('http://localhost:8080/addYTVideoToPlaylist', { song: music, playlist: playlistname })
    .subscribe((data: any) => {console.log(data); });
  }

  getPlaylists(){
    return this.http.get<any[]>('http://localhost:8080/playlists');
  }

  getPlaylist(playlist: string){
    return this.http.get<any[]>('http://localhost:8080/playlist/' + playlist);
  }
}
