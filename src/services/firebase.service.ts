import { Injectable } from '@angular/core';
import * as TodoActions from 'src/app/store/actions/todo.actions';
import * as fromTodoReducer from 'src/app/store/reducers/todo.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/models/user';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {
  }

  getTodoItems(userUid: User['uid']) {
    return this.firestore.collection("items", ref => ref.orderBy('date', 'asc').where('userUid', '==', userUid)).snapshotChanges();
  }

  createTodoItem(item: Item) {
    return this.firestore.collection("items").add(item);
  }

  deleteTodoItem(id: Item['idFirebase']) {
    return this.firestore.collection("items").doc(id).delete();
  }

  updateItemState(id: Item['idFirebase'],state: Item['done']) {
    return this.firestore.collection("items").doc(id).update({done: state});
  }
}
