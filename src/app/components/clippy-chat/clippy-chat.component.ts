import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClippyChatService } from '../../core/services/clippy-chat.service';

@Component({
  selector: 'app-clippy-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clippy-chat.component.html',
  styleUrls: ['./clippy-chat.component.scss']
})
export class ClippyChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private chat = inject(ClippyChatService);
  private uiSub = new Subscription();

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  open = false;
  input = '';

  messages$ = this.chat.messages$;
  typing$ = this.chat.typing$;
  connected$ = this.chat.connected$;

  ngOnInit(): void {
    this.chat.connect();
  }

  ngAfterViewInit(): void {
    this.uiSub.add(
      this.messages$.subscribe(() => this.scrollToBottomSoon())
    );
    this.uiSub.add(
      this.typing$.subscribe(() => this.scrollToBottomSoon())
    );
  }

  ngOnDestroy(): void {
    this.uiSub.unsubscribe();
    this.chat.disconnect();
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) this.scrollToBottomSoon();
  }

  send(): void {
    this.chat.send(this.input);
    this.input = '';
    this.scrollToBottomSoon();
  }

  private scrollToBottomSoon(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = this.messagesContainer?.nativeElement;
        if (!el) return;
        el.scrollTop = el.scrollHeight + 9999;
      });
    });
  }
}