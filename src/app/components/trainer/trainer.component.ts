import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '../../storage/local-storage.service';
import { SelfAssessmentComponent } from '../self-assessment/self-assessment.component';
import { Router } from '@angular/router';
import { SpeakerComponent } from '../speaker/speaker.component';

export interface CardItem {
  id: string | number;
  title: string;
  titleAnswer: string;
  auxiliaryText: string;
  auxiliaryText2: string;
  auxiliaryTextAnswer: string;
  qtdRevision?: number;
  nextRevisionDate?: Date | string;
  [key: string]: any;
}

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    SelfAssessmentComponent,
    SpeakerComponent
],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.scss',
})
export class TrainerComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  cards = signal<CardItem[]>([]);
  currentIndex = signal(0);
  currentCard = signal<CardItem | null>(null);
  isFlipped = signal(false);
  isFinished = signal(false);
  
  ngOnInit(): void {
    this.loadCards();
  }

  /**
   * Obtém a lista de cards salvos chamando o LocalStorageService.
   */
  loadCards(): void {
    const result$ = this.localStorageService.read();
    if (result$ && typeof result$.subscribe === 'function') {
      result$.subscribe({
        next: (cards: CardItem[]) => {
          this.setCards(cards);
        },
        error: (err: any) => {
          this.setCards([]);
        },
      });
    } else if (Array.isArray(result$)) {
      this.setCards(result$);
    }
  }

  /**
   * Configura a lista inicial de cards e define o primeiro card ativo.
   */
  private setCards(cards: CardItem[]): void {
    const dueCards = cards.filter(card => this.isDueForReview(card.nextRevisionDate));
    this.cards.set(dueCards);
    this.currentIndex.set(0);
    this.isFinished.set(false);
    this.isFlipped.set(false);
    this.currentCard.set(dueCards.length > 0 ? dueCards[0] : null);
  }

  isDueForReview(nextRevisionDate: Date | string | undefined): boolean {
    if (!nextRevisionDate) {
      return true; // sem data definida = card novo, entra na fila
    }

    const revisionDate = new Date(nextRevisionDate);
    const today = new Date();

    // Zera as horas para comparar só a data (ignorando horário)
    revisionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return revisionDate <= today;
  }

  /**
   * Vira o card para revelar a resposta e o self-assessment.
   */
  flip(): void {
    this.isFlipped.set(true);
  }

  /**
   * Trata o evento de cálculo da data de revisão emitido pelo SelfAssessmentComponent.
   * Atualiza o card localmente, persiste via LocalStorageService e avança para o próximo card.
   *
   * @param date Próxima data de revisão calculada
   */
  onDateRevision(date: Date): void {
    const card = this.currentCard();
    if (!card) return;

    const currentQtd = card.qtdRevision ?? 1;
    const updatedCard = { ...card, qtdRevision: currentQtd + 1, nextRevisionDate: date };

    this.localStorageService.update(card.id, {
      nextRevisionDate: date,
      qtdRevision: updatedCard.qtdRevision,
    }).subscribe({
      next: () => this.advanceToNextCard(),
      error: (err: any) => {
        console.error('Erro ao atualizar card:', err);
        this.advanceToNextCard();
      },
    });
  }

  /**
   * Avança para o próximo card da lista ou finaliza a sessão se não houver mais cards.
   */
  private advanceToNextCard(): void {
    const nextIndex = this.currentIndex() + 1;
    this.currentIndex.set(nextIndex);
    this.isFlipped.set(false);

    const list = this.cards();
    if (nextIndex < list.length) {
      this.currentCard.set(list[nextIndex]);
    } else {
      this.currentCard.set(null);
      this.isFinished.set(true);
    }
  }

  restart(): void {
    this.loadCards();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
