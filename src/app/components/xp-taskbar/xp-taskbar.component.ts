import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { DesktopWindow } from '../../core/models/desktop-window.model';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-xp-taskbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, TranslatePipe],
  templateUrl: './xp-taskbar.component.html',
  styleUrls: ['./xp-taskbar.component.scss'],
})
export class XpTaskbarComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  @Input() windows: DesktopWindow[] = [];
  @Output() start = new EventEmitter<void>();
  @Output() windowTabClick = new EventEmitter<string>();

  time = '';
  currentLang = 'ES';

  constructor() {
    const lang = this.languageService.getCurrentLang();
    this.currentLang = lang.toUpperCase();
    this.updateTime();

    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    this.timeoutId = setTimeout(() => {
      this.updateTime();
      this.intervalId = setInterval(() => this.updateTime(), 60_000);
      this.timeoutId = null;
    }, msToNextMinute);

    if (msToNextMinute <= 0) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.intervalId = setInterval(() => this.updateTime(), 60_000);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onStart(): void {
    this.start.emit();
  }

  onWindowTabClick(id: string): void {
    this.windowTabClick.emit(id);
  }

  setLang(code: 'es' | 'en' | 'fr'): void {
    this.languageService.setLang(code);
    this.currentLang = code.toUpperCase();
  }

  private updateTime(): void {
    const now = new Date();
    this.time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}