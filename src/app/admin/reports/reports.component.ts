import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Image } from '../../image';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  imagesModel;
  filtersLoaded: Promise<boolean>;

  constructor(private router: Router, private admin: AdminService) { }

  async ngOnInit() {
    await this.getImage()
  }

  getImage(){
    this.admin.reportedImage()
      .subscribe(res => {
        console.log(res)
        this.imagesModel = res
        this.filtersLoaded = Promise.resolve(true)
      }, error => {
        console.error(error)
      })
  }

  delete(images){
    this.admin.deleteReportedImage(images)
      .subscribe(res => {
        window.location.reload()
      }, error => {
        console.error(error)
      })
  }

  confirm(images){
    this.admin.addToVotingList(images)
    .subscribe(res => {
      window.location.reload()
    }, error => {
      console.error(error)
    })
  }

}
