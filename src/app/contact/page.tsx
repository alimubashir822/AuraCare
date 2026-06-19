import { Mail, Phone, Building, Globe, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            Contact & Partnerships
          </h1>
          <p className="text-muted-foreground text-sm">
            Interested in deploying care navigation at your clinic? Or have a general support inquiry? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Info Panels (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-6">
              <h2 className="text-xl font-bold font-display text-foreground">Inquiries</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our support team is available Mon-Fri, 9am - 5pm EST. We look forward to hearing from you.
              </p>

              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@auracare.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>(555) 0199-244</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-primary" />
                  <span>AuraCare HQ, 500 Boylston St, Boston, MA</span>
                </div>
              </div>
            </div>

            {/* Monetization / Clinic CTA */}
            <div className="rounded-2xl bg-secondary text-primary-foreground p-6 space-y-4 shadow-sm">
              <Globe className="h-8 w-8 opacity-90" />
              <h3 className="text-base font-bold font-display">Clinic SaaS Integration</h3>
              <p className="text-xxs text-primary-foreground/90 leading-relaxed">
                Connect your medical schedules, automate your patient intake, and review AI-synthesized report briefs directly in your EHR systems.
              </p>
              <button className="w-full bg-background text-secondary hover:bg-muted text-xs font-bold py-2.5 rounded-full transition-all">
                Request API Access Demo
              </button>
            </div>
          </div>

          {/* Form (Right) */}
          <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card p-6 md:p-8 shadow-xs">
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Inquiry Type</label>
                <select className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="clinic">Clinic SaaS Partnership</option>
                  <option value="support">Patient Support Inquiry</option>
                  <option value="press">Press & Research Questions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Message</label>
                <textarea
                  placeholder="Tell us about your organization or inquiry..."
                  rows={5}
                  className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <Send className="mr-2 h-4 w-4" />
                <span>Send Message</span>
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
