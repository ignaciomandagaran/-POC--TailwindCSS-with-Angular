import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {
  }

  getTodoItems() {
    return this.firestore.collection("items").snapshotChanges();
  }

  createTodoItem(item: Item) {
    return this.firestore.collection("items").add(item);
  }

  deleteTodoItem(id: Item['id']) {
    return this.firestore.collection("items").doc(id).delete();
  }
}
