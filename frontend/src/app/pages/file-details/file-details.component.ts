import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService, RealEstateFile } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  file?: RealEstateFile;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.fileService.getFileById(id).subscribe({
        next: (f) => {
          this.file = f;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'تعذر تحميل بيانات الملف.';
          this.loading = false;
        }
      });
    }
  }

  statusLabel(status?: string): string {
    const map: Record<string, string> = {
      NEW: 'جديد',
      UNDER_STUDY: 'قيد الدراسة',
      AWAITING_VERIFICATION: 'في انتظار التثبت',
      UNDER_VERIFICATION: 'قيد التثبت',
      RETURNED_FOR_CORRECTION: 'مُرجع للتصحيح',
      AWAITING_FINAL_VERIFICATION: 'في انتظار التثبت النهائي',
      UNDER_FINAL_VERIFICATION: 'قيد التثبت النهائي',
      APPROVED: 'مصادق عليه',
      CLOSED: 'مغلق'
    };
    return status ? (map[status] || status) : '-';
  }

  documentStatusLabel(status?: string): string {
    const map: Record<string, string> = {
      PENDING: 'قيد الانتظار',
      VERIFIED: 'مقبول ومثبت',
      REJECTED: 'مرفوض'
    };
    return status ? (map[status] || status) : '-';
  }
}

