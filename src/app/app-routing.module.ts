import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { CreateCouponComponent } from './admin/create-coupon/create-coupon.component';
import { ViewCouponsComponent } from './admin/view-coupons/view-coupons.component';
import { CouponDetailsComponent } from './admin/coupon-details/coupon-details.component';
import { ViewImagesComponent } from './admin/view-images/view-images.component';
import { ReportsComponent } from './admin/reports/reports.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "profile",
    pathMatch: "full"
  },
  {
    path: "login",
    component: AdminLoginComponent
  },
  {
    path: "profile",
    component: AdminProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "create_coupon",
    component: CreateCouponComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "view_coupons",
    component: ViewCouponsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "coupon_detials/:id",
    component: CouponDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "view_images",
    component: ViewImagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
