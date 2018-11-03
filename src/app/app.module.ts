import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NbThemeModule, NbSidebarModule, NbLayoutModule,  NbMenuModule, NbMenuService, NbSidebarService, NbCardModule, NbTabsetModule, NbAccordionModule, NbButtonModule, NbUserModule, NbListModule, NbAlertModule } from '@nebular/theme';

import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateCouponComponent } from './admin/create-coupon/create-coupon.component';
import { ViewCouponsComponent } from './admin/view-coupons/view-coupons.component';
import { CouponDetailsComponent } from './admin/coupon-details/coupon-details.component';
import { ViewImagesComponent } from './admin/view-images/view-images.component';
import { ReportsComponent } from './admin/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminProfileComponent,
    PageNotFoundComponent,
    CreateCouponComponent,
    ViewCouponsComponent,
    CouponDetailsComponent,
    ViewImagesComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,

    HttpClientModule ,
    NbThemeModule.forRoot({ name: 'default' }),
    NbMenuModule.forRoot(),
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbTabsetModule,
    NbAccordionModule,
    NbButtonModule,
    NbUserModule,
    NbListModule,
    NbAlertModule
  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, {provide: LocationStrategy, useClass: HashLocationStrategy}, NbSidebarService, NbMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
