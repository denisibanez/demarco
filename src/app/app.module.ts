// Core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './views/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Services
import { HomeService } from '../../src/app/services/axios';

// Services http request
import { httpInterceptorProviders } from './services/httpRequest/interceptor';

// Router
import { AppRoutingModule } from './router/app-routing.module';

// Libs
import { MaterialModule } from './plugins/material.module';
import { IMaskModule } from 'angular-imask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

// Store
import { StateModule } from './store/store.module';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SnackbarModule } from './components/snackbar/snackbar.module';
import { ButtonRaisedComponent } from './components/button-raised/button-raised.component';
import { ButtonOutlinedComponent } from './components/button-outlined/button-outlined.component';
import { InputComponent } from './components/input/input.component';
import { DialogModule } from './components/dialog/dialog.module';
import { TextAreaComponent } from './components/text-area/text-area.component';

// Views
import { LayoutComponent } from './views/layout/layout.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { TableComponent } from './components/table/table.component';
import { DialogDetailComponent } from './views/home/dialog-detail/dialog-detail.component';
import { DialogDeleteComponent } from './views/home/dialog-delete/dialog-delete.component';
import { DialogAddComponent } from './views/home/dialog-add/dialog-add.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StateModule,
    CommonModule,
    SnackbarModule,
    DialogModule,
    IMaskModule,
    CurrencyMaskModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    ButtonRaisedComponent,
    ButtonOutlinedComponent,
    InputComponent,
    TextAreaComponent,
    LoginComponent,
    TableComponent,
    DialogDetailComponent,
    DialogDeleteComponent,
    DialogAddComponent,
  ],
  providers: [HomeService, HttpClientModule, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
