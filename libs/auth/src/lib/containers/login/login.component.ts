import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Authenticate } from '@clades/data-models';

@Component({
  selector: 'clades-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login(authenticate: Authenticate): void {
    this.authService.login(authenticate).subscribe();
  }
}
