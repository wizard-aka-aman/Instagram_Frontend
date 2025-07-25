import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'; 
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SharedModule } from "./shared/shared.module";  
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    PagenotfoundComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    SharedModule, 
    HttpClientModule, 
    BrowserAnimationsModule, // 👈 Required for toast animations
    ToastrModule.forRoot(),  // 👈 Global config 
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
