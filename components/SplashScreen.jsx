"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../public/icons/logo.png";

export default function SplashScreen({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry?.type;

    const isInternalNav =
      document.referrer && document.referrer.includes(window.location.origin);

    // ❌ Skip ONLY internal navigation
    if (navType === "navigate" && isInternalNav) {
      setLoading(false);
      return;
    }

    // ✅ Show splash (first visit + reload)
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 20;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          setLoading(false);
        }, 300);
      }

      setProgress(value);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        {/* Logo with Shine Effect */}
        <div className="relative w-28 h-28 overflow-hidden">
          <Image
            src={Logo}
            alt="logo"
            fill
            className="object-contain"
            priority
          />

          {/* Shine animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="shine" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-56 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="mt-3 text-xs text-gray-500 font-medium">
          {Math.floor(progress)}%
        </p>

        {/* Styles */}
        <style jsx>{`
          .shine {
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent,
              rgba(255, 255, 255, 0.7),
              transparent
            );
            animation: shineMove 2s infinite;
          }

          @keyframes shineMove {
            0% {
              left: -75%;
            }
            100% {
              left: 125%;
            }
          }
        `}</style>
      </div>
    );
  }

  return children;
}
