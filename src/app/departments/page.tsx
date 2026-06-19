import Link from "next/link";
import { db } from "@/lib/db";
import type { MedicalDepartment } from "@prisma/client";
import {
  Heart, 
  Activity, 
  Smile, 
  Baby, 
  Brain, 
  Speech, 
  ShieldAlert, 
  ArrowRight,
  Stethoscope
} from "lucide-react";

// Helper to map icons by name string
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Heart": return Heart;
    case "Activity": return Activity;
    case "Smile": return Smile;
    case "Baby": return Baby;
    case "Brain": return Brain;
    case "Speech": return Speech;
    case "ShieldAlert": return ShieldAlert;
    default: return Stethoscope;
  }
}

export const revalidate = 0; // Disable caching to fetch live departments

export default async function Departments() {
  let departments: MedicalDepartment[] = [];
  try {
    departments = await db.medicalDepartment.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to load departments:", error);
  }

  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            Medical Departments
          </h1>
          <p className="text-muted-foreground text-base">
            Browse our list of healthcare specialties to understand their scope and find matched providers.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => {
            const Icon = getIconComponent(dept.icon);
            return (
              <div 
                key={dept.id} 
                className="group relative rounded-2xl border border-border/60 bg-card p-8 card-hover shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dept.description}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-border/40">
                  <Link
                    href={`/doctors?specialty=${encodeURIComponent(dept.name)}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary/80 group/link"
                  >
                    <span>View Matching Doctors</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {departments.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No departments loaded. Run `node prisma/seed.js` to seed standard departments.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
