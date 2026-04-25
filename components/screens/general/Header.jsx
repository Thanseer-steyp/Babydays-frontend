"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";
import axiosPublic from "@/components/config/AxiosPublic";

// ── Icons 
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const OrdersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ── Hook: outside click 
function useOutsideClick(ref, cb) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

// ── UserMenu 
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));
  const initial = user.username?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden sm:flex flex-col items-center gap-0.5 text-teal-600 hover:text-teal-700 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
          {initial}
        </div>
        
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-52 py-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors" onClick={() => setOpen(false)}>
            <OrdersIcon /> My Orders
          </Link>
          <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors" onClick={() => setOpen(false)}>
            <HeartIcon /> Wishlist
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
            >
              <LogOutIcon /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Header 
export default function Header() {
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search Extentions
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchDropdownRef = useRef(null);
  useOutsideClick(searchDropdownRef, () => setShowSearchDropdown(false));

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      axiosPublic.get(`public/products/?q=${encodeURIComponent(searchValue.trim())}`)
        .then((res) => {
          setSearchResults(res.data);
          setShowSearchDropdown(true);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  
  const [apiCategories, setApiCategories] = useState([]);
  const browseRef = useRef(null);
  useOutsideClick(browseRef, () => setBrowseOpen(false));

  useEffect(() => {
    axiosPublic.get("public/categories/")
      .then((res) => setApiCategories(res.data))
      .catch(() => { });
  }, []);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`);
    setMobileOpen(false);
    setSearchValue("");
  };

  const navLinks = [
    { label: "Hot Deals", hot: true, href: "/deals" },
    { label: "New Arrivals", href: "/arrivals" },
    { label: "All Products", href: "/products" },
    { label: "All Categories", href: "/categories" },
    { label: "Most Rated", href: "/rated" },
  ];

  const searchDropdownUI = showSearchDropdown && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
      {isSearching ? (
        <div className="p-4 text-center text-sm text-gray-500 animate-pulse font-bold">Searching…</div>
      ) : searchResults.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-500 font-bold">No products found.</div>
      ) : (
        <div className="flex flex-col max-h-[350px] overflow-y-auto">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => { setShowSearchDropdown(false); setSearchValue(""); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-teal-50 border-b border-gray-50 last:border-0 transition-colors"
            >
              {product.main_media ? (
                <img src={product.main_media} className="w-10 h-10 object-cover rounded-md flex-shrink-0" alt={product.title} />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-teal-600 font-black">₹{product.lowest_variant_price ?? product.price}</p>
                  {(product.lowest_variant_mrp ?? product.mrp) > (product.lowest_variant_price ?? product.price) && (
                    <p className="text-[10px] text-gray-400 line-through">₹{product.lowest_variant_mrp ?? product.mrp}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 text-center sticky bottom-0">
            <button onClick={handleSearch} className="text-xs font-bold text-teal-600 hover:text-teal-700 w-full py-1 focus:outline-none">
              View all {searchResults.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .header-root * { font-family: 'Nunito', sans-serif; }
        .nav-ul { position: relative; }
        .nav-ul::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #14b8a6;
          transition: width 0.2s ease;
        }
        .nav-ul:hover::after { width: 100%; }
      `}</style>

      <header className="header-root w-full bg-white shadow-sm sticky top-0 z-50">
        {/* ── Top bar ── */}
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/icons/logo.png" alt="Baby Store" className="h-10 w-auto" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="text-teal-600 font-black text-lg hidden" style={{ display: "none" }}>BabyStore</span>
          </Link>

          {/* Search bar — desktop */}
          <div className="hidden sm:flex flex-1 max-w-2xl relative" ref={searchDropdownRef}>
            <div className="w-full flex items-center border-2 border-teal-400 rounded-lg overflow-hidden bg-white focus-within:border-teal-500 focus-within:shadow-md focus-within:shadow-teal-100 transition-all">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => { if (searchValue.trim()) setShowSearchDropdown(true); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products…"
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 placeholder-gray-400 bg-transparent outline-none"
              />
              <button onClick={handleSearch} className="px-4 py-2.5 text-gray-400 hover:text-teal-500 transition-colors border-l border-gray-200">
                <SearchIcon />
              </button>
            </div>
            {searchDropdownUI}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 ml-auto">
            
            {user && (
              <Link href="/wishlist" className="hidden sm:flex flex-col items-center gap-0.5 text-gray-500 hover:text-teal-500 transition-colors">
                <HeartIcon />
                <span className="text-[10px] font-bold">Wishlist</span>
              </Link>
            )}

            {/* Cart */}
            {user && (<Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-teal-500 transition-colors relative">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-teal-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <span className="hidden sm:block text-[10px] font-bold">Cart</span>
            </Link>)}

            {/* Auth */}
            {loading ? (
              <div className="hidden sm:block w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <Link href="/auth" className="hidden sm:flex flex-col items-center gap-0.5 text-gray-500 hover:text-teal-500 transition-colors">
                <UserIcon />
                <span className="text-[10px] font-bold">Login</span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="sm:hidden text-gray-600 hover:text-teal-500 transition-colors p-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Desktop nav ── */}
        <div className="hidden sm:flex max-w-[1400px] mx-auto px-4 sm:px-6 py-2 items-center gap-4">
          
          <div className="relative flex-shrink-0" ref={browseRef}>
            <button
              onClick={() => setBrowseOpen((o) => !o)}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <GridIcon />
              <span className="hidden md:inline">Browse Categories</span>
              <span className="md:hidden">Browse</span>
              <ChevronDown />
            </button>
            {browseOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[220px] py-2">
                {apiCategories.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Loading…</div>
                ) : (
                  apiCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setBrowseOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      {cat.image && (
                        <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
                      )}
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-ul flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-md transition-colors ${link.hot
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                  }`}
              >
                {link.hot && <FlameIcon />}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white">
            <div className="px-4 pt-4 pb-2 relative" ref={searchDropdownRef}>
              <div className="flex items-center border-2 border-teal-400 rounded-lg overflow-hidden bg-white">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => { if (searchValue.trim()) setShowSearchDropdown(true); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search products…"
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <button onClick={handleSearch} className="px-4 py-2.5 text-gray-400 border-l border-gray-200">
                  <SearchIcon />
                </button>
              </div>
              {searchDropdownUI}
            </div>

            <div className="px-4 pb-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold rounded-lg transition-colors ${link.hot ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                    }`}
                >
                  {link.hot && <FlameIcon />}
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {apiCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />
              <div className="flex gap-4 px-1">
                {user ? (
                  <>
                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-500 py-1">
                      <HeartIcon /> Wishlist
                    </Link>
                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-500 py-1">
                      <OrdersIcon /> Orders
                    </Link>
                    <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2 text-sm font-semibold text-red-500 py-1">
                      <LogOutIcon /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-500 py-1">
                    <UserIcon /> Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {browseOpen && <div className="fixed inset-0 z-40" onClick={() => setBrowseOpen(false)} />}
      </header>
    </>
  );
}


