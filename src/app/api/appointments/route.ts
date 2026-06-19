import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");

    if (patientId) {
      const appointments = await db.appointment.findMany({
        where: { patientId },
        include: { doctor: { include: { user: true } } },
        orderBy: { dateTime: "asc" },
      });
      return NextResponse.json(appointments);
    }

    if (doctorId) {
      const appointments = await db.appointment.findMany({
        where: { doctorId },
        include: { patient: { include: { user: true } } },
        orderBy: { dateTime: "asc" },
      });
      return NextResponse.json(appointments);
    }

    const all = await db.appointment.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
      orderBy: { dateTime: "asc" },
    });
    return NextResponse.json(all);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { doctorId, patientId, dateTime, type, reason } = await request.json();

    if (!doctorId || !patientId || !dateTime) {
      return NextResponse.json(
        { error: "Missing required fields: doctorId, patientId, dateTime" },
        { status: 400 }
      );
    }

    // 1. Fetch patient's latest assessment (if any) to create the AI consultation brief
    const latestAssessment = await db.assessment.findFirst({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });

    let aiBrief = "";
    if (latestAssessment) {
      const symptoms = JSON.parse(latestAssessment.symptoms || "[]");
      aiBrief = `### AI Patient Consultation Brief
- **Main Concern:** ${latestAssessment.concern}
- **Duration:** ${latestAssessment.duration || "Not specified"}
- **Severity Level:** ${latestAssessment.severity || "LOW"}
- **Assessed Symptoms:** ${symptoms.join(", ")}
- **Initial Recommended Department:** ${latestAssessment.recommendedDeptId ? "Recommended Specialty" : "General Medicine"}

#### Suggested Provider Questions:
1. What diagnostic tests are appropriate to rule out structural concerns?
2. Are there any conservative therapy actions (R.I.C.E or over-the-counter support) recommended prior to lab results?
3. What indications would suggest a need for emergency referral?`;
    } else {
      // Fallback AI brief based on the reservation reason
      aiBrief = `### AI Patient Consultation Brief
- **Main Concern:** Booking intake request
- **Details provided:** "${reason || "No details provided"}"
- **Assessed Symptoms:** Extrapolated from booking notes

#### Suggested Provider Questions:
1. What could be the direct cause of these symptoms?
2. What diagnostic path is recommended next?`;
    }

    // 2. Create the appointment in the database
    const newAppointment = await db.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: new Date(dateTime),
        status: "CONFIRMED", // Auto-confirm for dev ease
        type: type || "VIDEO",
        reason: reason || "Standard health consultation",
        summaryBrief: aiBrief,
      },
    });

    // 3. Log the audit activity
    try {
      const patient = await db.patient.findUnique({
        where: { id: patientId },
        include: { user: true },
      });
      if (patient) {
        await db.auditLog.create({
          data: {
            userId: patient.userId,
            userEmail: patient.user.email,
            userRole: "PATIENT",
            action: "Appointment Scheduled",
            details: `Scheduled appointment with doctor ID ${doctorId} for ${dateTime}. AI brief compiled.`,
          },
        });
      }
    } catch (e) {
      console.error("Audit log creation failed", e);
    }

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { appId, status, notes } = await request.json();

    if (!appId) {
      return NextResponse.json({ error: "Missing appId" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const updatedAppointment = await db.appointment.update({
      where: { id: appId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedAppointment);
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
