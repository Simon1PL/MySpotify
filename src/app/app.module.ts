import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainPageComponent } from './main-page/main-page.component';
import { LogoComponent } from './logo/logo.component';
import { MusicComponent } from './music/music.component';
import { YtPlayerService } from '../services/yt-player.service';
import { Duration } from './pipes/duration';
import { TimePipe } from './pipes/time.pipe';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from 'src/services/http.service';
import { PlaylistCheckboxComponent } from './playlist-checkbox/playlist-checkbox.component';

@NgModule({
  declarations: [
    MainPageComponent,
    LogoComponent,
    MusicComponent,
    Duration,
    TimePipe,
    PlaylistCheckboxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    YtPlayerService,
    HttpService
  ],
  bootstrap: [MainPageComponent]
})
export class AppModule { }
