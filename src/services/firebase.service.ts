import { Injectable } from '@angular/core';
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
}
