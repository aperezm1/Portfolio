import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private readonly userNameKey = 'xp_user_name';

  setUserName(name: string): void {
    localStorage.setItem(this.userNameKey, name);
  }

  getUserName(): string {
    return localStorage.getItem(this.userNameKey) ?? '';
  }

  clearUserName(): void {
    localStorage.removeItem(this.userNameKey);
  }
}