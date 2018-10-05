import { Component } from '@angular/core';
import { AuthService } from './auth.service'
import { NbSidebarService, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trueAge-admin';

  items: NbMenuItem[] = [
    {
      title: "Create Coupon",
      icon: 'fas fa-plus-circle',
      link: '/create_coupon'
    },
    {
      title: 'View Coupons',
      icon: "fas fa-eye",
      link: '/view_coupons'
    },
    {
      title: "View Images",
      icon: "far fa-image",
      link: "/view_images"
    }
   ];
   constructor(private _authService: AuthService, private sidebarService: NbSidebarService ){}

   toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

}
