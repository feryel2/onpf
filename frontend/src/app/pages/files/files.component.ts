import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService, RealEstateFile } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  files: RealEstateFile[] = [];
  filteredFiles: RealEstateFile[] = [];
  showAddModal = false;
  addFileForm!: FormGroup;
  isLoading = false;
  currentStatusFilter: string = 'ALL';
  searchTerm: string = '';
  submitError = '';

  // Form Stepper State
  currentStep: number = 1;

  // Regional Directorates of Land Property
  regions: string[] = [
    'الإدارة الجهوية للملكية العقارية بتونس',
    'الإدارة الجهوية للملكية العقارية بأريانة',
    'الإدارة الجهوية للملكية العقارية ببن عروس',
    'الإدارة الجهوية للملكية العقارية بسوسة',
    'الإدارة الجهوية للملكية العقارية بنابل',
    'الإدارة الجهوية للملكية العقارية بصفاقس',
    'الإدارة الجهوية للملكية العقارية ببنزرت',
    'الإدارة الجهوية للملكية العقارية بالمنستير'
  ];

  // Property Types
  propertyTypes: string[] = [
    'شقة سكنية بالطابق العلوي',
    'فيلا سكنية فاخرة',
    'مقسم عقاري سكني مهيأ',
    'ضيعة فلاحية مسجلة',
    'محل تجاري ومكاتب',
    'أرض صالحة للبناء'
  ];

  // Standard Documents to Include
  selectedDocs = {
    saleContract: false,
    taxReceipt: false,
    cadastralPlan: false,
    powerOfAttorney: false,
    mortgageRelease: false,
    inheritanceProof: false,
    courtJudgment: false,
    otherDocument: false
  };

  documentDetails = this.emptyDocumentDetails();

  private emptyDocumentDetails() {
    return {
      saleContract: { number: '', date: '' },
      taxReceipt: { number: '', date: '' },
      cadastralPlan: { number: '', date: '' },
      powerOfAttorney: { number: '', date: '' },
      mortgageRelease: { number: '', date: '' },
      inheritanceProof: { number: '', date: '' },
      courtJudgment: { number: '', date: '' },
      otherDocument: { number: '', date: '' }
    };
  }

  constructor(
    private fileService: FileService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.addFileForm = this.formBuilder.group({
      fileNumber: ['', Validators.required],
      lotNumber: ['', Validators.required],
      subject: ['', Validators.required],
      filingDate: ['', Validators.required],
      source: ['CITIZEN_REQUEST', Validators.required],
      operationType: ['', Validators.required],
      titleName: ['', Validators.required],
      region: ['الإدارة الجهوية للملكية العقارية بتونس', Validators.required],
      location: [''],
      surfaceM2: ['', Validators.min(1)],
      propertyType: [''],
      previousOwner: [''],
      newOwner: [''],
      saleAmountTnd: ['', Validators.min(1)],
      chargesStatus: [''],
      hasOpposition: [false]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentStatusFilter = params['status'] || 'ALL';
      this.loadFiles();
    });
  }

  setFilter(status: string): void {
    this.currentStatusFilter = status;
    if (status === 'ALL') {
      this.router.navigate(['/files']);
    } else {
      this.router.navigate(['/files'], { queryParams: { status } });
    }
  }

  applyLocalFilter(): void {
    let list = this.files;
    if (this.currentStatusFilter && this.currentStatusFilter !== 'ALL') {
      list = list.filter(f => f.status === this.currentStatusFilter);
    }
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(f => 
        (f.fileNumber && f.fileNumber.toLowerCase().includes(term)) ||
        (f.lotNumber && f.lotNumber.toLowerCase().includes(term)) ||
        (f.subject && f.subject.toLowerCase().includes(term))
      );
    }
    this.filteredFiles = list;
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      NEW: 'جديد',
      UNDER_STUDY: 'قيد الدراسة',
      AWAITING_VERIFICATION: 'في انتظار التثبت',
      UNDER_VERIFICATION: 'قيد التثبت',
      RETURNED_FOR_CORRECTION: 'مُرجع للتصحيح',
      AWAITING_FINAL_VERIFICATION: 'في انتظار التثبت النهائي',
      UNDER_FINAL_VERIFICATION: 'قيد التثبت النهائي',
      APPROVED: 'مصادق عليه ومدرج بالسجل',
      CLOSED: 'مغلق'
    };
    return labels[status] || status;
  }

  loadFiles(): void {
    this.isLoading = true;
    const filterParam = this.currentStatusFilter !== 'ALL' ? { status: this.currentStatusFilter } : undefined;
    this.fileService.getFiles(0, 50, filterParam).subscribe({
      next: (response) => {
        this.files = response.content || [];
        this.applyLocalFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('خطأ في تحميل الملفات', error);
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.currentStep = 1;
    this.submitError = '';
    this.addFileForm.reset({
      fileNumber: '',
      lotNumber: '',
      subject: '',
      filingDate: new Date().toISOString().split('T')[0],
      source: 'CITIZEN_REQUEST',
      operationType: '',
      titleName: '',
      region: 'الإدارة الجهوية للملكية العقارية بتونس',
      location: '',
      surfaceM2: '',
      propertyType: '',
      previousOwner: '',
      newOwner: '',
      saleAmountTnd: '',
      chargesStatus: '',
      hasOpposition: false
    });
    this.selectedDocs = { saleContract: false, taxReceipt: false, cadastralPlan: false, powerOfAttorney: false, mortgageRelease: false, inheritanceProof: false, courtJudgment: false, otherDocument: false };
    this.documentDetails = this.emptyDocumentDetails();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.currentStep = 1;
  }

  setStep(step: number): void {
    this.currentStep = step;
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  applyPreset(preset: 'apartment' | 'villa' | 'land' | 'lot'): void {
    const rnd = Math.floor(100 + Math.random() * 900);
    const today = new Date().toISOString().split('T')[0];

    switch (preset) {
      case 'apartment':
        this.addFileForm.patchValue({
          fileNumber: `FILE-2026-${rnd}`,
          lotNumber: `LOT-APT-${rnd}`,
          subject: 'مطلب ترسيم عقد بيع شقة سكنية بالمركب السكني',
          filingDate: today,
          source: 'CITIZEN_REQUEST',
          titleName: `الرسم العقاري ${rnd * 111} تونس "الرمال"`,
          region: 'الإدارة الجهوية للملكية العقارية بتونس',
          location: 'النصر 2، أريانة',
          surfaceM2: 145,
          propertyType: 'شقة سكنية بالطابق العلوي',
          previousOwner: 'شركة البعث العقاري المستقبل',
          newOwner: 'السيد منير بن الهادي العبيدي (ب.ت.و عدد 07824190)',
          saleAmountTnd: 240000,
          chargesStatus: 'خالٍ من الديون والرهون والتحملات'
        });
        this.selectedDocs = { saleContract: true, taxReceipt: true, cadastralPlan: true, powerOfAttorney: false, mortgageRelease: false, inheritanceProof: false, courtJudgment: false, otherDocument: false };
        break;

      case 'villa':
        this.addFileForm.patchValue({
          fileNumber: `FILE-2026-${rnd}`,
          lotNumber: `LOT-VIL-${rnd}`,
          subject: 'ترسيم عقد شراء فيلا مستقلة وحديقة ملحقة',
          filingDate: today,
          source: 'CITIZEN_REQUEST',
          titleName: `الرسم العقاري ${rnd * 222} تونس "الأندلس"`,
          region: 'الإدارة الجهوية للملكية العقارية بتونس',
          location: 'قمرت، تونس',
          surfaceM2: 680,
          propertyType: 'فيلا سكنية فاخرة',
          previousOwner: 'فوزي بن كمال الماجري',
          newOwner: 'سامية بنت محمد القروي (ب.ت.و عدد 09144820)',
          saleAmountTnd: 580000,
          chargesStatus: 'خالٍ من الرهون بعد الإدلاء بشهادة رفع اليد'
        });
        this.selectedDocs = { saleContract: true, taxReceipt: true, cadastralPlan: true, powerOfAttorney: false, mortgageRelease: true, inheritanceProof: false, courtJudgment: false, otherDocument: false };
        break;

      case 'land':
        this.addFileForm.patchValue({
          fileNumber: `FILE-2026-${rnd}`,
          lotNumber: `LOT-AGR-${rnd}`,
          subject: 'مطلب تقييد عقد بيع ضيعة فلاحية مسجلة',
          filingDate: today,
          source: 'CITIZEN_REQUEST',
          titleName: `الرسم العقاري ${rnd * 333} زغوان "الواحة"`,
          region: 'الإدارة الجهوية للملكية العقارية بنابل',
          location: 'الفحص، زغوان',
          surfaceM2: 15000,
          propertyType: 'ضيعة فلاحية مسجلة',
          previousOwner: 'عبد الرزاق بن عثمان الرياحي',
          newOwner: 'شركة الإحياء والتنمية الفلاحية الخضراء',
          saleAmountTnd: 350000,
          chargesStatus: 'خالٍ من العقل والقيود الاحتياطية'
        });
        this.selectedDocs = { saleContract: true, taxReceipt: true, cadastralPlan: true, powerOfAttorney: true, mortgageRelease: false, inheritanceProof: false, courtJudgment: false, otherDocument: false };
        break;

      case 'lot':
        this.addFileForm.patchValue({
          fileNumber: `FILE-2026-${rnd}`,
          lotNumber: `LOT-LOT-${rnd}`,
          subject: 'ترسيم شراء مقسم سكني مهيأ (قطعة رقم 18)',
          filingDate: today,
          source: 'CITIZEN_REQUEST',
          titleName: `الرسم العقاري ${rnd * 444} سوسة "الجوهرة"`,
          region: 'الإدارة الجهوية للملكية العقارية بسوسة',
          location: 'سهلول 4، سوسة',
          surfaceM2: 420,
          propertyType: 'مقسم عقاري سكني مهيأ',
          previousOwner: 'الوكالة العقارية للسكنى',
          newOwner: 'الأستاذ رمزي بن بلقاسم السوسي (ب.ت.و 04899120)',
          saleAmountTnd: 175000,
          chargesStatus: 'خالٍ من الديون والرهون'
        });
        this.selectedDocs = { saleContract: true, taxReceipt: true, cadastralPlan: true, powerOfAttorney: false, mortgageRelease: false, inheritanceProof: false, courtJudgment: false, otherDocument: false };
        break;
    }
  }

  submitAddFile(): void {
    if (this.addFileForm.invalid) {
      this.addFileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.submitError = '';
    const formVal = this.addFileForm.value;
    const documentDefinitions = [
      { selected: this.selectedDocs.saleContract, type: 'عقد بيع نهائي معرف به ومسجل بالقباضة', details: this.documentDetails.saleContract },
      { selected: this.selectedDocs.taxReceipt, type: 'شهادة إبراء ذمة وخلاص جبائي', details: this.documentDetails.taxReceipt },
      { selected: this.selectedDocs.cadastralPlan, type: 'مثال هندسي لديوان قيس الأراضي والمسح العقاري', details: this.documentDetails.cadastralPlan },
      { selected: this.selectedDocs.powerOfAttorney, type: 'توكيل قانوني أو قنصلي', details: this.documentDetails.powerOfAttorney },
      { selected: this.selectedDocs.mortgageRelease, type: 'شهادة رفع اليد والتشطيب على الرهن', details: this.documentDetails.mortgageRelease },
      { selected: this.selectedDocs.inheritanceProof, type: 'حجة وفاة أو إراثة', details: this.documentDetails.inheritanceProof },
      { selected: this.selectedDocs.courtJudgment, type: 'حكم أو قرار قضائي نهائي', details: this.documentDetails.courtJudgment },
      { selected: this.selectedDocs.otherDocument, type: 'وثيقة قانونية أخرى', details: this.documentDetails.otherDocument }
    ];
    const incompleteDocument = documentDefinitions.find(document => document.selected && (!document.details.number.trim() || !document.details.date));
    if (incompleteDocument) {
      this.isLoading = false;
      this.submitError = `أدخل رقم وتاريخ الوثيقة المحددة: ${incompleteDocument.type}.`;
      return;
    }

    const documents = documentDefinitions
      .filter(document => document.selected)
      .map((document, index) => ({
        id: Date.now() + index,
        type: document.type,
        number: document.details.number.trim(),
        date: document.details.date,
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      }));

    const newFilePayload: any = {
      fileNumber: formVal.fileNumber,
      lotNumber: formVal.lotNumber,
      subject: formVal.subject,
      filingDate: formVal.filingDate,
      source: formVal.source,
      operationType: formVal.operationType,
      cadastralData: {
        operationType: formVal.operationType,
        titleName: formVal.titleName,
        region: formVal.region,
        location: formVal.location,
        surfaceM2: formVal.surfaceM2 ? Number(formVal.surfaceM2) : undefined,
        propertyType: formVal.propertyType,
        previousOwner: formVal.previousOwner,
        newOwner: formVal.newOwner,
        saleAmountTnd: formVal.saleAmountTnd ? Number(formVal.saleAmountTnd) : undefined,
        chargesStatus: formVal.chargesStatus,
        hasOpposition: Boolean(formVal.hasOpposition)
      },
      documents
    };

    this.fileService.createFile(newFilePayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeAddModal();
        this.loadFiles();
      },
      error: (error) => {
        this.isLoading = false;
        this.submitError = error.error?.message || 'تعذر إنشاء الملف. تحقق من البيانات وحاول مجدداً.';
      }
    });
  }
}
