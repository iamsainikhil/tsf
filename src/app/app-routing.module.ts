import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about/about.component';
import { ContactComponent } from './about/contact/contact.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { CartPageComponent } from './cart/pages/cart-page/cart-page.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaqComponent } from './faq/faq.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FlavorsPageComponent } from './flavors/pages/flavors-page/flavors-page.component';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PicklesPageComponent } from './pickles/pages/pickles-page/pickles-page.component';
import { PowdersPageComponent } from './powders/pages/powders-page/powders-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SavoriesPageComponent } from './savories/pages/savories-page/savories-page.component';
import { ItemPageComponent } from './shared/pages/item-page/item-page.component';
import { AllowGuardService } from './shared/services/allow-guard.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { SweetsPageComponent } from './sweets/pages/sweets-page/sweets-page.component';
import { TermsComponent } from './terms/terms.component';
import { UserComponent } from './user/user.component';
import { WishlistPageComponent } from './wishlist/pages/wishlist-page/wishlist-page.component';


const routes: Routes = [
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  {path: 'shop', component: CategoriesComponent, pathMatch: 'full'},
  {path: 'about', component: AboutComponent, pathMatch: 'full'},
  {path: 'contact', component: ContactComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [AllowGuardService]},
  {path: 'signup', component: SignupComponent, pathMatch: 'full', canActivate: [AllowGuardService]},
  {path: 'sweets', component: SweetsPageComponent, pathMatch: 'full'},
  {path: 'sweets/:id', component: ItemPageComponent, pathMatch: 'full'},
  {path: 'savories', component: SavoriesPageComponent, pathMatch: 'full'},
  {path: 'savories/:id', component: ItemPageComponent, pathMatch: 'full'},
  {path: 'pickles', component: PicklesPageComponent, pathMatch: 'full'},
  {path: 'pickles/:id', component: ItemPageComponent, pathMatch: 'full'},
  {path: 'powders', component: PowdersPageComponent, pathMatch: 'full'},
  {path: 'powders/:id', component: ItemPageComponent, pathMatch: 'full'},
  {path: 'flavors', component: FlavorsPageComponent, pathMatch: 'full'},
  {path: 'flavors/:id', component: ItemPageComponent, pathMatch: 'full'},
  {path: 'cart', component: CartPageComponent, pathMatch: 'full'},
  {
    path: 'wishlist',
    component: WishlistPageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'user',
  component: UserComponent,
  pathMatch: 'full',
  canActivate: [AuthGuardService]
  },
  {
    path: 'feedback',
  component: FeedbackComponent,
  pathMatch: 'full',
  canActivate: [AuthGuardService]
  },
  {path: 'frequently-asked-questions', component: FaqComponent, pathMatch: 'full'},
  {path: 'privacy-policy', component: PrivacyPolicyComponent, pathMatch: 'full'},
  {path: 'terms-of-service', component: TermsComponent, pathMatch: 'full'},
  {path: '404', component: PageNotFoundComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
