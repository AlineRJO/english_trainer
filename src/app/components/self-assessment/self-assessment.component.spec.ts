import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfAssessmentComponent } from './self-assessment.component';

describe('SelfAssessmentComponent', () => {
  let component: SelfAssessmentComponent;
  let fixture: ComponentFixture<SelfAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfAssessmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve criar o componente com valor padrão de qtdRevision = 1', () => {
    expect(component).toBeTruthy();
    expect(component.qtdRevision).toBe(1);
    expect(component.selectedDifficulty).toBeNull();
  });

  it('cenário 1: qtdRevision não informado (valor padrão 1), dificuldade "hard" (peso 1) -> intervalDays = 1 -> data emitida = hoje + 1 dia', () => {
    const fixedNow = new Date(2026, 9, 23, 12, 0, 0); // 23/10/2026 12:00
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    let emittedDate: Date | undefined;
    component.dateRevision.subscribe((date) => (emittedDate = date));

    // qtdRevision não informado (permanece 1)
    const result = component.onDifficultySelected('hard');

    const expectedDate = new Date(2026, 9, 24, 12, 0, 0); // hoje + 1 dia
    expect(emittedDate).toEqual(expectedDate);
    expect(result).toEqual(expectedDate);
    expect(component.selectedDifficulty).toBe('hard');
  });

  it('cenário 2: qtdRevision = 2, dificuldade "hard" (peso 1) -> intervalDays = 2 -> data emitida = hoje + 2 dias', () => {
    const fixedNow = new Date(2026, 9, 23, 12, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    component.qtdRevision = 2;

    let emittedDate: Date | undefined;
    component.dateRevision.subscribe((date) => (emittedDate = date));

    const result = component.onDifficultySelected('hard');

    const expectedDate = new Date(2026, 9, 25, 12, 0, 0); // hoje + 2 dias
    expect(emittedDate).toEqual(expectedDate);
    expect(result).toEqual(expectedDate);
  });

  it('cenário 3: qtdRevision = 5, dificuldade "easy" (peso 5) -> intervalDays bruto = 25 (> 20), então 25 / 2 = 12.5 dias arredondado com Math.round para 13 dias -> hoje + 13 dias', () => {
    const fixedNow = new Date(2026, 9, 23, 12, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    component.qtdRevision = 5;

    let emittedDate: Date | undefined;
    component.dateRevision.subscribe((date) => (emittedDate = date));

    const result = component.onDifficultySelected('easy');

    // 23 de Outubro + 13 dias = 5 de Novembro de 2026
    const expectedDate = new Date(2026, 10, 5, 12, 0, 0);
    expect(emittedDate).toEqual(expectedDate);
    expect(result).toEqual(expectedDate);
  });

  it('cenário adicional: dificuldade "medium" (peso 3) com qtdRevision = 1 -> intervalDays = 3 -> hoje + 3 dias', () => {
    const fixedNow = new Date(2026, 9, 23, 12, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    component.qtdRevision = 1;

    let emittedDate: Date | undefined;
    component.dateRevision.subscribe((date) => (emittedDate = date));

    const result = component.onDifficultySelected('medium');

    const expectedDate = new Date(2026, 9, 26, 12, 0, 0); // hoje + 3 dias
    expect(emittedDate).toEqual(expectedDate);
    expect(result).toEqual(expectedDate);
  });

  it('deve renderizar os 3 radio buttons no template com classes de cores e emitir data ao selecionar', async () => {
    const fixedNow = new Date(2026, 9, 23, 12, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    let emittedDate: Date | undefined;
    component.dateRevision.subscribe((date) => (emittedDate = date));

    const compiled = fixture.nativeElement as HTMLElement;
    const easyRadio = compiled.querySelector('.radio-easy');
    const mediumRadio = compiled.querySelector('.radio-medium');
    const hardRadio = compiled.querySelector('.radio-hard');

    expect(easyRadio).toBeTruthy();
    expect(mediumRadio).toBeTruthy();
    expect(hardRadio).toBeTruthy();

    const easyInput = compiled.querySelector('.radio-easy input') as HTMLInputElement;
    easyInput.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const expectedDate = new Date(2026, 9, 28, 12, 0, 0); // 23/10 + 5 dias = 28/10
    expect(emittedDate).toEqual(expectedDate);
    expect(component.selectedDifficulty).toBe('easy');
  });
});
