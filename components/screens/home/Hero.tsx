"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import axiosInstance from "@/components/config/AxiosInstance";
import heroData from "@/data/hero.json";

// ── Types ──────────────────────────────────────────────────────────────────
interface Banner {
  id: number;
  image: string;
  textPosition: "left" | "right";
  showContent: boolean;
  badge: string | null;
  headline: string | null;
  headlineBold: string | null;
  headlineSuffix: string | null;
  couponLabel: string | null;
  couponCode: string | null;
  couponSuffix: string | null;
  discountText: string | null;
  discountSuffix: string | null;
  cta: string | null;
  ctaLink: string | null;
  bgGradient: string | null;
}

interface Category {
  id: string | number;
  slug: string;
  name: string;
  image: string;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Main Component ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const banners = heroData.banners as Banner[];
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axiosInstance
      .get(`public/categories/`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);

const goTo = useCallback(
  (dir: "left" | "right", targetIndex?: number) => {
    if (isAnimating) return;

    setDirection(dir);
    setIsAnimating(true);

    // 👉 change slide instantly
    setCurrentSlide((prev) => {
      if (targetIndex !== undefined) return targetIndex;
      if (dir === "right") return (prev + 1) % banners.length;
      return (prev - 1 + banners.length) % banners.length;
    });

    // 👉 only control animation timing
    setTimeout(() => {
      setIsAnimating(false);
    }, 380);
  },
  [isAnimating, banners.length]
);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goTo("right"), 4500);
  }, [goTo]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNav = (dir: "left" | "right", idx?: number) => {
    goTo(dir, idx);
    resetTimer();
  };

  const scrollCats = (dir: "left" | "right") => {
    catScrollRef.current?.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  const banner = banners[currentSlide];
  const hasText = banner.headline || banner.headlineBold || banner.headlineSuffix;
  const hasCoupon = banner.couponCode && banner.discountText;
  const hasCTA = banner.cta && banner.ctaLink;

  const contentVisible = banner.showContent || hovered;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .hero-section * { font-family: 'Nunito', sans-serif; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-right { animation: slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .slide-left  { animation: slideInLeft  0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }

        .dot-pill { transition: all 0.25s ease; }
        .dot-pill.active { width: 24px; border-radius: 6px; background: #14b8a6; }

        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .cat-circle { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cat-card:hover .cat-circle { transform: scale(1.09); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }

        .banner-overlay {
          transition: opacity 0.35s ease;
        }
        .content-panel {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .content-panel.hidden-content {
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
        }
        .content-panel.visible-content {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>

      <section className="hero-section w-full bg-white px-4 md:px-6 py-4 mx-auto">

        <div
          className="relative w-full rounded-2xl overflow-hidden select-none"
          style={{ height: "420px" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* BG Image */}
          <div
            key={`bg-${currentSlide}`}
            className={`absolute inset-0 ${isAnimating ? (direction === "right" ? "slide-right" : "slide-left") : ""}`}
          >
            <Image
              src={banner.image}
              alt={banner.headlineBold ?? `Banner ${banner.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-center"
              priority
            />

            <div
              className="absolute inset-0 banner-overlay"
              style={{
                opacity: contentVisible ? 1 : 0,
                background:
                  banner.textPosition === "left"
                    ? "linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)"
                    : "linear-gradient(to left, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)",
              }}
            />
          </div>

          <div
            key={`content-${currentSlide}`}
            className={`absolute inset-0 flex items-center content-panel ${contentVisible ? "visible-content" : "hidden-content"
              } ${banner.textPosition === "left"
                ? "justify-start pl-10 md:pl-16"
                : "justify-end pr-10 md:pr-16"
              }`}
          >
            <div className="flex flex-col max-w-xs md:max-w-sm">

              {/* Badge */}
              {banner.badge && (
                <span
                  className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 fade-up"
                  style={{ animationDelay: "0s" }}
                >
                  {banner.badge}
                </span>
              )}

              {/* Headline */}
              {hasText && (
                <div className="mb-4 fade-up" style={{ animationDelay: "0.06s" }}>
                  {banner.headline && (
                    <p className="text-white text-3xl md:text-4xl font-light leading-tight drop-shadow-lg">
                      {banner.headline}
                    </p>
                  )}
                  {banner.headlineBold && (
                    <p className="text-white text-4xl md:text-5xl font-black leading-tight drop-shadow-lg">
                      {banner.headlineBold}
                    </p>
                  )}
                  {banner.headlineSuffix && (
                    <p className="text-white text-3xl md:text-4xl font-light leading-tight drop-shadow-lg">
                      {banner.headlineSuffix}
                    </p>
                  )}
                </div>
              )}

              {/* Divider */}
              {hasText && (hasCoupon || hasCTA) && (
                <div
                  className="w-40 h-px bg-white/50 mb-4 fade-up"
                  style={{ animationDelay: "0.12s" }}
                />
              )}

              {/* Coupon */}
              {hasCoupon && (
                <>
                  <div
                    className="flex flex-wrap items-center gap-2 mb-2 fade-up"
                    style={{ animationDelay: "0.18s" }}
                  >
                    {banner.couponLabel && (
                      <span className="text-white text-sm font-semibold drop-shadow">
                        {banner.couponLabel}
                      </span>
                    )}
                    <span className="bg-yellow-300 text-gray-800 text-sm font-black px-2 py-0.5 rounded shadow">
                      &quot;{banner.couponCode}&quot;
                    </span>
                    {banner.couponSuffix && (
                      <span className="text-white text-sm font-semibold drop-shadow">
                        {banner.couponSuffix}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex flex-wrap items-center gap-2 mb-5 fade-up"
                    style={{ animationDelay: "0.24s" }}
                  >
                    <span className="bg-yellow-400 text-gray-900 text-sm font-black px-3 py-1 rounded shadow">
                      {banner.discountText}
                    </span>
                    {banner.discountSuffix && (
                      <span className="text-white text-sm font-bold drop-shadow">
                        {banner.discountSuffix}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* CTA */}
              {hasCTA && (
                <a
                  href={banner.ctaLink!}
                  className="inline-flex items-center gap-2 bg-white text-teal-600 font-black text-sm px-6 py-3 rounded-full w-fit shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 fade-up"
                  style={{ animationDelay: hasCoupon ? "0.3s" : "0.18s" }}
                >
                  {banner.cta}
                  <ChevronRight />
                </a>
              )}
            </div>
          </div>

          {/* Prev arrow */}
          <button
            onClick={() => handleNav("left")}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          {/* Next arrow */}
          <button
            onClick={() => handleNav("right")}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => handleNav(i > currentSlide ? "right" : "left", i)}
                className={`dot-pill h-2.5 rounded-full border-none cursor-pointer ${i === currentSlide
                    ? "active w-6 bg-teal-500"
                    : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Categories ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Categories</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCats("left")}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50 transition-all"
                aria-label="Scroll categories left"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => scrollCats("right")}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50 transition-all"
                aria-label="Scroll categories right"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div ref={catScrollRef} className="cat-scroll flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="cat-card flex-shrink-0 flex flex-col items-center gap-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md rounded-xl px-4 py-4 w-[130px] transition-all duration-200 group cursor-pointer"
              >
                <div className="cat-circle w-16 h-16 rounded-full flex items-center justify-center shadow-sm overflow-hidden relative bg-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-gray-300 text-[10px]">No Img</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                  {cat.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}