import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({ providedIn: 'root' })
export class ClippyChatService {
  private socket: Socket | null = null;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private typingSubject = new BehaviorSubject<boolean>(false);
  typing$ = this.typingSubject.asObservable();

  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  connect(): void {
    if (this.socket) return;

    this.socket = io(environment.chatSocketUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 5000
    });

    this.socket.on('connect', () => this.connectedSubject.next(true));
    this.socket.on('disconnect', () => this.connectedSubject.next(false));

    this.socket.on('chat:bot_typing', (payload: { typing: boolean }) => {
      this.typingSubject.next(Boolean(payload?.typing));
    });

    this.socket.on('chat:bot_message', (payload: { text: string; ts: number }) => {
      this.push({ from: 'bot', text: payload.text, ts: payload.ts || Date.now() });
    });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.connectedSubject.next(false);
    this.typingSubject.next(false);
  }

  send(text: string, lang: 'es' | 'en' | 'fr' = 'es'): void {
    const clean = text.trim();
    if (!clean || !this.socket) return;
    this.push({ from: 'user', text: clean, ts: Date.now() });
    this.socket.emit('chat:user_message', { text: clean, lang });
  }

  clear(): void {
    this.messagesSubject.next([]);
  }

  private push(message: ChatMessage): void {
    const next = [...this.messagesSubject.value, message];
    this.messagesSubject.next(next);
  }
}