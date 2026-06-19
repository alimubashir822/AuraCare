"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieIcon, 
  Plus, 
  Stethoscope, 
  Star,
  CheckCircle,
  FileText
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  rating: number;
  clinicName: string;
  status: string;
}

interface ClinicDashboardClientProps {
  totalLeads: number;
  totalConversions: number;
  doctors: Doctor[];
  deptData: { name: string; value: number }[];
  trendData: { month: string; Leads: number; Conversions: number }[];
}

export default function ClinicDashboardClient({
  totalLeads,
  totalConversions,
  doctors: initialDoctors,
  deptData,
  trendData,
}: ClinicDashboardClientProps) {
  // Hydration safe check for Recharts
  const [mounted, setMounted] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  
  // Tab states
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "doctors">("analytics");
  
  // Add Doctor Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("General Medicine");
  const [newDocExp, setNewDocExp] = useState(5);
  const [newDocFee, setNewDocFee] = useState(50);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const conversionRate = totalLeads > 0 
    ? ((totalConversions / totalLeads) * 100).toFixed(0) 
    : "0";

  // Recharts colors
  const COLORS = ["#0d9488", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const mockDoc: Doctor = {
      id: Math.random().toString(),
      name: newDocName,
      email: `${newDocName.toLowerCase().replace(/ /g, ".")}@clinic.com`,
      specialty: newDocSpecialty,
      experience: Number(newDocExp),
      consultationFee: Number(newDocFee),
      rating: 5.0,
      clinicName: "Metro Care Center",
      status: "ACTIVE",
    };

    setDoctors(prev => [...prev, mockDoc]);
    setFormSuccess(true);
    setNewDocName("");
    
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
          <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Total Intake Leads</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalLeads}</p>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
          <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Matched Conversions</p>
          <p className="text-2xl font-bold text-secondary mt-1">{totalConversions}</p>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
          <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Intake Conversion Rate</p>
          <p className="text-2xl font-bold text-primary mt-1">{conversionRate}%</p>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-xxs">
          <p className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold">Managed Specialists</p>
          <p className="text-2xl font-bold text-foreground mt-1">{doctors.length}</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60">
        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === "analytics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Clinic Analytics
        </button>
        <button
          onClick={() => setActiveSubTab("doctors")}
          className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === "doctors"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Staff & Doctor Directory ({doctors.length})
        </button>
      </div>

      {/* Tab Contents: Analytics */}
      {activeSubTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Trend Chart (Leads vs Conversions) */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Patient Acquisition Trend (Leads vs Bookings)
            </h3>
            
            <div className="h-[250px] w-full pt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "8px", fontSize: "11px", borderColor: "#e2e8f0" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Conversions" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
              )}
            </div>
          </div>

          {/* Specialty Load distribution */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-display flex items-center gap-1.5">
              <PieIcon className="h-4.5 w-4.5 text-primary" />
              Specialty Load Distribution (AI Suggested Depts)
            </h3>

            <div className="min-h-[250px] h-auto md:h-[250px] w-full pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
              {mounted ? (
                <>
                  <div className="h-[200px] w-[200px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deptData.length > 0 ? deptData : [{ name: "General Medicine", value: 1 }]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(deptData.length > 0 ? deptData : [{ name: "General Medicine", value: 1 }]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend list */}
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 pl-0 md:pl-4 pt-4 md:pt-0 text-xxs text-muted-foreground w-full">
                    {deptData.map((d, idx) => (
                      <div key={d.name} className="flex items-center space-x-2">
                        <span 
                          className="h-2.5 w-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                        />
                        <span className="truncate">{d.name} ({d.value})</span>
                      </div>
                    ))}
                    {deptData.length === 0 && (
                      <p className="text-xxs italic">No assessment load mapped. Seed data.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab Contents: Doctors Directory list */}
      {activeSubTab === "doctors" && (
        <div className="space-y-6">
          
          {/* Header & Trigger */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-foreground font-display">Specialist Staff Log</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/95 text-xxs font-bold px-3.5 py-2 rounded-full transition-all shadow-xs flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Specialist</span>
            </button>
          </div>

          {/* Add Doctor Form */}
          {showAddForm && (
            <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-md max-w-lg animate-fade-in">
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <h4 className="text-xs font-bold text-foreground font-display">Simulate Specialist Registration</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Allison Vance"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">Specialty</label>
                    <select
                      value={newDocSpecialty}
                      onChange={(e) => setNewDocSpecialty(e.target.value)}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="ENT Specialist">ENT Specialist</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">Experience (Years)</label>
                    <input
                      type="number"
                      value={newDocExp}
                      onChange={(e) => setNewDocExp(Number(e.target.value))}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                      min={1}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold text-muted-foreground uppercase">Consultation Fee ($)</label>
                    <input
                      type="number"
                      value={newDocFee}
                      onChange={(e) => setNewDocFee(Number(e.target.value))}
                      className="w-full text-xxs rounded-lg border border-border bg-background px-3 py-2 focus:outline-none"
                      min={10}
                      required
                    />
                  </div>
                </div>

                {formSuccess && (
                  <div className="p-2 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                    <CheckCircle className="h-4 w-4" />
                    <span>Specialist Registered Successfully!</span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-border text-muted-foreground hover:bg-muted text-xxs font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/95 text-xxs font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    Register Provider
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="border border-border/60 bg-card rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 font-display text-muted-foreground uppercase tracking-wider text-xxs border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Provider Name</th>
                    <th className="px-6 py-3.5 font-bold">Specialty</th>
                    <th className="px-6 py-3.5 font-bold">Exp</th>
                    <th className="px-6 py-3.5 font-bold">Fee</th>
                    <th className="px-6 py-3.5 font-bold">Rating</th>
                    <th className="px-6 py-3.5 font-bold">Roster Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground font-display flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {doc.name.charAt(0)}
                        </div>
                        <span>{doc.name}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-muted-foreground">{doc.specialty}</td>
                      <td className="px-6 py-4 text-foreground font-medium">{doc.experience} Years</td>
                      <td className="px-6 py-4 font-bold text-foreground">${doc.consultationFee}</td>
                      <td className="px-6 py-4 text-yellow-600 font-bold flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{doc.rating.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-500/10 text-green-600 text-xxs font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
