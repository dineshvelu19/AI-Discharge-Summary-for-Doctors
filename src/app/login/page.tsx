import BetaAgreementModal from "@/components/auth/BetaAgreementModal";
import { Activity, Mail, Lock, ArrowRight } from "lucide-react";


export default function LoginPage() {
  return (
    <BetaAgreementModal>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-clinical-teal-light/30 blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-primary-100/40 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-clinical-teal/10 blur-3xl animate-blob animation-delay-500"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="glass-card p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-clinical-teal to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-clinical-teal/20">
                <Activity size={32} strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground text-center">
                QuickDischarge <span className="text-clinical-teal text-xl align-super">2.0</span>
              </h1>
              <p className="text-sm text-foreground/60 mt-2 text-center">
                Clinical intelligence for modern healthcare
              </p>
            </div>

            <form className="space-y-5" action="/reset-password">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80" htmlFor="email">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-lg border border-border bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:border-clinical-teal focus:outline-none focus:ring-1 focus:ring-clinical-teal transition-colors"
                    placeholder="dr.smith@hospital.org"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground/80" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-clinical-teal hover:text-clinical-teal-dark transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="block w-full rounded-lg border border-border bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:border-clinical-teal focus:outline-none focus:ring-1 focus:ring-clinical-teal transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group relative flex w-full justify-center overflow-hidden rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-all hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background mt-6"
              >
                <span className="relative flex items-center gap-2">
                  Secure Sign In
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </form>

            <div className="mt-8 border-t border-border/50 pt-6">
              <p className="text-xs text-center text-foreground/50">
                Protected by enterprise-grade encryption. HIPAA compliant infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BetaAgreementModal>
  );
}
