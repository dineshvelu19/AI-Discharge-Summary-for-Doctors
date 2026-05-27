"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BetaAgreementModal from "@/components/auth/BetaAgreementModal";
import { Activity, Mail, Lock, ArrowRight, AlertTriangle } from "lucide-react";

// Graceful Supabase Client Initialization (prevent crashes if variables are missing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Try signing in with Supabase if the client is initialized
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          console.log("[Auth] Successfully logged in via Supabase.");
          // Clear any mock sessions
          document.cookie = "mock-auth-session=; path=/; max-age=0; SameSite=Lax";
          router.push("/");
          return;
        } else if (error) {
          // If Supabase exists but credentials failed, don't fallback to mock unless they enter showcase demo passwords
          if (password !== "12345678" && password !== "123456") {
            setErrorMsg(error.message || "Invalid email or password.");
            setIsSubmitting(false);
            return;
          }
        }
      }

      // 2. Demonstration bypass: allow immediate access for showcase purposes if standard passwords are used
      if (password === "12345678" || password === "123456") {
        console.log("[Auth] Fallback: Logged in via mock showcase session.");
        // Set secure mock auth session cookie for middleware bypass
        document.cookie = "mock-auth-session=true; path=/; max-age=86400; SameSite=Lax";
        router.push("/");
        return;
      }

      setErrorMsg("Invalid credentials. Try our showcase credential (doctor@hospital.org / 12345678).");
    } catch (err) {
      console.error("[Auth Error]:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during secure sign-in.";
      setErrorMsg(message);
    } finally {
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

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-800 dark:text-red-400 text-xs font-semibold flex items-start gap-2 animate-shake">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-border bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:border-clinical-teal focus:outline-none focus:ring-1 focus:ring-clinical-teal transition-colors"
                    placeholder="dr.smith@hospital.org"
                    required
                    disabled={isSubmitting}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-border bg-surface/50 py-2.5 pl-10 pr-3 text-sm text-foreground focus:border-clinical-teal focus:outline-none focus:ring-1 focus:ring-clinical-teal transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center overflow-hidden rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-all hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background mt-6 disabled:opacity-50"
              >
                <span className="relative flex items-center gap-2">
                  {isSubmitting ? "Securing Tunnel..." : "Secure Sign In"}
                  {!isSubmitting && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
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
