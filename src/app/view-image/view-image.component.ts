import { Component, Inject, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  // selector: 'app-payment-status-model',
  templateUrl: './view-image.component.html'
})
export class ViewImageModelComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data,public db:DatabaseService,
    private _location: Location) { }
  ngOnInit() {
    
  }
  openUrl(){
    window.open(this.data,'_blank')
  }
}
