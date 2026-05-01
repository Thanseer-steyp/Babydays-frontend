"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import axiosPublic from "@/components/config/AxiosPublic";
import ProductDetailClient from "@/components/ProductDetailClient";

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    axiosPublic
      .get(`public/products/${slug}/`)
      .then((r) => setProduct(r.data))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFoundFlag(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFoundFlag) notFound();

  if (loading) {
    return (
      <div
        className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 bg-white"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-3/4" />
            <div className="h-6 bg-gray-100 rounded-xl animate-pulse w-1/2" />
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main
      className="w-full bg-white min-h-screen"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          {product.product_category && (
            <>
              <Link
                href={`/category/${product.product_category}`}
                className="hover:text-teal-600 transition-colors capitalize"
              >
                {product.product_category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700 font-semibold line-clamp-1">
            {product.title}
          </span>
        </nav>

        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}