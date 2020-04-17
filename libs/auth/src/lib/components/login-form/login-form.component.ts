import { Component, EventEmitter, Output } from '@angular/core';
import { Authenticate } from '@clades/data-models';
@Component({
  selector: 'clades-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Output() submit = new EventEmitter<Authenticate>();

  login(authenticate: Authenticate) {
    this.submit.emit(authenticate);
  }
}
