import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';  
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageModelComponent } from '../view-image/view-image.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';  
const EXCEL_EXTENSION = '.xlsx';  


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // DbUrl:string = "http://localhost:3000/api/web/";
  DbUrl:string = "http://skydecor.theloyaltypartner.co.in:3000/api/web/";
  s3path='http://skydecor.theloyaltypartner.co.in:3000/';
  // s3path='http://localhost:3000/';
  domain = ""
  sessionToken:string = '';
  counterData:any={};
  userDataForm:any={};
  vendorCounterData:any={};
  drType:any=[]
  skeletonArr=Array(10);
  // redeemRequestData:any={};
  constructor(
    public http:HttpClient,
    public formBuilder:FormBuilder,
    public dialogAlert : DialogService,
    public router:Router,
    public matdialog:MatDialog,
    ) { 
    }
    
    getCounter()
    {
      console.log('getCounterDbData',this.userDataForm);
      this.postReq({'projectId':this.userDataForm.user_project_id},'sidebar/count')
      .subscribe((result:any)=>{
        console.log('getCounter', result);
        this.counterData = result['data'];
      },error=>{
        console.log(error);
        this.dialogAlert.error('','Something went wrong !!! Try again ...');
      });
      
    }
    
    openImage(src){
      // window.open(src)
      const dialogRef = this.matdialog.open(ViewImageModelComponent, {
        // width: '400px',
        autoFocus: false,
        data: src
      });
      
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    
    notificationList:any=[];
    notificationListCount:any;
    pageSize:any = 5;
    currentPage:any = 1;
    getNotificationList(pageSize:any=5,currentPage:any=1)
    {
      this.pageSize = pageSize;
      this.currentPage = currentPage;
      var logData = [];
      console.log('*** Get Notifictaion Data ***');
      this.postReq({'projectId':this.userDataForm.user_project_id, 'pageSize' : this.pageSize, 'currentPage' : this.currentPage},'notification/all')
      .subscribe((result:any)=>{
        console.log(result);
        
        logData = Object.assign([],result['logData']['logData']);
        
        logData.map(x=>{
          if(x.type == 'Vendor')
          {
            x.goToLink = '/vendor-detail/'+x.moduleEncryptId;
          } 
          if(x.type == 'Complaint')
          {
            x.goToLink = '/complaint-detail/'+x.moduleEncryptId;
          }
          x.logData = x.log_description;
        });
        console.log('logData',logData);
        
        
        if(this.currentPage == 1)
        {
          this.notificationList = logData;
        }
        else{
          this.notificationList = this.notificationList.concat(logData);
        }
        
        this.notificationListCount = result['logData']['totalLogData'];
        
      },error=>{
        console.log(error);
        this.dialogAlert.error('','Something went wrong !!! Try again ...');
      });
    }
    
    
    notificationCounter:any;
    getNotificationCounter()
    {
      console.log('*** Get Notifictaion Counter Data ***');
      this.postReq({'projectId':this.userDataForm.user_project_id},'notification/counter')
      .subscribe((result:any)=>{
        console.log(result);
        this.notificationCounter = result['data']['notificationCount'];
      },error=>{
        console.log(error);
        this.dialogAlert.error('','Something went wrong !!! Try again ...');
      });
    }
    
    
    
    getVendorCounter(vendorId:any)
    {
      console.log('*** Get Vendor Detail Counter ***');
      this.postReq({'vendorId' : vendorId},'vendor/counter/data')
      .subscribe((result:any)=>{
        console.log('vendorCounterData',result);
        this.vendorCounterData = result['data'];
      },error=>{
        console.log(error);
        this.dialogAlert.error('','Something went wrong !!! Try again ...');
      });
    }
    
    
    projectList:any=[];
    getProjectList()
    {
      console.log('*** Get Project List ***');
      this.postReq({},'login/project/list').subscribe(result=>{
        console.log(result);
        if(result['status'] == 200)
        {
          this.projectList = result['data']['projectData'];
        }
      },error=>{
        console.log(error);
      })
    }
    loginType:any = localStorage.getItem('loginType') 
    header:any = new HttpHeaders();
    postReq(request_data:any, fn:any)
    {
      let header = new HttpHeaders();
      console.log('Bearer ' + this.sessionToken)
      header = header.append('token','Bearer ' + this.sessionToken.replace('"','').replace('"',''));
      header = header.append("Content-Type", "application/json");
      header = header.append("type", localStorage.getItem('loginType'));
      console.log(request_data);
      return this.http.post(this.DbUrl+fn, JSON.stringify(request_data), {headers:header});
    }
    
    
    FileData(request_data:any, fn:any)
    {
      this.header.append('Content-Type',undefined);
      console.log(request_data);
      return this.http.post( this.DbUrl+fn, request_data, {headers : this.header});
    }

    getReq(request_data:any, fn:any)
    {
      let header = new HttpHeaders();
      header = header.append("Content-Type", "application/json");
      console.log(request_data);
      return this.http.get(this.DbUrl+fn);
    }
    
    
    presentLoader(){
      
    }
    dismissLoader(){
      
    }
    presentAlert(title,message){
      Swal.fire(title, message, "error");
    }
    sessionExpire(){
      Swal.fire('Session Expired', 'Login again to continue', "error");
      localStorage.removeItem('sessionToken');
      this.sessionToken='';
      this.router.navigate(['/login']);
    }
    errDismissLoader(){
      
    }
    successAlert(title,message){
      Swal.fire('Success!', message, "success");
    }
    filteredResults:any={};
    states:any=[]
    getStates(){
      this.postReq({filter:{}},'master/state_list').subscribe(async resp=>{
        this.states=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.states.push(r.state_name);
          })
          this.filteredResults.states = this.states
          
        }
      })
    }
    districts:any=[]
    getDistricts(state){
      this.postReq({filter:{state_name:state}},'master/district_list').subscribe(async resp=>{
        this.districts=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.districts.push(r.district_name);
          })
          this.filteredResults.districts = this.districts
        }
      })  
    }
    city:any=[];
    getCity(state,district){
      this.postReq({filter:{state_name:state,district_name:district}},'master/city_list').subscribe(async resp=>{
        this.city=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.city.push(r.city);
          })
          this.filteredResults.city = this.city
        }
      })      
      
    }
    area:any=[];
    getArea(state,district,city){
      this.postReq({filter:{state_name:state,district_name:district,city:city}},'master/area_list').subscribe(async resp=>{
        this.area=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.area.push(r.area);
          })
          this.filteredResults.area = this.area
        }
      })      
      
    }
    zone:any=[];
    getZone(state,district,city,area){
      this.postReq({filter:{state_name:state,district_name:district,city:city,area:area}},'master/zone_list').subscribe(async resp=>{
        this.zone=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.zone.push(r.zone);
          })
          this.filteredResults.zone = this.zone
        }
      })      
      
    }
    beat:any=[];
    getBeat(state,district,city,area){
      this.postReq({filter:{state_name:state,district_name:district,city:city,area:area}},'master/beat_list').subscribe(async resp=>{
        this.beat=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.beat.push(r.beat);
          })
          this.filteredResults.beat = this.beat
        }
        console.log(this.beat)
      })      
      
    }
    pincode:any=[];
    getPincode(state,district,city,area,zone){
      this.postReq({filter:{state_name:state,district_name:district,city:city,area:area,zone:zone}},'master/pincode_list').subscribe(async resp=>{
        this.pincode=[]
        if(resp['result'].data.length) {
          await resp['result'].data.map(r=>{
            this.pincode.push(r.pincode);
          })
          this.filteredResults.pincode = this.pincode
          console.log(this.filteredResults.pincode,this.pincode);
          
        }
      })      
      
    }
    public exportAsExcelFile(json: any[], excelFileName: string): void {  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);  
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });  
      this.saveAsExcelFile(excelBuffer, excelFileName);  
    }  
    private saveAsExcelFile(buffer: any, fileName: string): void {  
      const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});  
      FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);  
    }
    openLink(link){
      window.open(this.domain+link,'_blank')
    }  
    errHandler(data){
      this.dismissLoader();
      console.log(data);
      if(data.error['message']=='Invalid token'){
        this.sessionExpire();
        return;
      }
      
    }


    permissionData:any;
    permission:any={};
    loggedInPermission(moduleId:any, subModuleId:any){
      console.log('*** moduleId', moduleId);
      console.log('*** subModuleId', subModuleId);
      
      
      if(localStorage.getItem('permissionData'))
      {
        
        this.permissionData = JSON.parse(localStorage.getItem('permissionData'));
        console.log('permissionData -->',this.permissionData);
        
        
        console.log('*** Permission ***');
        this.permissionData.map((x:any)=>{
          
          if(moduleId && subModuleId){
            x.dropDown.map(y=>{
              if(x.module_id == moduleId && y.slug == subModuleId){
                this.permission = y;
              }
            })
          }else{
            if(x.slug === moduleId)
            {
              this.permission = x;
            }
          }
        });
        console.log('this.permission',this.permission);
        return this.permission;
      }
      else{
        return false;
}
}
    // exportAsXLSX():void {  
    //    this.exportAsExcelFile([{Name:'Rahum'},{Name:'Deep'}], 'sample');  
    // }  
  }
  