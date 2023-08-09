import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-widget',
  templateUrl: './create-new-widget.component.html',
  styleUrls: ['./create-new-widget.component.scss'],
})
export class CreateNewWidgetComponent {

  constructor(private router: Router) {}
  
  openWidgetCreator() {
    this.router.navigate(['create-new']);
  }
}
