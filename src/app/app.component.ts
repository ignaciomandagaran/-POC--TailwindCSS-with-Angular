import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';
import { FirebaseService } from 'src/services/firebase.service';
import { Item } from '../models/item';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';

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
  skeletonTheme = {};

  constructor(public themeService: ThemeService,
              private firebaseService: FirebaseService)
  {}

  ngOnInit(): void {
    this.themeService.getThemeValue().subscribe(value => {
      this.isDarkMode = value;

      if (this.isDarkMode) {
        this.skeletonTheme = {
          'border-radius': '4px',
          height: '240px',
          'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          'background-color': '#25273C',
          'margin-bottom': '24px'
        }
      } else {
        this.skeletonTheme = {
          'border-radius': '4px',
          height: '240px',
          'box-shadow': '0 20px 25px -5px hsla(236, 33%, 92%, 0.7), 0 10px 10px -5px hsla(236, 33%, 92%, 0.5)',
          'background-color': '#FFF',
          'margin-bottom': '24px'
        }
      }
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
