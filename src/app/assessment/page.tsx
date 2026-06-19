"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  Languages, 
  HelpCircle,
  Video,
  Users,
  X,
  Star,
  Phone,
  MapPin,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import CareJourneyTracker, { buildJourneySteps } from "@/components/CareJourneyTracker";

interface Message {
  sender: "user" | "ai";
  text: string;
  isSummary?: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  clinicName: string;
  languages: string;
  rating: number;
}

interface RecommendedDept {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function AssessmentPage() {
  // Multilingual toggle
  const [lang, setLang] = useState<"en" | "es">("en");
  
  // Chat States
  const [step, setStep] = useState(0); // 0: input symptoms, 1: duration, 2: severity, 3: age group, 4: complete
  const [concern, setConcern] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  
  // Voice Simulation States
  const [isRecording, setIsRecording] = useState(false);
  const [voicePulseText, setVoicePulseText] = useState("");

  // Matching Doctor States
  const [recommendedDept, setRecommendedDept] = useState<RecommendedDept | null>(null);
  const [matchedDoctors, setMatchedDoctors] = useState<Doctor[]>([]);
  const [hasBooked, setHasBooked] = useState(false);
  
  // Booking Modal States inside Chat
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingType, setBookingType] = useState<"VIDEO" | "IN_PERSON">("VIDEO");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingReason, setBookingReason] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Patient user session
  const [patientId, setPatientId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Localization Dictionary
  const t = {
    en: {
      title: "AI Symptom Navigator",
      subtitle: "Conversational intake and clinical routing",
      emergencyWarningTitle: "CRITICAL SAFETY ALERT",
      emergencyWarningText: "Your input indicates emergency symptoms. Please seek immediate emergency medical care. Call 911 or visit the closest emergency room.",
      emergencyBtn: "I understand, reset assessment",
      welcomeMsg: "Hello! Describe your health concerns. For example, 'My throat hurts and I have fever.'",
      placeholder: "Type your health concern here...",
      durationPrompt: "How long has this been happening?",
      severityPrompt: "How severe is your discomfort?",
      agePrompt: "What is your age group?",
      calculating: "AI is analyzing your symptoms and compiling recommendations...",
      resetBtn: "Reset Triage Assessment",
      micTooltip: "Simulate voice input",
      voiceListening: "Listening... (Simulating transcription)",
      voiceFinished: "Transcribed: 'I have had a really bad headache and neck stiffness since yesterday morning.'",
      matchTitle: "Matched Specialists",
      matchSubtitle: "We recommend booking a consultation with the following providers:",
      bookBtn: "Book Online",
      guestAlert: "Assessments completed as a guest are not saved to your profile. Please log in to save history.",
      loginLink: "Sign in as Patient",
      reasonPlaceholder: "Describe anything else for the doctor...",
      selectDate: "Select Date",
      selectTime: "Select Time",
      consultType: "Consultation Type",
      confirmBtn: "Confirm Booking",
      bookingDone: "Appointment Scheduled Successfully!",
      quickLogin: "Quick Login (John Doe)"
    },
    es: {
      title: "Navegador de Síntomas AI",
      subtitle: "Admisión conversacional y enrutamiento clínico",
      emergencyWarningTitle: "ALERTA DE SEGURIDAD CRÍTICA",
      emergencyWarningText: "Sus síntomas podrían requerir atención inmediata. Busque atención de emergencia de inmediato. Llame al 911 o vaya a la sala de emergencias más cercana.",
      emergencyBtn: "Entendido, reiniciar evaluación",
      welcomeMsg: "¡Hola! Describa sus problemas de salud. Por ejemplo, 'Me duele la garganta y tengo fiebre'.",
      placeholder: "Escriba sus síntomas aquí...",
      durationPrompt: "¿Cuánto tiempo ha estado ocurriendo esto?",
      severityPrompt: "¿Qué tan severo es su malestar?",
      agePrompt: "¿Cuál es su grupo de edad?",
      calculating: "La IA está analizando sus síntomas y recopilando recomendaciones...",
      resetBtn: "Reiniciar Evaluación",
      micTooltip: "Simular entrada de voz",
      voiceListening: "Escuchando... (Simulando transcripción)",
      voiceFinished: "Transcrito: 'He tenido un dolor de cabeza muy fuerte y rigidez en el cuello desde ayer por la mañana.'",
      matchTitle: "Especialistas Sugeridos",
      matchSubtitle: "Recomendamos programar una consulta con los siguientes profesionales:",
      bookBtn: "Reservar",
      guestAlert: "Las evaluaciones completadas como invitado no se guardan en su perfil. Inicie sesión para guardar.",
      loginLink: "Iniciar Sesión",
      reasonPlaceholder: "Describa cualquier otro detalle para el médico...",
      selectDate: "Seleccionar Fecha",
      selectTime: "Seleccionar Hora",
      consultType: "Tipo de Consulta",
      confirmBtn: "Confirmar Reserva",
      bookingDone: "¡Cita Programada con Éxito!",
      quickLogin: "Inicio de sesión (John Doe)"
    }
  }[lang];

  // Initialize Welcome Message
  useEffect(() => {
    setMessages([{ sender: "ai", text: t.welcomeMsg }]);
    
    // Check Patient session
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user.role === "PATIENT") {
            setPatientId(data.user.profileId);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkSession();
  }, [lang]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecording, voicePulseText]);

  // Real-time text monitoring for emergency keyword trigger
  const handleInputChange = (val: string) => {
    setInputValue(val);
    
    const text = val.toLowerCase();
    const criticalKeywords = ["chest pain", "breathing difficulty", "shortness of breath", "loss of speech", "paralysis", "stroke", "numbness", "arm pain"];
    const matched = criticalKeywords.some(keyword => text.includes(keyword));
    
    if (matched) {
      setIsEmergency(true);
    } else {
      setIsEmergency(false);
    }
  };

  // Simulate Voice input trigger
  const triggerVoiceSimulation = () => {
    if (isRecording) return;
    
    setIsRecording(true);
    setVoicePulseText(t.voiceListening);
    setIsEmergency(false);

    // Simulate speech transcription after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setVoicePulseText("");
      const mockTranscription = lang === "en" 
        ? "I have had a really bad headache and neck stiffness since yesterday morning."
        : "He tenido un dolor de cabeza muy fuerte y rigidez en el cuello desde ayer por la mañana.";
      
      setInputValue(mockTranscription);
    }, 3000);
  };

  const handleSendInitial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setConcern(userText);
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInputValue("");
    setStep(1);

    // AI Follow up 1 (Duration)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: t.durationPrompt }]);
    }, 600);
  };

  const handleSelectDuration = (val: string) => {
    setDuration(val);
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setStep(2);

    // AI Follow up 2 (Severity)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: t.severityPrompt }]);
    }, 600);
  };

  const handleSelectSeverity = (val: string) => {
    setSeverity(val);
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setStep(3);

    // AI Follow up 3 (Age group)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: t.agePrompt }]);
    }, 600);
  };

  const handleSelectAgeGroup = async (val: string) => {
    setAgeGroup(val);
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setStep(4);

    // Show calculating loading state
    setMessages(prev => [...prev, { sender: "ai", text: t.calculating }]);

    // Submit payload to assessments API
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concern,
          symptoms: [concern], // simplification
          ageGroup: val,
          severity,
          duration,
          patientId,
          language: lang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Remove calculating message
        setMessages(prev => prev.slice(0, -1));
        
        // Add AI Guidance summary message
        setMessages(prev => [...prev, { 
          sender: "ai", 
          text: data.assessment.summary,
          isSummary: true 
        }]);

        // Capture Recommended Dept
        if (data.recommendedDept) {
          setRecommendedDept(data.recommendedDept);
          // Fetch matching doctors from backend
          fetchMatchingDoctors(data.recommendedDept.name);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: "ai", text: "Connection error. Assessment could not be compiled." }]);
    }
  };

  const fetchMatchingDoctors = async (specialtyName: string) => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const allAppointments = await res.json();
        // Since we got list of all appointments, wait, we actually need to get doctors. Let's fetch all doctors or parse them.
        // Actually, we can fetch all doctors, let's see: we can filter from a direct fetch of doctors list.
        // Let's filter doctors by the recommended specialty. In our seed data, we have doctors.
        // Let's fetch them by calling a standard get request to /api/appointments to get the doctor entries, or we can just fetch doctors
        // by parsing the appointments list which includes doctor info, or query `/api/appointments` and extract unique doctors!
        // Wait, `/api/appointments` GET request returns:
        // `const all = await db.appointment.findMany({ include: { patient: { include: { user: true } }, doctor: { include: { user: true } } } });`
        // Wait, that includes doctors! We can map them.
        // Alternatively, we can query matched doctors. In our seed script, we have Dr. Ahmed Bilal (Orthopedics), Dr. Sarah Jenkins (Dermatology), Dr. Michael Chen (Cardiology).
        // Let's fetch the list of doctors by querying /api/appointments and selecting unique doctors, or mapping them in client.
        const appointments = allAppointments;
        const uniqueDoctors: Doctor[] = [];
        const seenIds = new Set();
        
        for (const app of appointments) {
          if (app.doctor && !seenIds.has(app.doctor.id)) {
            seenIds.add(app.doctor.id);
            uniqueDoctors.push({
              id: app.doctor.id,
              name: app.doctor.user.name,
              specialty: app.doctor.specialty,
              consultationFee: app.doctor.consultationFee,
              clinicName: "Metro General Hospital",
              languages: app.doctor.languages,
              rating: app.doctor.rating || 5.0
            });
          }
        }
        
        // Filter by specialty
        const filtered = uniqueDoctors.filter(d => d.specialty.toLowerCase() === specialtyName.toLowerCase());
        setMatchedDoctors(filtered);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetAssessment = () => {
    setStep(0);
    setConcern("");
    setDuration("");
    setSeverity("");
    setAgeGroup("");
    setInputValue("");
    setIsEmergency(false);
    setRecommendedDept(null);
    setMatchedDoctors([]);
    setHasBooked(false);
    setMessages([{ sender: "ai", text: t.welcomeMsg }]);
  };

  const handleOpenBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setBookingError("");
    setBookingSuccess(false);
  };

  const handleCloseBooking = () => {
    setBookingDoctor(null);
    setBookingDate("");
    setBookingReason("");
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setBookingError("Please log in as a patient to schedule appointments.");
      return;
    }
    if (!bookingDate) {
      setBookingError("Please select a date.");
      return;
    }

    setIsBookingSubmitting(true);
    setBookingError("");

    try {
      const dateTimeString = `${bookingDate}T${bookingTime}:00`;
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: bookingDoctor?.id,
          patientId: patientId,
          dateTime: dateTimeString,
          type: bookingType,
          reason: bookingReason,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        setHasBooked(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          handleCloseBooking();
        }, 2500);
      } else {
        const d = await res.json();
        setBookingError(d.error || "Failed to schedule.");
      }
    } catch (err) {
      setBookingError("Error submitting booking.");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const triggerPatientDemoLogin = async () => {
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
        setPatientId(data.user.profileId);
        setBookingError("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/15 min-h-[calc(100vh-4rem)]">
      
      {/* Assessment Wrapper */}
      <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col p-4 md:p-6 space-y-4">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-card border border-border/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground font-display leading-tight">{t.title}</h1>
              <p className="text-xxs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="inline-flex items-center space-x-1.5 border border-border px-3 py-1.5 rounded-full text-xxs font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{lang === "en" ? "Español" : "English"}</span>
            </button>

            {/* Reset Button */}
            {(step > 0) && (
              <button
                onClick={resetAssessment}
                className="p-1.5 border border-border rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                title={t.resetBtn}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Emergency Panel Indicator */}
        {isEmergency && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-4 flex items-start space-x-3.5 shadow-md animate-pulse">
            <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold tracking-wider uppercase">{t.emergencyWarningTitle}</h3>
              <p className="text-xxs leading-relaxed font-semibold">{t.emergencyWarningText}</p>
              <button
                onClick={resetAssessment}
                className="mt-2 text-xxs font-bold border border-destructive/30 hover:bg-destructive/10 px-3 py-1 rounded-md transition-colors"
              >
                {t.emergencyBtn}
              </button>
            </div>
          </div>
        )}

        {/* ── AI Healthcare Journey Tracker ── */}
        {step > 0 && !isEmergency && (
          <CareJourneyTracker
            compact={true}
            title="Your Care Journey"
            steps={buildJourneySteps({
              hasConcern: !!concern,
              hasAssessment: step >= 4,
              recommendedDept: recommendedDept?.name,
              hasMatchedDoctor: matchedDoctors.length > 0,
              hasBooking: hasBooked,
            })}
          />
        )}


        {/* Chat Feed */}
        <div className="flex-1 bg-card border border-border/60 rounded-2xl p-4 md:p-6 shadow-xs overflow-y-auto space-y-4 min-h-[300px] max-h-[500px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : msg.isSummary
                    ? "bg-muted/40 border border-border/40 text-foreground font-normal prose prose-xs max-w-full"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.isSummary ? (
                  <div className="whitespace-pre-line space-y-3">
                    {msg.text}
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Animated voice recording simulation wave */}
          {isRecording && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 space-y-2 max-w-[80%]">
                <div className="flex items-center space-x-2 text-xxs font-semibold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span>{voicePulseText}</span>
                </div>
                {/* Visual equalizer wave */}
                <div className="flex items-end justify-center space-x-1.5 h-6 px-4">
                  <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: "0.1s" }} />
                  <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: "0.3s" }} />
                  <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: "0.4s" }} />
                  <div className="w-1 bg-primary rounded-full animate-wave" style={{ animationDelay: "0.5s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic User Intake Choices Options Panel */}
        {step > 0 && step < 4 && (
          <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-xxs uppercase tracking-wider text-muted-foreground font-bold">
              {step === 1 ? t.durationPrompt : step === 2 ? t.severityPrompt : t.agePrompt}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {/* Duration Options */}
              {step === 1 && (
                <>
                  <button
                    onClick={() => handleSelectDuration(lang === "en" ? "Less than 24 hours" : "Menos de 24 horas")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Less than 24 hours" : "Menos de 24 horas"}
                  </button>
                  <button
                    onClick={() => handleSelectDuration(lang === "en" ? "1-3 Days" : "1-3 Días")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "1-3 Days" : "1-3 Días"}
                  </button>
                  <button
                    onClick={() => handleSelectDuration(lang === "en" ? "4-7 Days" : "4-7 Días")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "4-7 Days" : "4-7 Días"}
                  </button>
                  <button
                    onClick={() => handleSelectDuration(lang === "en" ? "1+ Weeks" : "1+ Semanas")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "1+ Weeks" : "1+ Semanas"}
                  </button>
                </>
              )}

              {/* Severity Options */}
              {step === 2 && (
                <>
                  <button
                    onClick={() => handleSelectSeverity("LOW")}
                    className="bg-muted hover:bg-green-500 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Low Discomfort" : "Bajo malestar"}
                  </button>
                  <button
                    onClick={() => handleSelectSeverity("MEDIUM")}
                    className="bg-muted hover:bg-yellow-500 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Medium / Tolerable" : "Medio / Tolerable"}
                  </button>
                  <button
                    onClick={() => handleSelectSeverity("HIGH")}
                    className="bg-muted hover:bg-red-500 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "High / Intense" : "Alto / Intenso"}
                  </button>
                </>
              )}

              {/* Age group Options */}
              {step === 3 && (
                <>
                  <button
                    onClick={() => handleSelectAgeGroup("0-17")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Child (0-17)" : "Niño (0-17)"}
                  </button>
                  <button
                    onClick={() => handleSelectAgeGroup("18-25")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Young Adult (18-25)" : "Joven Adulto (18-25)"}
                  </button>
                  <button
                    onClick={() => handleSelectAgeGroup("26-64")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Adult (26-64)" : "Adulto (26-64)"}
                  </button>
                  <button
                    onClick={() => handleSelectAgeGroup("65+")}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    {lang === "en" ? "Senior (65+)" : "Adulto Mayor (65+)"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input Bar (Step 0) */}
        {step === 0 && (
          <form onSubmit={handleSendInitial} className="flex items-center space-x-2 bg-card border border-border/60 rounded-full p-2 pl-4 pr-2 shadow-xs">
            <input
              type="text"
              placeholder={t.placeholder}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-transparent border-0 text-xs focus:outline-none focus:ring-0 placeholder:text-muted-foreground/75"
              required
            />
            
            {/* Mic Simulation Button */}
            <button
              type="button"
              onClick={triggerVoiceSimulation}
              className={`p-2.5 rounded-full transition-colors ${
                isRecording 
                  ? "bg-destructive text-white animate-pulse" 
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
              title={t.micTooltip}
            >
              {isRecording ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/95 p-2.5 rounded-full transition-all shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Match Doctors Panel (Once Complete) */}
        {step === 4 && matchedDoctors.length > 0 && (
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-md space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t.matchTitle}
                </h2>
                <p className="text-xxs text-muted-foreground leading-normal">{t.matchSubtitle}</p>
              </div>
              {recommendedDept && (
                <span className="shrink-0 text-xxs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                  {recommendedDept.name}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {matchedDoctors.map((doc) => (
                <div 
                  key={doc.id}
                  className="group p-5 border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all bg-gradient-to-r from-transparent to-primary/2"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Doctor avatar + info */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                        {doc.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground font-display">{doc.name}</p>
                        <p className="text-xxs text-primary font-semibold">{doc.specialty}</p>
                        {/* Star rating */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.round(doc.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                          ))}
                          <span className="text-xxs text-muted-foreground ml-1">{doc.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book button */}
                    <button
                      onClick={() => handleOpenBooking(doc)}
                      className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 text-xxs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 group-hover:shadow-sm"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {t.bookBtn}
                    </button>
                  </div>

                  {/* Details Row */}
                  <div className="mt-4 flex flex-wrap gap-3 text-xxs text-muted-foreground">
                    <span className="flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-full">
                      <Phone className="h-3 w-3" />
                      ${doc.consultationFee} fee
                    </span>
                    <span className="flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-full">
                      <MapPin className="h-3 w-3" />
                      {doc.clinicName}
                    </span>
                    {doc.languages && (
                      <span className="flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-full">
                        <Languages className="h-3 w-3" />
                        {doc.languages}
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-semibold">
                      <CheckCircle className="h-3 w-3" />
                      AI Matched
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Safe Guest Assessment Warning */}
            {!patientId && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex justify-between items-center gap-4 text-xxs text-yellow-800 leading-normal">
                <span>{t.guestAlert}</span>
                <Link
                  href="/login"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-3.5 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  {t.loginLink}
                </Link>
              </div>
            )}

            {/* Post-assessment CTA: view full journey */}
            {hasBooked && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fade-in">
                <div>
                  <p className="text-sm font-bold text-foreground font-display">Appointment Booked!</p>
                  <p className="text-xxs text-muted-foreground mt-0.5">View your full care journey and consultation brief in your dashboard.</p>
                </div>
                <Link href="/patient/dashboard" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/95 text-xxs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5">
                  My Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}


      </div>

      {/* Booking Modal inside Chat */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-foreground font-display">Schedule Appointment</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Booking with {bookingDoctor.name}</p>
              </div>
              <button 
                onClick={handleCloseBooking}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4 animate-pulse">
                <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                <h4 className="text-base font-bold text-foreground font-display">{t.bookingDone}</h4>
                <p className="text-xxs text-muted-foreground">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-4">
                
                {/* Not logged in */}
                {!patientId && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl space-y-3">
                    <p className="text-xxs text-yellow-800 leading-normal flex gap-2">
                      <HelpCircle className="h-4.5 w-4.5 shrink-0" />
                      You must be signed in as a Patient to schedule consultations.
                    </p>
                    <button
                      type="button"
                      onClick={triggerPatientDemoLogin}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      {t.quickLogin}
                    </button>
                  </div>
                )}

                {/* Consultation Type */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-bold text-muted-foreground uppercase">{t.consultType}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingType("VIDEO")}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xxs font-semibold transition-all ${
                        bookingType === "VIDEO" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Video className="h-4.5 w-4.5" />
                      <span>Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("IN_PERSON")}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xxs font-semibold transition-all ${
                        bookingType === "IN_PERSON" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Users className="h-4.5 w-4.5" />
                      <span>In-Person</span>
                    </button>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">{t.selectDate}</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">{t.selectTime}</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-bold text-muted-foreground uppercase">Reason/Notes</label>
                  <textarea
                    placeholder={t.reasonPlaceholder}
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={2}
                    className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-1.5 focus:outline-none"
                  />
                </div>

                {/* Booking error details */}
                {bookingError && (
                  <p className="text-xxs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
                    {bookingError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!patientId || isBookingSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold py-2.5 rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span>{t.confirmBtn}</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
