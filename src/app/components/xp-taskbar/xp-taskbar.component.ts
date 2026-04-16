import { Component, EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-xp-taskbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, TranslatePipe],
  templateUrl: './xp-taskbar.component.html',
  styleUrls: ['./xp-taskbar.component.scss']
})
export class XpTaskbarComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private timerId: ReturnType<typeof setInterval> | null = null;

  @Output() start = new EventEmitter<void>();

  time = '';
  currentLang = 'ES';

  constructor() {
    const lang = this.languageService.getCurrentLang() || 'es';
    this.currentLang = this.toTaskbarLang(lang);
    this.updateTime();

    this.timerId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  onStart(): void {
    this.start.emit();
  }

  setLang(code: 'es' | 'en' | 'fr'): void {
    this.languageService.setLang(code);
    this.currentLang = this.toTaskbarLang(code);
  }

  private toTaskbarLang(code: string): string {
    const normalized = (code || 'es').toLowerCase();
    if (normalized === 'es') return 'ES';
    if (normalized === 'en') return 'EN';
    if (normalized === 'fr') return 'FR';
    return normalized.slice(0, 2).toUpperCase();
  }

  private updateTime(): void {
    const now = new Date();
    this.time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}