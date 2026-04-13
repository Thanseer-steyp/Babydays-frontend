// PATH: app/category/[slug]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import axiosPublic from "@/components/config/AxiosPublic";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage({ params }) {
  const { slug } = use(params);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch category info
        const catRes = await axiosPublic.get("public/categories/");
        const found = catRes.data.find((c) => c.slug === slug);
        setCategory(found ?? null);

        // Fetch products in this category
        const prodRes = await axiosPublic.get(`public/products/?category=${slug}`);
        setProducts(prodRes.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="w-full h-72 bg-gray-200 animate-pulse" />
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Hero banner */}
      <div className="relative w-full" style={{ height: "280px" }}>
        {category?.image ? (
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-700" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />

        {/* Breadcrumb */}
        <nav className="absolute top-5 left-6 md:left-10">
          <ol className="flex items-center gap-2 text-white/70 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <span>/</span>
            <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
            <span>/</span>
            <li className="text-white font-bold">{category?.name ?? slug}</li>
          </ol>
        </nav>

        <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-10 pb-4">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full w-fit text-white bg-teal-500/80">
            {products.length} Products
          </span>
          <h1 className="text-white text-4xl md:text-5xl font-black drop-shadow-xl leading-tight">
            {category?.name ?? slug}
          </h1>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-800">{category?.name ?? slug}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} products</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4"><img src="/icons/shoppingbag.png" alt="shopingbag" className="w-32 h-32" /></div>
            <h3 className="text-xl font-black text-gray-700">No products yet</h3>
            <p className="text-gray-400 mt-2 text-sm">Check back soon — new items coming!</p>
            <Link href="/" className="mt-6 text-sm font-bold px-6 py-3 rounded-full text-white bg-teal-500 hover:bg-teal-600 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}



