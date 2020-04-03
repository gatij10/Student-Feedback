import { Injectable } from '@angular/core';
import { feed} from '../model/feed';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  itemsCollection : AngularFirestoreCollection<feed>
  items : Observable<feed[]>
  itemDoc : AngularFirestoreDocument<feed>
  Galleryitems : any 
  approveBlog : AngularFirestoreDocument<feed>
  feedback: any;

  
  constructor(public afs: AngularFirestore, public router : Router) { 
    this.itemsCollection = this.afs.collection('feedback', ref => ref.orderBy("score" , "desc"))

  }
  getFeedbackFromFirestore() {
    this.items = this.afs.collection('feedback', ref => ref.orderBy("count", "desc")).snapshotChanges().pipe(map( changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as feed
        data.id = a.payload.doc.id;
        return data;
      })
    }))
    return this.items
  }
}
