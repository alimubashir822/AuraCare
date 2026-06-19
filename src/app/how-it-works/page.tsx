import Link from "next/link";
import { ArrowRight, UserPlus, MessageSquare, ShieldAlert, GitFork, ClipboardCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: "1. Describe Symptoms",
      description: "Patients describe symptoms in plain text or simulate voice transcription. Select language (English/Spanish) and answer preliminary options.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: ShieldAlert,
      title: "2. Emergency Audit",
      description: "The system runs text checks against critical medical signs. Any flags for life-threatening symptoms prompt an immediate ER seek warning.",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: GitFork,
      title: "3. Adaptive Follow-up",
      description: "AI asks standard medical intake questions regarding symptoms: severity, duration, and age group to gauge clinical scope.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: ClipboardCheck,
      title: "4. Department Recommendation",
      description: "Instead of diagnoses, the system maps symptoms to specialty departments (e.g. Cardiology, Orthopedics) to guide care path choices.",
      color: "bg-teal-500/10 text-teal-600",
    },
    {
      icon: UserPlus,
      title: "5. Doctor Matching & Booking",
      description: "AuraCare suggests specialists accepted by your insurance/language. Booking compiles an AI Patient Consultation Brief for the doctor.",
      color: "bg-indigo-500/10 text-indigo-600",
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            How Care Navigation Works
          </h1>
          <p className="text-muted-foreground text-base">
            Learn how our medical AI routes patient concerns to professional clinical care teams safely.
          </p>
        </div>

        {/* Steps Timeline Layout */}
        <div className="space-y-12 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-border before:hidden md:before:block">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8 relative z-10">
                {/* Icon Circle */}
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 shadow-xs ${step.color} border border-current/10 font-bold text-lg md:text-base`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Step Content */}
                <div className="bg-card rounded-2xl border border-border/60 p-6 md:p-8 flex-1 space-y-2 card-hover">
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer highlight */}
        <div className="mt-16 bg-muted/30 border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-lg font-bold font-display">Our Commitment to Patient Safety</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We operate under a strict Clinical Safety policy. AuraCare never attempts to diagnose conditions, prescribe drugs, or replace a doctor. We guide patients through educational intake steps so they can receive correct, timely support.
            </p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-xs shrink-0 group"
          >
            <span>Try Assessment Now</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
