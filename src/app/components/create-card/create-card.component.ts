import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '../../storage/local-storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.scss',
})
export class CreateCardComponent {
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  isSaving = false;

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    auxiliaryText: ['', [Validators.required, Validators.maxLength(300)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.localStorageService.create(this.form.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.form.reset();
        this.snackBar.open('Card salvo com sucesso!', 'OK', { duration: 3000 });
      },
      error: (error: any) => {
        this.isSaving = false;
        console.error('Erro ao salvar card:', error);
        this.snackBar.open('Erro ao salvar o card. Tente novamente.', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
