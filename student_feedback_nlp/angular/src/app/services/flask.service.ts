import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Feedback } from "../model/feedback";


@Injectable({
  providedIn: 'root'
})
export class FlaskService {

  constructor(private httpClient: HttpClient) { }

  public server:string = "http://localhost:5000//api/";


  public addFeedback(post1: Feedback , teacher:number){

     const {content} = post1;
     const formData: FormData = new FormData();
     formData.append("content", content);
    formData.append("teacher", teacher.toString());

     return this.httpClient.post<Feedback>(this.server + "addFeedback", formData)
  }


  public getPost(postId: string){
    return this.httpClient.get<Feedback>(this.server + `score/${postId}`)
  }

  public getAdmin(){
    return this.httpClient.get<Feedback>(this.server + "admin")
  }
  
}
