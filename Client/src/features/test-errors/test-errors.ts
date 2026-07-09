import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { single } from 'rxjs';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  baseUrl = 'https://localhost:5001/api/';
    validationErrors = signal<string[]>([]);
  
    constructor(private http: HttpClient) { }
  
    ngOnInit(): void {
    }
  
    get404Error() {
      this.http.get(this.baseUrl + 'buggy/not-found').subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
  
    get400Error() {
      this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
  
    get500Error() {
      this.http.get(this.baseUrl + 'buggy/server-error').subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
  
    get401Error() {
      this.http.get(this.baseUrl + 'buggy/auth').subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
  
    get400ValidationError() {
      this.http.post(this.baseUrl + 'account/register', {}).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
        this.validationErrors.set(error);
      })
    }
  
}
