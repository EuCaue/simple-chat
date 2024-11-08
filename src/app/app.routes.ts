import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatComponent } from './features/chat/chat.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'chat', component: ChatComponent },
];
