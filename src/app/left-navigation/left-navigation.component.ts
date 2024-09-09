import { Component, OnInit, Renderer2 } from '@angular/core';
import { DatabaseService } from '../_services/database.service';
import { CustomEventsService } from '../_services/custom-events.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent {
  tabActiveType:any={};
  tab:any={};
  status:boolean = false
  navigationData:any=[];
  dataNotFound=false
  reqSent=false
  constructor(private render: Renderer2,
    public event:CustomEventsService,public db:DatabaseService) 
    {
      this.getData(true)
      this.tabActive('tab0');
      // this.getDrType();
    }
    
    ngOnInit() {
      console.log('permissionData',JSON.parse(localStorage.getItem('permissionData')))
      // this.navigationData = JSON.parse(localStorage.getItem('permissionData'));
    }
    
    tabActive(tab:any)
    {
      this.tabActiveType = {};
      this.tabActiveType[tab] = !this.tabActiveType[tab]; 
      this.tab[tab] = !this.tab[tab]; 
    }
    // drType:any=[];
    // getDrType(){
    //   let r = {
    //     "fullname": "Test",
    //     "mobile_no": "1111155552",
    //     "email": "test@gmail.com",
    //     "country": "India",
    //     "isd_code": "+91",
    //     "state": "Haryana",
    //     "city": "Faridabad",
    //     "profile_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAYAAAC5UQwxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmVkYTJiM2ZhYywgMjAyMS8xMS8xNy0xNzoyMzoxOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQwRUI4Mjc3OEY2OTExRUNBNTEzRDU0RDZBNDMwQzdDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQwRUI4Mjc4OEY2OTExRUNBNTEzRDU0RDZBNDMwQzdDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDBFQjgyNzU4RjY5MTFFQ0E1MTNENTRENkE0MzBDN0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDBFQjgyNzY4RjY5MTFFQ0E1MTNENTRENkE0MzBDN0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ssBcIAAACyklEQVR42rSW20sUcRTHz8zstmuukoSb6aIWSa2UUFSSbT50kaKHqKTLQ0++1HOEb/0HPQY+9ZIERWAPEklFZBRR2lJQYKaolYhuW+a2re440/fs/BbG2bG9zHjgw/C7zO/7O+d3O1JlIEAFWBvoAPtAEwiK+jnwBQyBx2Aw30BSHsEz4KoQLMTeghvgbrGCG0EP6KTSrB9cBt8LEWwGT0ENObOf4BgYNlfKlk6NYj2cirFVgTcgvJqH68A4qCtmVFkiaqiWaesmiVrqFRqZ1uhhVLV62gAWuOAxNdzOJ1buk2hLUKKmGpm218q0ow7fzTJtKJdW9LMIsqf3wAmz4B5wztyrokyijhaFdjcq1BwyBGTJfiKJlE6zv3WaA+yhjR0H7XxssiHlM3Q028oit674aT6pU2wBg83rNBXTaHJOp29xjWZQjqP+R0IvJvq8nq3sYa1ZjO3CQQ/5vUR9H1XqHVQpuaRTGlHSML6CbeZRjPByKH1eo+xVpEwbB2F8Vst4a7H9YBsLnra2/F0yvhfbvBmKNZ5YV0+KXo8uW5s6+VhEcn7QdEfngde6s9Vj1xSRxUF33f4s2lY3sWBoLQRXCVI1C5a5JWLetTrZKvpYMOWG2M2BNEWuJ6n7jhFLr/2hXZTtbvRSLDph7MihMeMry7bdYryVPoGdjj3s8lP/sEqHworhimob0lGex0s3PPRh6mdxFIKVRiglsg3pKxbsy32Waa3sPgt+Bc/NtQGfc8UKf+4yg5Hs0navuGXHlh0Lvp/MeTWuWR/gB+BUtnD+gIfCIaWk6I7OaNT7Im2uegYOWwXXgwm+DVxetwSoFy//ipwmKS5y1WXB9qyYXRL1mR9JEHfj/hYORP+XtbG9A7s4NXEg9gS02J1xeZUfpsFJcElMoFD7ALpEPjpeSqqftSMi69orUr4qUf8LTIlkdwA8yjfQPwEGAHN9u3AANWbiAAAAAElFTkSuQmCC",
    //     "pincode": "121005",
    //     "profile_type": "Test",
    //     "specialisation": "Test user data",
    //     "exp_year": "01",
    //     "exp_month": "12",
    //     "description": "Test Data Here"
    // }
    
    //   this.db.postReq(r,'user/temp_register').subscribe(resp=>{
    //     if(resp['status'] == 'success'){
    //       this.db.drType = resp['result'].data
    //     }else{
    //       if(resp['message']=='Invalid token'){
    //         this.db.sessionExpire();
    //         return;
    //       }
    //       this.db.presentAlert(resp['status'],resp['message'])
    //     }
    //   })
    // }
    
    drRefreshEvent(){
      
      if(this.db.router.url.includes('dr-list')) {
        setTimeout(() => {
          this.event.publish('refresh-dr-list',{})
        }, 500);
      }
      if(this.db.router.url.includes('lead-list')) {
        setTimeout(() => {
          this.event.publish('refresh-lead-list',{})
        }, 500);
      }
      if(this.db.router.url.includes('order-list')) {
        setTimeout(() => {
          console.log('test');
          
          this.event.publish('refresh-order-list',{})
        }, 500);
      }
    }
    getData(loop){
      this.db.presentLoader();
      
      this.db.postReq({},'left_navigation').subscribe(resp=>{
        this.db.dismissLoader();
        if(resp['status'] == 'success'){
          this.navigationData = resp['data'].permissionData
        }else{
          if(resp['message']=='Invalid token'){
            this.db.sessionExpire();
            return;
          }
          this.db.presentAlert(resp['status'],resp['message'])
        }
        setTimeout(() => {
          // if(loop)this.getData(true);
        }, 60*1000);
      },err=>{
        this.db.errHandler(err);
      })
    }
    backNav() {
      this.status = !this.status;
      if(this.status) {
        //this.render.removeClass(document.body, 'toggle-active-tlp');
      }
      else {
        //this.render.removeClass(document.body, 'toggle-active-tlp');
      }
    }
}
