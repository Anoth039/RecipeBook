import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'recipebook_theme';
  isDark$ = new BehaviorSubject<boolean>(this.getStoredPreference());

  constructor() {
    this.applyClass(this.isDark$.value);
  }

  toggle() {
    const next = !this.isDark$.value;
    this.isDark$.next(next);
    localStorage.setItem(this.storageKey, next ? 'dark' : 'light');
    this.applyClass(next);
  }

  private getStoredPreference(): boolean {
    return localStorage.getItem(this.storageKey) === 'dark';
  }

  private applyClass(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
