"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosPublic from "@/components/config/AxiosPublic";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic.get("public/categories/")
      .then((r) => setCategories(r.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-bold">Categories</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">All Categories</h1>
          <p className="text-gray-500 mt-2">Browse our full range of baby product categories</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: "200px" }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4"><img src="/icons/notfound.jpg" alt="notfound" className="w-32 h-32" /></p>
            <p className="font-bold text-lg">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 bg-white border border-gray-100 hover:border-teal-200 hover:shadow-lg rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Image */}
                <div className="relative w-full bg-gray-50" style={{ aspectRatio: "1/1" }}>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-50">
                      <span className="text-5xl"><img src="/icons/shoppingbag.png" alt={cat.name} /></span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="px-3 pb-4 text-center">
                  <p className="text-sm font-black text-gray-800 group-hover:text-teal-600 transition-colors leading-snug">
                    {cat.name}
                  </p>
                  <p className="text-xs text-teal-500 font-bold mt-1">View Products →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
