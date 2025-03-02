import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClickService {
  private baseUrl = 'https://gpa-cgpa-calculator-yltr.onrender.com/api';

  constructor(private http: HttpClient) { }

  trackClick(type: 'GPA' | 'CGPA') {
    return this.http.post(`${this.baseUrl}/click/${type}`, {});
  }

  getClickCounts() {
    return this.http.get(`${this.baseUrl}/clicks`);
  }
}
