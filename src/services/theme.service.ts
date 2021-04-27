import { DOCUMENT } from "@angular/common";
import { Injectable, Renderer2, Inject, RendererFactory2 } from "@angular/core";
import {BehaviorSubject} from 'rxjs';

export enum ThemeMode {
  DARK = "dark",
  DEFAULT = "default"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isDarkMode: boolean | undefined;
  public themeValue = new BehaviorSubject(this.localTheme);
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2)
  {
    this.renderer = rendererFactory.createRenderer(null, null);

    if (this.localTheme === ThemeMode.DARK) {
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
