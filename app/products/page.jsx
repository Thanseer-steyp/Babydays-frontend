"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/components/config/AxiosInstance";
import ProductCard from "@/components/ProductCard";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("category") ?? "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQ);
  const [appliedSearch, setAppliedSearch] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get("public/categories/").then((r) => setCategories(r.data)).catch(() => { });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (appliedSearch) params.set("q", appliedSearch);
        if (category) params.set("category", category);
        const res = await axiosInstance.get(`public/products/?${params.toString()}`);
        setProducts(res.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [appliedSearch, category]);

  const handleSearch = () => setAppliedSearch(search);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Page Header */}
      <div className="bg-white pt-8 pb-4">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm font-semibold">
              <li><a href="/" className="text-gray-400 hover:text-teal-500 transition-colors">Home</a></li>
              <span className="text-gray-400">/</span>
              <li className="text-gray-800">Products</li>
            </ol>
          </nav>

          <h1 className="text-gray-900 text-4xl md:text-5xl font-black mb-2 tracking-tight">
            Our Collection
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 md:top-[65px] z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="hidden sm:block">
            <h2 className="text-lg font-black text-gray-800">Browse Products</h2>
            <p className="text-sm text-gray-500 mt-0.5 whitespace-nowrap">{products.length} items available</p>
          </div>

          <div className="flex w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 shadow-sm transition-colors bg-white cursor-pointer w-full sm:min-w-[200px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div> */}

      {/* Product grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-4"><img src="/icons/notfound.png" alt="notfound" className="w-32 h-32"/></div>
            <h3 className="text-xl font-black text-gray-700">No products found</h3>
            <p className="text-gray-400 mt-2 text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(""); setAppliedSearch(""); setCategory(""); }} className="mt-6 bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
