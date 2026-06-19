import Link from "next/link";
import { HeartPulse, ShieldAlert, Award, Compass } from "lucide-react";

export default function About() {
  const pillars = [
    {
      icon: ShieldAlert,
      title: "Patient Safety First",
      description: "We enforce strict safety guardrails. AuraCare acts as an intake assistant and care router, not a physician. We actively monitor and divert emergency symptoms.",
    },
    {
      icon: Compass,
      title: "Care Path Guidance",
      description: "Patients shouldn't get lost in complex medical structures. We translate concerns to hospital department routing directions, simplifying their entry paths.",
    },
    {
      icon: Award,
      title: "Preparing Consultations",
      description: "We compile AI Patient Consultation Briefs that outline duration, severity, and critical details, allowing doctors to prepare before they walk into the exam room.",
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-background space-y-20">
      
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
          Bridging Patients and Clinical Teams
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          AuraCare was founded to solve a major gap in healthcare: the transition between searching for symptom explanations online and receiving professional medical consultations.
        </p>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-muted/20 border border-border/40 rounded-2xl p-8 md:p-12">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Why Care Navigation Over Diagnostic Guessing?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Standard symptom checkers attempt to estimate probabilities of rare or complex diseases. This often causes unnecessary patient anxiety or creates a false sense of security.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>AuraCare is different.</strong> Our system focuses on care-path mapping. We understand the severity, structure the history, and direct you to the correct department (e.g. dermatology or physical therapy) and provider.
            </p>
          </div>
          <div className="flex justify-center">
            <HeartPulse className="h-48 w-48 stroke-[1.5] text-primary/30" />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center font-display">Our Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div key={idx} className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4 card-hover">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold font-display">{pil.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pil.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Board & Standards */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-display">Our Medical Standards</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our adaptive question structures are compiled based on clinical triage guidelines, ensuring that standard histories are logged systematically. All processes are audited and securely logged.
        </p>
        <div className="pt-4">
          <Link
            href="/assessment"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-xs"
          >
            Access Triage Engine
          </Link>
        </div>
      </section>

    </div>
  );
}
