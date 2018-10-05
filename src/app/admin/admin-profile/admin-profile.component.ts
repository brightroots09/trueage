import { Component, OnInit } from '@angular/core';
import { Admin } from '../../admin';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  adminModel;
  error;
  filtersLoaded: Promise<boolean>;

  constructor(private router: Router, private admin: AdminService) { }

  async ngOnInit() {
    await this.getProfile()
  }

  getProfile(){
    this.admin.adminProfile()
      .subscribe(res => {
        console.log(res)
        this.adminModel = res
        this.filtersLoaded = Promise.resolve(true);
      }, error => {
        this.error = error
      })
  }

}
