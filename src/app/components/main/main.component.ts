import { Component } from '@angular/core';
import { SpeakerComponent } from '../speaker/speaker.component';

@Component({
  selector: 'app-main',
  imports: [SpeakerComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {}
