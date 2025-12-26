import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExpenseRecord {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  item: string;
  amount: number;
  category: string;
  note: string;
}

export type User = 'Shawn' | 'Ethan';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Using the direct URL. Note: The backend must be deployed as "Anyone" (Anonymous) 
  // for this to work in a browser without CORS issues on redirects.
  private readonly API_URL = 'https://script.google.com/macros/s/AKfycbyYP_AfB_lzq8SMX_xn8AQKPR3SPC04zpFEbv1fWpH0yOklpW6qrygsB7bHYWQp-a9r/exec';

  getExpenses(sheetName: User): Observable<ExpenseRecord[]> {
    // Note: We do NOT set Content-Type for GET requests as it can trigger preflight
    return this.http.get<ExpenseRecord[]>(`${this.API_URL}?sheetName=${sheetName}`);
  }

  // Generic POST handler for Create, Update, Delete
  // GAS requires Content-Type: text/plain to avoid preflight OPTIONS
  private postAction(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=utf-8'
    });
    return this.http.post(this.API_URL, JSON.stringify(payload), { headers });
  }

  createExpense(sheetName: User, data: Omit<ExpenseRecord, 'id'>): Observable<any> {
    const payload = {
      sheetName,
      action: 'create',
      data: { ...data, id: crypto.randomUUID() } 
    };
    return this.postAction(payload);
  }

  updateExpense(sheetName: User, record: ExpenseRecord): Observable<any> {
    const payload = {
      sheetName,
      action: 'update',
      data: record
    };
    return this.postAction(payload);
  }

  deleteExpense(sheetName: User, id: string): Observable<any> {
    const payload = {
      sheetName,
      action: 'delete',
      id
    };
    return this.postAction(payload);
  }
}
