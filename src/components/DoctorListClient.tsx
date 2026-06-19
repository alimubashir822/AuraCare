"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Star, 
  MapPin, 
  Languages, 
  Shield, 
  Calendar, 
  Video, 
  Users, 
  X, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  languages: string;
  bio: string;
  rating: number;
  consultationFee: number;
  hospital: string;
  insuranceAccepted: string;
  clinicName: string;
  clinicAddress: string;
}

interface DoctorListClientProps {
  doctors: Doctor[];
  specialties: string[];
  initialSpecialty: string;
}

export default function DoctorListClient({ 
  doctors, 
  specialties, 
  initialSpecialty 
}: DoctorListClientProps) {
  // Filter States
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [language, setLanguage] = useState("");
  const [insurance, setInsurance] = useState("");

  // Booking Modal States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingType, setBookingType] = useState<"VIDEO" | "IN_PERSON">("VIDEO");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingReason, setBookingReason] = useState("");
  
  // Status States
  const [user, setUser] = useState<{ id: string; role: string; profileId: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch logged in user details on mount
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "PATIENT") {
            setUser(data.user);
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    }
    checkUser();
  }, []);

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.bio.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialty = !specialty || doc.specialty === specialty;
    
    const matchesLanguage = 
      !language || doc.languages.toLowerCase().includes(language.toLowerCase());
    
    const matchesInsurance = 
      !insurance || doc.insuranceAccepted.toLowerCase().includes(insurance.toLowerCase());

    return matchesSearch && matchesSpecialty && matchesLanguage && matchesInsurance;
  });

  const handleOpenBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setErrorMsg("");
    setBookingSuccess(false);
  };

  const handleCloseBooking = () => {
    setSelectedDoctor(null);
    setBookingDate("");
    setBookingReason("");
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be logged in as a Patient to book an appointment.");
      return;
    }
    if (!bookingDate) {
      setErrorMsg("Please select a date.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const dateTimeString = `${bookingDate}T${bookingTime}:00`;
      
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor?.id,
          patientId: user.profileId,
          dateTime: dateTimeString,
          type: bookingType,
          reason: bookingReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          handleCloseBooking();
        }, 2500);
      } else {
        setErrorMsg(data.error || "Failed to book appointment.");
      }
    } catch (e) {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickDemoLogin = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "patient@demo.com",
          password: "password",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setErrorMsg("");
      }
    } catch (error) {
      console.error("Demo login failed", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search & Filters
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctor name, bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm rounded-lg border border-border bg-background px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
          </div>

          {/* Specialty Dropdown */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full text-sm rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full text-sm rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Any Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Arabic">Arabic</option>
            <option value="Mandarin">Mandarin</option>
          </select>

          {/* Insurance Dropdown */}
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="w-full text-sm rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Any Insurance</option>
            <option value="Blue Shield">Blue Shield</option>
            <option value="Aetna">Aetna</option>
            <option value="UnitedHealth">UnitedHealth</option>
            <option value="Cigna">Cigna</option>
          </select>
        </div>
      </div>

      {/* Grid of Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="group rounded-2xl border border-border/60 bg-card p-6 shadow-xs card-hover flex flex-col justify-between"
          >
            <div className="space-y-4">
              
              {/* Doctor Name & Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-display group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-primary font-semibold">{doc.specialty}</p>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-500/10 text-yellow-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{doc.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {doc.bio}
              </p>

              {/* Specs Details */}
              <div className="space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{doc.clinicName} • {doc.hospital}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-primary shrink-0" />
                  <span>{doc.languages}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">Insurance: {doc.insuranceAccepted}</span>
                </div>
              </div>

            </div>

            {/* Price & Book CTA */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
              <div>
                <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Consultation Fee</p>
                <p className="text-lg font-bold text-foreground">${doc.consultationFee.toFixed(0)}</p>
              </div>
              <button
                onClick={() => handleOpenBooking(doc)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-xs"
              >
                Book Appointment
              </button>
            </div>

          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No doctors found matching the search criteria.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground font-display">Schedule Appointment</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Booking with {selectedDoctor.name}</p>
              </div>
              <button 
                onClick={handleCloseBooking}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-foreground font-display">Booking Confirmed!</h4>
                <p className="text-xs text-muted-foreground">Your appointment is scheduled. Redirecting dashboard...</p>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-4">
                
                {/* Check User */}
                {!user ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl space-y-3">
                    <p className="text-xs text-yellow-800 leading-normal flex gap-2">
                      <HelpCircle className="h-4 w-4 shrink-0" />
                      You must be logged in as a <strong>Patient</strong> to book appointments.
                    </p>
                    <button
                      type="button"
                      onClick={quickDemoLogin}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      Demo Login as Patient (John Doe)
                    </button>
                    <p className="text-center text-xxs text-muted-foreground">
                      Or visit the <Link href="/login" className="underline text-primary">Login page</Link>
                    </p>
                  </div>
                ) : null}

                {/* Consultation Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Consultation Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingType("VIDEO")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        bookingType === "VIDEO" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Video className="h-4 w-4" />
                      <span>Video Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("IN_PERSON")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        bookingType === "IN_PERSON" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>In-Person</span>
                    </button>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Select Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Select Time</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Reason for Appointment</label>
                  <textarea
                    placeholder="Briefly describe what you'd like to discuss..."
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={3}
                    className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Error Box */}
                {errorMsg && (
                  <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={!user || isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold py-3 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Scheduling...</span>
                  ) : (
                    <>
                      <Calendar className="h-4.5 w-4.5" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
