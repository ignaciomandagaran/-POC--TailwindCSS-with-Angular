import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeMode, ThemeService } from 'src/services/theme.service';
import { Item } from './item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkMode: boolean | undefined;
  isDarkModeSubscription = new Subscription();

  title = 'todo';
  filter: 'all' | 'active' | 'done' = 'all';

  allItems: Item[] = [
    { description: 'eat', done: true },
    { description: 'sleep', done: false },
    { description: 'play', done: false },
    { description: 'laugh', done: false },
  ];

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.themeValue.subscribe(value => {
      if(value === ThemeMode.DARK) {
        this.isDarkMode = true;
      } else {
        this.isDarkMode = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.themeService.themeValue.unsubscribe();
  }

  get items() {
    if (this.filter === 'all') {
      return this.allItems;
    }
    return this.allItems.filter(item => this.filter === 'done' ? item.done : !item.done);
  }

  addItem(description: string) {
    this.allItems.unshift({
      description,
      done: false
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  checkValue(item: Item) {
    item.done = !item.done;
 }
}
