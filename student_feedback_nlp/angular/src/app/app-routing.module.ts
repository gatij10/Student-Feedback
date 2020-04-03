import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TeacherComponent } from './teacher/teacher.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './guard/auth.guard';
import { SecureInnerPagesGuard } from './guard/inner.guard';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [

  {path : 'home', component : HomeComponent},
  {path : 'login', component : LoginComponent ,  canActivate : [SecureInnerPagesGuard]},
  {path : 'teacher/:id', component : TeacherComponent , canActivate : [AuthGuard]},
  {path : 'feedback', component : FeedbackComponent , canActivate : [AuthGuard]},
  {path : 'signup', component : SignupComponent , canActivate : [SecureInnerPagesGuard] },
  {path : 'admin', component : AdminComponent , canActivate : [AuthGuard]},


  {path : '', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
