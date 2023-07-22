import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewComponent } from './pages/create-new/create-new.component';
import { HomeComponent } from './pages/home/home.component';
import { EntryComponent } from './pages/entry/entry.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: "entry",   // Need to try this
    component: EntryComponent
  },
  {
    path: "home",   // Need to try this
    component: HomeComponent
  },
  {
    path: "create-new",   // Need to try this
    component: CreateNewComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
