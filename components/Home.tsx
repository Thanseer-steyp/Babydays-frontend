"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import axiosInstance from "@/components/config/AxiosInstance";

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function CategorySection({ category, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-md" style={{ height: "200px" }}>
        {category.image ? (
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-12">
          <span className="text-xs font-bold tracking-widest uppercase mb-2 px-2 py-0.5 rounded w-fit text-white bg-teal-500/80">
            Collection
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-black drop-shadow-lg leading-tight">
            {category.name}
          </h2>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold px-5 py-2.5 rounded-full text-white shadow-lg border border-white/30 bg-teal-500 hover:bg-teal-600 transition-colors backdrop-blur-sm"
        >
          View All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* <div className="flex justify-center">
        <Link
          href={`/category/${category.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3 rounded-full border-2 text-white shadow-md bg-teal-500 border-teal-500 hover:bg-teal-600 transition-colors"
        >
          View All {category.name}
          <ChevronRight />
        </Link>
      </div> */}

      <div className="w-full h-px bg-gray-200 mt-2" />
    </section>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axiosInstance.get("public/categories/");
        const cats = catRes.data;
        setCategories(cats);

        const productMap = {};
        await Promise.all(
          cats.map(async (cat) => {
            try {
              const prodRes = await axiosInstance.get(`public/products/?category=${cat.slug}`);
              productMap[cat.slug] = prodRes.data.slice(0, 10);
            } catch {
              productMap[cat.slug] = [];
            }
          })
        );
        setProductsByCategory(productMap);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 flex flex-col gap-10 bg-white">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="w-full h-48 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="w-full bg-gray-50 min-h-screen" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-16">
        {categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            products={productsByCategory[cat.slug] ?? []}
          />
        ))}
        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4"><img src="/icons/shoppingbag.png" alt="shoppingbag" className="w-32 h-32" /></p>
            <p className="font-bold text-lg">No products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}



