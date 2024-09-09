import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OfferListComponent } from './offer/list/list.component';
import { AuthGuard } from './_guard/authGuard';
import { OfferAddComponent } from './offer/add/add.component';
import { OfferDetailComponent } from './offer/detail/detail.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'offer-list', component: OfferListComponent, canActivate: [AuthGuard]},
  { path: 'offer-add', component: OfferAddComponent, canActivate: [AuthGuard]},
  { path: 'offer-edit/:id', component: OfferAddComponent, canActivate: [AuthGuard]},
  { path: 'offer-detail/:id', component: OfferDetailComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { 
  
}
