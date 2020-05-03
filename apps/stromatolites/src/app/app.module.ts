import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule } from '@clades/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@clades/layout';
import { AbcLayoutModule } from '@clades/abc-layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    RouterModule.forRoot([{path: 'auth', children: authRoutes}], { initialNavigation: 'enabled' }),
    AuthModule,
    LayoutModule,
    AbcLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
