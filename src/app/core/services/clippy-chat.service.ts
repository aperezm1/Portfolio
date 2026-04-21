import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { WsChatMessage } from '../models/ws-chat-message.model';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class ClippyChatService {
  private socket?: WebSocketSubject<WsChatMessage>;
  private socketSubscription?: Subscription;
  private reconnectAttempts = 0;
  private manualClose = false;
  private language = inject(LanguageService);

  private readonly messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();

  private readonly typingSubject = new BehaviorSubject<boolean>(false);
  readonly typing$ = this.typingSubject.asObservable();

  private readonly connectedSubject = new BehaviorSubject<boolean>(false);
  readonly connected$ = this.connectedSubject.asObservable();

  connect(url: string = environment.chatSocketUrl): void {
    if (this.socket && !this.socket.closed) return;

    this.manualClose = false;
    this.connectedSubject.next(false);

    const lang = this.language.getCurrentLang() as 'es' | 'en' | 'fr';
    const wsUrl = `${url}?lang=${lang}`;

    this.socket = webSocket<WsChatMessage>({
      url: wsUrl,
      serializer: (msg) => JSON.stringify(msg),
      deserializer: (event) => this.deserializeMessage(String(event.data)),
      openObserver: {
        next: () => {
          this.reconnectAttempts = 0;
          this.connectedSubject.next(true);
        }
      },
      closeObserver: {
        next: () => {
          this.connectedSubject.next(false);
        }
      }
    });

    this.socketSubscription = this.socket.subscribe({
      next: (message) => this.handleIncomingMessage(message),
      error: () => {
        this.connectedSubject.next(false);
        this.typingSubject.next(false);
        this.tryReconnect(url);
      },
      complete: () => {
        this.connectedSubject.next(false);
        this.typingSubject.next(false);
      }
    });
  }

  disconnect(): void {
    this.manualClose = true;
    this.socketSubscription?.unsubscribe();
    this.socket?.complete();
    this.socket = undefined;
    this.reconnectAttempts = 0;
    this.connectedSubject.next(false);
    this.typingSubject.next(false);
  }

  send(text: string): void {
    const clean = text.trim();
    if (!clean || !this.socket || this.socket.closed) return;

    const lang = this.language.getCurrentLang() as 'es' | 'en' | 'fr';
    this.push({ from: 'user', text: clean, ts: Date.now() });

    if (clean.toLowerCase() === 'ping') {
      this.typingSubject.next(true);
      this.socket.next({
        type: 'ping',
        payload: { text: clean, lang },
        from: 'user',
        timestamp: new Date().toISOString()
      });
      return;
    }

    this.typingSubject.next(true);
    this.socket.next({
      type: 'chat',
      payload: { text: clean, lang },
      from: 'user',
      timestamp: new Date().toISOString()
    });
  }

  clear(): void {
    this.messagesSubject.next([]);
  }

  private handleIncomingMessage(message: WsChatMessage): void {
    if (message.type === 'chat') {
      if (message.from === 'user') return;

      const text = this.resolveText(message);
      if (!text) return;

      this.typingSubject.next(false);
      this.push({
        from: 'bot',
        text,
        ts: this.toTimestamp(message.timestamp)
      });
      return;
    }

    if (message.type === 'notification' || message.type === 'status' || message.type === 'pong') {
      this.typingSubject.next(false);
    }
  }

  private resolveText(message: WsChatMessage): string {
    if (message.payload?.text) return String(message.payload.text);
    if (message.payload?.textKey) return String(message.payload.textKey);
    return '';
  }

  private deserializeMessage(rawData: string): WsChatMessage {
    const parsed = JSON.parse(rawData) as Partial<WsChatMessage>;
    const payload = parsed.payload ?? {};

    return {
      type: this.normalizeType(parsed.type),
      payload: {
        text: payload.text ? String(payload.text) : undefined,
        textKey: payload.textKey ? String(payload.textKey) : undefined,
        lang: payload.lang
      },
      from: this.normalizeFrom(parsed.from),
      timestamp: parsed.timestamp ? String(parsed.timestamp) : new Date().toISOString()
    };
  }

  private normalizeType(type: WsChatMessage['type'] | string | undefined): WsChatMessage['type'] {
    const allowed: WsChatMessage['type'][] = ['chat', 'notification', 'status', 'ping', 'pong'];
    return allowed.includes(type as WsChatMessage['type']) ? (type as WsChatMessage['type']) : 'notification';
  }

  private normalizeFrom(from: WsChatMessage['from'] | string | undefined): WsChatMessage['from'] {
    const allowed: WsChatMessage['from'][] = ['user', 'bot', 'system'];
    return allowed.includes(from as WsChatMessage['from']) ? (from as WsChatMessage['from']) : 'system';
  }

  private tryReconnect(url: string): void {
    if (this.manualClose) return;
    if (this.reconnectAttempts >= 5) return;

    this.reconnectAttempts += 1;
    timer(1500 * this.reconnectAttempts).subscribe(() => this.connect(url));
  }

  private push(message: ChatMessage): void {
    this.messagesSubject.next([...this.messagesSubject.value, message]);
  }

  private toTimestamp(value: string): number {
    const ts = Date.parse(value);
    return Number.isNaN(ts) ? Date.now() : ts;
  }
}