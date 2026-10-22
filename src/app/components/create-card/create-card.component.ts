import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '../../storage/local-storage.service';
import { Router } from '@angular/router';

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
  @Output() cardCreated = new EventEmitter<any>();

  cardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      auxiliaryText: ['', [Validators.maxLength(300)]],
    });
  }

  /**
   * Submete o formulário, valida os campos e salva no LocalStorageService.
   */
  onSubmit(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const cardData = {
      title: this.cardForm.value.title?.trim() ?? '',
      auxiliaryText: this.cardForm.value.auxiliaryText?.trim() ?? '',
    };

    const createdCard = this.localStorageService.create(cardData);

    if (createdCard) {
      this.cardCreated.emit(createdCard);
      this.cardForm.reset();
       this.router.navigate([``]);
    }
  }

  submitCard(): void {
    this.onSubmit();
  }
}
