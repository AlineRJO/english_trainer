/**
 * ============================================================================
 * REGRA DE NEGÓCIO - CÁLCULO DA PRÓXIMA DATA DE REVISÃO (Spaced Repetition)
 * ============================================================================
 *
 * 1. Pesos atribuídos por nível de dificuldade percebida (em dias):
 *    - Hard:   1 dia
 *    - Medium: 3 dias
 *    - Easy:   5 dias
 *
 * 2. Cálculo do intervalo base:
 *    intervalDays = pesoDaDificuldade * this.qtdRevision
 *    - qtdRevision representa quantas vezes a palavra/card já foi revisada.
 *    - Caso o componente pai não informe qtdRevision, o valor padrão é 1.
 *
 * 3. Ajuste para intervalos longos:
 *    Se intervalDays > 20, recalcula-se:
 *    intervalDays = intervalDays / 2
 *
 * 4. Tratamento de valores fracionários:
 *    O resultado é explicitamente arredondado utilizando Math.round(intervalDays).
 *    Exemplo: qtdRevision = 5, easy (peso 5) -> intervalo bruto = 25 dias (> 20)
 *             -> 25 / 2 = 12.5 dias -> Math.round(12.5) = 13 dias.
 *
 * 5. Data final:
 *    Calculada adicionando intervalDays dias à data atual:
 *    dataCalculada = new Date(hoje.getTime());
 *    dataCalculada.setDate(dataCalculada.getDate() + intervalDays);
 *
 * 6. Emissão:
 *    A dataCalculada é emitida através do Output dateRevision.emit(dataCalculada).
 * ============================================================================
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

export type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-self-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule],
  templateUrl: './self-assessment.component.html',
  styleUrl: './self-assessment.component.scss',
})
export class SelfAssessmentComponent {
  /** Quantidade de vezes que a palavra já foi revisada (valor padrão: 1) */
  @Input() qtdRevision: number = 1;

  /** Emite a data calculada da próxima revisão assim que uma opção for selecionada */
  @Output() dateRevision = new EventEmitter<Date>();

  /** Nível de dificuldade atualmente selecionado */
  selectedDifficulty: Difficulty | null = null;

  /** Pesos por nível de dificuldade em dias */
  private readonly difficultyWeights: Record<Difficulty, number> = {
    hard: 1,
    medium: 3,
    easy: 5,
  };

  /**
   * Método executado ao selecionar um radio button de dificuldade.
   * Aplica as regras de repetição espaçada, calcula a data final e emite via dateRevision.
   *
   * @param difficulty 'easy' | 'medium' | 'hard'
   * @param baseDate Data de referência para cálculo (padrão: data atual)
   * @returns A data calculada
   */
  onDifficultySelected(difficulty: Difficulty, baseDate: Date = new Date()): Date {
    this.selectedDifficulty = difficulty;

    const weight = this.difficultyWeights[difficulty];
    const revisionCount = this.qtdRevision ?? 1;

    let intervalDays = weight * revisionCount;

    if (intervalDays > 20) {
      intervalDays = intervalDays / 2;
    }

    // Arredondamento explícito para dias inteiros (ex: 25 / 2 = 12.5 -> 13)
    intervalDays = Math.round(intervalDays);

    const calculatedDate = new Date(baseDate.getTime());
    calculatedDate.setDate(calculatedDate.getDate() + intervalDays);

    this.dateRevision.emit(calculatedDate);
    return calculatedDate;
  }
}
