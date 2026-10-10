# Backend API - ONPF Application

## نظام إدارة دراسة الملفات العقارية
Backend for Real Estate Files Management Application

---

## متطلبات التشغيل
### Requirements

- **Java**: JDK 11 or higher
- **Maven**: 3.6 or higher
- **MySQL**: 5.7 or higher
- **Git**: For version control

---

## خطوات التثبيت والتشغيل
### Installation & Execution Steps

### 1. إعداد قاعدة البيانات
**Setup Database**

```bash
mysql -u root -p < ../database/schema.sql
```

أو استخدم أي أداة MySQL أخرى (PhpMyAdmin, etc.)

### 2. بناء المشروع
**Build Project**

```bash
cd backend
mvn clean install
```

### 3. تشغيل التطبيق
**Run Application**

```bash
mvn spring-boot:run
```

التطبيق سيكون متاحًا على: `http://localhost:8080/api`

---

## هيكل المشروع
### Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/tn/gov/onpf/
│   │   │   ├── OnpfApplication.java          # Entry Point
│   │   │   ├── model/                        # Database Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── RealEstateFile.java
│   │   │   │   ├── LegalDocument.java
│   │   │   │   └── Operation.java
│   │   │   ├── dto/                          # Data Transfer Objects
│   │   │   ├── repository/                   # Database Repositories
│   │   │   ├── service/                      # Business Logic
│   │   │   ├── controller/                   # REST Controllers
│   │   │   ├── security/                     # Security & JWT
│   │   │   ├── exception/                    # Custom Exceptions
│   │   │   └── config/                       # Configuration Classes
│   │   └── resources/
│   │       ├── application.yml               # Configuration
│   │       └── application-prod.yml          # Production Config
│   └── test/                                 # Unit Tests
└── pom.xml                                   # Maven Dependencies
```

---

## واجهات برمجية رئيسية
### Main API Endpoints

### Authentication
- `POST /auth/login` - تسجيل الدخول
- `POST /auth/logout` - تسجيل الخروج
- `POST /auth/refresh` - تحديث الرمز

### Files Management
- `GET /files` - الحصول على قائمة الملفات
- `GET /files/{id}` - الحصول على تفاصيل ملف
- `POST /files` - إنشاء ملف جديد
- `PUT /files/{id}` - تحديث ملف
- `POST /files/{id}/assign-to-verification` - إحالة الملف للتثبت
- `POST /files/{id}/approve` - المصادقة على الملف
- `POST /files/{id}/return-for-correction` - إرجاع للتصحيح

### Statistics
- `GET /files/statistics` - الإحصائيات

### Operations Log
- `GET /operations` - سجل العمليات
- `GET /operations/file/{fileId}` - عمليات ملف محدد

---

## بيانات المستخدمين الافتراضية
### Default Users

```
محرر (Editor):
  Username: editor_user
  Password: password
  Role: EDITOR

متثبت (Verifier):
  Username: verifier_user
  Password: password
  Role: VERIFIER

متثبت أعلى (Senior Verifier):
  Username: senior_verifier
  Password: password
  Role: SENIOR_VERIFIER
```

**تغيير كلمات السر بعد أول تسجيل دخول!**

---

## تكوين الإنتاج
### Production Configuration

1. قم بتغيير `app.jwtSecret` في `application-prod.yml`
2. استخدم قاعدة بيانات منفصلة وآمنة
3. قم بتفعيل HTTPS
4. استخدم متغيرات البيئة للحساسات البيانات

---

## استكشاف الأخطاء
### Troubleshooting

**المشكلة: فشل الاتصال بقاعدة البيانات**
- تأكد من تشغيل MySQL
- تحقق من بيانات الاتصال في `application.yml`
- تأكد من أن قاعدة البيانات `onpf_db` موجودة

**المشكلة: خطأ عند تشغيل التطبيق**
- قم بتنظيف المشروع: `mvn clean`
- قم بإعادة بناء: `mvn install`
- تحقق من لوج الأخطاء

---

## التطوير والاختبار
### Development & Testing

```bash
# Run Tests
mvn test

# Generate Code Coverage Report
mvn clean test jacoco:report

# Check Code Quality (with SonarQube)
mvn sonar:sonar
```

---

## توثيق API
### API Documentation

تتم التوثيق باستخدام Swagger/OpenAPI (يمكن إضافته لاحقًا)

---

## الملاحظات الأمنية
### Security Notes

- جميع كلمات المرور مشفرة باستخدام BCrypt
- استخدام JWT لالتحقق من الهوية
- فصل الصلاحيات حسب الأدوار
- تسجيل جميع العمليات في سجل العمليات

---

## المساهمة
### Contributing

يرجى اتباع معايير الترميز المعتمدة:
- اتبع Google Java Style Guide
- اكتب اختبارات الوحدة
- وثق الكود بالتعليقات

---

## الترخيص
### License

جميع الحقوق محفوظة للديوان الوطني للملكية العقارية - تونس

---

## التواصل
### Contact

للأسئلة والدعم: support@onpf.tn
