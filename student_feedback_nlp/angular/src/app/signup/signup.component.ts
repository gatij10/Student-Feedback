import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  public busy: boolean;
  selected: number = 0;

  constructor(public authService: AuthService, private router: Router) {}
  authError: any;

  ngOnInit() {
    this.authService.eventAuthError$.subscribe(data => {
      this.authError = data;
    });
  }
  createUser(frm) {
    this.busy = true;
    this.authService.createUser(frm.value, this.selected);

    setTimeout(() => {
      this.busy = false;
    }, 2000);
  }

  selectChangeHandler(event: any) {
    //update the ui
    this.selected = event.target.value;
  }
}
