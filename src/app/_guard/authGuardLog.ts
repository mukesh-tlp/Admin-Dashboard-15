import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DatabaseService } from '../_services/database.service';


@Injectable()
export class AuthGuardLog implements CanActivate {
  
  constructor(private router: Router,
    public db: DatabaseService) {
      console.log('Auth Guard Log');
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      if (localStorage.getItem('loyaltyPartnerCrmUserData')){
        var data = JSON.parse(localStorage.getItem('loyaltyPartnerCrmUserData'));
        console.log('loyaltyPartnerCrmUserData',data);

        console.log('state URL - '+state.url);
        if(state.url != '/')  
        {
        }
        else
        {
          this.router.navigate(['/sfm_mangement']);
        }
        return false;
      }
      else
      {
        return true;
      }
    }
    
  }
  
  