import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import ClinicDashboardClient from "@/components/ClinicDashboardClient";

export const revalidate = 0; // Live reload

export default async function ClinicDashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session")?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/clinic/dashboard");
  }

  let sessionUser;
  try {
    sessionUser = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
  } catch (e) {
    redirect("/login");
  }

  if (sessionUser.role !== "CLINIC_ADMIN") {
    redirect("/login");
  }

  // 1. Fetch Clinic Analytics
  // Leads: assessments completed
  const totalLeads = await db.assessment.count();
  // Conversions: appointments scheduled
  const totalConversions = await db.appointment.count();

  // 2. Fetch doctors in the clinic (or all doctors for dashboard preview)
  const doctors = await db.doctor.findMany({
    include: { user: true, clinic: true },
  });

  // 3. Fetch assessments with department details to compute department loads
  const assessments = await db.assessment.findMany({
    include: { recommendedDept: true },
  });

  // Calculate department distribution for Recharts
  const deptCountMap: Record<string, number> = {};
  assessments.forEach((ass) => {
    const deptName = ass.recommendedDept?.name || "General Medicine";
    deptCountMap[deptName] = (deptCountMap[deptName] || 0) + 1;
  });

  const chartDeptData = Object.entries(deptCountMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Mock monthly intake data for Recharts trend
  const trendData = [
    { month: "Jan", Leads: 25, Conversions: 12 },
    { month: "Feb", Leads: 32, Conversions: 18 },
    { month: "Mar", Leads: 45, Conversions: 22 },
    { month: "Apr", Leads: 52, Conversions: 31 },
    { month: "May", Leads: 68, Conversions: 42 },
    { month: "Jun", Leads: totalLeads + 30, Conversions: totalConversions + 15 },
  ];

  // 4. Serialize doctors
  const serializedDoctors = doctors.map((doc) => ({
    id: doc.id,
    name: doc.user.name,
    email: doc.user.email,
    specialty: doc.specialty,
    experience: doc.experience,
    consultationFee: doc.consultationFee,
    rating: doc.rating,
    clinicName: doc.clinic?.name || "Independent Clinic",
    status: "ACTIVE", // mock availability status
  }));

  return (
    <div className="py-8 bg-muted/15 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Identity Header */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-tight">
              Administrative Command
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Welcome back, Administrator
            </p>
          </div>
          <span className="bg-primary/10 text-primary text-xxs font-bold px-3 py-1 rounded-full border border-primary/25">
            Admin Account
          </span>
        </div>

        {/* Client component for interactive Recharts graphs */}
        <ClinicDashboardClient 
          totalLeads={totalLeads}
          totalConversions={totalConversions}
          doctors={serializedDoctors}
          deptData={chartDeptData}
          trendData={trendData}
        />

      </div>
    </div>
  );
}
