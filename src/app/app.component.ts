import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService, ExpenseRecord, User } from './api.service';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TransactionDialogComponent, CurrencyPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  api = inject(ApiService);
  
  currentUser = signal<User>('Shawn');
  expenses = signal<ExpenseRecord[]>([]);
  loading = signal<boolean>(false);
  
  // Dialog State
  showDialog = signal<boolean>(false);
  selectedExpense = signal<ExpenseRecord | null>(null);

  constructor() {
    // Re-fetch when user changes
    effect(() => {
      this.fetchData(this.currentUser());
    });
  }

  fetchData(user: User) {
    this.loading.set(true);
    this.api.getExpenses(user).subscribe({
      next: (data) => {
        this.expenses.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch', err);
        this.loading.set(false);
      }
    });
  }

  // Computed Values
  totalBalance = computed(() => {
    return this.expenses().reduce((acc, curr) => acc + curr.amount, 0);
  });

  recentTransactions = computed(() => {
    // Sort by date descending
    return [...this.expenses()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  // Actions
  switchUser(user: User) {
    this.currentUser.set(user);
  }

  openAddDialog() {
    this.selectedExpense.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(expense: ExpenseRecord) {
    this.selectedExpense.set(expense);
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
    this.selectedExpense.set(null);
  }

  onSave(data: Omit<ExpenseRecord, 'id'> | ExpenseRecord) {
    this.loading.set(true);
    this.closeDialog(); // Optimistic close or wait? Let's close.
    
    if ('id' in data) {
      // Update
      this.api.updateExpense(this.currentUser(), data as ExpenseRecord).subscribe(() => this.fetchData(this.currentUser()));
    } else {
      // Create
      this.api.createExpense(this.currentUser(), data).subscribe(() => this.fetchData(this.currentUser()));
    }
  }

  onDelete() {
    const record = this.selectedExpense();
    if (record) {
      this.loading.set(true);
      this.closeDialog();
      this.api.deleteExpense(this.currentUser(), record.id).subscribe(() => this.fetchData(this.currentUser()));
    }
  }
}
