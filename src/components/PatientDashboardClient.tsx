"use client";

import { useState } from "react";
import { 
  Calendar, 
  Activity, 
  FileText, 
  Clock, 
  Video, 
  Users, 
  ChevronRight, 
  Sparkles,
  ClipboardList,
  Plus,
  Loader2,
  CheckCircle,
  Stethoscope,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import CareJourneyTracker, { buildJourneySteps } from "@/components/CareJourneyTracker";

interface PatientDashboardClientProps {
  patient: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    insurance: string;
    insuranceMemberId: string;
    allergies: string;
    conditions: string;
  };
  appointments: {
    id: string;
    dateTime: string;
    status: string;
    type: string;
    reason: string;
    notes: string;
    summaryBrief: string;
    doctorName: string;
    doctorSpecialty: string;
    clinicName: string;
    clinicAddress: string;
  }[];
  assessments: {
    id: string;
    concern: string;
    symptoms: string;
    severity: string;
    duration: string;
    summary: string;
    recommendedDept: string;
    recommendedAction: string;
    createdAt: string;
  }[];
  documents: {
    id: string;
    title: string;
    category: string;
    aiExplanation: string;
    createdAt: string;
  }[];
  timeline: {
    date: string;
    title: string;
    description: string;
    type: "assessment" | "appointment" | "document" | "system";
  }[];
}

export default function PatientDashboardClient({
  patient,
  appointments: initialAppointments,
  assessments,
  documents: initialDocuments,
  timeline,
}: PatientDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "assessments" | "vault">("overview");

  // State managers
  const [appointments, setAppointments] = useState(initialAppointments);
  const [documents, setDocuments] = useState(initialDocuments);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [expandedAssessId, setExpandedAssessId] = useState<string | null>(null);
  
  // Document Simplifier States
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [customReportName, setCustomReportName] = useState("");
  const [customReportText, setCustomReportText] = useState("");
  const [simplifierSuccess, setSimplifierSuccess] = useState(false);

  // Quick template simulation
  const reportTemplates = [
    {
      title: "Blood Panel (Metabolic)",
      text: "WBC: 6.2 x10^3/uL, RBC: 4.8 x10^6/uL, Hemoglobin: 14.2 g/dL, Glucose (Fasting): 108 mg/dL (Flagged: Elevated), LDL Cholesterol: 132 mg/dL (Flagged: Borderline High), Sodium: 139 mEq/L."
    },
    {
      title: "Chest X-Ray Diagnostic",
      text: "PA and lateral views. Lungs are inflated and clear of consolidation, effusion, or pneumothorax. Cardiomediastinal contour is normal. Bony thorax is intact. Impression: No acute cardiopulmonary abnormality."
    },
    {
      title: "Lumbar Spine MRI Brief",
      text: "L4-L5: Minimal diffuse disc bulge. L5-S1: Mild right subarticular zone protrusion measuring 2mm, slightly abutting the descending right S1 nerve root. No severe canal stenosis. Facet joints look normal."
    }
  ];

  const handleSimulateUpload = async (title: string, content: string) => {
    setIsSimplifying(true);
    setSimplifierSuccess(false);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          title,
          content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments(prev => [data.document, ...prev]);
        setSimplifierSuccess(true);
        setCustomReportName("");
        setCustomReportText("");
        setTimeout(() => setSimplifierSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleCancelAppointment = async (appId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(`/api/appointments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, status: "CANCELLED" }),
      });

      if (res.ok) {
        setAppointments(prev =>
          prev.map(app => (app.id === appId ? { ...app, status: "CANCELLED" } : app))
        );
      }
    } catch (error) {
      console.error("Cancel failed", error);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6">
        
        {/* Navigation Cards */}
        <div className="rounded-2xl border border-border/60 bg-card p-2.5 sm:p-4 shadow-xs flex flex-row overflow-x-auto lg:flex-col gap-2 lg:gap-0 lg:space-y-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 w-auto lg:w-full justify-center lg:justify-start ${
              activeTab === "overview" 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            <span>Health Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 w-auto lg:w-full justify-center lg:justify-start ${
              activeTab === "appointments" 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            <span>Consultations ({appointments.filter(a=>a.status !== "CANCELLED").length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab("assessments")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 w-auto lg:w-full justify-center lg:justify-start ${
              activeTab === "assessments" 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <ClipboardList className="h-4.5 w-4.5" />
            <span>Symptom History ({assessments.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 w-auto lg:w-full justify-center lg:justify-start ${
              activeTab === "vault" 
                ? "bg-primary text-primary-foreground font-bold shadow-xs" 
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Document Explainer ({documents.length})</span>
          </button>
        </div>

        {/* Clinical Brief Info Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display">
            Quick Health Profile
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Allergies:</span>
              <span className="font-semibold text-destructive">{patient.allergies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conditions:</span>
              <span className="font-semibold text-foreground">{patient.conditions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Insurance:</span>
              <span className="font-semibold text-foreground truncate max-w-[150px]">{patient.insurance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DOB:</span>
              <span className="font-semibold text-foreground">{patient.dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="font-semibold text-foreground">{patient.gender}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Panel */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: OVERVIEW & TIMELINE */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ── AI Healthcare Journey Tracker ── */}
            <div className="md:col-span-3">
              <CareJourneyTracker
                compact={true}
                title="Your Care Journey"
                steps={buildJourneySteps({
                  hasConcern: assessments.length > 0,
                  hasAssessment: assessments.length > 0,
                  recommendedDept: assessments[0]?.recommendedDept,
                  hasMatchedDoctor: appointments.length > 0,
                  hasBooking: appointments.filter(a => a.status === "CONFIRMED" || a.status === "COMPLETED").length > 0,
                })}
              />
            </div>

            {/* Quick Metrics Cards */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
                <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Symptom Checks</p>
                <p className="text-2xl font-bold text-foreground mt-1">{assessments.length}</p>
              </div>
              <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
                <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Active Bookings</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {appointments.filter(a => a.status === "CONFIRMED").length}
                </p>
              </div>
              <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
                <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Saved Reports</p>
                <p className="text-2xl font-bold text-secondary mt-1">{documents.length}</p>
              </div>
            </div>


            {/* Health Journey Timeline (Left) */}
            <div className="md:col-span-2 bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                AI Health Timeline
              </h2>
              
              <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {timeline.map((event, idx) => (
                  <div key={idx} className="flex space-x-4 relative items-start">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 z-10 border ${
                      event.type === "assessment" 
                        ? "bg-primary text-primary-foreground border-primary/20"
                        : event.type === "appointment" 
                        ? "bg-secondary text-secondary-foreground border-secondary/20"
                        : "bg-teal-500 text-white border-teal-500/20"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center space-x-2 text-xxs font-semibold">
                        <span className="text-muted-foreground">{event.date}</span>
                        <span className="text-border">•</span>
                        <span className="capitalize font-semibold text-primary">{event.title}</span>
                      </div>
                      <p className="text-xs text-foreground leading-normal font-medium">{event.description}</p>
                    </div>
                  </div>
                ))}

                {timeline.length === 0 && (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Your health timeline is empty. Describe symptoms or book consultation to populate.
                  </div>
                )}
              </div>
            </div>

            {/* Next Appointment Card (Right) */}
            <div className="md:col-span-1 bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-primary" />
                  Next Scheduled Visit
                </h3>
                
                {appointments.filter(a => a.status === "CONFIRMED")[0] ? (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {appointments.filter(a => a.status === "CONFIRMED")[0].doctorName}
                      </p>
                      <p className="text-xxs text-primary font-semibold">
                        {appointments.filter(a => a.status === "CONFIRMED")[0].doctorSpecialty}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">Date & Time:</p>
                      <p className="font-bold text-foreground">
                        {new Date(appointments.filter(a => a.status === "CONFIRMED")[0].dateTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                      {appointments.filter(a => a.status === "CONFIRMED")[0].type === "VIDEO" ? (
                        <>
                          <Video className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span>Video Call Consultation</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span>In-Person Visit</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    No upcoming appointments. Need care navigation advice? Schedule a consult after running symptom checker.
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setActiveTab("appointments")}
                className="w-full mt-6 inline-flex items-center justify-center bg-muted hover:bg-muted/75 text-foreground text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                <span>View All Visits</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Consultation Schedule
            </h2>

            <div className="space-y-4">
              {appointments.map((app) => (
                <div 
                  key={app.id}
                  className="border border-border/60 rounded-2xl p-4 md:p-6 space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-1.5">
                        {app.doctorName}
                        <span className={`text-xxs px-2 py-0.5 rounded-full font-bold ${
                          app.status === "CONFIRMED" 
                            ? "bg-green-500/10 text-green-600" 
                            : app.status === "COMPLETED" 
                            ? "bg-muted text-muted-foreground" 
                            : "bg-red-500/10 text-red-600"
                        }`}>
                          {app.status}
                        </span>
                      </h3>
                      <p className="text-xxs text-primary font-semibold mt-0.5">{app.doctorSpecialty} • {app.clinicName}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      {app.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="text-xxs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20 transition-all"
                        >
                          Cancel Appointment
                        </button>
                      )}
                      
                      <button
                        onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}
                        className="bg-muted hover:bg-muted/70 text-foreground text-xxs font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        {expandedAppId === app.id ? "Hide Brief" : "View AI Brief"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Date & Time</p>
                      <p className="font-bold text-foreground mt-1">
                        {new Date(app.dateTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Type</p>
                      <p className="font-bold text-foreground mt-1 capitalize">{app.type.replace("_", " ").toLowerCase()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Location</p>
                      <p className="font-bold text-foreground mt-1 truncate" title={app.clinicAddress}>
                        {app.type === "VIDEO" ? "Video Consultation Link" : app.clinicAddress}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Consultation intake report brief */}
                  {expandedAppId === app.id && (
                    <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-3 animate-fade-in">
                      <div className="flex items-center space-x-2 text-primary">
                        <Sparkles className="h-4.5 w-4.5" />
                        <h4 className="text-xs font-bold font-display uppercase tracking-wide">AI Consultation Intake Report</h4>
                      </div>
                      <div className="text-xs text-foreground whitespace-pre-line leading-relaxed font-normal">
                        {app.summaryBrief || "No intake brief generated for this consultation."}
                      </div>
                      {app.notes && (
                        <div className="border-t border-primary/10 pt-3 mt-3">
                          <p className="text-xxs uppercase tracking-wider font-bold text-muted-foreground">Doctor Clinical Notes:</p>
                          <p className="text-xs text-foreground mt-1 italic font-normal">{app.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ))}

              {appointments.length === 0 && (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  You have no appointments scheduled. Explore Matched Specialists from symptom checks to book a visit.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ASSESSMENTS */}
        {activeTab === "assessments" && (
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Symptom Assessment History
            </h2>

            <div className="space-y-4">
              {assessments.map((ass) => (
                <div 
                  key={ass.id}
                  className="border border-border/60 rounded-2xl p-4 md:p-6 space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-foreground font-display">
                        Symptom check for &quot;{ass.concern}&quot;
                      </h3>
                      <p className="text-xxs text-muted-foreground mt-0.5">
                        Completed on {new Date(ass.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    
                    <span className={`text-xxs px-2 py-0.5 rounded-full font-bold ${
                      ass.severity === "CRITICAL" || ass.severity === "HIGH" 
                        ? "bg-red-500/10 text-red-600 animate-pulse" 
                        : ass.severity === "MEDIUM" 
                        ? "bg-yellow-500/10 text-yellow-600" 
                        : "bg-green-500/10 text-green-600"
                    }`}>
                      {ass.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Duration</p>
                      <p className="font-bold text-foreground mt-1">{ass.duration || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Recommended Dept</p>
                      <p className="font-bold text-foreground mt-1">{ass.recommendedDept}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground uppercase tracking-wider text-xxs">Suggested Action</p>
                      <p className="font-bold text-foreground mt-1 capitalize">{ass.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setExpandedAssessId(expandedAssessId === ass.id ? null : ass.id)}
                      className="text-xxs font-bold text-primary hover:underline transition-all flex items-center"
                    >
                      {expandedAssessId === ass.id ? "Close Guidance Report" : "Read Full AI Guidance Report"}
                      <ChevronRight className={`ml-0.5 h-4.5 w-4.5 transform transition-transform ${expandedAssessId === ass.id ? "rotate-90" : ""}`} />
                    </button>
                    
                    {ass.recommendedAction !== "Emergency" && (
                      <Link
                        href={`/doctors?specialty=${encodeURIComponent(ass.recommendedDept)}`}
                        className="bg-primary/10 hover:bg-primary/20 text-primary text-xxs font-bold px-3 py-1.5 rounded-full transition-all"
                      >
                        Book Specialists
                      </Link>
                    )}
                  </div>

                  {/* Expandable Full AI Guidance Summary markdown */}
                  {expandedAssessId === ass.id && (
                    <div className="bg-muted/40 border border-border/40 p-5 rounded-2xl space-y-3 text-xs text-foreground whitespace-pre-line leading-relaxed font-normal animate-fade-in">
                      {ass.summary}
                    </div>
                  )}

                </div>
              ))}

              {assessments.length === 0 && (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  You have not completed any symptom assessments yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MEDICAL DOCUMENT VAULT & AI EXPLAINER */}
        {activeTab === "vault" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Explainer simulation (Left) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display">
                    Document AI Explainer
                  </h3>
                </div>
                <p className="text-xxs text-muted-foreground leading-relaxed">
                  Have a complex diagnostic lab panel or radiology scan report? Simulate an upload below to receive an AI-simplified explanation in plain English.
                </p>

                {/* Templates buttons */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xxs font-bold text-muted-foreground uppercase">Upload Lab Templates</p>
                  {reportTemplates.map((temp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateUpload(temp.title, temp.text)}
                      disabled={isSimplifying}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left text-xxs font-semibold text-foreground disabled:opacity-50"
                    >
                      <span className="truncate">{temp.title}</span>
                      <Plus className="h-3.5 w-3.5 text-primary shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Custom Uploader Simulation */}
                <div className="border-t border-border/40 pt-4 space-y-3">
                  <p className="text-xxs font-bold text-muted-foreground uppercase">Or Write Report Text</p>
                  <input
                    type="text"
                    placeholder="Report Name (e.g. Brain MRI)"
                    value={customReportName}
                    onChange={(e) => setCustomReportName(e.target.value)}
                    className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                  />
                  <textarea
                    placeholder="Type raw medical observations or diagnostic summaries..."
                    value={customReportText}
                    onChange={(e) => setCustomReportText(e.target.value)}
                    rows={3}
                    className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSimulateUpload(customReportName || "Custom Scan Brief", customReportText)}
                    disabled={isSimplifying || !customReportText}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xxs font-bold py-2 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isSimplifying ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>AI Explaining...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Simplify Text</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success alert */}
                {simplifierSuccess && (
                  <div className="p-2.5 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                    <CheckCircle className="h-4 w-4" />
                    <span>Report Explained & Saved!</span>
                  </div>
                )}

              </div>
            </div>

            {/* Explainer documents vault listing (Right) */}
            <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Medical Document Vault
              </h2>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="border border-border/60 rounded-2xl p-4 md:p-5 space-y-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-foreground font-display flex items-center gap-1.5">
                          <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                          {doc.title}
                        </h4>
                        <p className="text-xxs text-muted-foreground mt-0.5">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setSelectedDocId(selectedDocId === doc.id ? null : doc.id)}
                        className="text-xxs font-bold text-primary hover:underline transition-colors"
                      >
                        {selectedDocId === doc.id ? "Hide Explanation" : "Read AI Explanation"}
                      </button>
                    </div>

                    {selectedDocId === doc.id && (
                      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-xs text-foreground whitespace-pre-line leading-relaxed font-normal animate-fade-in">
                        <div className="flex items-center space-x-1.5 text-primary font-bold uppercase tracking-wider text-xxs mb-2">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI Plain-English Simplification</span>
                        </div>
                        {doc.aiExplanation || "Simplifying document..."}
                      </div>
                    )}

                  </div>
                ))}

                {documents.length === 0 && (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    Your document vault is currently empty. Use the uploader simulation to parse a health report.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
