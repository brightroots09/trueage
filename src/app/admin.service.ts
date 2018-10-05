import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, ObservableInput } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  /**
   * ----
   * URLs
   * ----
   */

  private _adminProfileUrl = "/admin/profile";
  private _createCouponUrl = "/admin/create_coupon";
  private _viewCouponsUrl = "/admin/view_coupons";
  private _viewCouponsDetailsUrl = "/admin/coupon_detials";
  private _editCouponUrl = "/admin/edit_coupon";

  private _viewImages = "/admin/view_images";
  private _deleteImage = "/admin/delete_image";

  constructor(private http: HttpClient) { }

  /**
   * ---------
   * functions
   * ---------
   */
  adminProfile(): Observable<any>{
    return this.http.get<any>(this._adminProfileUrl)
  }

  createCoupon(data): Observable<any>{
    return this.http.post<any>(this._createCouponUrl, data)
  }

  viewCoupons(): Observable<any>{
    return this.http.get<any>(this._viewCouponsUrl)
  }

  viewCouponsDetails(id): Observable<any>{
    let url = this._viewCouponsDetailsUrl + "/" + id
    return this.http.get<any>(url)
  }

  editCoupon(id, data): Observable<any>{
    let url = this._editCouponUrl + "/" + id;
    return this.http.post<any>(url, data)
  }

  viewImages(): Observable<any>{
    return this.http.get<any>(this._viewImages)
  }

  deleteImage(id, image, url, reason): Observable<any>{
    return this.http.post<any>(this._deleteImage, {id, image, url, reason})
  }

}
