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

  private _adminProfileUrl = "http://localhost:8080/admin/profile";
  private _createCouponUrl = "http://localhost:8080/admin/create_coupon";
  private _viewCouponsUrl = "http://localhost:8080/admin/view_coupons";
  private _viewCouponsDetailsUrl = "http://localhost:8080/admin/coupon_detials";
  private _editCouponUrl = "http://localhost:8080/admin/edit_coupon";

  private _viewImages = "http://localhost:8080/admin/view_images";
  private _deleteImage = "http://localhost:8080/admin/delete_image";

  private _reportedImageUrl = "http://localhost:8080/admin/reports";
  private _deleteReportedImageUrl = "http://localhost:8080/admin/delete_reported_image";
  private _addToVotingListUrl = "http://localhost:8080/admin/add_to_voting_list";

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

  deleteImage(id, url, reason): Observable<any>{
    return this.http.post<any>(this._deleteImage, {id, url, reason})
  }

  reportedImage(): Observable<any>{
    return this.http.get<any>(this._reportedImageUrl)
  }

  deleteReportedImage(images): Observable<any>{
    return this.http.post<any>(this._deleteReportedImageUrl, images)
  }

  addToVotingList(images): Observable<any>{
    return this.http.post<any>(this._addToVotingListUrl, images)
  }

}
