import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { type FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, onValue, ref, set } from 'firebase/database';

import { FormBuilder, FormGroup } from '@angular/forms';

import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environment';

type Chat = {
  id?: string;
  username: string;
  message: string;
  timestamp: Date;
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  app: FirebaseApp;
  db: Database;
  form: FormGroup;
  username: string = '';
  message: string = '';
  chats: Chat[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.app = initializeApp(environment.firebase);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      message: [],
      username: [],
    });
  }

  onChatSubmit(form: any): void {
    const chat = form;
    chat.timestamp = new Date().toString();
    chat.id = uuidv4();
    set(ref(this.db, `chats/${chat.id}`), chat);
    this.form = this.formBuilder.group({
      message: [],
      username: [chat.username],
    });
  }
  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      const chatsArray = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
      chatsArray.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
      this.chats = chatsArray;
    });
  }
}
