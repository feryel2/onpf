const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8080;
const SECRET_KEY = 'your-secret-key-change-this-in-production';

// Sample users (password is pre-hashed in real app)
const users = [
  {
    id: 1,
    username: 'editor_user',
    password: 'password',
    email: 'editor@onpf.gov.tn',
    fullName: 'محرر النظام',
    role: 'EDITOR'
  },
  {
    id: 2,
    username: 'verifier_user',
    password: 'password',
    email: 'verifier@onpf.gov.tn',
    fullName: 'متثبت النظام',
    role: 'VERIFIER'
  },
  {
    id: 3,
    username: 'senior_verifier',
    password: 'password',
    email: 'senior@onpf.gov.tn',
    fullName: 'متثبت أعلى',
    role: 'SENIOR_VERIFIER'
  }
];

// In-memory data used when the Spring Boot backend is not running locally.
const files = [
  {
    id: 1,
    fileNumber: 'FILE-2026-001',
    lotNumber: 'LOT-101',
    subject: 'طلب نقل ملكية عقار سكني بحي النصر',
    filingDate: '2026-01-15',
    status: 'UNDER_STUDY',
    source: 'CITIZEN_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'محرر النظام',
    responsible: 'محرر النظام',
    notes: 'الملف قيد الدراسة وإعداد التقرير القانوني.',
    cadastralData: {
      titleName: 'الرسم العقاري 10182 أريانة "الربيع"',
      location: 'حي النصر 2، أريانة',
      region: 'الإدارة الجهوية للملكية العقارية بأريانة',
      surfaceM2: 240,
      propertyType: 'شقة سكنية بالطابق الثالث',
      previousOwner: 'شركة البناء والتعمير',
      newOwner: 'أحمد بن صالح الورغي',
      saleAmountTnd: 195000,
      chargesStatus: 'خالٍ من الديون والرهون',
      hasOpposition: false
    },
    documents: [
      {
        id: 101,
        type: 'عقد بيع ابتدائي',
        number: 'DOC-2026-001',
        date: '2026-01-10',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      },
      {
        id: 102,
        type: 'شهادة ملكية',
        number: 'DOC-2026-002',
        date: '2026-01-12',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      }
    ]
  },
  {
    id: 2,
    fileNumber: 'FILE-2026-002',
    lotNumber: 'LOT-102',
    subject: 'تسوية رسم عقاري ونقل ملكية قطعة أرض فلاحية مع رفع اليد عن رهن',
    filingDate: '2026-02-20',
    status: 'AWAITING_VERIFICATION',
    source: 'REGISTRY_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'متثبت النظام',
    responsible: 'متثبت النظام',
    notes: 'تمت دراسة الملف من قبل المحرر وإحالته للتثبت ومراجعة الوثائق المرفقة.',
    cadastralData: {
      titleName: 'الرسم العقاري 32140 منوبة "البركة"',
      location: 'المرناقية، ولاية منوبة',
      region: 'الإدارة الجهوية للملكية العقارية بمنوبة',
      surfaceM2: 5200,
      propertyType: 'قطعة أرض فلاحية مسيجة',
      previousOwner: 'ورثة عمر بن فرج الماجري',
      newOwner: 'سليم بن المنصف الطرابلسي',
      saleAmountTnd: 160000,
      chargesStatus: 'جاري فحص شهادة رفع اليد عن القرض الفلاحي',
      hasOpposition: false
    },
    documents: [
      {
        id: 201,
        type: 'عقد بيع قطعي ومعرف به ومسجل',
        number: 'DOC-2026-101',
        date: '2026-02-15',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: 'في انتظار فحص التوقيعات وصحة صفة الأطراف'
      },
      {
        id: 202,
        type: 'شهادة إبراء ذمة جبائية (خلاص معاليم التسجيل)',
        number: 'DOC-2026-102',
        date: '2026-02-18',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      },
      {
        id: 203,
        type: 'مثال هندسي لديوان قيس الأراضي ومطابقة الحدود',
        number: 'DOC-2026-103',
        date: '2026-02-19',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      }
    ]
  },
  {
    id: 3,
    fileNumber: 'FILE-2026-003',
    lotNumber: 'LOT-103',
    subject: 'تحيين رسم عقاري وتغيير صبغة',
    filingDate: '2026-03-01',
    status: 'UNDER_VERIFICATION',
    source: 'COURT_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'متثبت النظام',
    responsible: 'متثبت النظام',
    notes: 'جاري التثبت من صحة الحكم القضائي والوثائق الهندسية.',
    cadastralData: {
      titleName: 'الرسم العقاري 55812 تونس "النرجس"',
      location: 'المنزه 6، تونس',
      region: 'الإدارة الجهوية للملكية العقارية بتونس',
      surfaceM2: 780,
      propertyType: 'فيلا سكنية وتجارية',
      previousOwner: 'منية بنت البشير القسنطيني',
      newOwner: 'شركة الخدمات العقارية الدولية',
      saleAmountTnd: 620000,
      chargesStatus: 'خالٍ من العقل والرهون',
      hasOpposition: false
    },
    documents: [
      {
        id: 301,
        type: 'حكم قضائي بات في تغيير الصبغة',
        number: 'DOC-2026-201',
        date: '2026-02-28',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        notes: 'الوثيقة مستوفية للشروط القانونية وصيغة التنفيذ'
      },
      {
        id: 302,
        type: 'تقرير خبير عدلي ومثال ديوان قيس الأراضي',
        number: 'DOC-2026-202',
        date: '2026-03-01',
        status: 'PENDING',
        verificationResult: 'PENDING',
        notes: ''
      }
    ]
  },
  {
    id: 4,
    fileNumber: 'FILE-2026-004',
    lotNumber: 'LOT-104',
    subject: 'ترسيم عقد بيع عقار مع التشطيب على رهن بنكي سابق ونقل الملكية',
    filingDate: '2026-03-05',
    status: 'AWAITING_FINAL_VERIFICATION',
    source: 'CITIZEN_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'متثبت أعلى',
    responsible: 'متثبت أعلى',
    notes: 'تقرير المتثبت: تم تدقيق كافة الوثائق والتأكد من خلاص معاليم القباضة ورفع اليد البنكي. الوكالة القنصلية معروضة لمصادقة الحافظ المساعد.',
    cadastralData: {
      titleName: 'الرسم العقاري 48921 تونس "الوفاء"',
      location: 'المنطقة الصناعية الشرقية، تونس',
      region: 'الإدارة الجهوية للملكية العقارية بتونس',
      surfaceM2: 1250,
      propertyType: 'مقسم عقاري مهيأ (قطعة رقم 14)',
      previousOwner: 'شركة النهوض العقاري الساحل (ممثلة بوكيلها القانوني)',
      newOwner: 'السيد محمد بن علي الطرابلسي (ب.ت.و عدد 08492014)',
      saleAmountTnd: 285000,
      chargesStatus: 'تم التشطيب على الرهن البنكي السابق بموجب كتب رفع اليد المرفق',
      hasOpposition: false
    },
    documents: [
      {
        id: 401,
        type: 'عقد بيع نهائي معرف به ومسجل بالقباضة المالية',
        number: 'DOC-2026-301',
        date: '2026-03-02',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: false,
        notes: 'مستوف للشروط القانونية ومطابق لسلسلة التملك بالدفتر العقاري'
      },
      {
        id: 402,
        type: 'شهادة رفع اليد والتشطيب على الرهن البنكي',
        number: 'DOC-2026-302',
        date: '2026-03-03',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: false,
        notes: 'شهادة بنكية مسجلة برفع اليد عن الرهن المقيد سابقا بالرسم'
      },
      {
        id: 403,
        type: 'توكيل قنصلي خاص لنقل الملكية',
        number: 'DOC-2026-303',
        date: '2026-02-26',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: true,
        reservationText: 'توكيل مبرم بالخارج ومعرف به قنصلياً — معروض للتأشير النهائي من طرف الحافظ المساعد',
        notes: 'تمت المعاينة والتحقق من صحة التوكيل وتطابقه مع هوية المشتري'
      },
      {
        id: 404,
        type: 'مثال هندسي لديوان قيس الأراضي والمسح العقاري',
        number: 'DOC-2026-304',
        date: '2026-03-04',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: false,
        notes: 'مطابق لدفتر الرسم والمثال الهندسي رقم 442'
      }
    ]
  },
  {
    id: 5,
    fileNumber: 'FILE-2026-005',
    lotNumber: 'LOT-105',
    subject: 'مطلب ترسيم رهن عقاري لفائدة بنك الإسكان',
    filingDate: '2026-03-10',
    status: 'RETURNED_FOR_CORRECTION',
    source: 'REGISTRY_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'محرر النظام',
    responsible: 'محرر النظام',
    notes: 'تم إرجاع الملف لنقص شهادة خلاص المعاليم الجبائية.',
    cadastralData: {
      titleName: 'الرسم العقاري 18230 زغوان "الفردوس"',
      location: 'الناظور، زغوان',
      region: 'الإدارة الجهوية للملكية العقارية بزغوان',
      surfaceM2: 12000,
      propertyType: 'ضيعة فلاحية',
      previousOwner: 'حبيب بن يوسف الجلاصي',
      newOwner: 'حبيب بن يوسف الجلاصي (الراهن)',
      saleAmountTnd: 75000,
      chargesStatus: 'مطلب تقييد رهن عقاري جديد',
      hasOpposition: false
    },
    documents: [
      {
        id: 501,
        type: 'عقد قرض ورهن عقاري',
        number: 'DOC-2026-401',
        date: '2026-03-08',
        status: 'REJECTED',
        verificationResult: 'REJECTED',
        notes: 'الشهادة الجبائية المرفقة منتهية الصلاحية'
      }
    ]
  },
  {
    id: 6,
    fileNumber: 'FILE-2026-006',
    lotNumber: 'LOT-106',
    subject: 'ترسيم عقد بيع شقة وتطهير السجل العقاري نهائياً',
    filingDate: '2026-02-10',
    status: 'APPROVED',
    source: 'CITIZEN_REQUEST',
    studyResponsible: 'محرر النظام',
    assignedTo: 'متثبت أعلى',
    responsible: 'متثبت أعلى',
    notes: 'تأشيرة الحافظ المساعد للملكية العقارية: تم التدقيق والمصادقة النهائية والترسيم بالسجل العقاري.',
    cadastralData: {
      titleName: 'الرسم العقاري 62194 سوسة "الجوهرة"',
      location: 'خزامة الغربية، سوسة',
      region: 'الإدارة الجهوية للملكية العقارية بسوسة',
      surfaceM2: 165,
      propertyType: 'شقة فاخرة بالطابق الرابع',
      previousOwner: 'السيدة فاتن بنت الهادي المنصوري',
      newOwner: 'السيد كمال بن عبد العزيز السوسي',
      saleAmountTnd: 220000,
      chargesStatus: 'خالٍ من كل رهن أو قيد احتياطي بعد التشطيب',
      hasOpposition: false
    },
    registration: {
      formalityNumber: 'FORM-2026-8806',
      volumeNumber: 'VOL-426',
      folioNumber: '152',
      effectiveDate: '2026-02-25',
      conservatorVisa: 'تأشيرة الحافظ المساعد للملكية العقارية: تم الترسيم بالسجل العقاري وتطهير الرسم واستخراج شهادة الملكية.',
      certificateNumber: 'CERT-ONPF-2026-92410'
    },
    documents: [
      {
        id: 601,
        type: 'عقد بيع نهائي معرف به ومسجل',
        number: 'DOC-2026-501',
        date: '2026-02-08',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: false,
        notes: 'مستوف لجميع الشروط القانونية'
      },
      {
        id: 602,
        type: 'شهادة إبراء ذمة وخلاص جبائي',
        number: 'DOC-2026-502',
        date: '2026-02-09',
        status: 'VERIFIED',
        verificationResult: 'APPROVED',
        hasReservation: false,
        notes: 'خالصة ومطابقة'
      }
    ]
  }
];

const operations = [
  {
    id: 1,
    operationType: 'إنشاء ملف',
    previousStatus: null,
    newStatus: 'NEW',
    notes: 'إنشاء الملف العقاري',
    timestamp: new Date().toISOString(),
    fileId: 1,
    fileNumber: 'FILE-2026-001',
    user: 'محرر النظام',
    role: 'EDITOR'
  },
  {
    id: 2,
    operationType: 'إحالة إلى المتثبت',
    previousStatus: 'UNDER_STUDY',
    newStatus: 'AWAITING_VERIFICATION',
    notes: 'إحالة الملف للتثبت',
    timestamp: new Date().toISOString(),
    fileId: 2,
    fileNumber: 'FILE-2026-002',
    user: 'محرر النظام',
    role: 'EDITOR'
  }
];

function logOp(file, user, type, oldStatus, newStatus, notes) {
  operations.unshift({
    id: operations.length + 1,
    operationType: type,
    previousStatus: oldStatus,
    newStatus: newStatus,
    notes: notes || '',
    timestamp: new Date().toISOString(),
    fileId: file.id,
    fileNumber: file.fileNumber,
    user: user.fullName || user.username,
    role: user.role
  });
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password && u.isActive !== false);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const user = users.find(item => item.username === req.user.username);
  const { currentPassword, newPassword } = req.body;
  if (!user || user.isActive === false) return res.status(403).json({ message: 'الحساب غير نشط.' });
  if (user.password !== currentPassword) return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة.' });
  if (typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ message: 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.' });
  user.password = newPassword;
  res.json({ message: 'تم تغيير كلمة المرور بنجاح.' });
});

// Protected endpoint - Get files
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'SENIOR_VERIFIER') return res.status(403).json({ message: 'صلاحية المتثبت الأعلى مطلوبة.' });
  res.json(users.map(({ password, ...user }) => ({ ...user, isActive: user.isActive !== false })));
});

app.post('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'SENIOR_VERIFIER') return res.status(403).json({ message: 'صلاحية المتثبت الأعلى مطلوبة.' });
  const { username, email, fullName, password, role } = req.body;
  if (![username, email, fullName, password].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'جميع الحقول مطلوبة.' });
  }
  if (password.trim().length < 8) return res.status(400).json({ message: 'كلمة المرور يجب ألا تقل عن 8 أحرف.' });
  if (!['EDITOR', 'VERIFIER', 'SENIOR_VERIFIER'].includes(role)) return res.status(400).json({ message: 'الدور المحدد غير صالح.' });
  if (users.some(user => user.username === username.trim() || user.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ message: 'اسم المستخدم أو البريد الإلكتروني مستخدم مسبقاً.' });
  }

  const user = {
    id: Math.max(...users.map(item => item.id), 0) + 1,
    username: username.trim(),
    password: password.trim(),
    email: email.trim(),
    fullName: fullName.trim(),
    role,
    isActive: true
  };
  users.push(user);
  const { password: ignoredPassword, ...safeUser } = user;
  res.status(201).json(safeUser);
});

app.put('/api/users/:id(\\d+)', authenticateToken, (req, res) => {
  if (req.user.role !== 'SENIOR_VERIFIER') return res.status(403).json({ message: 'صلاحية المتثبت الأعلى مطلوبة.' });
  const user = users.find(item => item.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'المستخدم غير موجود.' });
  const role = req.body.role || user.role;
  const isActive = req.body.isActive === undefined ? user.isActive !== false : Boolean(req.body.isActive);
  if (!['EDITOR', 'VERIFIER', 'SENIOR_VERIFIER'].includes(role)) return res.status(400).json({ message: 'الدور المحدد غير صالح.' });
  if (user.username === req.user.username && (!isActive || role !== 'SENIOR_VERIFIER')) {
    return res.status(409).json({ message: 'لا يمكن تعطيل حسابك أو تغيير دورك الحالي.' });
  }
  const activeSeniors = users.filter(item => item.role === 'SENIOR_VERIFIER' && item.isActive !== false).length;
  if (user.role === 'SENIOR_VERIFIER' && user.isActive !== false && (!isActive || role !== 'SENIOR_VERIFIER') && activeSeniors <= 1) {
    return res.status(409).json({ message: 'يجب الإبقاء على مستخدم نشط واحد على الأقل بدور المتثبت الأعلى.' });
  }
  if (req.body.email && users.some(item => item.id !== user.id && item.email.toLowerCase() === String(req.body.email).trim().toLowerCase())) {
    return res.status(409).json({ message: 'البريد الإلكتروني مستخدم مسبقاً.' });
  }
  if (req.body.email) user.email = String(req.body.email).trim();
  if (req.body.fullName) user.fullName = String(req.body.fullName).trim();
  user.role = role;
  user.isActive = isActive;
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// Protected endpoint - Get files
app.get('/api/files', authenticateToken, (req, res) => {
  const { status, fileNumber, lotNumber, q } = req.query;
  const normalizedQuery = String(q || '').trim().toLocaleLowerCase();
  const page = Math.max(Number(req.query.page || 0), 0);
  const size = Math.min(Math.max(Number(req.query.size || 10), 1), 100);
  const filtered = files.filter(file =>
    (!status || file.status === status) &&
    (!fileNumber || file.fileNumber.includes(fileNumber)) &&
    (!lotNumber || file.lotNumber === lotNumber) &&
    (!normalizedQuery || [file.fileNumber, file.lotNumber, file.subject, file.notes, file.source,
      file.cadastralData?.titleName, file.cadastralData?.region, file.cadastralData?.location]
      .some(value => String(value || '').toLocaleLowerCase().includes(normalizedQuery)))
  );
  const content = filtered.slice(page * size, (page + 1) * size);
  res.json({
    content,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    number: page,
    size
  });
});

app.post('/api/files', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') {
    return res.status(403).json({ message: 'ليس لديك الصلاحيات اللازمة للقيام بهذه العملية.' });
  }

  const { fileNumber, lotNumber, subject, filingDate, source, cadastralData } = req.body;
  if (![fileNumber, lotNumber, subject, filingDate, source].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'جميع الحقول الأساسية إجبارية.' });
  }
  if (files.some(file => file.fileNumber === fileNumber.trim())) {
    return res.status(400).json({ message: 'رقم الملف موجود مسبقاً.' });
  }

  const nowId = files.length ? Math.max(...files.map(item => item.id)) + 1 : 1;

  const defaultCadastral = {
    operationType: cadastralData?.operationType || req.body.operationType || 'OTHER',
    titleName: cadastralData?.titleName || `الرسم العقاري ${lotNumber.replace(/[^0-9]/g, '') || nowId * 1234} تونس`,
    location: cadastralData?.location || 'المنطقة العقارية بتونس',
    region: cadastralData?.region || 'الإدارة الجهوية للملكية العقارية بتونس',
    surfaceM2: Number(cadastralData?.surfaceM2) || 500,
    propertyType: cadastralData?.propertyType || 'عقار مبني / مقسم سكني',
    previousOwner: cadastralData?.previousOwner || 'المالك السابق المقيد بالرسم',
    newOwner: cadastralData?.newOwner || 'المشتري الجديد المكتسب للحق',
    saleAmountTnd: Number(cadastralData?.saleAmountTnd) || 150000,
    chargesStatus: cadastralData?.chargesStatus || 'خالٍ من الرهون والتحملات',
    hasOpposition: false
  };

  const file = {
    id: nowId,
    fileNumber: fileNumber.trim(),
    lotNumber: lotNumber.trim(),
    subject: subject.trim(),
    filingDate,
    source,
    status: 'NEW',
    studyResponsible: req.user.fullName || 'محرر النظام',
    assignedTo: req.user.fullName || 'محرر النظام',
    responsible: req.user.fullName || 'محرر النظام',
    notes: req.body.notes || 'تم فتح الملف وبدء دراسة السندات العقارية.',
    cadastralData: defaultCadastral,
    documents: req.body.documents && req.body.documents.length ? req.body.documents : [
      {
        id: Date.now(),
        type: 'عقد بيع نهائي معرف به ومسجل بالقباضة',
        number: `DOC-${Date.now().toString().slice(-4)}-01`,
        date: filingDate,
        status: 'PENDING',
        verificationResult: 'PENDING',
        hasReservation: false,
        notes: 'في انتظار التدقيق ومطابقة الهويات والتوقيعات'
      },
      {
        id: Date.now() + 1,
        type: 'شهادة إبراء ذمة وخلاص معاليم التسجيل',
        number: `DOC-${Date.now().toString().slice(-4)}-02`,
        date: filingDate,
        status: 'PENDING',
        verificationResult: 'PENDING',
        hasReservation: false,
        notes: ''
      },
      {
        id: Date.now() + 2,
        type: 'مثال هندسي لديوان قيس الأراضي ومطابقة الحدود',
        number: `DOC-${Date.now().toString().slice(-4)}-03`,
        date: filingDate,
        status: 'PENDING',
        verificationResult: 'PENDING',
        hasReservation: false,
        notes: ''
      }
    ]
  };
  files.unshift(file);
  logOp(file, req.user, 'إنشاء ملف', null, 'NEW', file.notes);
  return res.status(201).json(file);
});

app.get('/api/files/:id(\\d+)', authenticateToken, (req, res) => {
  const file = files.find(item => item.id === Number(req.params.id));
  return file ? res.json(file) : res.status(404).json({ message: 'الملف غير موجود.' });
});

app.put('/api/files/:id(\\d+)', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'Seul l’éditeur peut modifier un dossier.' });
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  const old = file.status;
  if (!['NEW', 'UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(old)) return res.status(409).json({ message: 'Dossier hors phase d’étude.' });
  if (req.body.subject) file.subject = req.body.subject;
  if (req.body.lotNumber) file.lotNumber = req.body.lotNumber;
  if (req.body.source) file.source = req.body.source;
  if (req.body.notes !== undefined) file.notes = req.body.notes;

  // Update rich cadastral data if provided
  if (req.body.cadastralData) {
    file.cadastralData = {
      ...file.cadastralData,
      ...req.body.cadastralData
    };
  }

  // Update documents list if provided
  if (req.body.documents) {
    file.documents = req.body.documents;
  }

  if (old === 'NEW' || old === 'RETURNED_FOR_CORRECTION') {
    file.status = 'UNDER_STUDY';
  }

  logOp(file, req.user, 'حفظ وتحديث بيانات الدراسة', old, file.status, file.notes);
  return res.json(file);
});

// Add document to file
app.post('/api/files/:id(\\d+)/documents', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'Seul l’éditeur peut ajouter des documents.' });
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  if (!['NEW', 'UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(file.status)) return res.status(409).json({ message: 'Dossier hors phase d’étude.' });
  const { type, number, date, notes } = req.body;
  const newDoc = {
    id: Date.now(),
    type: type || 'وثيقة ومستند عقاري',
    number: number || `DOC-${Date.now().toString().slice(-4)}`,
    date: date || new Date().toISOString().split('T')[0],
    status: 'PENDING',
    verificationResult: 'PENDING',
    hasReservation: false,
    notes: notes || ''
  };

  file.documents = file.documents || [];
  file.documents.push(newDoc);
  logOp(file, req.user, 'إضافة وثيقة للملف', null, file.status, `إضافة وثيقة: ${newDoc.type} (${newDoc.number})`);
  return res.status(201).json(newDoc);
});

// Delete document from file
app.delete('/api/files/:id(\\d+)/documents/:docId(\\d+)', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'Seul l’éditeur peut supprimer des documents.' });
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  if (!['NEW', 'UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(file.status)) return res.status(409).json({ message: 'Dossier hors phase d’étude.' });
  file.documents = (file.documents || []).filter(d => d.id !== Number(req.params.docId));
  return res.json({ success: true, message: 'تم حذف الوثيقة بنجاح.' });
});

// Assign file to verification
app.post('/api/files/:fileId(\\d+)/documents', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'إضافة الوثائق مخصصة للمحرر.' });
  const file = files.find(item => item.id === Number(req.params.fileId));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });
  if (!['NEW', 'UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(file.status)) {
    return res.status(409).json({ message: 'لا يمكن تعديل الوثائق بعد إحالة الملف.' });
  }
  const { type, number, date, notes } = req.body;
  if (![type, number, date].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'نوع الوثيقة ورقمها وتاريخها حقول إجبارية.' });
  }
  const existingIds = files.flatMap(item => item.documents || []).map(document => Number(document.id) || 0);
  const document = {
    id: Math.max(Date.now(), ...existingIds) + 1,
    type: type.trim(),
    number: number.trim(),
    date,
    status: 'PENDING',
    verificationResult: 'PENDING',
    notes: notes || ''
  };
  file.documents = file.documents || [];
  file.documents.push(document);
  logOp(file, req.user, 'إضافة وثيقة', file.status, file.status, document.type);
  return res.status(201).json(document);
});

app.delete('/api/files/:fileId(\\d+)/documents/:documentId(\\d+)', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'حذف الوثائق مخصص للمحرر.' });
  const file = files.find(item => item.id === Number(req.params.fileId));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });
  if (!['NEW', 'UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(file.status)) {
    return res.status(409).json({ message: 'لا يمكن تعديل الوثائق بعد إحالة الملف.' });
  }
  const index = (file.documents || []).findIndex(document => document.id === Number(req.params.documentId));
  if (index < 0) return res.status(404).json({ message: 'الوثيقة غير موجودة.' });
  const [document] = file.documents.splice(index, 1);
  logOp(file, req.user, 'حذف وثيقة', file.status, file.status, document.type);
  return res.json({ message: 'تم حذف الوثيقة.' });
});

// Assign file to verification
app.post('/api/files/:id(\\d+)/assign-to-verification', authenticateToken, (req, res) => {
  if (req.user.role !== 'EDITOR') return res.status(403).json({ message: 'Seul l’éditeur peut transmettre le dossier.' });
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  const old = file.status;
  if (!['UNDER_STUDY', 'RETURNED_FOR_CORRECTION'].includes(old)) return res.status(409).json({ message: 'Le dossier doit être étudié avant sa transmission.' });
  file.status = 'AWAITING_VERIFICATION';
  file.assignedTo = 'متثبت النظام';
  file.responsible = 'متثبت النظام';
  if (req.body.note) file.notes = req.body.note;

  logOp(file, req.user, 'إحالة إلى المتثبت', old, file.status, file.notes);
  return res.json(file);
});

// Approve file
app.post('/api/files/:id(\\d+)/approve', authenticateToken, (req, res) => {
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  const old = file.status;
  if (req.user.role === 'VERIFIER') {
    if (!['AWAITING_VERIFICATION', 'UNDER_VERIFICATION'].includes(old)) return res.status(403).json({ message: 'Action réservée à la vérification initiale.' });
    file.status = 'AWAITING_FINAL_VERIFICATION';
    file.assignedTo = 'متثبت أعلى';
    file.responsible = 'متثبت أعلى';
    if (req.body.note) file.notes = req.body.note;
    logOp(file, req.user, 'إحالة إلى المتثبت الأعلى', old, file.status, file.notes);
  } else if (req.user.role === 'SENIOR_VERIFIER') {
    if (!['AWAITING_FINAL_VERIFICATION', 'UNDER_FINAL_VERIFICATION'].includes(old)) return res.status(403).json({ message: 'Action réservée à la vérification finale.' });
    file.status = 'APPROVED';
    file.assignedTo = req.user.fullName || 'متثبت أعلى';
    file.responsible = req.user.fullName || 'متثبت أعلى';
    if (req.body.note) file.notes = req.body.note;

    // Generate Official Grand Livre Foncier Registration Data
    const today = new Date().toISOString().split('T')[0];
    const formalityNum = 'FORM-2026-' + (8800 + file.id);
    const volNum = 'VOL-' + (420 + file.id);
    const folioNum = String((file.id * 14) + 68);
    const certNum = 'CERT-ONPF-2026-' + (91000 + (file.id * 235));

    file.registration = {
      formalityNumber: formalityNum,
      volumeNumber: volNum,
      folioNumber: folioNum,
      effectiveDate: today,
      conservatorVisa: req.body.note || 'تأشيرة الحافظ المساعد للملكية العقارية: تم الترسيم بالسجل العقاري وتطهير الرسم',
      certificateNumber: certNum
    };

    logOp(file, req.user, 'المصادقة والترسيم النهائي بالدفتر العقاري', old, file.status, `${file.notes || ''} [رقم التضمين: ${formalityNum}، المجلد: ${volNum}، العدد: ${folioNum}]`);
  } else {
    return res.status(403).json({ message: 'غير مصرح لك بهذه العملية.' });
  }

  return res.json(file);
});

// Return file for correction
app.post('/api/files/:id(\\d+)/return-for-correction', authenticateToken, (req, res) => {
  const file = files.find(item => item.id === Number(req.params.id));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  const old = file.status;
  const canReturn = req.user.role === 'VERIFIER'
    ? ['AWAITING_VERIFICATION', 'UNDER_VERIFICATION'].includes(old)
    : req.user.role === 'SENIOR_VERIFIER' && ['AWAITING_FINAL_VERIFICATION', 'UNDER_FINAL_VERIFICATION'].includes(old);
  if (!canReturn) return res.status(403).json({ message: 'Action interdite pour votre rôle ou cette étape.' });
  file.status = 'RETURNED_FOR_CORRECTION';
  file.assignedTo = file.studyResponsible || 'محرر النظام';
  file.responsible = file.studyResponsible || 'محرر النظام';
  if (req.body.note) file.notes = req.body.note;

  logOp(file, req.user, 'إرجاع للتصحيح', old, file.status, file.notes);
  return res.json(file);
});

// Verify individual document
app.post('/api/files/:fileId(\\d+)/documents/:documentId(\\d+)/verify', authenticateToken, (req, res) => {
  const file = files.find(item => item.id === Number(req.params.fileId));
  if (!file) return res.status(404).json({ message: 'الملف غير موجود.' });

  const doc = (file.documents || []).find(d => d.id === Number(req.params.documentId));
  const canVerify = req.user.role === 'VERIFIER'
    ? ['AWAITING_VERIFICATION', 'UNDER_VERIFICATION'].includes(file.status)
    : req.user.role === 'SENIOR_VERIFIER' && ['AWAITING_FINAL_VERIFICATION', 'UNDER_FINAL_VERIFICATION'].includes(file.status);
  if (!canVerify) return res.status(403).json({ message: 'Vérification interdite pour votre rôle ou cette étape.' });
  if (!doc) return res.status(404).json({ message: 'الوثيقة غير موجودة.' });

  const { result, note } = req.body;
  if (!result || !['APPROVED', 'REJECTED'].includes(result)) {
    return res.status(400).json({ message: 'نتيجة التثبت غير صحيحة (APPROVED أو REJECTED).' });
  }

  doc.verificationResult = result;
  doc.status = result === 'APPROVED' ? 'VERIFIED' : 'REJECTED';
  if (note !== undefined) doc.notes = note;

  // Update file status to in-progress if it was awaiting
  if (file.status === 'AWAITING_VERIFICATION') {
    file.status = 'UNDER_VERIFICATION';
  } else if (file.status === 'AWAITING_FINAL_VERIFICATION') {
    file.status = 'UNDER_FINAL_VERIFICATION';
  }

  logOp(
    file,
    req.user,
    result === 'APPROVED' ? 'قبول وثيقة' : 'رفض وثيقة',
    null,
    doc.status,
    `وثيقة: ${doc.type} (${doc.number}) - ${note || ''}`
  );

  return res.json(doc);
});

// Statistics
app.get('/api/files/statistics', authenticateToken, (req, res) => {
  const count = status => files.filter(file => file.status === status).length;
  res.json({
    totalFiles: files.length,
    newFiles: count('NEW'),
    underStudy: count('UNDER_STUDY'),
    awaitingVerification: count('AWAITING_VERIFICATION'),
    returnedForCorrection: count('RETURNED_FOR_CORRECTION'),
    awaitingFinalVerification: count('AWAITING_FINAL_VERIFICATION'),
    underFinalVerification: count('UNDER_FINAL_VERIFICATION'),
    approved: count('APPROVED'),
    closed: count('CLOSED')
  });
});

// Operations log
app.get('/api/operations', authenticateToken, (req, res) => {
  const page = Math.max(Number(req.query.page || 0), 0);
  const size = Math.min(Math.max(Number(req.query.size || 20), 1), 100);
  res.json({
    content: operations.slice(page * size, (page + 1) * size),
    totalElements: operations.length,
    totalPages: Math.ceil(operations.length / size),
    number: page,
    size
  });
});

app.get('/api/operations/file/:fileId(\\d+)', authenticateToken, (req, res) => {
  const fileOps = operations.filter(o => o.fileId === Number(req.params.fileId));
  res.json({
    content: fileOps,
    totalElements: fileOps.length,
    number: 0,
    size: 20
  });
});

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    const account = users.find(item => item.username === user.username);
    if (!account || account.isActive === false) return res.status(403).json({ message: 'الحساب غير نشط.' });
    req.user = { ...user, role: account.role, fullName: account.fullName };
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ONPF API Mock Server running on http://localhost:${PORT}`);
  console.log(`✅ Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`✅ Test credentials: editor_user / password, verifier_user / password, senior_verifier / password`);
});
