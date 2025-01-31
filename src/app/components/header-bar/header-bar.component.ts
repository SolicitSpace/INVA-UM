import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent {
  constructor(private global: GlobalService, private router: Router) {}

  onLogout() {
    if (
      confirm(
        `Are you sure you want to logout? \nWarning: This will wipe all your data!`
      )
    )
      this.global.onLogout();
  }

  navToHomePage() {
    this.router.navigate(['home']);
  }

  isBgMenuOpen: boolean = false;
  toggleBgMenu() {
    this.isBgMenuOpen = !this.isBgMenuOpen;
  }
}
