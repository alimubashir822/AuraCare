"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; profileId?: string } | null>(null);

  // Check user session
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]); // Check session whenever the path changes

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "PATIENT") return "/patient/dashboard";
    if (user.role === "DOCTOR") return "/doctor/dashboard";
    if (user.role === "CLINIC_ADMIN") return "/clinic/dashboard";
    return "/";
  };

  const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Departments", href: "/departments" },
    { label: "Find Doctors", href: "/doctors" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-primary">
              <HeartPulse className="h-7 w-7 stroke-[2.5]" />
              <span className="text-xl font-bold tracking-tight text-foreground font-display">
                Aura<span className="text-primary">Care</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={getDashboardLink()}
                  className="inline-flex items-center space-x-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3.5 py-1.5 rounded-full transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-2 pl-2 border-l border-border">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Start AI Assessment
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted ${
                pathname === link.href ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border mt-4 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
                  </div>
                </div>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 bg-primary/10 text-primary hover:bg-primary/20 py-2.5 rounded-full font-semibold transition-all text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center space-x-2 border border-destructive/20 text-destructive hover:bg-destructive/10 py-2.5 rounded-full font-semibold transition-all text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center border border-border text-foreground hover:bg-muted py-2.5 rounded-full font-semibold transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/assessment"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-full font-semibold transition-all text-sm shadow-sm"
                >
                  Start AI Assessment
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
