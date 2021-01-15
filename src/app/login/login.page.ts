import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import firebase from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  auth = firebase.auth();
  firestore = firebase.firestore();
  errorCode;
  errorMessage;
  confirmEmailVerified;
  emailNotVerfied;
  loginForm = this.fb.group({
    password: ["", [Validators.required, Validators.minLength(6)]],
    email: ["", [Validators.required]],
  });

  get password() {
    return this.loginForm.get("password");
  }
  get Email() {
    return this.loginForm.get("email");
  }
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {}

  forgetPassword() {
    var auth = firebase.auth();
    var emailAddress = this.Email.value;

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(function () {
        alert("email sent!");
      })
      .catch(function (error) {
        // An error happened.
      });
  }
  verfiedEmail() {
    var user = firebase.auth().currentUser;

    user
      .sendEmailVerification()
      .then(() => {
        alert("email sent");
      })
      .catch((error) => {
        alert(error);
      });
  }
  onSubmit() {
    this.auth
      .signInWithEmailAndPassword(this.Email.value, this.password.value)
      .then((user) => {
        this.confirmEmailVerified = user.user.emailVerified;
        this.errorCode = "";
        this.errorMessage = "";
        if (this.confirmEmailVerified) {
          this.router.navigate(["home", user.user.displayName]);
        } else {
          this.emailNotVerfied = "This Email need to be verfied!";
        }
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      });
  }


}
