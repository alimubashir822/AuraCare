"use client";

import { useState } from "react";
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Video, 
  FileText, 
  Clipboard, 
  Check, 
  Loader2, 
  Sparkles,
  MapPin
} from "lucide-react";

interface Appointment {
  id: string;
  dateTime: string;
  status: string;
  type: string;
  reason: string;
  notes: string;
  summaryBrief: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  patientDOB: string;
}

interface DoctorDashboardClientProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    clinicName: string;
  };
  appointments: Appointment[];
}

export default function DoctorDashboardClient({
  doctor,
  appointments: initialAppointments,
}: DoctorDashboardClientProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // Edit note states
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Statistics calculation
  const totalPatients = new Set(appointments.map(a => a.patientId)).size;
  const todaysConsults = appointments.filter(a => {
    const appDate = new Date(a.dateTime).toDateString();
    const today = new Date().toDateString();
    return appDate === today && a.status === "CONFIRMED";
  }).length;
  const completedConsults = appointments.filter(a => a.status === "COMPLETED").length;

  const handleOpenDetail = (app: Appointment) => {
    if (selectedAppId === app.id) {
      setSelectedAppId(null);
    } else {
      setSelectedAppId(app.id);
      setEditingNotes(app.notes);
      setEditingStatus(app.status);
      setUpdateSuccess(false);
    }
  };

  const handleUpdateAppointment = async (appId: string) => {
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          status: editingStatus,
          notes: editingNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAppointments(prev =>
          prev.map(app =>
            app.id === appId ? { ...app, status: editingStatus, notes: editingNotes } : app
          )
        );
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs flex items-center justify-between">
          <div>
            <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Total Patients</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalPatients}</p>
          </div>
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs flex items-center justify-between">
          <div>
            <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Today&apos;s Visits</p>
            <p className="text-2xl font-bold text-secondary mt-1">{todaysConsults}</p>
          </div>
          <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs flex items-center justify-between">
          <div>
            <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Sessions Completed</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{completedConsults}</p>
          </div>
          <div className="h-10 w-10 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main Schedule List */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
          <Clipboard className="h-5 w-5 text-primary" />
          Intake & Consultations Log
        </h2>

        <div className="space-y-4">
          {appointments.map((app) => (
            <div 
              key={app.id}
              className="border border-border/60 rounded-2xl p-4 md:p-6 space-y-4 hover:border-secondary/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                
                {/* Patient / Details */}
                <div>
                  <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
                    {app.patientName}
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
                  <p className="text-xxs text-muted-foreground mt-0.5">
                    DOB: {app.patientDOB} • Gender: {app.patientGender}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenDetail(app)}
                  className="bg-muted hover:bg-muted/70 text-foreground text-xxs font-bold px-3 py-1.5 rounded-lg transition-all self-stretch sm:self-auto text-center"
                >
                  {selectedAppId === app.id ? "Hide Dossier" : "Open Intake Dossier"}
                </button>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl text-xs text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider text-xxs font-display">Date & Time</p>
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
                  <p className="font-semibold text-foreground uppercase tracking-wider text-xxs font-display">Visit Channel</p>
                  <p className="font-bold text-foreground mt-1 flex items-center gap-1.5">
                    {app.type === "VIDEO" ? (
                      <>
                        <Video className="h-4 w-4 text-primary shrink-0" />
                        <span>Video Call</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <span>In-Person</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider text-xxs font-display">Chief Complaint</p>
                  <p className="font-bold text-foreground mt-1 truncate" title={app.reason}>
                    {app.reason}
                  </p>
                </div>
              </div>

              {/* Expandable Clinical Intake Dossier */}
              {selectedAppId === app.id && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-muted/15 border border-border/40 p-5 rounded-2xl animate-fade-in">
                  
                  {/* Left Column: AI Patient Consultation Brief */}
                  <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-border/55 pb-4 lg:pb-0 lg:pr-6">
                    <div className="flex items-center space-x-2 text-primary">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse-slow" />
                      <h4 className="text-xs font-bold font-display uppercase tracking-wide">AI Patient Brief (Intake)</h4>
                    </div>
                    <div className="text-xs text-foreground whitespace-pre-line leading-relaxed font-normal">
                      {app.summaryBrief || "No intake report summary has been registered."}
                    </div>
                  </div>

                  {/* Right Column: Doctor Consultation updates */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-secondary">
                        <FileText className="h-4.5 w-4.5" />
                        <h4 className="text-xs font-bold font-display uppercase tracking-wide">Clinical Record Editor</h4>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xxs font-bold text-muted-foreground uppercase">Consultation Status</label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none"
                        >
                          <option value="CONFIRMED">CONFIRMED (Scheduled)</option>
                          <option value="COMPLETED">COMPLETED (Session Finished)</option>
                          <option value="CANCELLED">CANCELLED (Void Session)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xxs font-bold text-muted-foreground uppercase">Clinical Notes</label>
                        <textarea
                          placeholder="Type diagnoses, therapeutic prescriptions, or general consultation feedback..."
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          rows={4}
                          className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={() => handleUpdateAppointment(app.id)}
                        disabled={isUpdating}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 text-xxs font-bold py-3 rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Save Consultation Dossier</span>
                          </>
                        )}
                      </button>

                      {updateSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg p-2.5 flex items-center gap-1.5 animate-pulse text-xxs font-bold">
                          <Check className="h-4 w-4" />
                          <span>Dossier Saved!</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          ))}

          {appointments.length === 0 && (
            <div className="text-center py-12 text-xs text-muted-foreground font-medium">
              You have no patients scheduled on your consultation schedule logs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
