"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/components/config/AxiosInstance";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </svg>
);

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("public/products/")
      .then((r) => {
        // Filter products that have a discount (mrp > price)
        const deals = r.data.filter((p) => {
          const price = p.lowest_variant_price ?? p.price ?? 0;
          const mrp = p.lowest_variant_mrp ?? p.mrp ?? 0;
          return mrp > price && price > 0;
        });
        // Sort by highest discount % first
        deals.sort((a, b) => {
          const discA = ((a.lowest_variant_mrp ?? a.mrp ?? 0) - (a.lowest_variant_price ?? a.price ?? 0)) / ((a.lowest_variant_mrp ?? a.mrp) || 1);
          const discB = ((b.lowest_variant_mrp ?? b.mrp ?? 0) - (b.lowest_variant_price ?? b.price ?? 0)) / ((b.lowest_variant_mrp ?? b.mrp) || 1);
          return discB - discA;
        });
        setProducts(deals);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className=" bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Hero banner */}
      <div className="relative w-full h-64 md:h-[400px] overflow-hidden select-none flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="/images/deals/hotdeal.png" alt="hot deals" className="w-full h-full object-cover" />
          <div className="absolute inset-0" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="text-6xl"><img src="/icons/shopingbag.png" alt="shoppingbag" className="w-32 h-32" /></div>
            <h3 className="text-xl font-black text-gray-700">No deals right now</h3>
            <p className="text-gray-400 text-sm">Check back soon for great offers!</p>
            <Link href="/products" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
