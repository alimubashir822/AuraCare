# AuraCare Platform — Next-Gen AI Patient Intake & Care Navigation

AuraCare is a premium, HIPAA-compliant digital clinic patient intake and care navigation platform built for modern healthcare providers. Instead of acting as a simple symptom chat widget, AuraCare guides patients through a structured, data-driven healthcare journey, converting initial health concerns into clinical records, matched provider appointments, and real-time clinic analytics.

---

## 🏛️ System Features & Scope

The platform serves three primary stakeholder categories: Patients, Doctors, and Clinic Administrators.

### 1. Patients: Intake & Care Path
* **Conversational AI Patient Intake Flow:** A medical-style guided experience that collects chief concern, severity, duration, age group, medical history, active medications, and provider preferences.
* **Emergency Safety Layer:** Real-time text analysis monitors patient responses. Critical symptoms (e.g. chest pain, difficulty breathing, sudden slurred speech) trigger a flashing red emergency alert banner directing the patient to seek ER / 911 care immediately.
* **AI Healthcare Journey Visualization:** A visual 5-step interactive status tracker (`CareJourneyTracker.tsx`) mapping progress from:
  `Understand Symptoms → AI Assessment → Choose Specialist → Book Consultation → Follow-up Care`
* **AI Voice Checker Simulation:** Interactive voice waveform indicator simulating micro-transcription of patient verbal reports.
* **Patient EHR & Document Vault:** Explains complex technical medical records (e.g., blood test profiles) in plain English to resolve patient jargon confusion.

### 2. Doctors: Workspace & Clinical Intake
* **AI Patient Summary Report:** Automatically formats structured clinical summaries (concern, duration, severity, medications, and questions prepared for the doctor) available to providers before the call.
* **Clinical Appointment Management:** Unified calendar interface detailing upcoming consultations, patient intake summaries, and notes editing.

### 3. Clinic Admins: Management & Flow Analytics
* **Real-time Patient Conversion Board:** Rich visual charts (powered by Recharts) monitoring intake-to-booking conversions, department distributions, and patient lead logs.
* **Specialist Management:** Unified calendar system showing clinician schedules and occupancy rates.
* **HIPAA Compliance Audit Logs:** Real-time dashboard log detailing data access logs (e.g. `VIEWED_PATIENT_RECORD`, `AI_COPILOT_COMPILATION`) tracking actor, role, action, and timestamp.

---

## 🛠️ Technical Stack

* **Framework:** Next.js 15 (App Router with dynamic routing)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4.0
* **Database:** SQLite (via LibSQL client driver)
* **ORM:** Prisma ORM
* **Charts/Icons:** Recharts, Lucide React

---

## 📂 Project Structure

```text
c:\Users\Mubashir Ali\Desktop\SymptomChecker\
├── prisma/
│   ├── schema.prisma      # Relational Database Schema
│   └── seed.js            # Mock Database Hydration Script
├── public/
│   └── favicon.ico        # Custom Project Favicon
├── src/
│   ├── app/
│   │   ├── (public)       # Public Pages (Home, How It Works, Resources, Contact)
│   │   ├── api/           # Auth, Appointments, Assessments API Handlers
│   │   ├── clinic/        # Clinic Admin Dashboard (/clinic/dashboard)
│   │   ├── doctor/        # Clinician Panel (/doctor/dashboard)
│   │   ├── patient/       # Patient Portal (/patient/dashboard)
│   │   ├── assessment/    # AI Symptom Assessment Interactive Engine
│   │   ├── layout.tsx     # Shell navigation layout
│   │   └── globals.css    # Typography, CSS variables, & micro-animations
│   ├── components/        # Reusable dashboard clients, charts, and journey trackers
│   ├── lib/
│   │   └── db.ts          # Absolute path SQLite connection initializer
│   └── middleware.ts      # Role-based route-protection sessions filter
└── package.json
```

---

## 🚀 Getting Started & Local Setup

### 1. Install Dependencies
Initialize npm packages:
```bash
npm install
```

### 2. Database Layout Synchronization
Map out SQLite schemas and generate the Prisma Client:
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database Mock Data
Hydrate the database with clinics, medical departments, doctor slots, and analytics:
```bash
node prisma/seed.js
```

### 4. Start Development Server
Launch the compiler and dev server:
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser. *(Note: Port 3001 is used if port 3000 is occupied).*

---

## 🔐 Session Switcher (Testing & Debugging)

To easily test the platform's multi-role capability, a Developer Quick Login page is configured at `/login` with pre-built credentials:
* **Patient Portal:** Quick login as a patient to test the intake form, AI summaries, document explainers, and timelines.
* **Doctor Workspace:** Access clinical notes and intakes.
* **Clinic Admin Command Center:** View booking conversions, department metrics, and HIPAA audit trails.
