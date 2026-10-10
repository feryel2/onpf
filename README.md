# ONPF - تطبيق إدارة دراسة الملفات العقارية
# ONPF - Real Estate Files Study Management System

## الوصف
**Description**

تطبيق ويب إداري مهني خاص بإدارة دراسة الملفات العقارية والوثائق القانونية داخل الديوان الوطني للملكية العقارية في تونس.

A professional administrative web application for managing the study of real estate files and legal documents within Tunisia's National Real Estate Ownership Bureau.

---

## المميزات الرئيسية
**Key Features**

- 🌍 **RTL Interface** - واجهة كاملة من اليمين إلى اليسار (Arabic Support)
- 📊 **Dashboard** - لوحة قيادة مع إحصائيات شاملة
- 📁 **File Management** - إدارة الملفات العقارية والوثائق
- 👥 **Role-Based Access** - تحكم دقيق بالصلاحيات (محرر، متثبت، متثبت أعلى)
- ✍️ **Study Workflow** - سير العمل الدراسي والتثبت
- 🔍 **Advanced Search** - بحث متقدم عن الملفات
- 📋 **Operations Log** - تتبع شامل لجميع العمليات
- 🔐 **Security** - JWT authentication + Role-based security

---

## المتطلبات النظامية
**System Requirements**

### Frontend Requirements
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Angular**: 16.x

### Backend Requirements
- **Java**: JDK 11 or higher
- **Maven**: 3.6 or higher
- **MySQL**: 5.7 or higher

### General Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: 2GB minimum for development
- **Disk Space**: 1GB for development environment

---

## التثبيت السريع
**Quick Start**

### 1. استنساخ المستودع
**Clone Repository**

```bash
cd c:\xampp\htdocs
git clone <repository-url> onpf
cd onpf
```

### 2. إعداد قاعدة البيانات
**Database Setup**

```bash
# Open MySQL Command Line or PhpMyAdmin
mysql -u root -p < database/schema.sql

# Or using MySQL Workbench:
# File > Open SQL Script > database/schema.sql > Execute
```

### 3. تشغيل Backend
**Start Backend**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend سيكون متاحًا على: `http://localhost:8080/api`

### 4. تشغيل Frontend
**Start Frontend**

```bash
cd frontend
npm install
npm start
```

Frontend سيكون متاحًا على: `http://localhost:4200`

### 5. تسجيل الدخول
**Login**

استخدم أحد المستخدمات التالية:
- Username: `editor_user` | Password: `password` | Role: محرر
- Username: `verifier_user` | Password: `password` | Role: متثبت
- Username: `senior_verifier` | Password: `password` | Role: متثبت أعلى

---

## الهيكل المشروعي
**Project Structure**

```
onpf/
├── frontend/              # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # Layout components
│   │   │   ├── pages/             # Page components
│   │   │   ├── services/          # Services (auth, file, etc)
│   │   │   ├── guards/            # Route guards
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   └── app-routing.module.ts
│   │   ├── environments/          # Configuration
│   │   └── styles.scss            # Global styles
│   ├── package.json
│   └── angular.json
│
├── backend/               # Spring Boot Application
│   ├── src/
│   │   ├── main/java/tn/gov/onpf/
│   │   │   ├── model/        # JPA Entities
│   │   │   ├── dto/          # Data Transfer Objects
│   │   │   ├── repository/   # Data Access Layer
│   │   │   ├── service/      # Business Logic
│   │   │   ├── controller/   # REST Controllers
│   │   │   ├── security/     # Security & JWT
│   │   │   └── config/       # Configuration
│   │   └── resources/
│   │       └── application.yml
│   ├── pom.xml
│   └── README.md
│
├── database/
│   └── schema.sql         # Database Schema
│
├── SETUP.md              # Setup Guide
├── README.md             # This file
└── .gitignore
```

---

## الصفحات والميزات
**Pages & Features**

### 🏠 لوحة القيادة (Dashboard)
- إحصائيات شاملة لحالة الملفات
- معلومات في الوقت الفعلي

### 📁 إدارة الملفات (Files Management)
- عرض جميع الملفات العقارية
- البحث والتصفية والترتيب
- عرض تفاصيل الملف
- إنشاء ملفات جديدة

### ✍️ الدراسة (Study)
- دراسة الملف (للمحرر)
- إدخال البيانات والوثائق
- إحالة للتثبت

### ✅ التثبت (Verification)
- التحقق من الدراسة (للمتثبت)
- التحقق من الوثائق
- الموافقة أو الإرجاع

### 🔬 التثبت النهائي (Final Verification)
- المراجعة النهائية (للمتثبت الأعلى)
- الموافقة النهائية
- إغلاق الملف

### 📋 سجل العمليات (Operations Log)
- تتبع جميع العمليات على الملفات
- معلومات المستخدم والتاريخ والعملية

### 🔍 البحث (Search)
- بحث متقدم عن الملفات
- فلترة حسب معايير مختلفة

### 👥 المستخدمون والصلاحيات (Users)
- إدارة المستخدمين (للمتثبت الأعلى)
- تعيين الأدوار والصلاحيات

---

## أدوار المستخدمين
**User Roles**

### محرر (EDITOR)
- إنشاء وتعديل الملفات
- دراسة الملف
- إحالة الملف للتثبت
- عرض السجل

### متثبت (VERIFIER)
- عرض الملفات المحالة
- التحقق من الوثائق
- الموافقة أو الإرجاع للتصحيح
- تسجيل الملاحظات

### متثبت أعلى (SENIOR_VERIFIER)
- جميع صلاحيات المتثبت
- التثبت النهائي
- إدارة المستخدمين
- الإعدادات العامة

---

## واجهات برمجية رئيسية
**Main API Endpoints**

### Authentication
```
POST   /auth/login           - تسجيل الدخول
POST   /auth/logout          - تسجيل الخروج
GET    /auth/profile         - الملف الشخصي
```

### Files
```
GET    /files                - قائمة الملفات
GET    /files/:id            - تفاصيل الملف
POST   /files                - إنشاء ملف
PUT    /files/:id            - تحديث الملف
DELETE /files/:id            - حذف الملف
```

### Verification
```
POST   /files/:id/assign-to-verification      - إحالة للتثبت
POST   /files/:id/approve                      - موافقة
POST   /files/:id/return-for-correction        - إرجاع للتصحيح
POST   /files/:id/final-approve                - موافقة نهائية
```

### Statistics
```
GET    /files/statistics     - إحصائيات
```

### Operations
```
GET    /operations           - سجل العمليات
GET    /operations/file/:id  - عمليات ملف محدد
```

---

## التكوين
**Configuration**

### Frontend Configuration
ملف التكوين: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Backend Configuration
ملف التكوين: `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/onpf_db
    username: root
    password: ""
  
  jpa:
    hibernate:
      ddl-auto: validate
```

---

## التطوير
**Development**

### Build Frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/onpf-admin
```

### Build Backend
```bash
cd backend
mvn clean install
# Output: backend/target/onpf-backend-1.0.0.jar
```

### Run Tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
mvn test
```

---

## الإنتاج
**Production**

### Frontend
```bash
cd frontend
npm run build --configuration production
# Deploy dist/ folder to web server
```

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/onpf-backend-1.0.0.jar
```

---

## استكشاف الأخطاء
**Troubleshooting**

### المشكلة: عدم الاتصال بقاعدة البيانات
- تأكد من تشغيل MySQL
- تحقق من بيانات الاتصال
- تأكد من وجود قاعدة البيانات `onpf_db`

### المشكلة: خطأ CORS
- قم بتحديث CORS configuration في Backend
- تأكد من تطابق URLs

### المشكلة: JWT Token Expired
- تحقق من إعدادات `app.jwtExpirationMs`
- قم بتسجيل دخول مجددًا

---

## المساهمة
**Contributing**

1. اتبع معايير الترميز
2. اكتب اختبارات الوحدة
3. وثق الكود بالتعليقات
4. قم بإنشاء Pull Request

---

## الترخيص
**License**

جميع الحقوق محفوظة للديوان الوطني للملكية العقارية - تونس

---

## التواصل والدعم
**Contact & Support**

البريد الإلكتروني: support@onpf.tn
الموقع الإلكتروني: www.onpf.tn

---

## ملاحظات إضافية
**Additional Notes**

- تطبيق متوافق مع المتصفحات الحديثة (Chrome, Firefox, Safari, Edge)
- يدعم جميع أجهزة الحاسوب والأجهزة اللوحية
- واجهة سهلة الاستخدام للموظفين
- نظام أمن متقدم مع تسجيل جميع العمليات

---

**آخر تحديث: 30/08/2026**
**Last Updated: 2026-08-30**

لأي استفسارات تواصل مع فريق الدعم الفني
For any inquiries, contact the technical support team
