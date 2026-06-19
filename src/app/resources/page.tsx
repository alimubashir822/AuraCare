import Link from "next/link";
import { BookOpen, Search, ArrowRight, FileText } from "lucide-react";

export default function Resources() {
  const articles = [
    {
      title: "Common Causes of Back Pain & When to See an Orthopedist",
      slug: "causes-of-back-pain",
      category: "Orthopedics",
      readTime: "5 min read",
      summary: "Back pain affects 80% of adults. Learn about muscle strain, disk issues, and structural conditions, and identify the signs that indicate it's time to see a bone and joint specialist.",
      date: "June 18, 2026",
    },
    {
      title: "When Should You Consult a Dermatologist for Skin Rashes?",
      slug: "when-to-see-dermatologist",
      category: "Dermatology",
      readTime: "4 min read",
      summary: "Skin rashes can range from simple contact allergies to serious chronic issues. Discover how to evaluate symptoms like swelling, scaling, and duration to select the right skin doctor.",
      date: "June 12, 2026",
    },
    {
      title: "Recognizing Cardiovascular Warning Signs: Heart Care Paths",
      slug: "recognizing-cardiac-symptoms",
      category: "Cardiology",
      readTime: "6 min read",
      summary: "Heart health is critical. Learn to distinguish between benign fatigue, chest discomfort, and acute emergency signs that require calling 911 or visiting an interventional cardiologist.",
      date: "May 28, 2026",
    },
    {
      title: "Managing Childhood Fevers: General Guidelines for Parents",
      slug: "childhood-fevers-guide",
      category: "Pediatrics",
      readTime: "5 min read",
      summary: "A fever is a sign that a child's body is fighting off an infection. Understand standard child temperature ranges, home care remedies, and when to book an urgent pediatric checkup.",
      date: "May 15, 2026",
    },
    {
      title: "Chronic Sore Throats and Strep: When to Consult an ENT",
      slug: "strep-throat-ent-guide",
      category: "ENT Specialist",
      readTime: "3 min read",
      summary: "Is it a common cold or strep throat? Learn about pharyngitis complications, tonsil swelling, and how ear-nose-throat specialists run diagnostics to plan effective therapy.",
      date: "May 09, 2026",
    },
  ];

  return (
    <div className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            Healthcare Library
          </h1>
          <p className="text-muted-foreground text-sm">
            Read AI-generated, clinically reviewed guides to understand symptoms, learn care paths, and prepare for doctor visits.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Articles List (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {articles.map((art, idx) => (
              <article 
                key={idx}
                className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 shadow-xs card-hover space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                    {art.category}
                  </span>
                  <span className="text-muted-foreground">{art.readTime} • {art.date}</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display">
                  {art.title}
                </h2>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {art.summary}
                </p>

                <div className="pt-2">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary/80 group"
                  >
                    <span>Assess similar symptoms with AuraCare</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar CTA (Right) */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-md space-y-4">
              <BookOpen className="h-8 w-8 opacity-90" />
              <h3 className="text-lg font-bold font-display leading-tight">
                Not sure about your symptoms?
              </h3>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                Take our 3-minute interactive assessment. AuraCare will guide you to the right specialty department and help write your consultation brief.
              </p>
              <Link
                href="/assessment"
                className="w-full inline-flex items-center justify-center bg-background text-primary hover:bg-muted py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                Start Health Assessment
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h4 className="text-sm font-bold font-display text-foreground">Featured Search Terms</h4>
              <div className="flex flex-wrap gap-2 text-xxs font-semibold">
                <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground">Knee swelling relief</span>
                <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground">Strep throat symptoms</span>
                <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground">Chronic lower back pain</span>
                <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground">Heart attack warning signs</span>
                <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground">Contact dermatitis treatment</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
