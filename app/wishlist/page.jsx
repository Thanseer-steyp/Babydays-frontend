"use client";

import { useWishlist } from "@/components/context/WishlistContext";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="text-6xl"><img src="/icons/wishlist.png" alt="" /></div>
        <h2 className="text-2xl font-black text-gray-800">Sign in to view your wishlist</h2>
        <Link href="/auth" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md">
          Login / Register
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-7xl"><img src="/icons/wishlist.png" alt="wishlist" className="w-32 h-32" /></div>
            <h3 className="text-xl font-black text-gray-700">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm">Save items you love to buy them later</p>
            <Link href="/products" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md mt-2">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}



