import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainPageComponent } from './main-page/main-page.component';
import { LogoComponent } from './logo/logo.component';
import { MusicComponent } from './music/music.component';

@NgModule({
  declarations: [
    MainPageComponent,
    LogoComponent,
    MusicComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [MainPageComponent]
})
export class AppModule { }
