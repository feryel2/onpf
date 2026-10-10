import { Component, OnInit } from '@angular/core';
import { FileService, RealEstateFile } from '../../services/file.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  query = '';
  status = '';
  files: RealEstateFile[] = [];
  page = 0;
  readonly pageSize = 10;
  totalElements = 0;
  loading = false;
  searched = false;
  errorMessage = '';

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.search();
  }

  search(page = 0): void {
    this.page = page;
    this.loading = true;
    this.searched = true;
    this.errorMessage = '';

    const filters: { query?: string; status?: string } = {};
    if (this.query.trim()) filters.query = this.query.trim();
    if (this.status) filters.status = this.status;

    this.fileService.getFiles(this.page, this.pageSize, filters).subscribe({
      next: response => {
        const returnedFiles: RealEstateFile[] = response.content || [];
        const query = this.query.trim().toLocaleLowerCase();
        this.files = returnedFiles.filter(file => {
          const values = [file.fileNumber, file.lotNumber, file.subject, file.notes, file.source,
            file.cadastralData?.titleName, file.cadastralData?.region, file.cadastralData?.location]
            .filter((value): value is string => Boolean(value));
          const matchesQuery = !query || values.some(value => value.toLocaleLowerCase().includes(query));
          const matchesStatus = !this.status || file.status === this.status;
          return matchesQuery && matchesStatus;
        });
        this.totalElements = response.totalElements || 0;
        if (this.totalElements === returnedFiles.length) this.totalElements = this.files.length;
        this.loading = false;
      },
      error: () => {
        this.files = [];
        this.totalElements = 0;
        this.loading = false;
        this.errorMessage = 'تعذر تحميل نتائج البحث. تحقق من اتصال الخادم.';
      }
    });
  }

  clear(): void {
    this.query = '';
    this.status = '';
    this.search();
  }

  statusLabel(status: string): string {
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
