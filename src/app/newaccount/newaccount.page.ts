import { Component, OnInit } from "@angular/core";

import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PasswordValidator } from "src/app/shared/password.validator";
import { forbiddenNameValidator } from "src/app/shared/user-name.validator";
import firebase from "firebase";

@Component({
  selector: "app-newaccount",
  templateUrl: "./newaccount.page.html",
  styleUrls: ["./newaccount.page.scss"],
})
export class NewaccountPage implements OnInit {
  auth = firebase.auth();
  id: number;
  email: string;
  firestore = firebase.firestore();
  emailVerified: boolean;
  theUserExists;
  thereAuser;
  emailNotcorrect;
  registrationForm = this.fb.group(
    {
      userName: ["", [Validators.required, forbiddenNameValidator(/admin/)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required]],
    },
    { validator: PasswordValidator }
  );
  get userName() {
    return this.registrationForm.get("userName");
  }

  get confirmpassword() {
    return this.registrationForm.get("confirmPassword");
  }

  get password() {
    return this.registrationForm.get("password");
  }
  get Email() {
    return this.registrationForm.get("email");
  }
  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group(
      {
        userName: ["", [Validators.required, forbiddenNameValidator(/admin/)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
        email: ["", [Validators.required]],
      },
      { validator: PasswordValidator }
    );
  }

  ngOnInit() {}

  onSubmit() {
    this.auth
      .signInWithEmailAndPassword(this.Email.value, this.password.value)
      .then((user) => {
        this.theUserExists = "This Account is already exsisted!";
        this.thereAuser = user;
      })
      .catch((error) => {});
    console.log(this.thereAuser);
    if (this.thereAuser) {
    } else {
      if (!this.theUserExists) {
        this.auth
          .createUserWithEmailAndPassword(this.Email.value, this.password.value)
          .then((cred) => {
            console.log(cred);

            var user = firebase.auth().currentUser;
            user.updateProfile({
              displayName: this.userName.value,
            });
            user
              .sendEmailVerification()
              .then(() => {
                alert("A verification email has been sent");
                this.emailVerified = true;
                this.router.navigate(["/login"]);
              })
              .catch((error) => {
                alert(error);
              });
            var OwnDoc = this.firestore.doc(
              "customData/" + this.userName.value
            );

            OwnDoc.set({
              Name: this.userName.value,
              email: this.Email.value,
            });

         
          })
          .catch((error) => {
            this.emailNotcorrect = error;
          });
      }
    }
  }
  
  back() {
    this.router.navigate(["/login"]);
  }
}
