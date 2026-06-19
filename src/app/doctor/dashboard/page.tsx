import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import DoctorDashboardClient from "@/components/DoctorDashboardClient";

export const revalidate = 0; // Live reload dashboard

export default async function DoctorDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session")?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/doctor/dashboard");
  }

  let sessionUser;
  try {
    sessionUser = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
  } catch (e) {
    redirect("/login");
  }

  if (sessionUser.role !== "DOCTOR" || !sessionUser.profileId) {
    redirect("/login");
  }

  // Fetch Doctor details and clinic association
  const doctor = await db.doctor.findUnique({
    where: { id: sessionUser.profileId },
    include: {
      user: true,
      clinic: true,
      appointments: {
        include: {
          patient: {
            include: { user: true },
          },
        },
        orderBy: { dateTime: "asc" },
      },
    },
  });

  if (!doctor) {
    redirect("/login");
  }

  // Serialize details
  const serializedDoctor = {
    id: doctor.id,
    name: doctor.user.name,
    specialty: doctor.specialty,
    clinicName: doctor.clinic?.name || "Independent Clinic",
  };

  const serializedAppointments = doctor.appointments.map((app: any) => ({
    id: app.id,
    dateTime: app.dateTime.toISOString(),
    status: app.status,
    type: app.type,
    reason: app.reason || "General Consultation",
    notes: app.notes || "",
    summaryBrief: app.summaryBrief || "",
    patientId: app.patient.id,
    patientName: app.patient.user.name,
    patientGender: app.patient.gender || "Not specified",
    patientDOB: app.patient.dateOfBirth || "N/A",
  }));

  return (
    <div className="py-8 bg-muted/15 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Doctor Identity Header */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-tight">
              Clinical Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Welcome back, {serializedDoctor.name} • {serializedDoctor.specialty}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{serializedDoctor.clinicName}</p>
            <p className="text-xxs">Secure Provider Connection</p>
          </div>
        </div>

        {/* Doctor Dashboard Hydrator */}
        <DoctorDashboardClient 
          doctor={serializedDoctor}
          appointments={serializedAppointments}
        />

      </div>
    </div>
  );
}
