import { AllowGuardService } from './shared/services/allow-guard.service';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NguCarouselModule } from '@ngu/carousel';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgwWowModule } from 'ngx-wow';
import { AgmCoreModule } from '@agm/core';
import { AboutComponent } from './about/about/about.component';
import { ContactComponent } from './about/contact/contact.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailComponent } from './authentication/email/email.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { CartCheckoutComponent } from './cart/components/cart-checkout/cart-checkout.component';
import { CartComponent } from './cart/components/cart/cart.component';
import { CartPageComponent } from './cart/pages/cart-page/cart-page.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaqComponent } from './faq/faq.component';
import { FlavorsPageComponent } from './flavors/pages/flavors-page/flavors-page.component';
import { PopularComponent } from './home/components/popular/popular.component';
import { TestimonialsComponent } from './home/components/testimonials/testimonials.component';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { PicklesPageComponent } from './pickles/pages/pickles-page/pickles-page.component';
import { PowdersPageComponent } from './powders/pages/powders-page/powders-page.component';
import { SavoriesPageComponent } from './savories/pages/savories-page/savories-page.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { CollectionComponent } from './shared/components/collection/collection.component';
import { ItemComponent } from './shared/components/item/item.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { SiteFooterComponent } from './shared/components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './shared/components/site-header/site-header.component';
import { SiteLoaderComponent } from './shared/components/site-loader/site-loader.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { ScrollableDirective } from './shared/directives/scrollable.directive';
import { ItemPageComponent } from './shared/pages/item-page/item-page.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { AuthService } from './shared/services/auth.service';
import { BannerService } from './shared/services/banner.service';
import { CartService } from './shared/services/cart.service';
import { CommonService } from './shared/services/common.service';
import { ContactService } from './shared/services/contact.service';
import { CurrencyService } from './shared/services/currency.service';
import { GoogleAnalyticsEventsService } from './shared/services/google-analytics-events-service';
import { ItemService } from './shared/services/item.service';
import { LocalStorageService } from './shared/services/localStorage.service';
import { TokenService } from './shared/services/token.service';
import { SweetsPageComponent } from './sweets/pages/sweets-page/sweets-page.component';
import { UserComponent } from './user/user.component';
import { WishlistComponent } from './wishlist/components/wishlist/wishlist.component';
import { WishlistPageComponent } from './wishlist/pages/wishlist-page/wishlist-page.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { PricePipe } from './shared/pipes/price.pipe';
import { WordExtractPipe } from './shared/pipes/word-extract.pipe';
import { FeedbackComponent } from './feedback/feedback.component';


// plugins

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CarouselComponent,
    SweetsPageComponent,
    SavoriesPageComponent,
    PicklesPageComponent,
    PowdersPageComponent,
    FlavorsPageComponent,
    ItemComponent,
    ItemPageComponent,
    SiteFooterComponent,
    SiteHeaderComponent,
    SiteLoaderComponent,
    ModalComponent,
    LoginComponent,
    SignupComponent,
    WishlistComponent,
    WishlistPageComponent,
    CartPageComponent,
    CartComponent,
    CartCheckoutComponent,
    ScrollableDirective,
    CollectionComponent,
    EmailComponent,
    AboutComponent,
    ContactComponent,
    FaqComponent,
    ClickOutsideDirective,
    CategoriesComponent,
    PopularComponent,
    TestimonialsComponent,
    UserComponent,
    ForgotPasswordComponent,
    PricePipe,
    WordExtractPipe,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule,
    NguCarouselModule,
    NgxPageScrollModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsKey
    }),
    NgwWowModule.forRoot()
  ],
  providers: [
    GoogleAnalyticsEventsService,
    AuthService,
    BannerService,
    CurrencyService,
    TokenService,
    AuthGuardService,
    ItemService,
    CartService,
    LocalStorageService,
    CommonService,
    ContactService,
    AllowGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
