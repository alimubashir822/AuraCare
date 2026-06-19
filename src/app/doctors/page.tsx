import { db } from "@/lib/db";
import DoctorListClient from "@/components/DoctorListClient";
import type { Doctor, User, Clinic } from "@prisma/client";

export const revalidate = 0; // Live data fetching

interface PageProps {
  searchParams: Promise<{
    specialty?: string;
  }>;
}

export default async function Doctors(props: PageProps) {
  const searchParams = await props.searchParams;
  const initialSpecialty = searchParams.specialty || "";

  let doctors: (Doctor & { user: User; clinic: Clinic | null })[] = [];
  let specialties: string[] = [];

  try {
    // Fetch all active doctors with user and clinic details
    doctors = await db.doctor.findMany({
      include: {
        user: true,
        clinic: true,
      },
    });

    // Extract unique specialties for filtering
    const allSpecialties = doctors.map((d: any) => d.specialty);
    specialties = Array.from(new Set(allSpecialties)).sort();
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }

  // Parse doctors for easier use in client component
  const serializedDoctors = doctors.map((doc: any) => ({
    id: doc.id,
    name: doc.user.name,
    email: doc.user.email,
    specialty: doc.specialty,
    experience: doc.experience,
    languages: doc.languages,
    bio: doc.bio,
    rating: doc.rating,
    consultationFee: doc.consultationFee,
    hospital: doc.hospital || "General Hospital",
    insuranceAccepted: doc.insuranceAccepted || "All Major Insurances",
    clinicName: doc.clinic?.name || "Independent Clinic",
    clinicAddress: doc.clinic?.address || "",
  }));

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
            Find Matched Specialists
          </h1>
          <p className="text-muted-foreground text-sm">
            Search by name, filter by department, language, and insurance, and schedule your appointment online.
          </p>
        </div>

        <DoctorListClient 
          doctors={serializedDoctors} 
          specialties={specialties} 
          initialSpecialty={initialSpecialty}
        />

      </div>
    </div>
  );
}
