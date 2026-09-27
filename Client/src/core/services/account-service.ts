import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Logincreds, Registercreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  // Use HTTP and the API port currently running locally (backend listens on 5000/5001)
  baseUrl = environment.apiUrl;

  register(creds : Registercreds){
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap(user =>{
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(model: Logincreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      tap(user =>{
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user)); 
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
