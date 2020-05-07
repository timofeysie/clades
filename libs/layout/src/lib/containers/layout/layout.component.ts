import { Component, OnInit } from '@angular/core';
import { AuthService } from '@clades/auth'
import { Observable } from 'rxjs';
import { User } from '@clades/data-models';

@Component({
  selector: 'clades-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user$: Observable<User>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

  
  logout() {
    this.authService.logout();
    this.user$ = this.authService.user$;
    // this.store.dispatch(new authActions.AuthService.Login({}));
    // this.user$ = this.store.select(getUser);
  }
  
}
