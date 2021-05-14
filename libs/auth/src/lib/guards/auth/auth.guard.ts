import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { AuthState } from '@clades/auth';
import { Store, select } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AuthState>) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(state => state.auth.user),
      map(user => {
        console.log('greetings user');
        if (user) {
          console.log('user', user);
          return true;
        } else {
          console.log('no user');
          this.router.navigate([`/auth/login`]);
          return false;
        }
      })
    );
  }
}
