"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosPublic from "@/components/config/AxiosPublic";

interface Product {
  id: number;
  title: string;
  slug: string;
  main_media: string | null;
  lowest_variant_price: number | null;
  lowest_variant_mrp: number | null;
  price: number | null;
  mrp: number | null;
  average_rating: number;
  rating_count: number;
  delivery_charge: number;
  created_at: string;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// function RankBadge({ rank }: { rank: number }) {
//   const colors: Record<number, string> = {
//     1: "bg-yellow-400 text-yellow-900",
//     2: "bg-gray-300 text-gray-700",
//     3: "bg-amber-600 text-white",
//   };
//   return (
//     <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow ${colors[rank] ?? "bg-teal-500 text-white"}`}>
//       {rank}
//     </div>
//   );
// }

function ProductCard({ product, rank }: { product: Product; rank: number }) {
  const price = product.lowest_variant_price ?? product.price;
  const mrp = product.lowest_variant_mrp ?? product.mrp;
  const discount = mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        {product.main_media ? (
          <img
            src={product.main_media}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= Math.round(product.average_rating)} />
            ))}
          </div>
          <span className="text-xs font-black text-amber-500">{product.average_rating.toFixed(1)}</span>
          {/* <span className="text-[10px] text-gray-400 font-semibold">({product.rating_count})</span> */}
        </div>

        <div className="mt-auto pt-1 flex items-center gap-2 flex-wrap">
          {price && (
            <span className="text-base font-black text-teal-600">₹{price}</span>
          )}
          {mrp && mrp > (price ?? 0) && (
            <span className="text-xs text-gray-400 line-through font-semibold">₹{mrp}</span>
          )}
        </div>

        {product.delivery_charge === 0 && (
          <span className="text-[10px] text-green-600 font-bold">Free delivery</span>
        )}
      </div>
    </Link>
  );
}

export default function MostRatedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axiosPublic
      .get("public/products/")
      .then((res) => {
        
        const sorted = [...res.data]
          .filter((p: Product) => p.rating_count > 0)
          .sort((a: Product, b: Product) => {
            if (b.average_rating !== a.average_rating) return b.average_rating - a.average_rating;
            return b.rating_count - a.rating_count;
          });
        setProducts(sorted);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Hero banner */}
      <div className="bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-black text-sm font-bold uppercase tracking-widest">
              <span>Customer favourites</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">Most Rated</h1>
            <p className="text-gray-500 text-sm font-semibold max-w-md">
              Products our customers love the most  ranked by real reviews.
            </p>
          </div>
          
        </div>
      </div>
      

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="font-bold text-lg">Couldn&apos;t load products</p>
            <button onClick={() => window.location.reload()} className="bg-amber-500 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-amber-600 transition-colors">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <img src="/icons/emptyrating.png" alt="No ratings" className="w-24 h-24 object-contain" />
            <p className="font-bold text-lg">No rated products yet</p>
            <p className="text-sm text-gray-400">Products will appear here once customers leave reviews.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}