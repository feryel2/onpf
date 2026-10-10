import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService, RealEstateFile, CadastralData, Document } from '../../services/file.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  file?: RealEstateFile;
  notes = '';
  cadastral: CadastralData = {
    titleName: '',
    region: 'الإدارة الجهوية للملكية العقارية بتونس',
    location: '',
    surfaceM2: 0,
    propertyType: '',
    previousOwner: '',
    newOwner: '',
    saleAmountTnd: 0,
    chargesStatus: 'خالٍ من الديون والرهون',
    hasOpposition: false
  };

  loading = false;
  saving = false;
  sending = false;
  message = '';
  messageType: 'success' | 'danger' = 'success';

  // Modal state for adding a document
  showAddDocModal = false;
  newDoc: { type: string; number: string; date: string; notes: string } = {
    type: 'عقد بيع نهائي معرف به ومسجل بالقباضة',
    number: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  // Success Modal
  showSuccessModal = false;
  modalTitle = '';
  modalMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading = true;
    this.fileService.getFileById(id).subscribe({
      next: (f) => {
        this.file = f;
        this.notes = f.notes || '';
        if (f.cadastralData) {
          this.cadastral = { ...this.cadastral, ...f.cadastralData };
        } else {
          this.cadastral.titleName = `الرسم العقاري ${f.lotNumber} تونس`;
          this.cadastral.location = 'تونس العاصمة';
          this.cadastral.propertyType = 'عقار مبني / مقسم سكني';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageType = 'danger';
        this.message = 'تعذر تحميل بيانات الملف للدراسة.';
      }
    });
  }

  save(): void {
    if (!this.file) return;

    this.saving = true;
    this.message = '';

    const updatePayload: Partial<RealEstateFile> = {
      notes: this.notes,
      cadastralData: this.cadastral
    };

    this.fileService.updateFile(this.file.id, updatePayload).subscribe({
      next: (updated) => {
        this.file = updated;
        this.saving = false;
        this.messageType = 'success';
        this.message = 'تم حفظ دراسة الملف وتحديث البيانات العقارية بنجاح.';
      },
      error: (e) => {
        this.saving = false;
        this.messageType = 'danger';
        this.message = e.error?.message || 'حدث خطأ أثناء حفظ التعديلات.';
      }
    });
  }

  send(): void {
    if (!this.file) return;

    // First save the latest cadastral data and notes
    this.sending = true;
    this.message = '';

    const updatePayload: Partial<RealEstateFile> = {
      notes: this.notes,
      cadastralData: this.cadastral
    };

    this.fileService.updateFile(this.file.id, updatePayload).subscribe({
      next: () => {
        // Then assign to verification
        this.fileService.assignFileToVerification(this.file!.id, this.notes).subscribe({
          next: (f) => {
            this.file = f;
            this.sending = false;
            this.modalTitle = 'تمت إحالة الملف للتثبت بنجاح 🚀';
            this.modalMessage = `تم حفظ كافة البيانات العقارية والوثائق وإحالة الملف (${f.fileNumber}) إلى المتثبت القانوني.`;
            this.showSuccessModal = true;
          },
          error: (e) => {
            this.sending = false;
            this.messageType = 'danger';
            this.message = e.error?.message || 'تعذرت إحالة الملف إلى المتثبت.';
          }
        });
      },
      error: () => {
        this.sending = false;
        this.messageType = 'danger';
        this.message = 'تعذر حفظ البيانات قبل الإحالة.';
      }
    });
  }

  openAddDocModal(): void {
    this.newDoc = {
      type: 'عقد بيع نهائي معرف به ومسجل بالقباضة',
      number: `DOC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
    this.showAddDocModal = true;
  }

  closeAddDocModal(): void {
    this.showAddDocModal = false;
  }

  submitAddDoc(): void {
    if (!this.file) return;
    if (!this.newDoc.type || !this.newDoc.number) return;

    this.fileService.addDocument(this.file.id, this.newDoc).subscribe({
      next: (doc) => {
        this.file!.documents = this.file!.documents || [];
        this.file!.documents.push(doc);
        this.closeAddDocModal();
        this.messageType = 'success';
        this.message = `تمت إضافة الوثيقة « ${doc.type} » بنجاح.`;
      },
      error: () => {
        this.messageType = 'danger';
        this.message = 'تعذر إضافة الوثيقة إلى الملف.';
      }
    });
  }

  deleteDoc(doc: Document): void {
    if (!this.file || !confirm(`هل أنت متأكد من حذف الوثيقة « ${doc.type} » ؟`)) return;

    this.fileService.deleteDocument(this.file.id, doc.id).subscribe({
      next: () => {
        this.file!.documents = (this.file!.documents || []).filter(d => d.id !== doc.id);
        this.messageType = 'success';
        this.message = `تم حذف الوثيقة « ${doc.type} » بنجاح.`;
      },
      error: () => {
        this.messageType = 'danger';
        this.message = 'تعذر حذف الوثيقة.';
      }
    });
  }

  goBackToFiles(): void {
    this.showSuccessModal = false;
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
      APPROVED: 'مصادق عليه',
      CLOSED: 'مغلق'
    };
    return status ? (map[status] || status) : '-';
  }
}
