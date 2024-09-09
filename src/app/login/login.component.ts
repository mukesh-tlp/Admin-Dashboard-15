import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  constructor(
    private auth : AuthService,
    private router : Router, 
    private db : DatabaseService,
    ) {
      if(localStorage.getItem('sessionToken')) this.router.navigateByUrl('dashboard');
     }
    
    ngOnInit() {
      // this.form.loginUserName = 'admin';
      // this.db.exportAsXLSX();
      this.form.loginType = 'user';
    }
    
    
    hidePassword = true;
    form:any={};
    formSubmitted:any=false;
    userData:any={};
    submitLogin(myForm:any)
    {
      this.formSubmitted = true;
      console.log('*** Submit Login ***');
      console.log(this.form);
      
      this.auth.login(this.form.loginUserName,this.form.loginPassword,this.form.loginType)
      .subscribe((result) => {
        console.log(result);
        if(result==true)
        {
          // this.userData = this.auth.loggedIn;
          console.log(this.userData);
          this.router.navigate(['/dashboard']);
          myForm.resetForm();
        }else{
        }
      },err =>
      console.log(err)
      );
      this.formSubmitted = false;
    }
    
    
    
  }
  