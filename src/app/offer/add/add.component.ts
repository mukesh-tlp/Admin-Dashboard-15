import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/_services/database.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { getgid } from 'process';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class OfferAddComponent implements OnInit {
  
  constructor(public activatedRoutes:ActivatedRoute,private _location: Location,public db:DatabaseService,public actRoute:ActivatedRoute) { }
  todayDate:any
  ngOnInit() {
    
    if(this.activatedRoutes.snapshot.params.id){
      this.getDetail(this.activatedRoutes.snapshot.params.id);
    }else{
      this.form.bannerData=[];
      this.form.schemeData =[];
      this.todayDate =  moment(new Date ()).format('YYYY-MM-DD')
      
      this.getType()
      this.form.description='';
      this.form.terms_condition='';
      this.form.gift={};
      this.form.giftData=[];
      this.form.status="1";
      this.getStates();
      this.getDistricts();
      this.getGifts('');
      console.log("terms",this.form.description)
      
    }
    
    this.form.applicable_for = '3'
  }


  removeBanner(index){
    this.form.bannerData.splice(index,1);
  }
  removeScheme(index){
    this.form.schemeData.splice(index,1);
  }
  getDetail(id){
    this.db.presentLoader();
    
    this.db.postReq({'offer_id':id},'offer/detail').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.form = resp['result'].data;
        this.form.encrypt_id = this.actRoute.snapshot.params.id
        this.form.giftData = resp['result'].giftData;
        this.form.bannerData = resp['result'].bannerData;
        this.form.schemeData = resp['result'].schemeData;
        this.form.status = this.form.status.toString();
        this.form.areaData = resp['result'].areaData 
        this.form.applicable_for = this.form.applicable_for.toString()
        this.form.start_date = moment(this.form.start_date).format('YYYY-MM-DD')
        this.form.end_date = moment(this.form.end_date).format('YYYY-MM-DD')
        this.todayDate =  moment(new Date ()).format('YYYY-MM-DD')
        this.getType()
        this.form.gift={};
        this.getGifts('');

        this.db.postReq({filter:{state_name:this.searchState}},'master/state_list').subscribe(async resp=>{
          this.states= resp['result'].data;
         
         await this.form.areaData.map(row=>{
            let index = this.states.findIndex(r=>r.state_name == row.state_name);
            this.states[index].checked = true;
          })

          let statesArr=[];
         await  this.states.map(async r=>{
            if(r.checked) await  statesArr.push("'"+r.state_name+"'");
          })
          this.db.postReq({filter:{state_name_array:statesArr,district_name:this.searchDistrict}},'master/district_list').subscribe(async resp=>{
            this.districts = resp['result'].data

            await  this.form.areaData.map(row=>{
              let index = this.districts.findIndex(r=>r.district_name == row.district_name);
              this.districts[index].checked = true;
            })
  
          }) 
        })
       
        
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
  gifts:any=[]
  getGifts(event:any){
    console.log('$event',event);
    console.log('form', this.form);
    
    let reqData =  {
      "limit": 20000,
      "start": 0,
      "filter": {
        "statusName": "Active",
        // "architect_gift" : this.form.architect_offer == true ? 1 : 0,
        // "carpenter_gift" : 1,
        "fabricator_gift" : this.form.fabricator_offer == true ? 1 : 0,
        "carpenter_gift" : this.form.carpenter_offer == true ? 1 : 0,
        "status": 1
      }
    }
    this.db.postReq(reqData,'gift/list').subscribe(async resp=>{
      this.gifts= resp['result'].data
    })
  }
  searchUser:any;
  usersData:any=[];
  
  getUsers(){
    this.usersData=[]
    this.db.presentLoader();
    this.db.postReq({filter:{search:this.searchUser},limit : 50,start : 0},this.form.user_type == 'temp_user'? 'temp_user/list' : 'user/list').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.usersData = resp['result']['data'];
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
      this.db.dismissLoader();
    })
    
  }
  typeData:any=[];
  getType(){
    this.db.presentLoader();
    this.db.postReq({},'notification/type').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.typeData = resp['result'].data;
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
      this.db.dismissLoader();
    })
    
  }
  
  form: any={};
  formsInit(data:any) {
  }
  
  onSubmit(f:any){
    if(!this.form.giftData.length){
      this.db.presentAlert('Alert','Please add gift data');
      return
    }

    this.form.distributor_offer =  this.form.distributor_offer == true ? 1 : 0,
    this.form.carpenter_offer =  this.form.carpenter_offer == true ? 1 : 0,
    this.form.fabricator_offer = this.form.fabricator_offer == true ? 1 : 0,
    console.log("data",this.form)

    this.form.areaData = []
    this.districts.map(r=>{
      if(r.checked)
      this.form.areaData.push(r);
    })
    this.db.presentLoader();
    this.db.postReq(this.form, this.actRoute.snapshot.params.id ?  'offer/update' : 'offer/add').subscribe(resp=>{
      this.db.dismissLoader();
      if(resp['status'] == 'success'){
        this.db.successAlert(resp['status'],resp['message']);
        this.backClicked();
      }else{
        if(resp['message']=='Invalid token'){
          this.db.sessionExpire();
          return;
        }
        this.db.presentAlert(resp['status'],resp['message'])
      }
    },err=>{
      this.db.errHandler(err);
      this.db.errDismissLoader();
    })
    
  }
  
  backClicked() {
    this._location.back();
  }
  changeListener($event): void {
    console.log($event);
    this.form.image_path_loading = true;
    var file = $event.target.files[0];
    var reader = new FileReader();
    var image
    reader.onloadend = function () {
      image = reader.result;
    }
    setTimeout(() => {
      console.log(image);
      let reqData = {base64:image}
      this.db.presentLoader();
      this.db.postReq(reqData,'base64_to_file').subscribe(resp=>{
        this.db.dismissLoader();
        if(resp['status'] == 'success'){
          this.form.bannerData.push({banner_filename:resp['response'].fileName,status:1});
        }else{
          if(resp['message']=='Invalid token'){
            this.db.sessionExpire();
            return;
          }
          this.db.presentAlert(resp['status'],resp['message'])
        }
      },err=>{
        this.form.image_path_loading = false;
        this.db.errDismissLoader();
      })
    }, 100);
    
    reader.readAsDataURL(file);
    
  }
  changeListenerScheme($event): void {
    console.log($event);
    this.form.image_path_loading = true;
    var file = $event.target.files[0];
    var reader = new FileReader();
    var image
    reader.onloadend = function () {
      image = reader.result;
    }
    setTimeout(() => {
      console.log(image);
      let reqData = {base64:image}
      this.db.presentLoader();
      this.db.postReq(reqData,'base64_to_file').subscribe(resp=>{
        this.db.dismissLoader();
        if(resp['status'] == 'success'){
          this.form.schemeData.push({filename:resp['response'].fileName,status:1});
        }else{
          if(resp['message']=='Invalid token'){
            this.db.sessionExpire();
            return;
          }
          this.db.presentAlert(resp['status'],resp['message'])
        }
      },err=>{
        this.form.image_path_loading = false;
        this.db.errDismissLoader();
      })
    }, 100);
    
    reader.readAsDataURL(file);
    
  }
  
  changeListenerGift($event): void {
    
    console.log($event);
    this.form.gift.image_filename_loading = true;
    var file = $event.target.files[0];
    var reader = new FileReader();
    var image
    reader.onloadend = function () {
      image = reader.result;
    }
    setTimeout(() => {
      console.log(image);
      let reqData = {base64:image}
      this.db.presentLoader();
      this.db.postReq(reqData,'base64_to_file').subscribe(resp=>{
        this.form.gift.image_filename_loading = false;
        
        this.db.dismissLoader();
        if(resp['status'] == 'success'){
          this.form.gift.image_filename = resp['response'].fileName
        }else{
          if(resp['message']=='Invalid token'){
            this.db.sessionExpire();
            return;
          }
          this.db.presentAlert(resp['status'],resp['message'])
        }
      },err=>{
        this.form.gift.image_filename_loading = false;
        this.db.errDismissLoader();
      })
    }, 100);
    
    reader.readAsDataURL(file);
    
  }
  
  
  selectAll:any=false;
  selectAllHandler(){
    if(this.selectAll == true){
      this.usersData.map(r=>{
        r.checked = true;
      })
    }else{
      this.usersData.map(r=>{
        r.checked = false;
      })
    }
  }
  setApplicableForName(){
    console.log('setApplicableForName');

    // if(this.form.applicable_for == 1) this.form.applicable_for_name = "Retailer";
    // if(this.form.applicable_for == 2) this.form.applicable_for_name = "Dealer";
    // if(this.form.applicable_for == 3) this.form.applicable_for_name = "Distributor";
    // if(this.form.applicable_for == 4) this.form.applicable_for_name = "Retailer";
    // if(this.form.applicable_for == 5) this.form.applicable_for_name = "Sales_User";
    // if(this.form.applicable_for == 0) this.form.applicable_for_name = "All";
  }
  addToList(){
    if(!this.form.gift.gift_id) {
      this.db.presentAlert('Alert','Please select gift!');
      return;
    }
    let index  = this.form.giftData.findIndex(r=> r.gift_id ==this.form.gift.gift_id);
    
    if(index == -1 ){
      console.log(this.form);
      this.form.gift.status = 1;
      this.form.giftData.push(this.form.gift);
      this.form.gift={};
    }else{
      this.form.gift={};
    }    
    
    
  }
  removeItem(i){
    this.form.giftData.splice(i,1);
  }
  searchState:any
  searchDistrict:any
  states:any=[]
  getStates(){
    this.db.postReq({filter:{state_name:this.searchState}},'master/state_list').subscribe(async resp=>{
      this.states= resp['result'].data
    })
  }
  districts:any=[]
  getDistricts(){
    let statesArr=[];
    this.states.map(async r=>{
      if(r.checked) await  statesArr.push("'"+r.state_name+"'");
    })
    this.db.postReq({filter:{state_name_array:statesArr,district_name:this.searchDistrict}},'master/district_list').subscribe(async resp=>{
      this.districts = resp['result'].data
    })  
  }
  giftHandler(){
    console.log(this.form.gift);
    
    // if(!this.form.gift.title || !this.form.gift.description || !this.form.gift.points || !this.form.gift.image_filename) {
    
    //   this.db.presentAlert('Alert','Please fill all details!');
    //   return;
    // }
    this.form.gift.gift_id  = this.form.gift.gift_name.id
    this.form.gift.title  = this.form.gift.gift_name.title
    this.form.gift.description  = this.form.gift.gift_name.description
    this.form.gift.points  = this.form.gift.gift_name.points
    this.form.gift.image_filename  = this.form.gift.gift_name.image_filename
  }
  async stateSelectAllHandler(ev){
    console.log(ev);
    
    await this.states.map(r=>{
      if(ev.checked) r.checked = true;
      else r.checked = false;
    })
    this.getDistricts();
  }
  async districtSelectAllHandler(ev){
    await this.districts.map(r=>{
      if(ev.checked) r.checked = true;
      else r.checked = false;
    })
  }
}
