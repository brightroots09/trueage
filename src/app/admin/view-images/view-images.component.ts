import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Image } from '../../image';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {

  imagesModel;
  filtersLoaded: Promise<boolean>;
  imageReason = new Image()

  constructor(private router: Router, private admin: AdminService) { }

  async ngOnInit() {
    await this.getimages()
  }

  getimages(){
    this.admin.viewImages()
      .subscribe(res => {
        console.log(res)
        this.imagesModel = res
        this.filtersLoaded = Promise.resolve(true)
      }, error => {
        console.error(error)
      })
  }


  onFormSubmit(id, url){
    this.admin.deleteImage(id, url, this.imageReason)
      .subscribe(res => {
        window.location.reload()
      }, error => console.error(error))
  }

}
