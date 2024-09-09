import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../_services/database.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  project_type:any;
  userData = JSON.parse(localStorage.getItem('karbitUserData'));
  masterSearch:any
  constructor( private render: Renderer2 ,
    private router : Router,
    private _renderer: Renderer2,
    public db : DatabaseService) { 
      // this.db.setLoginData();
      // console.log('userData',this.db.userLoginData);
      console.log('routername', this.userData);
      
      this.project_type = this.router.url == '/dnm_mangement/distribution-detail'?'distributor':this.router.url == '/ddm_mangement/direct-dealer-detail'?'direct-dealer':this.router.url == '/dm_mangement/dealer-detail'?'dealer':'';
    }
    
    status:boolean = false
    
    ngOnInit() {
    }
    
    
    onChange(project_type:any)
    {
      this.project_type = project_type;
      console.log('projectType',this.project_type);
    }
    
    toggleHeader() 
    {
      this.status = !this.status;
      if(this.status) {
        this.render.addClass(document.body, 'toggle-active-tlp');
      }
      else {
        this.render.removeClass(document.body, 'toggle-active-tlp');
      }
    }
    
    openNav() 
    {
      this.status = !this.status;
      if(this.status) {
        this.render.addClass(document.body, 'nav-active');
      }
      else {
        this.render.removeClass(document.body, 'nav-active');
      }
    }
    
    
    printDoc(){
      const popupWin = window.open('/document-history/', '_blank', 'top=0,left=0,height=100%,width=auto');
    } 
    searchItemClickhandler(data:any){
      if(data.table_name.includes('customer')){
        // if(data.is_lead == '1')this.db.router.navigateByUrl('dr-detail/'+data.encrypt_id)
        // else
        this.db.router.navigateByUrl('dealer-basic/'+data.encrypt_id)
      }else{
        if(data.for_sales_user == '1')this.db.router.navigateByUrl('sales-user-detail/'+data.encrypt_id);
        if(data.for_system_user == '1')this.db.router.navigateByUrl('users-edit/'+data.encrypt_id);
      }
      this.searchData = [];
      this.masterSearch=null;
    }
    searchData:any=[];
    getData(){
      this.searchData = [];
      if(!this.masterSearch){
        return;
      }
      {
        let reqData = {
          "filter" : {
            "search" : this.masterSearch
          }
        }
        
        this.db.presentLoader();
        
        this.db.postReq(reqData,'master/search').subscribe(resp=>{
          this.db.dismissLoader();
          if(resp['status'] == 'success'){
            this.searchData = resp['result'].data
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
    logout() {
      localStorage.removeItem('karbitUserData');
      localStorage.removeItem('sessionToken');
      this.router.navigate(['']);
      this.db.sessionToken = '';
    }
    fontSize:any = localStorage.getItem('fontSize') ? localStorage.getItem('fontSize') : '100%';
    zoom(level:any){
      this._renderer.setStyle(document.body, 'zoom',level);
      localStorage.setItem('fontSize',level);
      this.fontSize = level;
    }

}
