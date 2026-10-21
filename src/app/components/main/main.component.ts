import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(private router: Router) {}
  
  goToLink(link: string): void {
    this.router.navigate([`/${link}`]);
  }
}
