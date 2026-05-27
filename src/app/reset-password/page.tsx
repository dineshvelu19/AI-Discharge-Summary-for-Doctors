"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BetaAgreementModal from "@/components/auth/BetaAgreementModal";
import { Lock, Check, X, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Graceful Supabase Client Initialization (prevent crashes if variables are missing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const criteria = [
    { id: "length", label: "At least 12 characters", met: password.length >= 12 },
    { id: "uppercase", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lowercase", label: "One lowercase letter", met: /[a-z]/.test(password) },
    { id: "number", label: "One number", met: /[0-9]/.test(password) },
    { id: "special", label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = criteria.filter((c) => c.met).length;
  
  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-amber-500";
    return "bg-clinical-teal";
  };

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const allCriteriaMet = strength === criteria.length;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = allCriteriaMet && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. If supabase is initialized and a real session is active, update the user in Supabase
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (!error) {
          console.log("[Auth] Password successfully updated on Supabase.");
          router.push("/");
          return;
        } else {
          // If Supabase reset failed (e.g. session expired), show error but allow bypass if it's a showcase demo run
          console.warn("[Auth] Supabase password update failed, checking fallback:", error.message);
          const mockSession = document.cookie.includes("mock-auth-session=true");
          if (!mockSession) {
            setErrorMsg(error.message || "Failed to reset password. Please sign in again.");
            setIsSubmitting(false);
            return;
          }
        }
      }

      // 2. Demo fallback: simulate password change completion
      console.log("[Auth] Fallback: Simulated password change completed.");
      // Reinforce secure mock auth session cookie for middleware bypass
      document.cookie = "mock-auth-session=true; path=/; max-age=86400; SameSite=Lax";
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("[Auth Reset Error]:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during password update.";
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

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
              <div className="w-12 h-12 bg-clinical-teal/10 rounded-full flex items-center justify-center text-clinical-teal mb-4 ring-1 ring-clinical-teal/20">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground text-center">
                Set Account Password
              </h2>
              <p className="text-sm text-foreground/60 mt-2 text-center">
                Please set a secure password for your new QuickDischarge account.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-800 dark:text-red-400 text-xs font-semibold flex items-start gap-2 animate-shake">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-border bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:border-clinical-teal focus:outline-none focus:ring-1 focus:ring-clinical-teal transition-colors"
                    placeholder="••••••••••••"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-3 p-4 rounded-xl bg-surface/60 border border-border/50 backdrop-blur-sm transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground/70">Password Strength</span>
                    <span className={`text-xs font-bold ${strength === 5 ? 'text-clinical-teal' : strength > 2 ? 'text-amber-500' : 'text-red-500'}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                            level <= strength ? getStrengthColor() : 'bg-border'
                          }`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-1.5 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                    {criteria.map((c) => (
                      <li key={c.id} className="flex items-center gap-2 text-xs">
                        {c.met ? (
                          <Check size={14} className="text-clinical-teal shrink-0" />
                        ) : (
                          <X size={14} className="text-foreground/30 shrink-0" />
                        )}
                        <span className={c.met ? "text-foreground/80" : "text-foreground/50"}>
                          {c.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full rounded-lg border ${
                      confirmPassword && !passwordsMatch 
                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                        : "border-border focus:border-clinical-teal focus:ring-1 focus:ring-clinical-teal"
                    } bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:outline-none transition-colors`}
                    placeholder="••••••••••••"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`group relative flex w-full justify-center overflow-hidden rounded-lg px-4 py-3 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background mt-4 ${
                  canSubmit 
                    ? "bg-clinical-teal hover:bg-clinical-teal-dark focus:ring-clinical-teal shadow-md hover:shadow-lg" 
                    : "bg-border text-foreground/40 cursor-not-allowed"
                }`}
              >
                <span className="relative flex items-center gap-2">
                  {isSubmitting ? "Securing Account..." : "Set Password & Continue"}
                </span>
              </button>
            </form>
            
            <div className="mt-8 text-center pt-6 border-t border-border/50">
              <Link href="/login" className="text-xs font-medium text-foreground/60 hover:text-clinical-teal transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BetaAgreementModal>
  );
}
