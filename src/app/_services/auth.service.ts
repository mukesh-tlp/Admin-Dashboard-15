import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { Router, NavigationExtras } from '@angular/router';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'  
})
export class AuthService {
  
  constructor(
    private http: HttpClient,
    public db:DatabaseService,
    public router: Router, 
    public dialogAlert : DialogService,
    ) { }
    
    auth:any = {};
    
    ngOnInit()
    {
      this.auth.token='';
      console.log(this.auth);
    }
    
    login(loginUserName: string, loginPassword: string,type:any): Observable<boolean> {
      let request_data={username:loginUserName,password:loginPassword};
      let header = new HttpHeaders();
      header = header.append("Content-Type", "application/json");
      console.log(request_data);
      
      return this.http.post<{token: string}>(this.db.DbUrl+'login', JSON.stringify(request_data), {headers:header})
      .pipe(
        map(result => {
          console.log(result);
          
          if(result['status'] == 'success'){
            this.db.sessionToken = result['data']['userData']['session_token'];
            localStorage.setItem('karbitUserData', JSON.stringify(result['data']['userData']));
            localStorage.setItem('sessionToken', JSON.stringify(result['data']['userData'].session_token));
            localStorage.setItem('loginType',type);
            localStorage.setItem('permissionData', JSON.stringify(result['data']['permissionData']));
            if(type == 'user')this.router.navigateByUrl('dashboard');
            else { this.router.navigateByUrl('dr-detail/'+result['data']['userData'].cust_type_id+'/'+result['data']['userData'].encrypt_id) }
          }
          else{
            this.db.presentAlert('Alert',result['message']);
            return false;
          }
        })
        );
        
      }
      
      
      
      
      logout() {
        localStorage.removeItem('belUserData');
        this.db.sessionToken = '';
        this.auth.token = '';
        this.router.navigate(['']);
      }
      
      
      getDecodedAccessToken(token: string): any {
        console.log('Token - ' +token);
        try{
          // return jwt_decode(token);
        }
        catch(Error){
          return null;
        }
      }
      
      
      
      getUrl(moduleId:any)
      {
        var moduleUrl;
        if(moduleId == '1'){ moduleUrl = '/complaint'}
        if(moduleId == '2'){ moduleUrl = '/user/admin2'}
        if(moduleId == '3'){ moduleUrl = '/amc/renewal'}
        if(moduleId == '4'){ moduleUrl = '/vendor'}
        if(moduleId == '5'){ moduleUrl = '/ssc'}
        if(moduleId == '6'){ moduleUrl = '/preventive'}
        return moduleUrl;
      }
      
      
      userLoginData:any={};
      public get loggedIn(): boolean {
        if(localStorage.getItem('belUserData'))
        {
          this.userLoginData = JSON.parse(localStorage.getItem('belUserData'));
          return this.userLoginData;
        }
        else{
          return false;
        }
      }
      
      
      permission:any={};
      loggedInPermission(moduleId:any){
        if(localStorage.getItem('belUserData'))
        {
          
          this.userLoginData = JSON.parse(localStorage.getItem('belUserData'));
          this.userLoginData;
          
          console.log('*** Permission ***');
          this.userLoginData.modulePermData.map((x:any)=>{
            if(x.moduleId === moduleId)
            {
              this.permission = x;
            }
          });
          console.log(this.permission);
          return this.permission;
        }
        else{
          return false;
        }
      }
      
      
    }