"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, Key, Mail, ShieldCheck, User, Users, Loader2 } from "lucide-react";
import Link from "next/link";

// Inner component that uses useSearchParams — must be wrapped in Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  // Normal Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.user;
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (user.role === "PATIENT") {
          router.push("/patient/dashboard");
        } else if (user.role === "DOCTOR") {
          router.push("/doctor/dashboard");
        } else if (user.role === "CLINIC_ADMIN") {
          router.push("/clinic/dashboard");
        }
      } else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: roleEmail, password: "password" }),
      });
      const data = await res.json();
      if (res.ok) {
        const user = data.user;
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (user.role === "PATIENT") {
          router.push("/patient/dashboard");
        } else if (user.role === "DOCTOR") {
          router.push("/doctor/dashboard");
        } else if (user.role === "CLINIC_ADMIN") {
          router.push("/clinic/dashboard");
        }
      } else {
        setErrorMsg(data.error || "Quick login failed");
      }
    } catch {
      setErrorMsg("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        
        <Link href="/" className="inline-flex items-center space-x-2 text-primary">
          <HeartPulse className="h-9 w-9 stroke-[2.5]" />
          <span className="text-2xl font-bold tracking-tight text-foreground font-display">
            Aura<span className="text-primary">Care</span>
          </span>
        </Link>
        
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
          Portal Sign In
        </h2>
        <p className="text-xs text-muted-foreground">
          Log in to manage appointments, histories, and dashboards.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card py-8 px-4 border border-border/60 rounded-2xl shadow-lg sm:px-10 space-y-6">
          
          {/* Quick Logins Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-xxs uppercase tracking-wider text-muted-foreground font-bold text-center">
              Developer Quick-Login Shortcuts
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin("patient@demo.com")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center space-y-1.5 disabled:opacity-50"
              >
                <User className="h-4.5 w-4.5 text-primary" />
                <span className="text-xxs font-bold">Patient</span>
              </button>
              
              <button
                onClick={() => handleQuickLogin("doctor@demo.com")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border hover:border-secondary hover:bg-secondary/5 transition-all text-center space-y-1.5 disabled:opacity-50"
              >
                <Users className="h-4.5 w-4.5 text-secondary" />
                <span className="text-xxs font-bold">Doctor</span>
              </button>
              
              <button
                onClick={() => handleQuickLogin("admin@demo.com")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-center space-y-1.5 disabled:opacity-50"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
                <span className="text-xxs font-bold">Admin</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-4 text-xxs text-muted-foreground uppercase font-bold">Or Enter Details</span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs rounded-lg border border-border bg-background px-3.5 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
                <Key className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

          </form>

        </div>
      </div>
      
      {/* Decorative */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.03),transparent_50%)] pointer-events-none" />
    </div>
  );
}

// Outer page component wraps the form in Suspense (required by Next.js 15 for useSearchParams)
export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
