import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to determine department recommendation based on keywords
async function getRecommendedDepartment(concern: string, symptoms: string[]) {
  const text = (concern + " " + symptoms.join(" ")).toLowerCase();
  
  let slug = "general-medicine";
  
  if (text.includes("knee") || text.includes("joint") || text.includes("bone") || text.includes("muscle") || text.includes("fracture") || text.includes("sprain")) {
    slug = "orthopedics";
  } else if (text.includes("chest") || text.includes("heart") || text.includes("cardiac") || text.includes("palpitations") || text.includes("breathing")) {
    slug = "cardiology";
  } else if (text.includes("skin") || text.includes("rash") || text.includes("itch") || text.includes("acne") || text.includes("mole")) {
    slug = "dermatology";
  } else if (text.includes("throat") || text.includes("ear") || text.includes("nose") || text.includes("swallow") || text.includes("tonsil") || text.includes("sinus")) {
    slug = "ent";
  } else if (text.includes("headache") || text.includes("brain") || text.includes("dizzy") || text.includes("migraine") || text.includes("numbness") || text.includes("seizure")) {
    slug = "neurology";
  } else if (text.includes("child") || text.includes("baby") || text.includes("pediatric") || text.includes("infant")) {
    slug = "pediatrics";
  }

  const dept = await db.medicalDepartment.findUnique({
    where: { slug },
  });

  return dept || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { concern, symptoms, ageGroup, severity, duration, patientId, language } = body;

    if (!concern) {
      return NextResponse.json({ error: "Concern is required" }, { status: 400 });
    }

    const lang = language === "es" ? "es" : "en";

    // 1. Check for critical emergency keywords
    const lowerConcern = concern.toLowerCase();
    const isEmergency = 
      lowerConcern.includes("chest pain") || 
      lowerConcern.includes("breathing difficulty") || 
      lowerConcern.includes("shortness of breath") || 
      lowerConcern.includes("loss of speech") || 
      lowerConcern.includes("paralysis") || 
      lowerConcern.includes("stroke") || 
      lowerConcern.includes("radiating arm pain") || 
      lowerConcern.includes("difficulty breathing");

    // 2. Resolve department recommendation
    const recommendedDept = await getRecommendedDepartment(concern, symptoms || []);
    
    // 3. Recommended Action
    let recommendedAction = "Consultation";
    if (isEmergency || severity === "CRITICAL") {
      recommendedAction = "Emergency";
    } else if (severity === "LOW" && !isEmergency) {
      recommendedAction = "Self Care";
    }

    let summaryContent = "";

    // 4. Check OpenAI Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        // Dynamic OpenAI chat completion
        const prompt = `You are a professional healthcare care navigation assistant. 
You must analyze the patient's symptoms and provide educational advice. 
IMPORTANT: DO NOT diagnose conditions, do not say "You have X disease". Only provide general health information and route the patient to the appropriate medical department.

Patient Details:
- Concern: ${concern}
- Symptoms: ${(symptoms || []).join(", ")}
- Age Group: ${ageGroup || "Not specified"}
- Severity: ${severity || "Moderate"}
- Duration: ${duration || "Not specified"}
- Recommended Department: ${recommendedDept ? recommendedDept.name : "General Medicine"}
- Language: ${lang === "es" ? "Spanish" : "English"}

Please provide a beautiful Markdown formatted response. Start with a header "### Health Guidance Summary".
Outline:
1. Summary of concern
2. Possible areas to discuss (e.g. specialists, departments)
3. Recommended next step (e.g. Schedule consultation, Rest and monitor, or seek emergency care)
4. A standard medical disclaimer indicating this is educational and not a diagnosis.
`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          summaryContent = resData.choices[0].message.content;
        }
      } catch (err) {
        console.error("OpenAI request failed, falling back to rule engine", err);
      }
    }

    // 5. Fallback rule-based medical AI generator
    if (!summaryContent) {
      let nextStepText = "";
      if (lang === "es") {
        if (recommendedAction === "Emergency") {
          nextStepText = "- **BUSQUE ATENCIÓN DE EMERGENCIA INMEDIATA.** Llame al 911 o vaya a la sala de emergencias más cercana.";
        } else if (recommendedAction === "Self Care") {
          nextStepText = "- Guarde reposo, controle los síntomas y aplique el protocolo R.I.C.E. si corresponde. Si los síntomas persisten por más de 5 días, reserve una consulta.";
        } else {
          const deptName = recommendedDept ? recommendedDept.name : "Medicina General";
          nextStepText = `- Programe una consulta virtual o presencial con un especialista en ${deptName} para una evaluación formal.`;
        }

        summaryContent = `### Resumen de Orientación de Salud

**Su inquietud:**
${concern}

**Posibles áreas a discutir:**
- Departamento de ${recommendedDept ? recommendedDept.name : "Medicina General"}
- Especialistas clínicos calificados

**Siguiente paso recomendado:**
${nextStepText}

**Información importante:**
Esta información es educativa y no constituye un diagnóstico médico. Siempre consulte con un médico calificado para cualquier problema médico.`;
      } else {
        if (recommendedAction === "Emergency") {
          nextStepText = "- **SEEK IMMEDIATE EMERGENCY CARE.** Call 911 or visit the closest Emergency Department immediately.";
        } else if (recommendedAction === "Self Care") {
          nextStepText = "- Rest and monitor symptoms. If symptoms persist for more than 5 days, schedule a consultation.";
        } else {
          const deptName = recommendedDept ? recommendedDept.name : "General Medicine";
          nextStepText = `- Schedule a virtual or in-person consultation with a specialist in ${deptName} for formal evaluation.`;
        }

        summaryContent = `### Health Guidance Summary

**Your concern:**
${concern}

**Possible areas to discuss:**
- ${recommendedDept ? recommendedDept.name : "General Medicine"} department
- Qualified clinic specialists

**Recommended next step:**
${nextStepText}

**Important:**
This information is educational and does not constitute a medical diagnosis. Always consult with a qualified physician for medical concerns.`;
      }
    }

    // 6. Save Assessment in SQLite
    const newAssessment = await db.assessment.create({
      data: {
        patientId: patientId || null,
        concern,
        symptoms: JSON.stringify(symptoms || []),
        ageGroup: ageGroup || null,
        severity: severity || null,
        duration: duration || null,
        summary: summaryContent,
        recommendedDeptId: recommendedDept ? recommendedDept.id : null,
        recommendedAction,
        status: "COMPLETED",
      },
    });

    // 7. Add AI Response trace log
    await db.aIResponse.create({
      data: {
        assessmentId: newAssessment.id,
        prompt: `Concern: ${concern}, Symptoms: ${JSON.stringify(symptoms)}`,
        content: summaryContent,
        type: "SUMMARY",
      },
    });

    // 8. Log the audit activity
    try {
      if (patientId) {
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
              action: "Symptom Assessment Completed",
              details: `Completed assessment for concern: '${concern}'. Recommended department: ${recommendedDept ? recommendedDept.name : "General"}.`,
            },
          });
        }
      }
    } catch (e) {
      console.error("Audit log failed during assessment save", e);
    }

    return NextResponse.json({
      success: true,
      assessment: newAssessment,
      recommendedDept: recommendedDept,
    });
  } catch (error: any) {
    console.error("Assessment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
