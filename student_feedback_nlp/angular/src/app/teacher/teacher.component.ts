import { Component, OnInit } from '@angular/core';
import { FlaskService } from "../services/flask.service";
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  score: any;



  User ;
  userid;
  currentUser : any;

  constructor(    private route : ActivatedRoute,
    private flaskApiService: FlaskService, private router: Router,
    public authService : AuthService, public angularFireAuth : AngularFireAuth, public afs: AngularFirestore) { }

  ngOnInit() {

    const id = this.route.snapshot.params['id'];
    this.getScore(id)
    
   setTimeout(() => {
    this.getCurrent()

   }, 1000);
     

  }



  getScore(id:string){
 
  this.flaskApiService.getPost(String(id)).subscribe( res => {
      
      this.score = res['data'];

      })
    }

    getCurrent() {
      this.afs.doc(`users/${this.angularFireAuth.auth.currentUser.uid}`).valueChanges().subscribe(item => {this.currentUser = item})
      
    }

}
