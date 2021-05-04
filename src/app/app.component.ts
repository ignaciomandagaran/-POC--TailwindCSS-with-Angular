import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AuthService } from 'src/services/auth.service';
import { Item } from '../models/item';
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
  skeletonTheme = AppConstants.skeletonTheme;

  constructor(public themeService: ThemeService,
              private firebaseService: FirebaseService,
              public authService: AuthService)
  {}

  async ngOnInit() {
    this.themeService.getThemeValue().subscribe(value => {
      this.isDarkMode = value;
    })

    if(!this.authService.userData && localStorage.getItem('userUid')) {
      this.getItems(localStorage.getItem('userUid'));
    }
  }

  ngOnDestroy(): void {
    this.themeService.themeValue.unsubscribe();
  }

  async login() {
    await this.authService.GoogleAuth();
    this.getItems(this.authService.userData.uid);
  }

  getItems(userUid: User['uid']) {
    this.firebaseService.getTodoItems(userUid).subscribe(resp => {
      this.collection = resp.map((e: any) => {
        return {
          userUid: e.payload.doc.data().userUid,
          description: e.payload.doc.data().description,
          done: e.payload.doc.data().done,
          idFirebase: e.payload.doc.id,
          date: e.payload.doc.date
        }
      })
      this.dataLoaded = true;
    },
    error => {
      console.error(error);
    });
  }

  addItem(description: string) {
    this.firebaseService.createTodoItem(
      {
        userUid: this.authService.userData.uid,
        description: description,
        done: false,
        date: new Date()
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
