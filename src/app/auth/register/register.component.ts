import {Component, OnInit} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthModalService} from '../shared/service/auth-modal.service';
import {AuthService} from '../shared/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form?: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public authModal: AuthModalService,
    private dialogRef: MatDialogRef<RegisterComponent>,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
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

    const user = {
      login: this.form?.value.login,
      email: this.form?.value.email,
      password: this.form?.value.password
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('Register successful', response);
        this.router.navigate(['/protected/home']);
        this.submitted = false;
        this.dialogRef.close();
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Register failed';
        this.submitted = false;
      }
    })
  }

  closeRegister() {
    this.dialogRef.close();
  }
}
