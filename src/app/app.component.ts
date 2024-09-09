import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './_services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Slimline Kitchens';
  
  constructor(public router : Router,public db:DatabaseService) {
    if(localStorage.getItem('sessionToken')) db.sessionToken = localStorage.getItem('sessionToken');
    console.log('db.sessionToken',db.sessionToken);
    
  }
  
  
}
