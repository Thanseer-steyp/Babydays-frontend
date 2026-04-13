"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import axiosPublic from "@/components/config/AxiosPublic";
import ProductCard from "@/components/ProductCard";

const COLLECTIONS = {
  under299: { label: "Under ₹299", maxPrice: 299, image: "/images/collections/299.png" },
  under499: { label: "Under ₹499", maxPrice: 499, image: "/images/collections/499.png" },
  under699: { label: "Under ₹699", maxPrice: 699, image: "/images/collections/699.png" },
};

export default function CollectionDetailPage({ params }) {
  const { id } = use(params);
  const collection = COLLECTIONS[id];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("price_asc");

  useEffect(() => {
    if (!collection) return;
    axiosPublic.get("public/products/")
      .then((r) => {
        const filtered = r.data.filter((p) => {
          const price = Number(p.lowest_variant_price ?? p.price ?? 0);
          return price > 0 && price <= collection.maxPrice;
        });
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (!collection) notFound();

  // Client-side sort
  const sorted = [...products].sort((a, b) => {
    const priceA = Number(a.lowest_variant_price ?? a.price ?? 0);
    const priceB = Number(b.lowest_variant_price ?? b.price ?? 0);
    const mrpA = Number(a.lowest_variant_mrp ?? a.mrp ?? priceA);
    const mrpB = Number(b.lowest_variant_mrp ?? b.mrp ?? priceB);
    const discA = mrpA > 0 ? (mrpA - priceA) / mrpA : 0;
    const discB = mrpB > 0 ? (mrpB - priceB) / mrpB : 0;

    if (sort === "price_asc") return priceA - priceB;
    if (sort === "price_desc") return priceB - priceA;
    if (sort === "discount") return discB - discA;
    return 0;
  });

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
 
      <div
        className="relative text-white"
        style={{
          ...(collection.image
            ? { backgroundImage: `url(${collection.image})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: `linear-gradient(135deg, ${collection.color}ee 0%, ${collection.color}99 100%)` }),
          minHeight: "220px",
        }}
      >
        {collection.image && (
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        )}

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 py-12">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-white font-bold">{collection.label}</span>
          </nav>

          <div>
            <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">{collection.label}</h1>
            <p className="text-white/80 mt-1">
              {loading ? "Loading…" : `${sorted.length} products available`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[65px] z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-gray-600">
            {loading ? "Loading…" : `${sorted.length} products`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-semibold">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:border-teal-400 transition-colors bg-white cursor-pointer"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="text-6xl"><img src="/icons/shopingbag.png" alt="shoppingbag" className="w-32 h-32" /></div>
            <h3 className="text-xl font-black text-gray-700">No products in this range</h3>
            <p className="text-gray-400 text-sm">Check back soon!</p>
            <Link href="/collections" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Back to Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
