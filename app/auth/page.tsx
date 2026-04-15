"use client";

import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import axiosPublic from "@/components/config/AxiosPublic";

export default function AuthPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) return;
    setGoogleLoading(true);
    setError("");
    try {
      await axiosPublic.post(
        "register/google-login/",
        { token },
        { withCredentials: true }
      );
      await login(); 
      router.replace("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .auth-page { font-family: 'DM Sans', sans-serif; }

        .auth-page .teal-orb-1 {
          position: fixed; top: -120px; right: -80px;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, #99f6e4 0%, #2dd4bf 40%, transparent 70%);
          opacity: 0.25; pointer-events: none;
        }
        .auth-page .teal-orb-2 {
          position: fixed; bottom: -100px; left: -60px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, #5eead4 0%, #0d9488 50%, transparent 70%);
          opacity: 0.18; pointer-events: none;
        }
        .auth-page .teal-orb-3 {
          position: fixed; top: 40%; left: 10%;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, #ccfbf1 0%, transparent 70%);
          opacity: 0.4; pointer-events: none;
        }

        .auth-page .card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(20, 184, 166, 0.18);
          border-radius: 28px;
          box-shadow:
            0 4px 24px rgba(13, 148, 136, 0.08),
            0 1px 2px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .auth-page .brand-ring {
          width: 82px; height: 82px;
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
        }

        .auth-page .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(13,148,136,0.2), transparent);
        }

        .auth-page .google-wrap {
          width: 100%;
        }
        .auth-page .google-wrap > div { width: 100% !important; }
        .auth-page .google-wrap iframe { width: 100% !important; }

        .auth-page .trust-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(204, 251, 241, 0.5);
          border: 1px solid rgba(20,184,166,0.2);
          border-radius: 99px;
          font-size: 11px;
          color: #0f766e;
          font-weight: 500;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-page .animate-card  { animation: fadeUp 0.5s ease both; }
        .auth-page .animate-card2 { animation: fadeUp 0.5s ease 0.08s both; }
        .auth-page .animate-card3 { animation: fadeUp 0.5s ease 0.16s both; }

        .auth-page .error-box {
          display: flex; align-items: center; gap: 10px;
          background: #fff1f1; border: 1px solid #fecaca;
          border-radius: 14px; padding: 12px 16px;
          color: #b91c1c; font-size: 13px;
        }

        .auth-page .loading-btn {
          width: 100%; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          display: flex; align-items: center; justify-content: center;
          gap: 10px; color: white;
          font-size: 14px; font-weight: 500;
          border: none; cursor: not-allowed;
        }
      `}</style>

      <main
        className="auth-page min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(135deg, #f0fdfb 0%, #e6fffa 50%, #f0faf7 100%)" }}
      >
        <div className="teal-orb-1" />
        <div className="teal-orb-2" />
        <div className="teal-orb-3" />

        <div className="relative w-full max-w-sm flex flex-col items-center gap-8">

          

          {/* Card */}
          <div className="card animate-card2 w-full px-8 py-9 flex flex-col items-center gap-6">
              <div className="animate-card flex flex-col items-center gap-4 text-center">
            <div className="brand-ring">
              <img src="/icons/logo.png" alt="logo" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#0f172a", lineHeight: 1.2, margin: 0 }}>
                Welcome
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b", marginTop: "6px" }}>
                Sign in to your account to continue with
              </p>
            </div>
          </div>

            {/* Error */}
            {error && (
              <div className="error-box w-full">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Google button */}
            {googleLoading ? (
              <div className="loading-btn w-full">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing you in…
              </div>
            ) : (
              <div className="google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  width="320"
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  logo_alignment="center"
                />
              </div>
            )}

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
              <div className="divider-line" />
              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>
                fast · safe · no password
              </span>
              <div className="divider-line" />
            </div>

            
          </div>

          {/* Footer */}
          <p className="animate-card3" style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
            By continuing, you agree to our{" "}
            <a href="/terms" style={{ color: "#0d9488", textDecoration: "none" }}>Terms</a>{" "}
            &amp;{" "}
            <a href="/privacy" style={{ color: "#0d9488", textDecoration: "none" }}>Privacy Policy</a>
          </p>

        </div>
      </main>
    </>
  );
}