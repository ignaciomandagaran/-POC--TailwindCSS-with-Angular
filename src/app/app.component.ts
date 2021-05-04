import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AuthService } from 'src/services/auth.service';
import { Item } from '../models/item';
import { UUID } from 'angular2-uuid';
import { AppConstants } from './utils/constants';
import { User } from 'src/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  dataLoaded = false;

  collection: Item[] = [];
  filter: 'all' | 'active' | 'done' = 'all';
  uuidValue: string = '';
  skeletonTheme = AppConstants.skeletonTheme;

  constructor(public themeService: ThemeService,
              private firebaseService: FirebaseService,
              public authService: AuthService)
  {}

  ngOnInit(): void {
    this.themeService.getThemeValue().subscribe(value => {
      this.isDarkMode = value;
    })

    this.firebaseService.getTodoItems().subscribe(resp => {
      this.collection = resp.map((e: any) => {
        return {
          id: e.payload.doc.data().id,
          description: e.payload.doc.data().description,
          done: e.payload.doc.data().done,
          idFirebase: e.payload.doc.id
        }
      })
      this.dataLoaded = true;
    },
    error => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.themeService.themeValue.unsubscribe();
  }

  generateUUID() {
    this.uuidValue=UUID.UUID();
    return this.uuidValue;
  }

  addItem(description: string) {
    this.firebaseService.createTodoItem(
      {
        id: this.generateUUID(),
        description: description,
        done: false,
      }
    ).then(resp => {}).catch(error => {
      console.error(error);
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  checkValue(item: Item) {
    item.done = !item.done;
  }

  clearCompletedItems() {
    this.collection.forEach(item => {
      if(item.done) {
        this.firebaseService.deleteTodoItem(item.idFirebase as string);
      }
    });
  }
}
