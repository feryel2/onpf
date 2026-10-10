# ONPF Developer Quick Reference Guide
# دليل المرجع السريع للمطورين

---

## 🚀 Getting Started in 5 Minutes

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
**Runs on**: http://localhost:8080/api

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
**Runs on**: http://localhost:4200

### 4. Login Credentials
```
Username: editor_user
Password: password
Role: محرر (Editor)
```

---

## 📁 Key Files & Directories

### Frontend
- `frontend/src/app/app.module.ts` - Main module
- `frontend/src/app/app-routing.module.ts` - Routes
- `frontend/src/app/services/auth.service.ts` - Authentication
- `frontend/src/app/services/file.service.ts` - File operations
- `frontend/src/styles.scss` - Global RTL styles
- `frontend/src/environments/` - Config files

### Backend
- `backend/src/main/java/tn/gov/onpf/OnpfApplication.java` - Entry point
- `backend/src/main/java/tn/gov/onpf/model/` - Database entities
- `backend/src/main/java/tn/gov/onpf/repository/` - Data access
- `backend/src/main/resources/application.yml` - Configuration
- `database/schema.sql` - Database structure

---

## 🏗️ Project Structure

```
Frontend Pages:
├── Login (Authentication)
├── Dashboard (Statistics & Overview)
├── Files (List, View, Create)
├── Study (File Study Workflow)
├── Verification (Review & Verify)
├── Final Verification (Senior Review)
├── Operations Log (Audit Trail)
├── Search (Advanced Search)
├── Users (User Management)
└── Settings (Configuration)

Backend Layers:
├── Controller (REST Endpoints)
├── Service (Business Logic)
├── Repository (Data Access)
├── Model (JPA Entities)
├── DTO (Data Transfer)
├── Security (JWT & Auth)
└── Config (Spring Configuration)
```

---

## 🔑 Important Concepts

### User Roles
- **محرر (EDITOR)**: Studies files, creates documents
- **متثبت (VERIFIER)**: Verifies documents, approves/rejects
- **متثبت_أعلى (SENIOR_VERIFIER)**: Final verification, user management

### File Statuses (9 Total)
1. جديد (NEW)
2. قيد الدراسة (UNDER_STUDY)
3. في انتظار التثبت (AWAITING_VERIFICATION)
4. قيد التثبت (UNDER_VERIFICATION)
5. مرجع للتصحيح (RETURNED_FOR_CORRECTION)
6. في انتظار التثبت النهائي (AWAITING_FINAL_VERIFICATION)
7. قيد التثبت النهائي (UNDER_FINAL_VERIFICATION)
8. مصادق عليه (APPROVED)
9. مغلق (CLOSED)

### RTL Implementation
- HTML: `<html lang="ar" dir="rtl">`
- CSS: `direction: rtl;` on parent containers
- Responsive grid layout with proper alignment

---

## 🔌 API Endpoints (To be implemented)

### Authentication
```
POST   /auth/login
POST   /auth/logout
GET    /auth/profile
```

### Files
```
GET    /files                      - List (with pagination)
GET    /files/:id                  - Get details
GET    /files/statistics           - Get statistics
POST   /files                      - Create
PUT    /files/:id                  - Update
POST   /files/:id/assign-to-verification
POST   /files/:id/approve
POST   /files/:id/return-for-correction
```

### Documents
```
GET    /files/:id/documents
POST   /files/:id/documents/:docId/verify
```

### Operations Log
```
GET    /operations
GET    /operations/file/:id
GET    /operations/user/:userId
```

---

## 🛠️ Common Development Tasks

### Add a New Page
1. Generate component: `ng generate component pages/new-page`
2. Add route in `app-routing.module.ts`
3. Add sidebar menu item in `sidebar.component.html`
4. Create service if needed
5. Implement component logic

### Add a Backend Endpoint
1. Create method in existing/new Service class
2. Add route method in corresponding Controller
3. Add repository query if needed
4. Test with Postman

### Connect Frontend to Backend
1. Update service method URL: `'http://localhost:8080/api/...'`
2. Ensure backend endpoint exists
3. Test with actual data
4. Add error handling

### Style a Component
1. Use RTL-friendly CSS
2. Test on both LTR and RTL
3. Use utility classes from `styles.scss`
4. Maintain responsive design

---

## 🐛 Debugging Tips

### Frontend
- Use Chrome DevTools Network tab to inspect API calls
- Check `localStorage` for JWT token
- Browser console for errors
- Use Angular Augury extension

### Backend
- Check `application.yml` configuration
- Review logs: `tail -f application.log`
- Use Postman to test endpoints
- Database query: `SELECT * FROM real_estate_files;`

---

## 📦 Dependencies

### Frontend
```
Angular 16, Bootstrap 5, Bootstrap Icons, RxJS
```

### Backend
```
Spring Boot 2.7, Spring Security, Spring Data JPA, JWT, MySQL Connector
```

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Check CORS configuration in `OnpfApplication.java`

### Issue: Database Connection Failed
**Solution**: Verify MySQL is running and credentials in `application.yml`

### Issue: JWT Token Expired
**Solution**: Login again - token expires in 24 hours

### Issue: RTL Text Not Working
**Solution**: Ensure `lang="ar"` and `dir="rtl"` in HTML

---

## 📊 Database Tables

### users
- id, username, password, email, full_name, role, is_active, created_at, updated_at

### real_estate_files
- id, file_number, lot_number, subject, filing_date, status, source, study_responsible_id, assigned_to_id, notes

### legal_documents
- id, file_id, document_type, document_number, document_date, status, notes, verification_result

### operations
- id, file_id, user_id, operation_type, previous_status, new_status, notes, timestamp

---

## 🧪 Testing Workflow

```bash
# Backend Unit Tests
mvn test

# Backend Integration Tests
mvn test -Dtest=*IntegrationTest

# Frontend Unit Tests
npm test

# Frontend E2E Tests
npm run e2e
```

---

## 📝 Code Style Guidelines

### Backend
- Package: `tn.gov.onpf.<module>`
- Class names: PascalCase
- Method names: camelCase
- Constants: UPPER_SNAKE_CASE
- Comments in English or Arabic

### Frontend
- Component selectors: `app-<component-name>`
- Service names: `<domain>.service.ts`
- Use strong typing with interfaces
- Comments in English or Arabic
- RTL-first CSS (direction: rtl)

---

## 🎯 Naming Conventions (Important)

### Arabic Terms Used
- الملف = File
- الوثيقة = Document
- الدراسة = Study
- التثبت = Verification
- المستخدم = User
- الدور = Role
- الحالة = Status
- العملية = Operation

### English Class Names (Backend)
- User, RealEstateFile, LegalDocument, Operation
- UserService, FileService, DocumentService
- UserController, FileController

### English Component Names (Frontend)
- DashboardComponent, FilesComponent, VerificationComponent
- AuthService, FileService
- AuthGuard, AuthInterceptor

---

## 🔐 Security Best Practices

1. ✅ Change default passwords immediately
2. ✅ Use HTTPS in production
3. ✅ Store JWT secret securely
4. ✅ Implement rate limiting
5. ✅ Validate all inputs
6. ✅ Use parameterized queries
7. ✅ Log all important operations
8. ✅ Review audit trail regularly

---

## 📞 Need Help?

- Frontend Issues: Check `frontend/README.md`
- Backend Issues: Check `backend/README.md`
- Setup Issues: Check `SETUP.md`
- General: Check main `README.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-08-30  
**Language**: Arabic (العربية) & English
