import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import {Home} from '../features/home/home';
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected title = 'Dating App';

  protected members = signal<User[]>([]);

  async ngOnInit(){
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userJson = localStorage.getItem('user');
    if(!userJson) return;
    const user = JSON.parse(userJson);
    this.accountService.currentUser.set(user);
  }

  async getMembers() {
    try {
      return await lastValueFrom(
        this.http.get<User[]>('https://localhost:5001/api/members')
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}