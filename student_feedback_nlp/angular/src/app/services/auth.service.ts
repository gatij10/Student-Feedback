import { Injectable, NgZone } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import * as firebase from "firebase/app";
import { async } from "@angular/core/testing";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userData: any; // Save logged in user data
  itemdoc: AngularFirestoreDocument;
  authState: any = null;
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;
  log: any;
  User;
  selectedUser: number;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
    this.afAuth.authState.subscribe(data => (this.authState = data));
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  // Sign out
  async SignOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem("user");
    this.router.navigate(["login"]);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null ? true : false;
  }
  // Testing
  login(email: string, password: string) {
    this.log = true;
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(async error => {
        this.eventAuthError.next(error);
        window.alert(error);
        this.log = false;
      })
      .then(async userCredential => {
        if (userCredential) {
          this.router.navigate(["/home"]);
        } else {
          if (this.log) {
            this.logout().then(() => this.router.navigate(["/login"]));
          }
        }
      });
  }

  adminlogin(email: string, password: string) {
    this.log = true;
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(async error => {
        this.eventAuthError.next(error);
        window.alert(error);
        this.log = false;
      })
      .then(async userCredential => {
        if (userCredential) {
          this.router.navigate(["/adminPanel"]);
        } else {
          if (this.log) {
            window.alert("Verify Email");
            this.logout().then(() => this.router.navigate(["/home"]));
          }
        }
      });
  }

  getUserState() {
    return this.afAuth.authState;
  }

  createUser(user, selected) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)

      .then(async userCredential => {
        this.newUser = user;
        userCredential.user.updateProfile({
          displayName: user.firstName
        });
        this.selectedUser = selected;
        this.insertUserData(userCredential).then(res => {
          this.router.navigate["/home"];
          this.logout();
        });
      })
      .catch(error => {
        this.eventAuthError.next(error);
        window.alert(error);
      });
  }
  async ForgotPassword(passwordResetEmail) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
      window.alert("Password reset email sent, check your inbox.");
    } catch (error) {
      window.alert(error);
    }
  }
  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.afs.doc(`users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      id: this.newUser.firstName,
      nav: this.selectedUser,
      admin: false
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  adminlogout() {
    this.logout().then(() => this.router.navigate(["/home"]));
  }
}
