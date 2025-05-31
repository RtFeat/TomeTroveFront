import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../shared/service/auth.service';
import {AuthModalService} from '../shared/service/auth-modal.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{
  form?: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public authModal: AuthModalService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null,
        [
          Validators.required,
        ]),
      password: new FormControl(null,
        [
        Validators.required,
        Validators.minLength(6)
        ])
    })
  }

  submit() {
    if (this.form?.invalid) {
      return
    }

    this.submitted = true;
    const credentials = {
      login: this.form?.value.login,
      password: this.form?.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful',response);
        this.router.navigate(['/protected/home']);
        this.submitted = false;
        this.dialogRef.close()
      },
      error: (error) => {
        this.errorMessage = (error.error && error.error.error) ? error.error.error : 'Login failed';
        console.log('Login failed', error);
        this.submitted = false
      }
    })
  }

  closeLogin() {
    this.dialogRef.close()
  }
}
