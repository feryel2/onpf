# تطبيق إدارة دراسة الملفات العقارية - دليل الإعداد
# Application Setup Guide - إدارة دراسة الملفات العقارية

## المتطلبات الأساسية | Prerequisites

### 1. Node.js و npm
- تنزيل من: https://nodejs.org/ (LTS Version)
- التحقق: `node --version` و `npm --version`

### 2. Java Development Kit (JDK)
- إصدار JDK 11 أو أحدث
- التحقق: `java -version`

### 3. Maven
- تنزيل من: https://maven.apache.org/
- التحقق: `mvn -version`

---

## خطوات الإعداد | Setup Steps

### Frontend (Angular)

```bash
cd frontend

# تثبيت الاعتماديات
npm install

# تشغيل خادم التطوير
npm start
```

التطبيق سيكون متاحًا على: `http://localhost:4200`

### Backend (Spring Boot)

```bash
cd backend

# بناء المشروع
mvn clean install

# تشغيل التطبيق
mvn spring-boot:run
```

الخادم سيكون متاحًا على: `http://localhost:8080`

---

## البنية | Project Structure

```
onpf/
├── frontend/                 # تطبيق Angular
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # تطبيق Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── database/                 # نصوص قاعدة البيانات
    └── schema.sql
```

---

## قاعدة البيانات | Database Setup

```bash
# قم بتشغيل MySQL/MariaDB
# ثم قم بتنفيذ:

mysql -u root -p < database/schema.sql
```

---

## ملاحظات مهمة | Important Notes

- التطبيق يدعم الاتجاه RTL (Right-to-Left) بالكامل
- اللغة الأساسية: العربية
- لا تغير التكوينات الأساسية دون التشاور مع الفريق
- جميع المصطلحات مأخوذة من الديوان الوطني للملكية العقارية
