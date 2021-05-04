import { Injectable } from "@angular/core";
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import { User } from "src/models/user";

@Injectable({
  providedIn:  'root'
})
export  class  AuthService {
  userData: User;

  constructor(public  fireauth:  AngularFireAuth,
              public firestore: AngularFirestore) {
    this.fireauth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
      }
    })
  }

  // Sign in with Google
  async GoogleAuth() {
    return await this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    try {
      const result = await this.fireauth.signInWithPopup(provider);
      await this.SetUserData(result.user);
    } catch (error) {
      window.alert(error);
    }
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  async SignOut() {
    await this.fireauth.signOut();
    this.userData = null;
  }
}
