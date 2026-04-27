import { Component, inject, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Registercreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected creds = {} as Registercreds;

  register() {
    console.log('Registering with creds:', this.creds);
    this.accountService.register(this.creds).subscribe({
      next: response => {this.cancel(), console.log('Registration successful:', response)},
      error: error => {
        console.log('Registration error:', error);
        console.log('Error status:', error.status);
        console.log('Error message:', error.error);
      }
    });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
