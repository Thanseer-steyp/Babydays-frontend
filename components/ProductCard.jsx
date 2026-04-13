// PATH: components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/components/context/WishlistContext";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#e11d48" : "none"} stroke={filled ? "#e11d48" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function ProductCard({ product }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  // Support both API shape and legacy shape
  const title = product.title ?? product.name ?? "";
  const slug = product.slug ?? "";
  const mainImage = product.main_media ?? product.images?.[0] ?? null;
  const price = product.lowest_variant_price ?? product.price ?? product.salePrice ?? 0;
  const mrp = product.lowest_variant_mrp ?? product.mrp ?? product.price ?? 0;
  const isAvailable = product.is_available ?? product.inStock ?? true;
  const id = product.id;

  const discount = mrp && price && mrp > price
    ? Math.round(((mrp - price) / mrp) * 100)
    : null;

  const wishlisted = isWishlisted(id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/auth"); return; }
    if (wishlisted) {
      await removeFromWishlist(slug);
    } else {
      await addToWishlist(slug);
    }
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="group relative flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
      aria-label={`View ${title}`}
    >
      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      {/* Out of stock badge */}
      {!isAvailable && (
        <div className="absolute top-3 left-0 z-10 bg-orange-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-r-full shadow-sm">
          Out of stock
        </div>
      )}

      {/* Discount badge */}
      {discount && isAvailable && (
        <div className="absolute top-3 left-0 z-10 bg-teal-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-r-full shadow-sm">
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative w-full bg-gray-50 overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[13px] text-gray-700 font-semibold leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
          {title}
        </p>
        <div className="flex items-center gap-2 mt-auto flex-wrap">
          <span className="text-base font-black text-gray-900">₹{Number(price).toLocaleString("en-IN")}</span>
          {mrp > price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{Number(mrp).toLocaleString("en-IN")}</span>
              {discount && <span className="text-xs font-bold text-orange-500">{discount}% off</span>}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}




// // PATH: components/ProductCard.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import type { Product } from "@/types";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const displayPrice = product.salePrice ?? product.price;

//   return (
//     // ✅ href uses /product/ (singular) — matches app/product/[slug]/page.jsx
//     <Link
//       href={`/product/${product.slug}`}
//       className="group relative flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-250"
//       aria-label={`View ${product.name}`}
//     >
//       {/* Out of stock badge */}
//       {!product.inStock && (
//         <div
//           className="absolute top-3 left-0 z-10 bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-r-full shadow-sm"
//           aria-label="Out of stock"
//         >
//           ! Out of stock
//         </div>
//       )}

//       {/* Discount badge */}
//       {product.discount && product.inStock && (
//         <div
//           className="absolute top-3 left-0 z-10 bg-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-r-full shadow-sm"
//           aria-label={`${product.discount}% discount`}
//         >
//           {product.discount}% OFF
//         </div>
//       )}

//       {/* Product image */}
//       <div className="relative w-full bg-gray-50 overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
//         <Image
//           src={product.images[0]}
//           alt={product.name}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-300"
//           sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
//         />
//       </div>

//       {/* Info */}
//       <div className="p-3 flex flex-col gap-2 flex-1">
//         <p className="text-[13px] text-gray-700 font-semibold leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
//           {product.name}
//         </p>

//         {/* Price row */}
//         <div className="flex items-center gap-2 mt-auto flex-wrap">
//           <span className="text-base font-black text-gray-900">
//             ₹{displayPrice.toLocaleString("en-IN")}
//           </span>
//           {product.salePrice && (
//             <>
//               <span className="text-sm text-gray-400 line-through">
//                 ₹{product.price.toLocaleString("en-IN")}
//               </span>
//               <span className="text-xs font-bold text-orange-500">
//                 {product.discount}% off
//               </span>
//             </>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }