"use client";

import { CheckCircle2, Circle, Clock3, Sparkles, ArrowRight, Calendar, Stethoscope, Activity, FileCheck2 } from "lucide-react";

export type JourneyStep = {
  id: string;
  label: string;
  description: string;
  icon: "symptoms" | "department" | "specialist" | "booking" | "followup";
  status: "completed" | "active" | "upcoming";
  detail?: string;
};

interface CareJourneyTrackerProps {
  steps: JourneyStep[];
  title?: string;
  compact?: boolean;
}

const iconMap = {
  symptoms: Activity,
  department: Stethoscope,
  specialist: FileCheck2,
  booking: Calendar,
  followup: CheckCircle2,
};

const statusColors = {
  completed: {
    dot: "bg-primary text-primary-foreground border-primary",
    line: "bg-primary",
    label: "text-primary",
    card: "bg-primary/5 border-primary/25",
  },
  active: {
    dot: "bg-secondary text-secondary-foreground border-secondary shadow-[0_0_14px_2px_hsl(var(--secondary)/0.35)] animate-pulse",
    line: "bg-border",
    label: "text-foreground",
    card: "bg-secondary/5 border-secondary/25",
  },
  upcoming: {
    dot: "bg-muted text-muted-foreground border-border",
    line: "bg-border",
    label: "text-muted-foreground",
    card: "bg-muted/30 border-border/40",
  },
};

export default function CareJourneyTracker({ steps, title = "Your Healthcare Journey", compact = false }: CareJourneyTrackerProps) {
  const completedCount = steps.filter(s => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground font-display">{title}</h2>
            <p className="text-xxs text-muted-foreground mt-0.5">
              {completedCount} of {steps.length} steps complete
            </p>
          </div>
        </div>

        {/* Progress ring summary */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider">Progress</p>
            <p className="text-xl font-bold text-foreground font-display">{progressPercent}%</p>
          </div>
          {/* Thin progress bar */}
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps - Horizontal on large, Vertical on small */}
      {compact ? (
        /* Compact horizontal layout */
        <div className="px-3 sm:px-6 py-5">
          <div className="flex items-start gap-0 relative">
            {steps.map((step, idx) => {
              const Icon = iconMap[step.icon];
              const colors = statusColors[step.status];
              const isLast = idx === steps.length - 1;
              return (
                <div key={step.id} className="flex flex-col items-center flex-1 relative min-w-0">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute top-3.5 sm:top-4 left-1/2 w-full h-[1.5px] sm:h-0.5 z-0">
                      <div className={`h-full w-full ${step.status === "completed" ? "bg-primary" : "bg-border"} transition-all duration-500`} />
                    </div>
                  )}
                  {/* Step dot */}
                  <div className={`relative z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${colors.dot} shrink-0`}>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : step.status === "active" ? (
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Circle className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-40" />
                    )}
                  </div>
                  {/* Label */}
                  <p className={`text-center text-[9px] sm:text-xxs font-semibold leading-tight px-0.5 truncate w-full ${colors.label}`} title={step.label}>
                    {step.label}
                  </p>
                  {step.detail && step.status !== "upcoming" && (
                    <p className="text-center text-[9px] sm:text-xxs text-muted-foreground mt-0.5 px-0.5 leading-tight hidden sm:block truncate w-full" title={step.detail}>
                      {step.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full vertical layout */
        <div className="p-6 space-y-3">
          {steps.map((step, idx) => {
            const Icon = iconMap[step.icon];
            const colors = statusColors[step.status];
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.id} className="flex gap-4 items-start group">
                {/* Left column: dot + connector */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={`h-9 w-9 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${colors.dot}`}>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    ) : step.status === "active" ? (
                      <Icon className="h-4.5 w-4.5" />
                    ) : (
                      <Clock3 className="h-4.5 w-4.5 opacity-30" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-full mt-2 min-h-[2rem] rounded-full transition-all duration-500 ${step.status === "completed" ? "bg-primary/40" : "bg-border/40"}`} />
                  )}
                </div>

                {/* Right column: card */}
                <div className={`flex-1 mb-1 rounded-xl border px-4 py-3 transition-all duration-300 ${colors.card} ${step.status === "active" ? "shadow-sm" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className={`text-xs font-bold font-display flex items-center gap-1.5 ${colors.label}`}>
                        {step.label}
                        {step.status === "active" && (
                          <span className="text-xxs font-semibold bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        {step.status === "completed" && (
                          <span className="text-xxs font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                            Done ✓
                          </span>
                        )}
                      </p>
                      <p className="text-xxs text-muted-foreground mt-0.5 leading-normal">{step.description}</p>
                    </div>
                    {step.detail && (
                      <div className="shrink-0 text-right">
                        <span className={`text-xxs font-bold px-2.5 py-1 rounded-lg ${step.status === "completed" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {step.detail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* CTA at bottom if all done */}
          {completedCount === steps.length && (
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground font-display">Journey Complete</p>
                <p className="text-xxs text-muted-foreground">Your care journey has been fully completed. Schedule a follow-up if needed.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary ml-auto shrink-0" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Helper to build journey steps from assessment data
 */
export function buildJourneySteps(params: {
  hasConcern: boolean;
  hasAssessment: boolean;
  recommendedDept?: string;
  hasMatchedDoctor: boolean;
  hasBooking: boolean;
}): JourneyStep[] {
  const { hasConcern, hasAssessment, recommendedDept, hasMatchedDoctor, hasBooking } = params;

  const step1Done = hasConcern;
  const step2Done = hasAssessment;
  const step3Done = hasMatchedDoctor;
  const step4Done = hasBooking;

  const getStatus = (isDone: boolean, prevDone: boolean): JourneyStep["status"] => {
    if (isDone) return "completed";
    if (prevDone) return "active";
    return "upcoming";
  };

  return [
    {
      id: "symptoms",
      label: "Understand Symptoms",
      description: "Describe your concern so AI can route you correctly",
      icon: "symptoms",
      status: getStatus(step1Done, true),
      detail: hasConcern ? "Described" : undefined,
    },
    {
      id: "assessment",
      label: "AI Assessment",
      description: "AI analyzes severity, duration and recommends a care path",
      icon: "department",
      status: getStatus(step2Done, step1Done),
      detail: recommendedDept || undefined,
    },
    {
      id: "specialist",
      label: "Choose Specialist",
      description: "Browse matched specialists in your recommended department",
      icon: "specialist",
      status: getStatus(step3Done, step2Done),
      detail: hasMatchedDoctor ? "Specialist Matched" : undefined,
    },
    {
      id: "booking",
      label: "Book Consultation",
      description: "Schedule a video or in-person visit with your chosen provider",
      icon: "booking",
      status: getStatus(step4Done, step3Done),
      detail: hasBooking ? "Appointment Set" : undefined,
    },
    {
      id: "followup",
      label: "Follow-up Care",
      description: "Review your post-consultation plan and next steps",
      icon: "followup",
      status: getStatus(false, step4Done),
    },
  ];
}
