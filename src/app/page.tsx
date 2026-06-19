import Link from "next/link";
import { ArrowRight, Activity, ShieldAlert, FileText, Calendar, Users, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-linear-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide animate-pulse-slow">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Next-Gen Care Navigation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-display leading-[1.1]">
              Understand Your Symptoms. <br />
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Find The Right Care.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe your health concerns, answer interactive clinical questions, receive educational care path guidance, and book qualified specialists instantly.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-base font-bold transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] group"
              >
                <span>Start AI Health Assessment</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-border bg-background hover:bg-muted/50 px-8 py-4 rounded-full text-base font-semibold transition-all hover:translate-y-[-2px]"
              >
                How It Works
              </Link>
            </div>

            {/* Emergency Disclaimer Banner */}
            <p className="text-xs text-muted-foreground/80 max-w-md mx-auto pt-2">
              * AuraCare provides general health information. If you have severe, life-threatening symptoms, call 911 or visit the nearest ER immediately.
            </p>

          </div>
        </div>

        {/* Decorative Grid or Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.04),transparent_50%)] pointer-events-none" />
      </section>

      {/* Clinical Metrics Section */}
      <section className="border-y border-border/40 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">94%</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Navigational Accuracy</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary font-display">&lt; 3 Min</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assessment Duration</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">15+</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Specialty Departments</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-secondary font-display">100%</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">HIPAA Complaint Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Core Features */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
              A Complete Patient Care Journey
            </h2>
            <p className="text-muted-foreground">
              Moving beyond basic chat, AuraCare bridges the gap between digital screening and real clinical consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Box 1: Symptom Assessment */}
            <div className="relative group rounded-2xl border border-border/60 bg-card p-8 card-hover shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary/20">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                1. AI Health Assessment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Describe your health symptoms in plain words. AuraCare asks targeted clinical questions dynamically to assess severity, duration, and associated symptoms.
              </p>
            </div>

            {/* Box 2: Department Routing */}
            <div className="relative group rounded-2xl border border-border/60 bg-card p-8 card-hover shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 transition-colors group-hover:bg-secondary/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                2. Department Recommendations
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive educational care recommendations. Find out exactly which specialist department fits your issue (e.g. ENT, Orthopedics, Cardiology) rather than generic disease names.
              </p>
            </div>

            {/* Box 3: Specialist Match */}
            <div className="relative group rounded-2xl border border-border/60 bg-card p-8 card-hover shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-accent-foreground/10 flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-accent-foreground/20">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                3. Specialist Booking
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review matched board-certified specialists, browse schedules, and request consultations. An AI-generated Patient Consultation Brief is sent automatically to the provider.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Feature: Safety Layer & Report */}
      <section className="py-20 bg-muted/15 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-destructive/10 text-destructive px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Emergency Safety Layer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
                Guarding Patient Safety with Strict Guardrails
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                AuraCare monitors user inputs in real-time. If emergency symptoms (such as sudden speech impairment or severe chest pain) are detected, our Emergency Safety Layer instantly triggers, flashing immediate warnings to seek hospital ER services.
              </p>
              
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">✓</div>
                  <span className="text-sm text-foreground font-medium">Real-time emergency keyword monitoring</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">✓</div>
                  <span className="text-sm text-foreground font-medium">Clear disclaimers warning against self-diagnosis</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">✓</div>
                  <span className="text-sm text-foreground font-medium">Clinical summary brief generation to help doctors prepare</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center space-x-1.5 text-sm font-bold text-primary hover:text-primary/80 group"
                >
                  <span>Read our Clinical Advisory guidelines</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right side: Mock UI preview */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">ai_assessment_engine.ts</span>
              </div>
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-xs font-semibold leading-relaxed flex items-start space-x-3">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">CRITICAL EMERGENCY DETECTED</p>
                  <p className="text-muted-foreground font-normal mt-0.5">Symptoms indicate immediate care is required. Please dial 911 or visit the closest emergency department immediately.</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-muted-foreground uppercase">Patient intake details</p>
                <div className="p-3 bg-muted rounded-md space-y-1">
                  <p><strong className="text-foreground">Concern:</strong> Sore throat and high fever for 3 days</p>
                  <p><strong className="text-foreground">Suggested Routing:</strong> ENT Specialist or General Medicine Practitioner</p>
                  <p><strong className="text-foreground">Pre-consult Brief:</strong> 1. Duration: 3 days. 2. Severity: Moderate.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Take Control of Your Health Journey
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-base">
            In less than three minutes, AuraCare can analyze your symptoms, direct you to correct medical departments, and connect you with top providers.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-background text-primary hover:bg-muted px-8 py-4 rounded-full text-base font-bold transition-all shadow-md"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-primary-foreground/20 hover:bg-primary-foreground/10 px-8 py-4 rounded-full text-base font-semibold transition-all"
            >
              Dev Portal Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
