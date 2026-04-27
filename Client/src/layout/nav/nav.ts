import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, FormsModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav {
  protected accountService = inject(AccountService);
  protected creds: any = {};

  login() {
    this.accountService.login(this.creds).subscribe({
      next: result => {
        console.log(result);        
        this.creds = {};
      },
      error: error => {
        console.log(error);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}