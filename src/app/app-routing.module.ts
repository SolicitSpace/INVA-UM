import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewComponent } from './pages/create-new/create-new.component';
import { HomeComponent } from './pages/home/home.component';
import { EntryComponent } from './pages/entry/entry.component';
import { WidgetDetailsComponent } from './pages/widget-details/widget-details.component';
import { EditWidgetComponent } from './pages/edit-widget/edit-widget.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: "entry",   
    component: EntryComponent
  },
  {
    path: "home",   
    component: HomeComponent
  },
  {
    path: "create-new",   
    component: CreateNewComponent
  },
  {
    path: "edit-widget",   
    component: EditWidgetComponent
  },
  {
    path: "widget-details",   
    component: WidgetDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
