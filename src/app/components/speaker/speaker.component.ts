import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-speaker',
  imports: [CommonModule, FormsModule],
  templateUrl: './speaker.component.html',
  styleUrl: './speaker.component.scss'
})
export class SpeakerComponent implements OnChanges {
  @Input() english_message: string = 'I speak English now!';
  newPhrase: string = '';
  displayedText: string = 'I speak English now!';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['english_message']) {
      const value = changes['english_message'].currentValue || '';
      this.displayedText = value.substring(0, 100);
      this.speak(this.displayedText);
    }
  }

  speak(text: string): void {
    if (!text) return;
    const cleanText = text.substring(0, 100);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  playNewPhrase(): void {
    const trimmed = this.newPhrase.trim();
    if (trimmed) {
      this.displayedText = this.newPhrase.substring(0, 100);
      this.english_message = this.displayedText;
      this.speak(this.newPhrase);
    }
  }
}
