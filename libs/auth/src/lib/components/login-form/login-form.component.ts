import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Authenticate } from '@clades/data-models';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'clades-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Output() submit = new EventEmitter<Authenticate>();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  login() {
    this.submit.emit({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    } as Authenticate);
  }
}