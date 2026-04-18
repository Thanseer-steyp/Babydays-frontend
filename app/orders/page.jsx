"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosPrivate from "@/components/config/AxiosPrivate";
import { useAuth } from "@/components/context/AuthContext";

const fmt = (n) => Number(n).toLocaleString("en-IN");
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const DELIVERY = {
  ordered:   { label: "Ordered",   color: "#0d9488", bg: "#f0fdfa", dot: "#14b8a6" },
  shipped:   { label: "Shipped",   color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  delivered: { label: "Delivered", color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
};
const PAYMENT = {
  paid:      { label: "Paid",    color: "#059669", bg: "#ecfdf5" },
  initiated: { label: "Pending", color: "#b45309", bg: "#fef3c7" },
  failed:    { label: "Failed",  color: "#dc2626", bg: "#fef2f2" },
};

/* ─── SkeletonCard ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex overflow-hidden pointer-events-none bg-white rounded-2xl border border-slate-200 shadow-[0_2px_16px_0_rgba(13,148,136,.07),0_1px_3px_rgba(0,0,0,.06)] mb-4">
      {/* skeleton image */}
      <div className="w-[110px] min-w-[110px] min-h-[110px] rounded-none bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
      {/* skeleton body */}
      <div className="flex-1 p-[18px_20px] flex flex-col gap-2.5">
        <div className="h-4 w-[65%] rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
        <div className="h-3 w-[45%] rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
        <div className="h-3 w-[30%] rounded-md bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* OrderCard  */
function OrderCard({ order, idx }) {
  const delivery = DELIVERY[order.delivery_status] ?? DELIVERY.ordered;
  const payment  = PAYMENT[order.payment_status]  ?? PAYMENT.initiated;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .order-card-anim {
          animation: slideUp 0.4s ease both;
        }
      `}</style>

      <article
        className="order-card-anim flex items-center gap-0 m-6 bg-white rounded-2xl border border-slate-200 shadow-[0_2px_16px_0_rgba(13,148,136,.07),0_1px_3px_rgba(0,0,0,.06)] overflow-hidden mb-4 transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_32px_0_rgba(13,148,136,.13),0_2px_8px_rgba(0,0,0,.08)] hover:-translate-y-0.5"
        style={{ animationDelay: `${idx * 80}ms` }}
      >
        {/* Product image */}
        <div className="w-[110px] min-w-[110px] bg-slate-50 border-r border-slate-100 flex items-center justify-center overflow-hidden shrink-0 max-sm:w-20 max-sm:min-w-[80px]">
          {order.product_image ? (
            <img
              src={order.product_image}
              alt={order.product_name}
              className="w-full h-full object-cover min-h-[110px] max-sm:min-h-[80px]"
            />
          ) : (
            <div className="w-full h-full min-h-[110px] max-sm:min-h-[80px] flex items-center justify-center bg-slate-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 pl-5 flex  flex-col gap-2.5 min-w-0 max-sm:p-3 max-sm:pl-3.5">
          {/* Title + badges */}
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-slate-900 leading-snug m-0 mb-1.5">
                {order.product_name}
              </p>
              <div className="flex flex-wrap gap-[5px]">
                {order.size && (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md px-2 py-0.5">
                    Size: {order.size}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md px-2 py-0.5">
                  Qty: {order.qty}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md px-2 py-0.5">
                  #{order.id}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[5px] items-end shrink-0 max-sm:flex-row max-sm:items-center">
              <span
                className="inline-flex items-center gap-[5px] text-[10px] font-extrabold tracking-wide rounded-full px-2.5 py-0.5"
                style={{ color: delivery.color, background: delivery.bg }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: delivery.dot }}
                />
                {delivery.label}
              </span>
              <span
                className="inline-flex items-center gap-[5px] text-[10px] font-extrabold tracking-wide rounded-full px-2.5 py-0.5"
                style={{ color: payment.color, background: payment.bg }}
              >
                {payment.label}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Price row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-black text-slate-900 max-sm:text-base">
                ₹{fmt(order.total)}
              </span>
              {order.mrp > order.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{fmt(order.mrp)}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-semibold">
                {order.payment_method === "cod" ? "Cash on Delivery" : "Prepaid"}
                {order.payment_channel ? ` · ${order.payment_channel}` : ""}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] text-slate-400 font-semibold">
                {fmtDate(order.created_at)}
              </span>
              {order.tracking_code && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {order.tracking_code}
                </span>
              )}
            </div>
          </div>

          {/* Review row */}
          {order.delivery_status === "delivered" && (
            <div className="pt-0.5">
              {!order.is_reviewed ? (
                <Link
                  href={`/orders/${order.id}/rate`}
                  className="inline-flex items-center gap-[5px] text-[11px] font-extrabold text-teal-700 bg-teal-50 border-[1.5px] border-teal-100 rounded-lg px-3 py-[5px] no-underline transition-[background,border-color] duration-150 hover:bg-teal-100 hover:border-teal-400"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Write a Review
                </Link>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < order.rating ? "#f59e0b" : "#e2e8f0"} stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Reviewed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  );
}

/* EmptyState*/
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-[60px_24px] bg-white rounded-2xl border border-slate-200 shadow-[0_2px_16px_0_rgba(13,148,136,.07),0_1px_3px_rgba(0,0,0,.06)] mt-5 [animation:slideUp_.4s_ease]">
      <div className="relative mb-6">
        <Image
          src="/icons/no orders.png"
          alt="No orders yet"
          width={180}
          height={180}
          className="opacity-85 drop-shadow-[0_8px_24px_rgba(13,148,136,.15)]"
        />
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[120px] h-5 rounded-[50%] bg-[radial-gradient(ellipse,rgba(13,148,136,.18)_0%,transparent_70%)]" />
      </div>
      <h2 className="text-[22px] font-black text-slate-900 m-0 mb-2.5">No orders yet</h2>
      <p className="text-sm text-slate-400 leading-[1.7] max-w-[320px] m-0 mb-7">
        Looks like you haven&apos;t placed any orders.<br />
        Start shopping and your order history will show up right here!
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-gradient-to-br from-teal-600 to-teal-500 text-white text-sm font-extrabold px-7 py-3 rounded-xl no-underline shadow-[0_4px_20px_rgba(13,148,136,.35)] transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_28px_rgba(13,148,136,.45)] hover:-translate-y-0.5"
      >
        Explore Products
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}

/* Page*/
export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    axiosPrivate
      .get("user/orders/")
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  /* not logged in*/
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3.5 text-center p-[40px_24px] bg-gradient-to-br from-teal-50 to-slate-50 font-[DM_Sans,Nunito,sans-serif]">
        <Image
          src="/icons/no orders.png"
          alt="Sign in"
          width={160}
          height={160}
          className="opacity-80 mb-2"
        />
        <h2 className="text-2xl font-black text-slate-900 m-0">
          Sign in to view your orders
        </h2>
        <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed m-0 mb-2">
          Your complete order history lives here — once you&apos;re logged in.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 bg-gradient-to-br from-teal-600 to-teal-500 text-white text-sm font-extrabold px-7 py-3 rounded-xl no-underline shadow-[0_4px_20px_rgba(13,148,136,.35)] transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_28px_rgba(13,148,136,.45)] hover:-translate-y-0.5"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-slate-50 [background:linear-gradient(160deg,#f0fdfa_0%,#f8fafc_60%)] font-[DM_Sans,Nunito,sans-serif] pb-[60px]">

        {/* ── Header ── */}
        <header className="relative overflow-hidden px-6 pt-12 pb-14 max-sm:px-4 max-sm:pt-9 max-sm:pb-12 [background:linear-gradient(135deg,#0f766e_0%,#14b8a6_100%)]">
          {/* decorative overlay */}
          <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_80%_at_90%_20%,rgba(255,255,255,.08)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_10%_80%,rgba(0,0,0,.06)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-[900px] mx-auto">
            <p className="text-[11px] font-bold tracking-[.12em] uppercase text-teal-100 mb-2">
              Order History
            </p>
            <h1 className="text-[clamp(26px,5vw,38px)] font-black text-white leading-[1.15] m-0 mb-1.5">
              Thanks for your <span className="text-teal-100">orders!</span> 
            </h1>
            <p className="text-sm text-white/70 m-0">
              Every purchase, tracked and kept in one place just for you.
            </p>

          </div>
        </header>

        {/* ── Content ── */}
        <div className="max-w-[900px] mx-auto px-4 mt-0">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order, idx) => (
              <OrderCard key={order.id} order={order} idx={idx} />
            ))
          )}
        </div>
      </div>
    </>
  );
}