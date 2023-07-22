import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private router : Router) {}

  onLogout() {
    localStorage.clear();
    this.router.navigate(['entry']);
  }
}
