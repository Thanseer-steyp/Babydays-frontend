"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const collections = [
  {
    id: "under299",
    label: "Under ₹299",
    maxPrice: 299,
    image: "/images/collections/299.png",
    color: "#14b8a6",
    tagline: "Quality products under ₹299",
  },
  {
    id: "under499",
    label: "Under ₹499",
    maxPrice: 399,
    image: "/images/collections/499.png",
    color: "#8b5cf6",
    tagline: "Great picks under ₹499",
  },
  {
    id: "under699",
    label: "Under ₹699",
    maxPrice: 499,
    image: "/images/collections/699.png",
    color: "#f59e0b",
    tagline: "Premium choices under ₹699",
  },
];

function CollectionCard({ col }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/collections/${col.id}`}
      className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ height: "320px" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${col.color}ee 0%, ${col.color}99 100%)`,
        }}
      />

      {!imgError && (
        <div className="absolute inset-0">
          <Image
            src={col.image}
            alt={col.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        </div>
      )}

      {imgError && (
        <>
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-6 w-40 h-40 rounded-full bg-white/10" />
        </>
      )}



      <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <h2 className="text-white text-3xl font-black drop-shadow-lg leading-none mb-1">
          {col.label}
        </h2>
        <p className="text-white/90 text-sm font-semibold mb-4">{col.tagline}</p>
        <span className="inline-flex items-center gap-2 bg-white text-gray-800 font-black text-sm px-5 py-2.5 rounded-full w-fit shadow-lg group-hover:scale-105 transition-transform duration-300">
          Shop Now 
        </span>
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  return (
    <main
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-bold">Collections</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Collections
          </h1>
          <p className="text-gray-500 mt-2">
            Shop by price — find the best value for every budget
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {collections.map((col) => (
            <CollectionCard key={col.id} col={col} />
          ))}
        </div>
      </div>
    </main>
  );
}