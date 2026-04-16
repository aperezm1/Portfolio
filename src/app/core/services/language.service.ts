import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  
  private readonly langKey = 'lang';
  private readonly defaultLang = 'es';

  initLang(): string {
    const lang = this.getCurrentLang();
    this.translate.use(lang);
    return lang;
  }

  getCurrentLang(): string {
    return localStorage.getItem(this.langKey) || this.defaultLang;
  }

  setLang(lang: string): void {
    localStorage.setItem(this.langKey, lang);
    this.translate.use(lang);
  }
}