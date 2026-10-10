import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService, RealEstateFile, Document } from '../../services/file.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  file?: RealEstateFile;
  note = '';
  message = '';
  messageType: 'success' | 'danger' = 'success';
  loading = false;
  loadingAction: 'approve' | 'return' | '' = '';
  docNotes: { [docId: string]: string } = {};
  actionLoading: { [docId: string]: boolean } = {};

  // Success modal state
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
        this.note = f.notes || '';
        this.loading = false;
        if (f.documents) {
          f.documents.forEach(d => {
            this.docNotes[d.id] = d.notes || '';
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageType = 'danger';
        this.message = 'تعذر تحميل الملف. تأكد من صحة رقم المعرف والصلاحيات.';
      }
    });
  }

  verifyDocument(doc: Document, result: 'APPROVED' | 'REJECTED'): void {
    if (!this.file) return;

    const docId = doc.id;
    this.actionLoading[docId] = true;
    const note = this.docNotes[docId] || '';

    this.files.verifyDocument(this.file.id, docId, result, note).subscribe({
      next: (updatedDoc) => {
        this.actionLoading[docId] = false;
        doc.status = updatedDoc.status;
        doc.verificationResult = updatedDoc.verificationResult;
        doc.notes = updatedDoc.notes;
        this.messageType = 'success';
        this.message = result === 'APPROVED' 
          ? `تم قبول الوثيقة « ${doc.type} » بنجاح.` 
          : `تم رفض الوثيقة « ${doc.type} ».`;
      },
      error: (e) => {
        this.actionLoading[docId] = false;
        this.messageType = 'danger';
        this.message = e.error?.message || 'تعذر تسجيل نتيجة التثبت من الوثيقة.';
      }
    });
  }

  approve(): void {
    if (!this.file) return;
    this.loadingAction = 'approve';
    this.message = '';
    this.files.approveFile(this.file.id, this.note).subscribe({
      next: (f) => {
        this.file = f;
        this.loadingAction = '';
        this.messageType = 'success';
        this.message = 'تمت المصادقة على الملف وإحالته بنجاح إلى المتثبت الأعلى.';
        
        // Show prominent success modal
        this.modalTitle = 'تمت المصادقة والإحالة بنجاح';
        this.modalMessage = `تمت إحالة الملف العقاري (${this.file.fileNumber}) بنجاح إلى المتثبت الأعلى للمصادقة النهائية.`;
        this.modalType = 'approved';
        this.showSuccessModal = true;
      },
      error: (e) => {
        this.loadingAction = '';
        this.messageType = 'danger';
        this.message = e.error?.message || 'تعذرت المصادقة على الملف.';
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
        this.message = 'تم إرجاع الملف إلى المحرر للتصحيح.';

        // Show prominent return modal
        this.modalTitle = 'تم إرجاع الملف للتصحيح';
        this.modalMessage = `تم إرجاع الملف العقاري (${this.file.fileNumber}) إلى المحرر لتصحيح واستكمال الملاحظات.`;
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

  goBackToFiles(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/files']);
  }

  statusLabel(status?: string): string {
    const map: { [key: string]: string } = {
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
    const map: { [key: string]: string } = {
      PENDING: 'قيد الانتظار',
      VERIFIED: 'مقبول ومثبت',
      REJECTED: 'مرفوض'
    };
    return status ? (map[status] || status) : '-';
  }
}

