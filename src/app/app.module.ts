import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainPageComponent } from './main-page/main-page.component';
import { LogoComponent } from './logo/logo.component';
import { MusicComponent } from './music/music.component';
import { YtPlayerService } from '../services/yt-player.service';
import { Duration } from './pipes/duration';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
  declarations: [
    MainPageComponent,
    LogoComponent,
    MusicComponent,
    Duration,
    TimePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [YtPlayerService],
  bootstrap: [MainPageComponent]
})
export class AppModule { }
