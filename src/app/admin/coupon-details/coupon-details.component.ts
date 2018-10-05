import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.css']
})
export class CouponDetailsComponent implements OnInit {

  param
  couponModel;
  filtersLoaded: Promise<boolean>;
  edit = false;

  constructor(private router: Router, private admin: AdminService, private route: ActivatedRoute) { 

    this.route.params.subscribe( params => {
      this.param = params 
    });

  }

  async ngOnInit() {
    await this.getCouponDetials()
  }


  getCouponDetials(){
    this.admin.viewCouponsDetails(this.param.id)
      .subscribe(res => {
        console.log(res)
        this.couponModel = res
        this.filtersLoaded = Promise.resolve(true)
      }, error => {
        console.error(error)
      })
  }

  toggleEdit(){
    this.edit = true
  }

  cancelAdd(){
    this.edit = false;
  }

  onFormSubmit(){
    this.admin.editCoupon(this.param.id, this.couponModel)
      .subscribe(res => {
        this.edit = false
      }, error => {
        console.error(error)
      })
  }

}
