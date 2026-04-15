"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/includes/AuthModal";
import axiosPrivate from "@/components/config/AxiosPrivate";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];

/* ── icons ── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [hasAddress, setHasAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("prepaid");
  const [showCodModal, setShowCodModal] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const { clearCart } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    name: "", phone: "", alt_phone: "", pincode: "",
    state: "", city: "", location: "", address_line: "", landmark: "",
  });

  useEffect(() => {
    if (user) { setStep(2); fetchAddress(); }
  }, [user]);

  useEffect(() => {
    const loadCheckoutItems = async () => {
      try {
        const res = await axiosPrivate.get("user/checkout/session/", { withCredentials: true });
        setCheckoutItems(res.data.items || []);
        setCheckoutSessionId(res.data.id);
      } catch (err) { console.error(err); }
    };
    if (user) loadCheckoutItems();
  }, [user]);

  const fetchAddress = async () => {
    try {
      const res = await axiosPrivate.get("user/address/");
      if (res.data?.name) { setAddress(res.data); setHasAddress(true); }
    } catch {}
  };

  const saveAddress = async () => {
    try {
      if (hasAddress) await axiosPrivate.put("user/address/", address);
      else { await axiosPrivate.post("user/address/", address); setHasAddress(true); }
      setStep(3);
    } catch (err) { alert("Failed to save address"); }
  };

  const confirmCodOrder = async () => {
    try {
      await axiosPrivate.post("user/create-order/", { items: checkoutItems, payment_method: "cod", address });
      setShowCodModal(false);
      clearCart();
      router.push("/orders");
    } catch (err) { alert(err?.response?.data?.detail || "Failed to place COD order"); }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    if (!checkoutItems.length) return;
    if (paymentMethod === "cod") { setShowCodModal(true); return; }
    const res = await loadRazorpayScript();
    if (!res) { alert("Razorpay SDK failed to load"); return; }
    try {
      const orderRes = await axiosPrivate.post("user/create-order/", {
        items: checkoutItems, payment_method: paymentMethod,
        session_id: checkoutSessionId, address,
      });
      const { razorpay_order_id, amount, razorpay_key } = orderRes.data;
      const options = {
        key: razorpay_key, amount, currency: "INR", name: "BABYDAY",
        order_id: razorpay_order_id,
        handler: async (response) => {
          await axiosPrivate.post("user/verify-payment/", {
            ...response, items: checkoutItems, address,
          });
          clearCart();
          router.push("/orders");
        },
      };
      new window.Razorpay(options).open();
    } catch (err) { alert("Payment failed. Try again."); }
  };

  const mrp = checkoutItems.reduce((s, i) => s + Number(i.mrp) * i.qty, 0);
  const subtotal = checkoutItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const isFreeDelivery = subtotal >= 2000;
  const delivery = isFreeDelivery ? 0 : checkoutItems.reduce((s, i) => s + Number(i.delivery_charge) * i.qty, 0);
  const total = subtotal + delivery;
  const discount = mrp - subtotal;

  if (!loading && !user && step === 1) {/* show login prompt */}
  if (!checkoutItems.length && user) return (
    <div className="min-h-screen bg-[#f0fdfb] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-5xl mb-3">🛒</div>
        <p className="font-medium">Your checkout session is empty.</p>
      </div>
    </div>
  );

  const steps = [
    { num: 1, label: "Account", icon: <img src="/icons/filledcheck.png" alt="User" /> },
    { num: 2, label: "Address", icon: <img src="/icons/location.png" alt="Map Pin" /> },
    { num: 3, label: "Payment", icon: <img src="/icons/wallet.png" alt="Credit Card" /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .co-root { font-family: 'DM Sans', sans-serif; }
        .co-root input, .co-root select, .co-root textarea {
          width: 100%; padding: 11px 14px;
          background: #f8fffe;
          border: 1.5px solid #d1faf4;
          border-radius: 12px;
          font-size: 14px; color: #0f172a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .co-root input:focus, .co-root select:focus {
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
        }
        .co-root input::placeholder { color: #94a3b8; }
        .co-root select { appearance: none; cursor: pointer; }

        .co-btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 28px; border-radius: 14px;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          color: white; font-weight: 600; font-size: 15px;
          border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(13,148,136,0.28);
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .co-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,148,136,0.36); }
        .co-btn-primary:active { transform: translateY(0); }

        .co-card {
          background: white;
          border: 1.5px solid #e0faf6;
          border-radius: 20px;
        }

        .co-step-connector {
          flex: 1; height: 2px;
          background: linear-gradient(90deg, #99f6e4, #e0faf6);
        }
        .co-step-connector.done {
          background: linear-gradient(90deg, #14b8a6, #2dd4bf);
        }

        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .co-animate { animation: fadeSlide 0.3s ease both; }

        .co-radio-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px;
          border: 2px solid #e0faf6;
          border-radius: 14px; cursor: pointer;
          transition: all 0.2s;
        }
        .co-radio-card.selected {
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .co-radio-dot {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid #cbd5e1; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .co-radio-card.selected .co-radio-dot {
          border-color: #14b8a6; background: #14b8a6;
        }
        .co-radio-dot-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: white;
        }

        .co-summary-item:not(:last-child) {
          border-bottom: 1px solid #f0fdfb;
        }

        .co-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 99px;
          font-size: 11px; font-weight: 600;
        }
      `}</style>

      <div className="co-root min-h-screen bg-gradient-to-br from-[#f0fdfb] via-white to-[#e6fffa] py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page title */}
          <div className="mb-8 text-center">
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Checkout</h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>Complete your order in just a few steps</p>
          </div>

          
          <div className="flex items-center mb-8 max-w-md mx-auto">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center" style={{ flex: idx < steps.length - 1 ? "1" : "0" }}>
                <div className="flex flex-col items-center gap-1">
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: step > s.num ? "linear-gradient(135deg,#0d9488,#14b8a6)" : step === s.num ? "white" : "white",
                    
                    color: step > s.num ? "white" : step === s.num ? "#0d9488" : "#94a3b8",
                    
                    transition: "all 0.3s",
                  }}>
                    {step > s.num ? <img src="/icons/filledcheck.png" alt="Check" /> : s.icon}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: step >= s.num ? "#0d9488" : "#94a3b8" }}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`co-step-connector ${step > s.num ? "done" : ""}`} style={{ margin: "0 8px", marginBottom: "18px" }} />
                )}
              </div>
            ))}
          </div>

          
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left — steps */}
            <div className="flex-1 co-card p-6 lg:p-8 co-animate">

              {/* STEP 1 */}
              {step === 1 && (
                <div className="text-center py-8">
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "linear-gradient(135deg,#ccfbf1,#99f6e4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                  }}>
                    <UserIcon />
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                    Sign in to continue
                  </h2>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: 28 }}>
                    Please log in to place your order securely
                  </p>
                  <button className="co-btn-primary" onClick={() => setShowAuth(true)}>
                    <UserIcon />
                    Login / Register
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <MapPinIcon />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Delivery Address</h2>
                      <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Where should we deliver?</p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Full Name *</label>
                      <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Mobile Number *</label>
                      <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit number" />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Alt Phone</label>
                      <input value={address.alt_phone} onChange={(e) => setAddress({ ...address, alt_phone: e.target.value })} placeholder="Optional" />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Pincode *</label>
                      <input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Location / Area *</label>
                      <input value={address.location} onChange={(e) => setAddress({ ...address, location: e.target.value })} placeholder="Area / Colony" />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>City / District *</label>
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City name" />
                    </div>
                    <div style={{ position: "relative" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>State *</label>
                      <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <svg style={{ position: "absolute", right: 12, top: "62%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Landmark</label>
                      <input value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} placeholder="Near landmark (optional)" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Full Address</label>
                      <input value={address.address_line} onChange={(e) => setAddress({ ...address, address_line: e.target.value })} placeholder="House / Flat / Building details (optional)" />
                    </div>
                  </div>

                  <button className="co-btn-primary w-full mt-6" onClick={saveAddress} style={{ width: "100%" }}>
                    {hasAddress ? "Continue to Payment " : "Save & Continue "}
                  </button>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <CreditCardIcon />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Payment Method</h2>
                      <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Choose how you'd like to pay</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Prepaid */}
                    <div className={`co-radio-card ${paymentMethod === "prepaid" ? "selected" : ""}`} onClick={() => setPaymentMethod("prepaid")}>
                      <div className={`co-radio-dot ${paymentMethod === "prepaid" ? "selected" : ""}`}>
                        {paymentMethod === "prepaid" && <div className="co-radio-dot-inner" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", margin: 0 }}>Online Payment</p>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>Pay securely online</p>
                      </div>
                    </div>

                    {/* COD */}
                    <div className={`co-radio-card ${paymentMethod === "cod" ? "selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
                      <div className={`co-radio-dot ${paymentMethod === "cod" ? "selected" : ""}`}>
                        {paymentMethod === "cod" && <div className="co-radio-dot-inner" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", margin: 0 }}>Cash on Delivery</p>
                        <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>

                  {/* Address summary */}
                  <div style={{ marginTop: 20, padding: "14px 16px", background: "#f8fffe", border: "1.5px solid #d1faf4", borderRadius: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Delivering to</p>
                      <button onClick={() => setStep(2)} style={{ fontSize: 12, color: "#0d9488", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Change</button>
                    </div>
                    <p style={{ fontSize: 14, color: "#1e293b", margin: 0 }}>
                      <strong>{address.name}</strong> · {address.phone}
                    </p>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
                      {[address.location, address.city, address.state, address.pincode].filter(Boolean).join(", ")}
                    </p>
                  </div>

                  <button
                    className="co-btn-primary mt-5"
                    onClick={handlePayment}
                    style={{ width: "100%", fontSize: 16, padding: "15px" }}
                  >
                    {paymentMethod === "cod" ? "Place Order" : "Pay Securely · ₹" + total.toFixed(0)}
                  </button>

                </div>
              )}
            </div>

            {/* Right — Order Summary */}
            <div style={{ width: "100%", maxWidth: 340 }}>
              <div className="co-card p-5">
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Order Summary</h2>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="co-summary-item" style={{ display: "flex", gap: 12, padding: "12px 0" }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img src={item.image} alt={item.title} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 12, border: "1.5px solid #e0faf6" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 4px" }}>Size: {item.size}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 4px" }}>Quantity: {item.qty}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0d9488" }}>₹{(Number(item.price) * item.qty).toFixed(0)}</span>
                          {Number(item.mrp) > Number(item.price) && (
                            <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>₹{(Number(item.mrp) * item.qty).toFixed(0)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>


                {/* Price breakdown */}
                <div style={{ borderTop: "1.5px dashed #e0faf6", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
                    <span>MRP Total</span><span>₹{mrp.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16a34a", fontWeight: 500 }}>
                    <span>Discount</span><span>-₹{discount.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
                    <span>Delivery</span>
                    <span style={{ color: delivery === 0 ? "#16a34a" : "#64748b", fontWeight: delivery === 0 ? 600 : 400 }}>
                      {delivery === 0 ? "FREE" : `₹${delivery.toFixed(0)}`}
                    </span>
                  </div>
                  <div style={{ borderTop: "1.5px solid #e0faf6", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                    <span>Total</span>
                    <span style={{ color: "#0d9488" }}>₹{total.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ textAlign: "center", padding: "6px 10px", background: "linear-gradient(135deg,#f0fdfb,#ccfbf1)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#0d9488" }}>
                       You save ₹{discount.toFixed(0)} on this order!
                    </div>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, padding: "14px", background: "white", borderRadius: 16, border: "1.5px solid #e0faf6" }}>
                {[
                  { icon: "/icons/check.png", text: "100% Secure Payments" },
                  { icon: "/icons/check.png", text: "Easy 7-day Returns" },
                  { icon: "/icons/check.png", text: "Reliable Delivery" },
                ].map((b) => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#475569", fontWeight: 500 }}>
                    <img src={b.icon} alt="check" className="w-4 h-4" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COD Modal */}
      <CodConfirmModal open={showCodModal} onClose={() => setShowCodModal(false)} onConfirm={confirmCodOrder} total={total} />

      {/* Auth Modal */}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setStep(2)} />
    </>
  );
}


function CodConfirmModal({ open, onClose, onConfirm, total }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: "white", borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#ccfbf1,#99f6e4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
            <img src="/icons/shoppingbag.png" alt="shoppingbag" className="w-32 h-32" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Confirm Your Order</h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            You'll pay <strong style={{ color: "#0d9488" }}>₹{total.toFixed(0)}</strong> when your order arrives at your doorstep.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "white", fontSize: 14, fontWeight: 600, color: "#64748b", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#0d9488,#14b8a6)", fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 4px 14px rgba(13,148,136,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
            Place Order ✓
          </button>
        </div>
      </div>
    </div>
  );
}