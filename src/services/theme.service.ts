import { DOCUMENT } from "@angular/common";
import { Injectable, Renderer2, Inject, RendererFactory2 } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ThemeMode {
  DARK = "dark",
  DEFAULT = "default"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;
  private renderer: Renderer2;
  private themeQuery: MediaQueryList | undefined;
  public themeValue = new BehaviorSubject<boolean>(this.isDarkMode);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
    private media: MediaMatcher)
  {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.themeQuery = this.media.matchMedia('(prefers-color-scheme: dark)');

    if (this.themeQuery.matches && this.localTheme === null) {
      this.isDarkMode = true;
      this.setThemeValue(this.isDarkMode);
      this.renderer.addClass(this.document.body, ThemeMode.DARK);
    }
    else if (this.localTheme !== null) {
      if (this.localTheme === ThemeMode.DARK) {
        this.isDarkMode = true;
        this.setThemeValue(this.isDarkMode);
        this.renderer.addClass(this.document.body, ThemeMode.DARK);
      }
      else {
        this.isDarkMode = false;
        this.setThemeValue(this.isDarkMode);
        this.renderer.removeClass(this.document.body, ThemeMode.DARK);
      }
    }
  }

  public toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.setThemeValue(this.isDarkMode);

    if (this.isDarkMode) {
      this.localTheme = ThemeMode.DARK;
      this.renderer.addClass(this.document.body, ThemeMode.DARK);
    } else {
      this.localTheme = ThemeMode.DEFAULT;
      this.renderer.removeClass(this.document.body, ThemeMode.DARK);
    }
  }

  public getThemeValue(): Observable<boolean> {
    return this.themeValue.asObservable();
  }

  public setThemeValue(newValue: boolean): void {
    this.themeValue.next(newValue);
  }

  set localTheme(value: string) {
    localStorage.setItem('theme', value);
  }

  get localTheme() {
    return localStorage.getItem('theme') as string;
  }
}
