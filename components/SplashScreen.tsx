"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 20; // random smooth progress
      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          setLoading(false);
        }, 300); // small delay for smooth finish
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
            src="/icons/logo.png"
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
        <div className="mt-8 w-56 h-2 bg-gray-200 rounded-full overflow-hidden">
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