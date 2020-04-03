import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FlaskService } from "../services/flask.service";
import { Router } from "@angular/router";
import { Feedback } from "../model/feedback";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  public busy: boolean;
  public teacher:string;
  public selected: number = 0;

  currentUser : any;

  constructor(private flaskApiService: FlaskService, private router: Router,public angularFireAuth : AngularFireAuth, public afs: AngularFirestore) { }

  public postForm = new FormGroup({

    content: new FormControl('',  Validators.required)
    
  });


  public addFeedback(formData: Feedback){
    this.busy = true;
   
      this.flaskApiService.addFeedback(formData , this.selected).subscribe(res => {
        this.busy = false;
        this.selected=0;
        console.log(res);
        this.router.navigate(["/feedback"]);
        
      });
    

  }

  selectChangeHandler (event: any) {
    //update the ui
    this.selected = event.target.value;
  }


  ngOnInit() {
    this.afs.doc(`users/${this.angularFireAuth.auth.currentUser.uid}`).valueChanges().subscribe(item => {this.currentUser = item})

  }

}
