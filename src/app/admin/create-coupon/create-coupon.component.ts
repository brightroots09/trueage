import { Component, OnInit } from '@angular/core';
import { Coupoon } from '../../coupon';
import { Router } from '../../../../node_modules/@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css']
})
export class CreateCouponComponent implements OnInit {

  couponsModel = new Coupoon()
  message;

  constructor(private router: Router, private admin: AdminService) { }

  ngOnInit() {
  }

  onFormSubmit(){
    this.admin.createCoupon(this.couponsModel)
      .subscribe(res => {
        this.router.navigate(["/view_coupons"])
      }, error => {
        console.error(error)
      })
  }

  cancelAdd(){
    this.router.navigate(["/view_coupons"])
  }

}
