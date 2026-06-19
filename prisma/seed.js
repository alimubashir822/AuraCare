const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const path = require("path");

const dbPath = path.resolve(__dirname, "../dev.db");
const connectionUrl = process.env.DATABASE_URL || `file:${dbPath}`;

const adapter = new PrismaLibSql({
  url: connectionUrl,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.aIResponse.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.medicalDepartment.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.clinic.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Existing data cleared.");

  // 1. Create Clinics
  const clinic1 = await prisma.clinic.create({
    data: {
      name: "Metro Care Center",
      address: "123 Healthcare Ave, Suite 400, Metro City",
      phone: "555-0199",
      email: "info@metrocare.com",
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: "Green Valley Family Clinic",
      address: "456 Valley View Rd, Green Valley",
      phone: "555-0244",
      email: "contact@greenvalleyclinic.com",
    },
  });

  console.log("Clinics created.");

  // 2. Create Medical Departments
  const depts = [
    {
      name: "Orthopedics",
      description: "Care and surgical treatment of bones, joints, ligaments, tendons, and muscles.",
      icon: "Activity",
      slug: "orthopedics",
    },
    {
      name: "Cardiology",
      description: "Diagnostics, treatment, and prevention of heart and vascular conditions.",
      icon: "Heart",
      slug: "cardiology",
    },
    {
      name: "Dermatology",
      description: "Comprehensive medical and cosmetic skin, hair, and nail healthcare services.",
      icon: "Smile",
      slug: "dermatology",
    },
    {
      name: "Pediatrics",
      description: "General medical checkups and specialist treatments for infants, children, and teens.",
      icon: "Baby",
      slug: "pediatrics",
    },
    {
      name: "Neurology",
      description: "Care for disorders of the brain, spinal cord, nerves, and neurological systems.",
      icon: "Brain",
      slug: "neurology",
    },
    {
      name: "ENT Specialist",
      description: "Diagnostics and surgical therapies for ear, nose, throat, head, and neck concerns.",
      icon: "Speech",
      slug: "ent",
    },
    {
      name: "General Medicine",
      description: "Primary physician visits, annual checkups, vaccinations, and preventive counseling.",
      icon: "ShieldAlert",
      slug: "general-medicine",
    },
  ];

  const deptMap = {};
  for (const d of depts) {
    const createdDept = await prisma.medicalDepartment.create({
      data: d,
    });
    deptMap[d.slug] = createdDept.id;
  }

  console.log("Departments created.");

  // 3. Create Users
  // Standard simulated passwords for local dev
  const passwordHash = "demo_hash_password_123";

  // Patient User
  const userPatient = await prisma.user.create({
    data: {
      email: "patient@demo.com",
      passwordHash,
      name: "John Doe",
      role: "PATIENT",
    },
  });

  const patient = await prisma.patient.create({
    data: {
      userId: userPatient.id,
      dateOfBirth: "1990-05-15",
      gender: "Male",
      phone: "555-0101",
      insuranceProvider: "Blue Shield Mutual",
      insuranceMemberId: "BS99214A-01",
      allergies: "Penicillin",
      conditions: "Mild seasonal asthma",
    },
  });

  // Doctor 1 User (Orthopedics)
  const userDoctor1 = await prisma.user.create({
    data: {
      email: "doctor@demo.com",
      passwordHash,
      name: "Dr. Ahmed Bilal",
      role: "DOCTOR",
    },
  });

  const doctor1 = await prisma.doctor.create({
    data: {
      userId: userDoctor1.id,
      specialty: "Orthopedics",
      experience: 12,
      languages: "English, Spanish, Arabic",
      bio: "Board-certified Orthopedic Specialist focusing on joint replacements, sports injuries, and advanced reconstructive surgeries.",
      consultationFee: 75.00,
      hospital: "Metro General Hospital",
      insuranceAccepted: "Blue Shield, UnitedHealth, Aetna",
      clinicId: clinic1.id,
    },
  });

  // Doctor 2 User (Dermatology)
  const userDoctor2 = await prisma.user.create({
    data: {
      email: "doctor2@demo.com",
      passwordHash,
      name: "Dr. Sarah Jenkins",
      role: "DOCTOR",
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      userId: userDoctor2.id,
      specialty: "Dermatology",
      experience: 8,
      languages: "English, Spanish",
      bio: "Dedicated dermatologist specialized in clinical diagnosis of skin conditions, acne management, and preventive skin screening.",
      consultationFee: 65.00,
      hospital: "Green Valley Medical Center",
      insuranceAccepted: "Blue Shield, Cigna, Humana",
      clinicId: clinic2.id,
    },
  });

  // Doctor 3 User (Cardiology)
  const userDoctor3 = await prisma.user.create({
    data: {
      email: "doctor3@demo.com",
      passwordHash,
      name: "Dr. Michael Chen",
      role: "DOCTOR",
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      userId: userDoctor3.id,
      specialty: "Cardiology",
      experience: 16,
      languages: "English, Mandarin",
      bio: "Interventional Cardiologist focused on cardiovascular health, hypertension management, and preventive heart care strategies.",
      consultationFee: 120.00,
      hospital: "Metro General Hospital",
      insuranceAccepted: "All Major Insurances Accepted",
      clinicId: clinic1.id,
    },
  });

  // Clinic Admin User
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      passwordHash,
      name: "Metro Clinic Admin",
      role: "CLINIC_ADMIN",
    },
  });

  console.log("Users and Profiles created.");

  // 4. Create Assessments
  // Assessment 1: Sore throat + fever (ENT)
  const assess1 = await prisma.assessment.create({
    data: {
      patientId: patient.id,
      concern: "Sore throat and fever",
      symptoms: JSON.stringify(["Sore throat", "Fever", "Difficulty swallowing"]),
      ageGroup: "26-45",
      severity: "MEDIUM",
      duration: "3 days",
      recommendedDeptId: deptMap["ent"],
      recommendedAction: "Consultation",
      summary: `### Health Guidance Summary
Your symptoms of a sore throat combined with a fever suggest a localized inflammatory or infectious response, possibly pharyngitis or tonsillitis.

**Possible areas to discuss:**
- ENT (Ear, Nose, Throat) Specialist
- General Medicine

**Recommended Next Step:**
- Schedule a standard virtual or in-person consultation with a provider to examine your throat and discuss treatment options.
`,
    },
  });

  // Assessment 2: Severe chest pain (Emergency)
  const assess2 = await prisma.assessment.create({
    data: {
      patientId: patient.id,
      concern: "Severe pressure and pain in my chest, radiating down my left arm",
      symptoms: JSON.stringify(["Chest pain", "Shortness of breath", "Arm pain"]),
      ageGroup: "26-45",
      severity: "CRITICAL",
      duration: "30 minutes",
      recommendedDeptId: deptMap["cardiology"],
      recommendedAction: "Emergency",
      summary: `### Emergency Safety Warning
**SEEK IMMEDIATE EMERGENCY CARE.**
Your symptoms are highly suspicious of a serious acute condition, such as a cardiovascular event.

**Immediate actions:**
- Call 911 or visit the nearest Emergency Room immediately.
- Do not drive yourself; call for an ambulance.
`,
    },
  });

  // Assessment 3: Knee pain (Orthopedics) - Guest (no patientId)
  const assess3 = await prisma.assessment.create({
    data: {
      concern: "Knee swollen and painful after running",
      symptoms: JSON.stringify(["Knee pain", "Joint swelling", "Stiffness"]),
      ageGroup: "18-25",
      severity: "LOW",
      duration: "1 day",
      recommendedDeptId: deptMap["orthopedics"],
      recommendedAction: "Consultation",
      summary: `### Health Guidance Summary
Your symptoms indicate a probable soft-tissue strain or joint inflammation resulting from running impact.

**Possible areas to discuss:**
- Orthopedic Specialist
- Physiotherapist

**Recommended Next Step:**
- Implement the R.I.C.E protocol (Rest, Ice, Compression, Elevation).
- Schedule a consultation if the swelling persists for more than 5 days.
`,
    },
  });

  console.log("Symptom assessments created.");

  // 5. Create Appointments
  // Upcoming Appointment (with Dr. Ahmed Bilal)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor1.id,
      dateTime: tomorrow,
      status: "CONFIRMED",
      type: "VIDEO",
      reason: "Assess knee pain and swelling post running exercise.",
      summaryBrief: `### Patient Consultation Brief
- **Concern:** Knee pain & swelling after running.
- **Duration:** 1-2 days.
- **Symptoms:** Knee swelling, stiffness, mild pain.
- **Goal:** Discuss diagnosis, imaging, and need for physical therapy.`,
    },
  });

  // Completed Appointment (with Dr. Sarah Jenkins)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(14, 30, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor2.id,
      dateTime: lastWeek,
      status: "COMPLETED",
      type: "IN_PERSON",
      reason: "Skin checkup for rash on left forearm.",
      notes: "Contact dermatitis diagnosed. Prescribed hydrocortisone cream 1% to apply twice daily for 7 days. Advised avoiding scented soaps.",
      summaryBrief: `### Patient Consultation Brief
- **Concern:** Itchy red rash on forearm.
- **Duration:** 5 days.
- **Symptoms:** Itching, redness, dry skin.`,
    },
  });

  console.log("Appointments created.");

  // 6. Create Documents
  await prisma.document.create({
    data: {
      patientId: patient.id,
      title: "Chest X-Ray Report",
      category: "REPORT",
      aiExplanation: "This chest X-ray report shows normal heart size and clear lungs. No signs of infection, fluid, or structural issues are present. In plain terms, your lungs and chest structure look healthy and clear.",
    },
  });

  // 7. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: userPatient.id,
      userEmail: userPatient.email,
      userRole: "PATIENT",
      action: "Symptom Assessment Completed",
      details: `Patient completed assessment for 'Sore throat and fever'. Severity: MEDIUM. Recommended department: ENT.`,
    },
  });

  console.log("Audit log entry created.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
