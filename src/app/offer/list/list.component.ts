import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
// import { ProductUnitDetailModelComponent } from '../product-unit-detail-model/product-unit-detail-model.component';
import { DatabaseService } from 'src/app/_services/database.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
// import { ProductUnitDetailModelComponent } from '../product-unit-detail-model/product-unit-detail-model.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class OfferListComponent implements OnInit {
  
  data:any=[];
  dataNotFound=false
  reqSent=false
  autoFocus?: boolean = true;
  checkModulePermission:any = {};
  constructor(
    public activatedroute: ActivatedRoute,
    private _location: Location,
    public dialog: MatDialog,
    public db:DatabaseService
    ) { 
      this.checkModulePermission = this.db.loggedInPermission(this.activatedroute.snapshot.routeConfig.path,0);
    }
    ngOnInit() {
      this.todayDate =  moment(new Date ()).format('YYYY-MM-DD')
      this.getCounters();
    }
    counters:any=[];
    tabActive:any;
    getCounters(){
      
      this.db.presentLoader();
      this.db.postReq({},'offer/count').subscribe(resp=>{
        this.reqSent = true;
        if(resp['status'] == 'success'){
          // resp['result'].data.map(r=>{
          this.counters= resp['result'].data
          // })
          console.log(this.counters);
          this.tabActive = resp['result'].data[0].type; 
          this.getData();
          
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
    todayDate :any
    pageNo:any=1;
    tempPageNo =1;;
    totalPages:any
    start:any=0;
    limit:any=50;
    totalLength:any;
    filter:any={};
    getData(){
      this.dataNotFound = false;
      this.reqSent = false;
      let reqData = {
        limit : this.limit,
        start : this.start,
        filter : this.filter,
        type:this.tabActive
      }
      this.db.presentLoader();
      this.db.postReq(reqData,'offer/list').subscribe(resp=>{
        this.reqSent = true;
        if(resp['status'] == 'success'){
          this.data = resp['result'].data;
          console.log(this.data);
          
          if(!this.data.length) this.dataNotFound = true;
          this.totalLength = resp['result'].totalCount;
          this.totalPages = Math.ceil(this.totalLength / this.limit);
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
    pagination(action){
      
      if(action == 'pageNo'){
        if(this.pageNo > 0 && this.pageNo <=this.totalPages){
          this.start = this.limit*(this.pageNo-1)
        }else{
          this.pageNo = Math.ceil(this.totalLength / this.data.length);
        }
      }
      else if(action=='next'){
        
               if(this.totalLength == (this.start+this.data.length)) return;

        this.start = this.start+this.limit
        this.pageNo ++ ;
      }else{
        if(this.pageNo == 1) return
        this.start = this.start-this.limit
        this.pageNo -- ;
      }
      this.getData();
      this.tempPageNo = this.pageNo
    }
    refresh(){
      this.start = 0;
      this.limit = 50;
      this.filter = {};
      this.getData();
    }
    
    backClicked() {
      this._location.back();
    }    
    // delete(data){
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'You won\'t be able to revert this!',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!',
    //     cancelButtonText: 'No, cancel!',
    //     dangerMode: true,
    //   })
    //   .then((willDelete) => {        
    //     if (willDelete) {
    //       this.db.presentLoader();
    //       // data.status = data.status == 0 ? 1 : 0;
    //       data.offer_id = data.encrypt_id;
    //       this.db.postReq(data,'offer/delete').subscribe(resp=>{
    //         if(resp['status'] == 'success'){
    //           Swal.fire({
    //             title: 'Deleted',
    //             text: 'Your file has been successfully deleted.',
    //             icon: 'success'
    //           })
    //           this.getCounters();
              
    //         }else{
    //           if(resp['message']=='Invalid token'){
    //             this.db.sessionExpire();
    //             return;
    //           }
    //           this.db.presentAlert(resp['status'],resp['message'])
    //         }
    //       })
          
    //     } else {
    //       Swal.fire("Your data is safe!");
    //     }
    //   });
    // }
    // changeStatus(data){
    //   console.log(data.status);
      
    //   Swal.fire({
    //     title: "Are you sure?",
    //     text: data.status == false  ? "You want to make this inactive!" : "You want to make this active!",
    //     icon: "warning",
    //     buttons: ["Cancel", "Confirm"],
    //     dangerMode: true,
    //   })
    //   .then((willDelete) => {        
    //     if (willDelete) {
    //       this.db.presentLoader();
    //       data.status = data.status ? 1 : 0
    //       data.offer_id = data.encrypt_id;
    //       this.db.postReq(data,'offer/update_status').subscribe(resp=>{
    //         if(resp['status'] == 'success'){
    //           Swal.fire({
    //             title: data.status == 0 ? "Inactive!" : "Active",
    //             icon: "success"
    //           });
    //           this.getCounters();
    //         }else{
    //           if(resp['message']=='Invalid token'){
    //             this.db.sessionExpire();
    //             return;
    //           }
    //           this.db.presentAlert(resp['status'],resp['message'])
    //         }
    //       })
          
    //     } else {
    //       Swal.fire("Your data is safe!");
    //       data.status = !data.status
    //     }
    //   });
    // }
    downloadExcel(){
      
      let reqData = {
        filter : this.filter,
        type:this.tabActive
      }
      this.db.presentLoader();
      this.db.postReq(reqData,'offer/list/excel').subscribe(resp=>{
        this.reqSent = true;
        if(resp['status'] == 'success'){
          this.db.exportAsExcelFile(resp['result'].data,resp['result'].file_name ? resp['result'].file_name : 'exported_data');
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
  }
  