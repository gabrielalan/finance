import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import FirebaseConfig from "./firebase.config";
import { environment } from '../../../environments/environment';

@Injectable()
export class DatabaseService {

  app: any;

  constructor() {
    this.app = firebase.initializeApp(FirebaseConfig);
  }

  ref(path) {
    return this.app.database().ref(`${environment.database.prefix}/${path}`);
  }
}
