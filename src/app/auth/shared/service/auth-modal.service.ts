import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from '../../login/login.component';
import {RegisterComponent} from '../../register/register.component';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {

  constructor(
    private dialog: MatDialog,
  ) {}

  openLogin() {
    console.log('LoginComponent is:', LoginComponent);
    this.dialog.open(LoginComponent, {
      disableClose: true,
    })
  }

  openRegister() {
    console.log('RegisterComponent is:', RegisterComponent);
    this.dialog.open(RegisterComponent, {
      disableClose: true,
    })
  }

}

