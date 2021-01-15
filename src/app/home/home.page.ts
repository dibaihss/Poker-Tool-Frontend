import { Component } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Store } from "@ngrx/store";
import { Appstate } from "../app.state";
import firebase from "firebase";

import * as AppActions from "../actions/app.actions";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  currentUserName;
  toggleOptions = true;
  firestore = firebase.firestore();

  constructor(
    private router: Router,
    private store: Store<Appstate>,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let nameUrl = params.get("MemberName");

      this.currentUserName = nameUrl;
    });
  }

  showProfiloptions() {
    this.toggleOptions = !this.toggleOptions;
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      this.router.navigate(["/login"]);
    } catch (error) {
      console.log(error);
    }
  }

  CreateClicked() {
    this.store.dispatch(new AppActions.CreateRommView(true));
    this.store.dispatch(new AppActions.ShowJoinView(false));

    this.router.navigate(["/home", this.currentUserName, "register"]);
  }

  JoinClicked() {
    this.store.dispatch(new AppActions.ShowJoinView(true));
    this.store.dispatch(new AppActions.CreateRommView(false));

    this.router.navigate(["/home", this.currentUserName, "register"]);
  }
}
