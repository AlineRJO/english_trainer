import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCardComponent } from './create-card.component';
import { LocalStorageService } from '../../storage/local-storage.service';

describe('CreateCardComponent', () => {
  let component: CreateCardComponent;
  let fixture: ComponentFixture<CreateCardComponent>;
  let mockLocalStorageService: { create: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockLocalStorageService = {
      create: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCardComponent],
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campos vazios e inválido', () => {
    expect(component.cardForm).toBeDefined();
    expect(component.cardForm.get('title')?.value).toBe('');
    expect(component.cardForm.get('auxiliaryText')?.value).toBe('');
    expect(component.cardForm.valid).toBe(false);
  });

  it('deve validar obrigatoriedade dos campos title e auxiliaryText', () => {
    const titleControl = component.cardForm.get('title');
    const auxiliaryTextControl = component.cardForm.get('auxiliaryText');

    expect(titleControl?.hasError('required')).toBe(true);
    expect(auxiliaryTextControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Hello');
    auxiliaryTextControl?.setValue('Olá');

    expect(titleControl?.hasError('required')).toBe(false);
    expect(auxiliaryTextControl?.hasError('required')).toBe(false);
    expect(component.cardForm.valid).toBe(true);
  });

  it('deve validar o tamanho máximo dos campos (maxlength)', () => {
    const titleControl = component.cardForm.get('title');
    const auxiliaryTextControl = component.cardForm.get('auxiliaryText');

    const longTitle = 'a'.repeat(101);
    titleControl?.setValue(longTitle);
    expect(titleControl?.hasError('maxlength')).toBe(true);

    const validTitle = 'a'.repeat(100);
    titleControl?.setValue(validTitle);
    expect(titleControl?.hasError('maxlength')).toBe(false);

    const longAuxText = 'b'.repeat(301);
    auxiliaryTextControl?.setValue(longAuxText);
    expect(auxiliaryTextControl?.hasError('maxlength')).toBe(true);

    const validAuxText = 'b'.repeat(300);
    auxiliaryTextControl?.setValue(validAuxText);
    expect(auxiliaryTextControl?.hasError('maxlength')).toBe(false);
  });

  it('não deve chamar localStorageService.create e deve marcar campos como touched quando o form for inválido', () => {
    expect(component.cardForm.valid).toBe(false);

    component.onSubmit();

    expect(mockLocalStorageService.create).not.toHaveBeenCalled();
    expect(component.cardForm.get('title')?.touched).toBe(true);
    expect(component.cardForm.get('auxiliaryText')?.touched).toBe(true);
  });

  it('deve chamar localStorageService.create com dados corretos, emitir evento e resetar o form quando válido', () => {
    const spyEmit = vi.spyOn(component.cardCreated, 'emit');
    const fakeCreatedCard = {
      id: '123-abc',
      title: 'Good morning',
      auxiliaryText: 'Bom dia',
    };
    mockLocalStorageService.create.mockReturnValue(fakeCreatedCard);

    component.cardForm.setValue({
      title: '  Good morning  ',
      auxiliaryText: '  Bom dia  ',
    });

    expect(component.cardForm.valid).toBe(true);

    component.onSubmit();

    expect(mockLocalStorageService.create).toHaveBeenCalledWith({
      title: 'Good morning',
      auxiliaryText: 'Bom dia',
    });
    expect(spyEmit).toHaveBeenCalledWith(fakeCreatedCard);
    expect(component.cardForm.get('title')?.value).toBeNull();
    expect(component.cardForm.get('auxiliaryText')?.value).toBeNull();
  });

  it('deve permitir submissão através do método salvar()', () => {
    const fakeCreatedCard = {
      id: '456-def',
      title: 'Thank you',
      auxiliaryText: 'Obrigado',
    };
    mockLocalStorageService.create.mockReturnValue(fakeCreatedCard);

    component.cardForm.setValue({
      title: 'Thank you',
      auxiliaryText: 'Obrigado',
    });

    component.salvar();

    expect(mockLocalStorageService.create).toHaveBeenCalledWith({
      title: 'Thank you',
      auxiliaryText: 'Obrigado',
    });
  });
});
