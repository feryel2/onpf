import { Component, OnInit } from '@angular/core';
import { FileService, OperationEntry } from '../../services/file.service';

@Component({
  selector: 'app-operations-log',
  templateUrl: './operations-log.component.html',
  styleUrls: ['./operations-log.component.scss']
})
export class OperationsLogComponent implements OnInit {
  operations: OperationEntry[] = [];
  page = 0;
  readonly pageSize = 20;
  totalElements = 0;
  loading = false;
  errorMessage = '';

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.load();
  }

  load(page = 0): void {
    this.page = page;
    this.loading = true;
    this.errorMessage = '';
    this.fileService.getOperations(this.page, this.pageSize).subscribe({
      next: response => {
        this.operations = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'تعذر تحميل سجل العمليات.';
      }
    });
  }

  statusLabel(status?: string): string {
    if (!status) return '—';
    const labels: Record<string, string> = {
      NEW: 'جديد',
      UNDER_STUDY: 'قيد الدراسة',
      AWAITING_VERIFICATION: 'في انتظار التثبت',
      UNDER_VERIFICATION: 'قيد التثبت',
      RETURNED_FOR_CORRECTION: 'مرجع للتصحيح',
      AWAITING_FINAL_VERIFICATION: 'في انتظار التثبت النهائي',
      UNDER_FINAL_VERIFICATION: 'قيد التثبت النهائي',
      APPROVED: 'مصادق عليه',
      CLOSED: 'مغلق'
    };
    return labels[status] || status;
  }

  roleLabel(role: string): string {
    const labels: Record<string, string> = {
      EDITOR: 'محرر',
      VERIFIER: 'متثبت',
      SENIOR_VERIFIER: 'متثبت أعلى'
    };
    return labels[role] || role;
  }

  get hasPreviousPage(): boolean {
    return this.page > 0;
  }

  get hasNextPage(): boolean {
    return (this.page + 1) * this.pageSize < this.totalElements;
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
