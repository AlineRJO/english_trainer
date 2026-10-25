import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TrainerComponent } from './trainer.component';
import { LocalStorageService } from '../../storage/local-storage.service';

describe('TrainerComponent', () => {
  let component: TrainerComponent;
  let fixture: ComponentFixture<TrainerComponent>;
  let mockLocalStorageService: {
    read: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  const fakeCards = [
    {
      id: 1,
      title: 'Apple',
      auxiliaryText: 'Maçã',
      qtdRevision: 1,
    },
    {
      id: 2,
      title: 'Book',
      auxiliaryText: 'Livro',
      qtdRevision: 3,
    },
  ];

  beforeEach(async () => {
    mockLocalStorageService = {
      read: vi.fn().mockReturnValue(of(fakeCards)),
      update: vi.fn().mockReturnValue(of({ success: true })),
    };

    await TestBed.configureTestingModule({
      imports: [TrainerComponent],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ao inicializar, currentCard deve ser o primeiro item da lista mockada', () => {
    expect(mockLocalStorageService.read).toHaveBeenCalled();
    expect(component.cards.length).toBe(2);
    expect(component.currentIndex).toBe(0);
    expect(component.currentCard).toEqual(fakeCards[0]);
    expect(component.isFlipped).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title-text')?.textContent).toContain('Apple');
  });

  it('ao clicar em "Visualizar resposta", isFlipped deve se tornar true', () => {
    expect(component.isFlipped).toBe(false);

    const flipButton = fixture.nativeElement.querySelector('.btn-flip') as HTMLButtonElement;
    expect(flipButton).toBeTruthy();

    flipButton.click();
    fixture.detectChanges();

    expect(component.isFlipped).toBe(true);

    const flipInner = fixture.nativeElement.querySelector('.card-flip-inner');
    expect(flipInner?.classList.contains('flipped')).toBe(true);
  });

  it('ao emitir dateRevision do self-assessment, localStorageService.update deve ser chamado com os dados corretos e avançar para o próximo card', () => {
    const testDate = new Date(2026, 9, 28);

    component.onDateRevision(testDate);

    // Incrementa qtdRevision (1 + 1 = 2) e chama update
    expect(mockLocalStorageService.update).toHaveBeenCalledWith(1, {
      nextRevisionDate: testDate,
      qtdRevision: 2,
    });

    // Avança para o segundo card
    expect(component.currentIndex).toBe(1);
    expect(component.currentCard).toEqual(fakeCards[1]);
    expect(component.isFlipped).toBe(false);
  });

  it('deve exibir mensagem de "Revisão concluída" quando todos os cards forem revisados', () => {
    const testDate = new Date(2026, 9, 30);

    // Revisa o primeiro card
    component.onDateRevision(testDate);
    expect(component.currentIndex).toBe(1);

    // Revisa o segundo (último) card
    component.onDateRevision(testDate);
    fixture.detectChanges();

    expect(component.currentIndex).toBe(2);
    expect(component.currentCard).toBeNull();
    expect(component.isFinished).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.finished-state')?.textContent).toContain('Revisão concluída');
  });

  it('deve exibir mensagem de estado vazio quando a lista de cards estiver vazia', () => {
    mockLocalStorageService.read.mockReturnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.cards.length).toBe(0);
    expect(component.currentCard).toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')?.textContent).toContain(
      'Nenhum card disponível para revisão'
    );
  });
});
