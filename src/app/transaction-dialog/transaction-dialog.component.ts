import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseRecord } from '../api.service';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-dialog.component.html'
})
export class TransactionDialogComponent implements OnInit {
  @Input() expense: ExpenseRecord | null = null;
  @Output() save = new EventEmitter<Omit<ExpenseRecord, 'id'> | ExpenseRecord>();
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    // Determine initial type based on amount sign.
    // Default to 'expense' if new.
    const isIncome = this.expense ? this.expense.amount > 0 : false;
    const absAmount = this.expense ? Math.abs(this.expense.amount) : null;

    this.form = this.fb.group({
      date: [this.expense?.date || new Date().toISOString().split('T')[0], Validators.required],
      item: [this.expense?.item || '', Validators.required],
      amount: [absAmount, [Validators.required, Validators.min(0.01)]],
      type: [isIncome ? 'income' : 'expense', Validators.required],
      category: [this.expense?.category || 'General', Validators.required],
      note: [this.expense?.note || '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formVal = this.form.value;
      const finalAmount = formVal.type === 'income' ? Math.abs(formVal.amount) : -Math.abs(formVal.amount);
      
      const payload: any = {
        date: formVal.date,
        item: formVal.item,
        amount: finalAmount,
        category: formVal.category,
        note: formVal.note
      };

      if (this.expense) {
        payload.id = this.expense.id;
      }

      this.save.emit(payload);
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this record?')) {
      this.delete.emit();
    }
  }
}
