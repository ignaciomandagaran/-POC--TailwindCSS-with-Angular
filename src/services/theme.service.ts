import { DOCUMENT } from "@angular/common";
import { Injectable, Renderer2, Inject, RendererFactory2 } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

export enum ThemeMode {
  DARK = "dark",
  DEFAULT = "default"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themeQuery: MediaQueryList | undefined;
  public isDarkMode: boolean | undefined;
  public themeValue = new BehaviorSubject(this.localTheme);
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
    private media: MediaMatcher)
  {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.themeQuery = this.media.matchMedia('(prefers-color-scheme: dark)');

    if (this.localTheme === ThemeMode.DARK || this.themeQuery.matches) {
      this.localTheme = ThemeMode.DARK;
      this.isDarkMode = true;
      this.renderer.addClass(this.document.body, ThemeMode.DARK);
    } else {
      this.renderer.removeClass(this.document.body, ThemeMode.DEFAULT);
    }
  }

  public toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.localTheme = ThemeMode.DARK;
      this.renderer.addClass(this.document.body, ThemeMode.DARK);
    } else {
      this.localTheme = ThemeMode.DEFAULT;
      this.renderer.removeClass(this.document.body, ThemeMode.DARK);
    }
  }

  set localTheme(value: string) {
    this.themeValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('theme', value);
  }

  get localTheme() {
    return localStorage.getItem('theme') as string;
  }
}
