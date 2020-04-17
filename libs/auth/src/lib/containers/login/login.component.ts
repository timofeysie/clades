import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clades-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  login(authenticate:any) {
    console.log(authenticate);
  }
}