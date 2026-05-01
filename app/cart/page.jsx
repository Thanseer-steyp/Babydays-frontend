"use client";

import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosPrivate from "@/components/config/AxiosPrivate";

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export default function CartPage() {
  const { cartItems, loading, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const handleCheckout = async () => {
    try {
      // 1️⃣ Reset/Create session
      await axiosPrivate.post("user/checkout/session/create/",{
        is_buy_now: false
      });

      // 2️⃣ Add all cart items
      for (const item of cartItems) {
        await axiosPrivate.post("user/checkout/session/add/", {
          variant_id: item.variant_id,
          qty: item.quantity,
        });
      }

      // 3️⃣ Go to checkout page
      router.push("/checkout");
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="text-6xl">
          <img src="/icons/cart.png" alt="cart" className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">
          Sign in to view your cart
        </h2>
        <Link
          href="/auth"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const deliveryCharge = cartItems.reduce(
    (sum, item) => sum + Number(item.delivery_charge ?? 0),
    0,
  );
  const totalMRP = cartItems.reduce(
    (sum, item) => sum + Number(item.mrp ?? item.price) * item.quantity,
    0,
  );
  const savings = totalMRP - subtotal;
  const total = subtotal + deliveryCharge;

  const cartItemImage = (item) => item.image || item.main_media;

  return (
    <main
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            My Cart
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-7xl">
              <img src="/icons/cart.png" alt="cart" className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-black text-gray-700">
              Your cart is empty
            </h3>
            <p className="text-gray-400 text-sm">
              Add some products to get started!
            </p>
            <Link
              href="/products"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md mt-2"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                      {cartItemImage(item) ? (
                        <Image
                          src={cartItemImage(item)}
                          alt={item.title}
                          fill
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <img
                            src="/icons/notfound.jpg"
                            alt="notfound"
                            className="w-24 h-24 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`}>
                      <p className="font-bold text-gray-800 text-sm hover:text-teal-600 transition-colors line-clamp-2">
                        {item.title}
                      </p>
                    </Link>
                    {item.size && (
                      <p className="text-xs text-gray-400 mt-1">
                        Size:{" "}
                        <span className="font-semibold text-gray-600">
                          {item.size}
                        </span>
                      </p>
                    )}
                    {item.stock <= 5 && item.stock > 0 && (
                      <p className="text-xs text-orange-500 font-bold mt-1">
                        Only {item.stock} left!
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{Number(item.mrp).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              item.quantity > 1
                                ? updateQty(
                                    item.slug,
                                    item.variant_id,
                                    item.quantity - 1,
                                    item.quantity,
                                  )
                                : removeFromCart(item.slug, item.variant_id)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-r border-gray-200 font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(
                                item.slug,
                                item.variant_id,
                                item.quantity + 1,
                                item.quantity,
                              )
                            }
                            disabled={item.quantity >= (item.stock ?? 99)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-l border-gray-200 font-bold disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.slug, item.variant_id)
                          }
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-teal-400 p-6 sticky top-24">
                <h3 className="text-lg font-black text-gray-900 mb-5">
                  Order Summary
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span className="font-bold">
                        −₹{savings.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span
                      className={
                        deliveryCharge === 0
                          ? "font-bold text-green-600"
                          : "font-semibold"
                      }
                    >
                      {deliveryCharge === 0
                        ? "FREE"
                        : `₹${deliveryCharge.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="border-t border-teal-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-black py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block text-center text-sm font-bold text-teal-600 hover:text-teal-700 mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
