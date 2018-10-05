import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _adminLoginUrl = "/admin/login";
  data;
  error;

  constructor(private http: HttpClient, private router: Router, private auth: AngularFireAuth) { }

  loginUser(user) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          res.user.getIdToken(true)
            .then(idToken => {
              resolve({admin: res, token: idToken})
            })
        }, err => reject(err)
        )
    })
  }


  loggedIn() {
    return !!localStorage.getItem('token')
  }
  logoutUser(user) {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  getToken() {
    return localStorage.getItem('token')
  }

}
