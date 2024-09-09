import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  
  
  constructor() { }
  
  ngOnInit() {
  } 
  
  
  
  success(title:any,msg:any){
    Swal.fire(
      title+' !',
      msg+'.',
      'success'
      )
    }
    
    error(type:any,msg:any){
      Swal.fire(
        type?type:'Oops',
        msg,
        'error'
        )
      }
      
      warning(type:any,msg:any){
        Swal.fire(
          type?type:'Oops',
          msg,
          'warning'
          )
        }
        
        // error(msg:any){
        //   Swal.fire({
        //     type: 'error',
        //     title: 'Oops...',
        //     text: msg,
        //     // footer: '<a href>Why do I have this issue?</a>'
        //   })
        // }
        
        
      } 