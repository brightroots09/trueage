import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-view-coupons',
  templateUrl: './view-coupons.component.html',
  styleUrls: ['./view-coupons.component.css']
})
export class ViewCouponsComponent implements OnInit {

  couponsModel;
  filtersLoaded: Promise<boolean>;

  constructor(private router: Router, private admin: AdminService) { }

  async ngOnInit() {
    await this.getCoupons()
  }

  getCoupons(){
    this.admin.viewCoupons()
      .subscribe(res => {
        console.log(res)
        this.couponsModel = res
        this.filtersLoaded = Promise.resolve(true)
      }, error => {
        console.error(error)
      })
  }

}
