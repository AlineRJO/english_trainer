import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { SpeakerComponent } from './speaker.component';

describe('ListenerComponent', () => {
  let component: SpeakerComponent;
  let fixture: ComponentFixture<SpeakerComponent>;
  let mockSpeechSynthesis: { speak: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
    };

    class MockSpeechSynthesisUtterance {
      text: string;
      lang = '';
      constructor(text: string) {
        this.text = text;
      }
    }

    (globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    (globalThis as any).speechSynthesis = mockSpeechSynthesis;
    (window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    (window as any).speechSynthesis = mockSpeechSynthesis;

    await TestBed.configureTestingModule({
      imports: [SpeakerComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial value for english_message and displayedText', () => {
    expect(component.english_message).toBe('I speak English now!');
    expect(component.displayedText).toBe('I speak English now!');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.current-message')?.textContent).toContain('I speak English now!');
  });

  it('should have empty initial value for newPhrase and 0/100 counter', () => {
    expect(component.newPhrase).toBe('');
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('');
    const counter = fixture.nativeElement.querySelector('.char-count') as HTMLElement;
    expect(counter.textContent).toContain('0/100');
  });

  it('should call speak and update displayedText when play button is clicked with typed text', async () => {
    const speakSpy = vi.spyOn(component, 'speak');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    component.newPhrase = 'Practice makes perfect!';
    fixture.detectChanges();
    await fixture.whenStable();

    button.click();
    fixture.detectChanges();

    expect(speakSpy).toHaveBeenCalledWith('Practice makes perfect!');
    expect(component.displayedText).toBe('Practice makes perfect!');
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  it('should automatically speak when english_message input changes', () => {
    const speakSpy = vi.spyOn(component, 'speak');
    const newMessage = 'Good morning everyone!';

    component.english_message = newMessage;
    component.ngOnChanges({
      english_message: new SimpleChange('I speak English now!', newMessage, false),
    });
    fixture.detectChanges();

    expect(speakSpy).toHaveBeenCalledWith(newMessage);
    expect(component.displayedText).toBe(newMessage);
  });
});
