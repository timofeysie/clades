import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule } from '@clades/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '@clades/auth';
import { LayoutModule } from '@clades/layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'products' },
        { path: 'auth', children: authRoutes },
        {
          path: 'products',
          loadChildren: () =>
            import('@clades/products').then(module => module.ProductsModule),
          canActivate: [AuthGuard]
        }
      ],
      { initialNavigation: 'enabled' }
    ),
    AuthModule,
    LayoutModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(
      {},
      {
        // metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
