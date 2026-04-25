import { useState, useEffect, useRef } from "react";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { useAuth } from "@/components/context/AuthContext";
import AuthPopup from "@/components/screens/auth/AuthPopup";
import axiosPublic from "./config/AxiosPublic";
import axiosPrivate from "./config/AxiosPrivate";
import { useRouter } from "next/navigation";

// ── Helpers ───────────────────────────────────────────────────────────────────
const isVideo = (url) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url ?? "");

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#000"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#000"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "#e11d48" : "none"}
    stroke={filled ? "#e11d48" : "currentColor"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="#f59e0b"
    stroke="#f59e0b"
    strokeWidth="1"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)" />
    <polygon points="10 8 17 12 10 16" fill="white" />
  </svg>
);
const MuteIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
const UnmuteIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

// ── Video Player with mute toggle ─────────────────────────────────────────────
const VideoPlayer = ({ src, isMuted, onToggleMute }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover img-fade"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Mute / Unmute button — bottom-right corner */}
      <button
        onClick={onToggleMute}
        className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all"
        title={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <MuteIcon /> : <UnmuteIcon />}
      </button>
    </div>
  );
};

// ── Thumbnail ─────────────────────────────────────────────────────────────────
const Thumbnail = ({ src, alt, active, onClick }) => (
  <button
    onClick={onClick}
    className={`thumb flex-shrink-0 relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
      active ? "border-teal-400 opacity-100" : "border-gray-200 opacity-70"
    }`}
  >
    {isVideo(src) ? (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <PlayIcon />
      </div>
    ) : (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    )}
  </button>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const loginRef = useRef(null);
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // videos start muted (browser autoplay policy)
  const { login } = useAuth();
  const [pendingAction, setPendingAction] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      await axiosPublic.post(
        "http://localhost:8000/api/v1/register/google-login/",
        { token },
        { withCredentials: true },
      );

      login(); // 🔥 update user from backend
    } catch (err) {
      console.error(err);
    }
  };
  // Group variants by size
  const groupedVariants = Object.values(
    product.variants.reduce((acc, v) => {
      if (!acc[v.size]) {
        acc[v.size] = {
          size: v.size,
          items: [],
          image: v.image, // take first image for that size
        };
      }
      acc[v.size].items.push(v);
      return acc;
    }, {}),
  );

  const [selectedGroup, setSelectedGroup] = useState(
    groupedVariants.find((g) => g.items.some((i) => i.is_available)) ||
      groupedVariants[0],
  );

  const [selectedItem, setSelectedItem] = useState(
    selectedGroup?.items.find((i) => i.is_available) || selectedGroup?.items[0],
  );

  useEffect(() => {
    if (selectedGroup) {
      setSelectedItem(
        selectedGroup.items.find((i) => i.is_available) ||
          selectedGroup.items[0],
      );
    }
  }, [selectedGroup]);

  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // ── Build media list (images + videos) ──────────────────────────────────────
  // ── Build media list (clean & no duplicates) ──
  let mediaList = [];

  // 1. ONLY selected variant image
  if (selectedItem?.image) {
    mediaList.push(selectedItem.image);
  }

  // 2. Optional: add product media (excluding duplicate)
  const productMedia = product.media?.map((m) => m.media).filter(Boolean) ?? [];

  const filteredProductMedia = productMedia.filter(
    (m) => m !== selectedItem?.image,
  );

  mediaList.push(...filteredProductMedia);

  // 3. fallback
  if (mediaList.length === 0 && product.main_media) {
    mediaList.push(product.main_media);
  }

  useEffect(() => {
    setActiveImg(0);
  }, [selectedItem]);

  // ── Pricing ──────────────────────────────────────────────────────────────────
  const price = selectedItem?.price ?? product.price ?? 0;
  const mrp = selectedItem?.mrp ?? product.mrp ?? price;

  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : null;
  const isAvailable =
    product.is_available && (selectedItem ? selectedItem.is_available : true);
  const wishlisted = isWishlisted(product.id);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleWishlist = async () => {
    if (!user) {
      setShowLogin(true);

      setTimeout(() => {
        document.getElementById("googleLoginTrigger")?.click();
      }, 100);

      return;
    }

    const productData = {
      id: product.id,
      title: product.title,
      price: product.price,
      main_image: product.main_media,
      average_rating: product.average_rating,
      slug: product.slug,
    };

    if (wishlisted) {
      await removeFromWishlist(productData);
    } else {
      await addToWishlist(productData);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setShowLogin(true);

      setTimeout(() => {
        document.getElementById("googleLoginTrigger")?.click();
      }, 100);

      return;
    }
    if (product.variants?.length > 0 && !selectedItem) {
      setCartMsg({ type: "error", text: "Please select a size" });
      return;
    }

    const variantId = selectedItem?.id;
    const result = await addToCart(product.slug, variantId, qty);
    setCartMsg(
      result.success
        ? { type: "success", text: "Added to cart!" }
        : { type: "error", text: "Failed to add to cart" },
    );
    setAddingToCart(false);
    setTimeout(() => setCartMsg(null), 3000);
  };

  const handleBuyNow = async () => {
    if (!user) {
      setPendingAction("BUY_NOW"); // ✅ string
      setShowLogin(true);
      return;
    }

    proceedToCheckout();
  };

  const proceedToCheckout = async () => {
    try {
      // 1️⃣ Reset session
      await axiosPrivate.post("user/checkout/session/create/");

      // 2️⃣ Add item
      await axiosPrivate.post("user/checkout/session/add/", {
        variant_id: selectedItem.id,
        qty: qty,
      });
      router.push("/checkout");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user && pendingAction === "BUY_NOW") {
      proceedToCheckout();
      setPendingAction(null);
    }
  }, [user]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCartMsg({ type: "success", text: "Link copied!" });
      setTimeout(() => setCartMsg(null), 2000);
    }
  };

  const features = product.features
    ? product.features.split("\n").filter((f) => f.trim())
    : [];

  const currentMedia = mediaList[activeImg];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .thumb { transition: border-color 0.15s, opacity 0.15s; }
        .thumb:hover { border-color: #14b8a6; opacity: 1; }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }
        .img-fade { animation: fadeIn 0.25s ease forwards; }
      `}</style>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* ── Left: Media ── */}
        <div className="flex flex-col gap-4">
          {/* Main viewer */}
          <div
            className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
            style={{ aspectRatio: "1/1" }}
          >
            {mediaList.length > 0 ? (
              isVideo(currentMedia) ? (
                <VideoPlayer
                  key={activeImg}
                  src={currentMedia}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted((m) => !m)}
                />
              ) : (
                <img
                  key={activeImg}
                  src={currentMedia}
                  alt={`${product.title} - ${activeImg + 1}`}
                  className="w-full h-full object-cover img-fade"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}

            {/* Prev / Next arrows */}
            {mediaList.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImg(
                      (i) => (i - 1 + mediaList.length) % mediaList.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setActiveImg((i) => (i + 1) % mediaList.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white hover:scale-110 transition-all"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {mediaList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {mediaList.map((src, i) => (
                <Thumbnail
                  key={i}
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  active={i === activeImg}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Details ── */}
        <div className="flex flex-col gap-5">
          {/* Stock + share */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold px-4 py-1.5 rounded-full ${isAvailable ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-600"}`}
            >
              {isAvailable ? "✓ In Stock" : "Out of stock"}
            </span>
            <button
              onClick={handleShare}
              className="text-teal-500 hover:text-teal-700 transition-colors p-1"
            >
              <ShareIcon />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
            {product.title}
          </h1>

          {/* Ratings */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(product.average_rating)
                        ? "text-amber-400"
                        : "text-gray-200"
                    }
                  >
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {product.average_rating}
              </span>
              <span className="text-sm text-gray-400">
                ({product.rating_count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-gray-900">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            {mrp > price && (
              <>
                <span className="text-lg text-gray-400 line-through font-medium">
                  ₹{Number(mrp).toLocaleString("en-IN")}
                </span>
                {discount && (
                  <span className="text-sm font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>
          {product.delivery_charge === 0 && (
            <p className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
              ✓ Free Delivery
            </p>
          )}

          <div className="w-full h-px bg-gray-100" />
          <p className="text-sm text-gray-500">
            Category:{" "}
            <a
              href={`/category/${product.product_category}`}
              className="text-teal-600 font-bold hover:underline capitalize"
            >
              {product.product_category}
            </a>
          </p>

          {/* Variants (prints) */}
          {/* Variant Images (based on selected size) */}
          {selectedGroup?.items?.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-gray-700">Select Design</p>

              <div className="flex gap-3 flex-wrap">
                {selectedGroup.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveImg(0);
                    }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedItem?.id === item.id
                        ? "border-teal-500"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt="variant"
                      className="w-full h-full object-cover"
                    />

                    {/* Out of stock overlay */}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-red-500">
                        Out
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Sizes (Grouped) */}
          {groupedVariants.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-gray-700">
                Size:{" "}
                <span className="font-normal text-gray-500">
                  {selectedGroup?.size}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                {groupedVariants.map((group) => (
                  <button
                    key={group.size}
                    onClick={() => {
                      setSelectedGroup(group);
                      setActiveImg(0);
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 ${
                      selectedGroup?.size === group.size
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-black">
                      {group.size}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-600 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">◉</span>
                  {f.replace(/^◉\s*/, "")}
                </li>
              ))}
            </ul>
          )}

          <div className="w-full h-px bg-gray-100" />

          {/* Cart message */}
          {cartMsg && (
            <div
              className={`text-sm font-bold px-4 py-2 rounded-lg ${
                cartMsg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {cartMsg.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || addingToCart}
              className="flex-1 min-w-[120px] bg-gray-700 hover:bg-gray-800 text-white text-sm font-black py-3 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {addingToCart ? "Adding…" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="flex-1 min-w-[120px] bg-amber-400 hover:bg-amber-500 text-white text-sm font-black py-3 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlist}
              className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-all"
            >
              <HeartIcon filled={wishlisted} />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-700 mb-1">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Category */}
        </div>
      </div>
      {showLogin && (
        <AuthPopup
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
