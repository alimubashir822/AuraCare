import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary">
              <HeartPulse className="h-6 w-6 stroke-[2.5]" />
              <span className="text-lg font-bold tracking-tight text-foreground font-display">
                Aura<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Leading the transition from symptom checks to personalized care routing and patient advocacy.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4 font-display">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/assessment" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  AI Assessment
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link href="/departments" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Medical Departments
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4 font-display">
              Resources & Growth
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/resources" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Health Library
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Partner with Clinics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4 font-display">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li className="text-xs text-muted-foreground">
                Email: support@auracare.com
              </li>
              <li className="text-xs text-muted-foreground">
                Phone: (555) 0199-244
              </li>
              <li className="text-xs text-muted-foreground">
                Location: Boston, MA
              </li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer Section */}
        <div className="mt-10 border-t border-border/40 pt-6">
          <div className="rounded-lg bg-destructive/5 border border-destructive/10 p-4">
            <h4 className="text-xs font-bold text-destructive tracking-wide uppercase mb-1">
              Strict Medical Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AuraCare is an AI-powered general educational health navigation platform. <strong>It does not diagnose conditions, prescribe medications, plan medical treatments, or replace professional consultations with qualified healthcare providers.</strong> The guidance provided is intended only to help patients prepare for visits and route themselves to correct departments. <strong>If you are experiencing severe, worsening, or acute life-threatening symptoms (such as intense chest pressure, breathing failure, sudden paralysis, or severe hemorrhaging), please seek immediate professional emergency medical care or call 911 immediately.</strong>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-2">
            <p>&copy; {currentYear} AuraCare Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-border">|</span>
            <p>
              Healthcare system by{" "}
              <a 
                href="http://www.medclinicx.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline font-semibold"
              >
                Med Clinic X
              </a>
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
