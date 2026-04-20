import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClippyChatService } from '../../core/services/clippy-chat.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-clippy-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clippy-chat.component.html',
  styleUrls: ['./clippy-chat.component.scss']
})
export class ClippyChatComponent implements OnInit, OnDestroy {
  private chat = inject(ClippyChatService);
  private language = inject(LanguageService);

  open = false;
  input = '';

  messages$ = this.chat.messages$;
  typing$ = this.chat.typing$;
  connected$ = this.chat.connected$;

  ngOnInit(): void {
    this.chat.connect();
  }

  ngOnDestroy(): void {
    this.chat.disconnect();
  }

  toggle(): void {
    this.open = !this.open;
  }

  send(): void {
    const lang = this.language.getCurrentLang() as 'es' | 'en' | 'fr';
    this.chat.send(this.input, lang);
    this.input = '';
  }
}