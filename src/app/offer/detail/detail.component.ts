import { Component, OnInit, Renderer2 } from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/_services/database.service';
// import { LsStatusModelComponent } from '../ls-status-model/ls-status-model.component';
// import { LsGiftModelComponent } from '../ls-gift-model/ls-gift-model.component';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './detail.component.html'
})
export class OfferDetailComponent implements OnInit {
  
  constructor(public dialog : MatDialog, public activatedroute:ActivatedRoute ,private _location: Location,public db:DatabaseService) { }
  
  ngOnInit() {
    this.getDetail(this.activatedroute.snapshot.params.id)
  }
  data:any={};
  getDetail(id){
    this.db.presentLoader();
    
    this.db.postReq({'offer_id':id},'offer/detail').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.data = resp['result'];   
        console.log(this.data);
        this.getCouponList()
        this.getRedeemReqList()
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
    })
    
  }
  getCouponList(){
    this.db.presentLoader();
    let reqData= {
      "limit": 100000,
      "start": 0,
      "filter": {
        "offer_id" :this.data.data.id,
      }
    }
    this.db.postReq(reqData,'coupon/list').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.data.couponList = resp['result'].data;   
        console.log(this.data);
        
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
    })
    
  }
  getRedeemReqList(){
    this.db.presentLoader();
    let reqData= {
      "limit": 100000,
      "start": 0,
      "filter": {
        "offer_id": this.data.data.id,
        "registered": 0,
        "gift_status": "",
        "redeem_status": ""
      }
    }
    this.db.postReq(reqData,'redeem_request/list').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.data.redeemReqList = resp['result'].data;   
        console.log(this.data);
        
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
    })
    
  }
  backClicked() {
    this._location.back();
  }
  // openStatusDialog(): void {
  //   const dialogRef = this.dialog.open(LsStatusModelComponent, {
  //     width: '500px',
  //     autoFocus: false,
  //     data: {}
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  
  // openGiftDialog(): void {
  //   const dialogRef = this.dialog.open(LsGiftModelComponent, {
  //     width: '768px',
  //     autoFocus: false,
  //     data: {}
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  
}
