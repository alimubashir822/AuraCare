import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { 
  HeartPulse, 
  Activity, 
  Calendar, 
  FileText, 
  User, 
  Clock, 
  ChevronRight, 
  Video, 
  Users, 
  MapPin,
  ClipboardList,
  Sparkles
} from "lucide-react";
import PatientDashboardClient from "@/components/PatientDashboardClient";

export const revalidate = 0; // Live dashboard reloading

export default async function PatientDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session")?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/patient/dashboard");
  }

  let sessionUser;
  try {
    sessionUser = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
  } catch (e) {
    redirect("/login");
  }

  if (sessionUser.role !== "PATIENT" || !sessionUser.profileId) {
    redirect("/login");
  }

  // 1. Fetch Patient, User, Appointments, Assessments, and Documents
  const patient = await db.patient.findUnique({
    where: { id: sessionUser.profileId },
    include: {
      user: true,
      appointments: {
        include: {
          doctor: {
            include: { user: true, clinic: true },
          },
        },
        orderBy: { dateTime: "asc" },
      },
      assessments: {
        include: { recommendedDept: true },
        orderBy: { createdAt: "desc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) {
    redirect("/login");
  }

  // 2. Format Health Timeline Events (Chronological order)
  const timelineEvents: {
    date: string;
    title: string;
    description: string;
    type: "assessment" | "appointment" | "document" | "system";
  }[] = [];

  // Add Assessments to timeline
  patient.assessments.forEach((ass) => {
    const formattedDate = new Date(ass.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    timelineEvents.push({
      date: formattedDate,
      title: "Symptom Assessment",
      description: `Concern: "${ass.concern}" - Recommended: ${ass.recommendedDept?.name || "General Medicine"}`,
      type: "assessment",
    });
  });

  // Add Appointments to timeline
  patient.appointments.forEach((app) => {
    const formattedDate = new Date(app.dateTime).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    timelineEvents.push({
      date: formattedDate,
      title: app.status === "COMPLETED" ? "Doctor Consultation Completed" : "Consultation Booked",
      description: `With ${app.doctor.user.name} (${app.doctor.specialty}) - ${app.type === "VIDEO" ? "Video Call" : "In-Person"}`,
      type: "appointment",
    });
  });

  // Add Documents to timeline
  patient.documents.forEach((doc) => {
    const formattedDate = new Date(doc.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    timelineEvents.push({
      date: formattedDate,
      title: "Health Report Analyzed",
      description: `Report: "${doc.title}" - AI Explanation saved`,
      type: "document",
    });
  });

  // Sort timeline events: newest first
  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Serialize data to avoid Next.js payload issues
  const serializedPatient = {
    id: patient.id,
    name: patient.user.name,
    email: patient.user.email,
    dateOfBirth: patient.dateOfBirth || "N/A",
    gender: patient.gender || "N/A",
    phone: patient.phone || "N/A",
    insurance: patient.insuranceProvider || "None Specified",
    insuranceMemberId: patient.insuranceMemberId || "",
    allergies: patient.allergies || "None declared",
    conditions: patient.conditions || "None declared",
  };

  const serializedAppointments = patient.appointments.map((app) => ({
    id: app.id,
    dateTime: app.dateTime.toISOString(),
    status: app.status,
    type: app.type,
    reason: app.reason || "",
    notes: app.notes || "",
    summaryBrief: app.summaryBrief || "",
    doctorName: app.doctor.user.name,
    doctorSpecialty: app.doctor.specialty,
    clinicName: app.doctor.clinic?.name || "Independent Clinic",
    clinicAddress: app.doctor.clinic?.address || "",
  }));

  const serializedAssessments = patient.assessments.map((ass) => ({
    id: ass.id,
    concern: ass.concern,
    symptoms: ass.symptoms,
    severity: ass.severity || "LOW",
    duration: ass.duration || "",
    summary: ass.summary || "",
    recommendedDept: ass.recommendedDept?.name || "General Medicine",
    recommendedAction: ass.recommendedAction || "Consultation",
    createdAt: ass.createdAt.toISOString(),
  }));

  const serializedDocuments = patient.documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    aiExplanation: doc.aiExplanation || "",
    createdAt: doc.createdAt.toISOString(),
  }));

  return (
    <div className="py-8 bg-muted/15 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl font-display">
              {serializedPatient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground leading-tight">
                {serializedPatient.name}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Patient Account • ID: {serializedPatient.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <Link
            href="/assessment"
            className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-5 py-3 rounded-full transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>New AI Symptom Checker</span>
          </Link>
        </div>

        {/* Dashboard Grid Hydrator */}
        <PatientDashboardClient 
          patient={serializedPatient}
          appointments={serializedAppointments}
          assessments={serializedAssessments}
          documents={serializedDocuments}
          timeline={timelineEvents.slice(0, 6)} // limit to recent 6 events for clean look
        />

      </div>
    </div>
  );
}
