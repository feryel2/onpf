import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService, RealEstateFile, Document } from '../../services/file.service';

@Component({
  selector: 'app-final-verification',
  templateUrl: './final-verification.component.html',
  styleUrls: ['./final-verification.component.scss']
})
export class FinalVerificationComponent implements OnInit {
  file?: RealEstateFile;
  note = '';
  message = '';
  messageType: 'success' | 'danger' = 'success';
  loading = false;
  loadingAction: 'approve' | 'return' | '' = '';

  // Legal Checklist for Senior Conservator / Verifier
  legalChecks = {
    noOpposition: true,
    cadastralMatching: true,
    fiscalClearance: true,
    powersValid: true
  };

  // Reservation arbitration map: 'LIFTED' (رفع التحفظ) or 'MAINTAINED' (تأكيد التحفظ)
  arbitrations: { [docId: string]: 'LIFTED' | 'MAINTAINED' } = {};

  // Certificate and Feedback Modals
  showCertificateModal = false;
  showSuccessModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'approved' | 'returned' = 'approved';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private files: FileService
  ) {}

  ngOnInit(): void {
    this.loadFile();
  }

  loadFile(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading = true;
    this.files.getFileById(id).subscribe({
      next: (f) => {
        this.file = f;
        this.note = f.notes || 'تأشيرة الحافظ المساعد للملكية العقارية: تم التدقيق والمطابقة مع السجل العقاري، وصالح للترسيم النهائي وتطهير الرسم.';
        this.loading = false;

        // Auto initialize reservations as LIFTED by default if senior verifier reviews them
        if (f.documents) {
          f.documents.forEach(d => {
            if (d.hasReservation) {
              this.arbitrations[d.id] = 'LIFTED';
            }
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageType = 'danger';
        this.message = 'تعذر تحميل بيانات الملف للمراجعة النهائية.';
      }
    });
  }

  get allChecksPassed(): boolean {
    return this.legalChecks.noOpposition &&
           this.legalChecks.cadastralMatching &&
           this.legalChecks.fiscalClearance &&
           this.legalChecks.powersValid;
  }

  get defaultFormalityNumber(): string {
    const num = this.file?.id ? Number(this.file.id) : 4;
    return 'FORM-2026-' + (8800 + num);
  }

  get defaultVolumeNumber(): string {
    const num = this.file?.id ? Number(this.file.id) : 4;
    return 'VOL-' + (420 + num);
  }

  get defaultFolioNumber(): string {
    const num = this.file?.id ? Number(this.file.id) : 4;
    return String((num * 14) + 68);
  }

  get defaultCertificateNumber(): string {
    const num = this.file?.id ? Number(this.file.id) : 4;
    return 'CERT-ONPF-2026-' + (91000 + (num * 235));
  }

  get verifiedDocsCount(): number {
    if (!this.file?.documents) return 0;
    return this.file.documents.filter(d => d.status === 'VERIFIED').length;
  }

  get compliancePercentage(): number {
    if (!this.file?.documents || this.file.documents.length === 0) return 100;
    return Math.round((this.verifiedDocsCount / this.file.documents.length) * 100);
  }

  setArbitration(docId: string, decision: 'LIFTED' | 'MAINTAINED'): void {
    this.arbitrations[docId] = decision;
  }

  approve(): void {
    if (!this.file) return;

    if (!this.allChecksPassed) {
      this.messageType = 'danger';
      this.message = 'تنبيه قانوني: يجب التأشير على جميع عناصر الرقابة القانونية ومطابقة السجل العقاري قبل المصادقة النهائية.';
      return;
    }

    this.loadingAction = 'approve';
    this.message = '';

    this.files.approveFile(this.file.id, this.note).subscribe({
      next: (f) => {
        this.file = f;
        this.loadingAction = '';
        this.messageType = 'success';
        this.message = 'تمت المصادقة والترسيم النهائي بالدفتر العقاري بنجاح.';

        // Open official certificate view modal
        this.showCertificateModal = true;
      },
      error: (e) => {
        this.loadingAction = '';
        this.messageType = 'danger';
        this.message = e.error?.message || 'تعذرت المصادقة النهائية على الملف.';
      }
    });
  }

  returnFile(): void {
    if (!this.file) return;
    this.loadingAction = 'return';
    this.message = '';
    this.files.returnFileForCorrection(this.file.id, this.note).subscribe({
      next: (f) => {
        this.file = f;
        this.loadingAction = '';
        this.messageType = 'success';
        this.message = 'تم إرجاع الملف للتصحيح إلى المتثبت/المحرر.';

        this.modalTitle = 'تم إرجاع الملف للتصحيح';
        this.modalMessage = `تم إرجاع الملف العقاري (${this.file.fileNumber}) إلى المحرر/المتثبت لاستكمال الملاحظات وتصحيح الموجبات القانونية.`;
        this.modalType = 'returned';
        this.showSuccessModal = true;
      },
      error: (e) => {
        this.loadingAction = '';
        this.messageType = 'danger';
        this.message = e.error?.message || 'تعذر إرجاع الملف.';
      }
    });
  }

  printCertificate(): void {
    window.print();
  }

  openCertificateView(): void {
    this.showCertificateModal = true;
  }

  closeCertificateView(): void {
    this.showCertificateModal = false;
  }

  goBackToFiles(): void {
    this.showSuccessModal = false;
    this.showCertificateModal = false;
    this.router.navigate(['/files']);
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
      APPROVED: 'مصادق عليه ومدرج بالسجل العقاري (APPROVED)',
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

