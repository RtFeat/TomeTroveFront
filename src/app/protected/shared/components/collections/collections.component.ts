import {Component, Inject, OnInit} from '@angular/core';
import {Anthology} from '../../interfaces';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../auth/shared/service/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AnthologyService} from '../../service/anthology.service';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-collections',
  imports: [
    ReactiveFormsModule,
    MatButton,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './collections.component.html',
  standalone: true,
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit {

  book$: Observable<Anthology> | undefined;

  constructor(
    private route: ActivatedRoute,
    protected authService: AuthService,
    private anthologyService: AnthologyService,
    public dialogRef: MatDialogRef<CollectionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Anthology
  ) {}

  ngOnInit() {
    // isolate window
    // this.book$ = this.route.params
    //   .pipe(switchMap((params: Params) => {
    //     return this.anthologyService.getById(params['id'])
    //   }))
  }

  buy(): void {
    this.anthologyService.createPayment(this.data.id!).subscribe({
      next: (response) => {
        window.location.href = response.payment_url;
      },
      error: (error) => {
        console.error('Error creating payment:', error);
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
