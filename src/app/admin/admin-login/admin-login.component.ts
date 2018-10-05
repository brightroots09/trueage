import { Component, OnInit } from '@angular/core';
import { Admin } from "../../admin";
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service"

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  adminModel = new Admin()
  message;

  constructor(private _router: Router, private _auth: AuthService ) { }

  ngOnInit() {
  }

  onFormSubmit() {
  }

  tryLogin(){
    this._auth.loginUser(this.adminModel)
    .then(res => {
        localStorage.setItem('token', res.token)
        this._router.navigate(["/profile"])
    }, err => {
      this.message = err.message
      console.error(err.message);
    })
  }

}
