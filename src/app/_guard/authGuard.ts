import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DatabaseService } from '../_services/database.service';
import { AuthService } from '../_services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router,
    public auth: AuthService,
    public db: DatabaseService,
    ) {
      
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
      if (localStorage.getItem('sessionToken')) {
        // logged in so return true
        return true;
      }
      
      // not logged in so redirect to login page
      this.router.navigate(['/login']);
      return false;
      
    }
 
    
  }