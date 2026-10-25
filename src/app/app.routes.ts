import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { TrainerComponent } from './components/trainer/trainer.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create-card', component: CreateCardComponent },
  { path: 'trainer-card', component: TrainerComponent },
];
