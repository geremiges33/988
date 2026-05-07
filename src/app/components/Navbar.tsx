import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Search, Heart, Menu, X, ChevronDown, User, LogOut, Package, Settings } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";
import React from "react";

/* ─────────────────────────── mega-menu data ─────────────────────────── */

const WOMEN_IMAGE =
  "https://images.unsplash.com/photo-1629922949137-e236a5ab497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MjQ5ODc3N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const MEN_IMAGE =
  "https://images.unsplash.com/photo-1630173250799-2813d34ed14b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwbWluaW1hbCUyMHN0eWxlJTIwb3V0Zml0fGVufDF8fHx8MTc3MjQ5ODc3OHww&ixlib=rb-4.1.0&q=80&w=1080";
const SALE_IMAGE =
  "https://images.unsplash.com/photo-1766524871302-88590e1fa1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlJTIwZGlzY291bnQlMjBmYXNoaW9uJTIwY2xvdGhpbmclMjByYWNrfGVufDF8fHx8MTc3MjQ5ODc3OXww&ixlib=rb-4.1.0&q=80&w=1080";

interface MegaColumn {
  heading: string;
  links: { label: string; to: string }[];
}

interface MegaMenuData {
  image: string;
  imageLabel: string;
  columns: MegaColumn[];
}

const megaMenus: Record<string, MegaMenuData> = {
  Women: {
    image: WOMEN_IMAGE,
    imageLabel: "New Collection",
    columns: [
      {
        heading: "Shop by Size",
        links: [
          { label: "XS",  to: "/shop/women?size=XS" },
          { label: "S",   to: "/shop/women?size=S" },
          { label: "M",   to: "/shop/women?size=M" },
          { label: "L",   to: "/shop/women?size=L" },
          { label: "XL",  to: "/shop/women?size=XL" },
          { label: "XXL", to: "/shop/women?size=XXL" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "All Women's",      to: "/shop/women" },
          { label: "Blouses & Shirts", to: "/shop/women?q=blouse" },
          { label: "Dresses",          to: "/shop/women?q=dress" },
          { label: "Skirts",           to: "/shop/women?q=skirt" },
          { label: "Coats & Jackets",  to: "/shop/women?q=coat" },
          { label: "Knitwear",         to: "/shop/women?q=knit" },
        ],
      },
      {
        heading: "Featured",
        links: [
          { label: "New Arrivals", to: "/shop/women?sort=newest" },
          { label: "Best Sellers", to: "/shop/women?sort=featured" },
          { label: "On Sale",      to: "/shop/women?sale=true" },
          { label: "Under $30",    to: "/shop/women?maxPrice=30" },
          { label: "Under $50",    to: "/shop/women?maxPrice=50" },
        ],
      },
    ],
  },
  Men: {
    image: MEN_IMAGE,
    imageLabel: "Men's Essentials",
    columns: [
      {
        heading: "Shop by Size",
        links: [
          { label: "XS",  to: "/shop/men?size=XS" },
          { label: "S",   to: "/shop/men?size=S" },
          { label: "M",   to: "/shop/men?size=M" },
          { label: "L",   to: "/shop/men?size=L" },
          { label: "XL",  to: "/shop/men?size=XL" },
          { label: "XXL", to: "/shop/men?size=XXL" },
        ],
      },
      {
        heading: "Clothing",
        links: [
          { label: "All Men's",       to: "/shop/men" },
          { label: "T-Shirts & Tees", to: "/shop/men?q=tee" },
          { label: "Polo Shirts",     to: "/shop/men?q=polo" },
          { label: "Hoodies",         to: "/shop/men?q=hoodie" },
          { label: "Jackets",         to: "/shop/men?q=jacket" },
          { label: "Jeans & Denim",   to: "/shop/men?q=denim" },
        ],
      },
      
      {
        heading: "Featured",
        links: [
          { label: "New Arrivals", to: "/shop/men?sort=newest" },
          { label: "Best Sellers", to: "/shop/men?sort=featured" },
          { label: "On Sale",      to: "/shop/men?sale=true" },
          { label: "Under $40",    to: "/shop/men?maxPrice=40" },
          { label: "Under $100",   to: "/shop/men?maxPrice=100" },
        ],
      },
    ],
  },
  Sale: {
    image: SALE_IMAGE,
    imageLabel: "Up to 70% Off",
    columns: [
      {
        heading: "Sale by Category",
        links: [
          { label: "All Sale Items",   to: "/shop?sale=true" },
          { label: "Clothing Sale",    to: "/shop/clothing?sale=true" },
          
        ],
      },
      {
        heading: "By Price",
        links: [
          { label: "Under $10", to: "/shop?sale=true&maxPrice=10" },
          { label: "Under $20", to: "/shop?sale=true&maxPrice=20" },
          { label: "Under $30", to: "/shop?sale=true&maxPrice=30" },
          { label: "Under $50", to: "/shop?sale=true&maxPrice=50" },
          { label: "Under $100", to: "/shop?sale=true&maxPrice=100" },
        ],
      },
      {
        heading: "By Condition",
        links: [
          { label: "Excellent Condition", to: "/shop?sale=true&condition=Excellent" },
          { label: "Very Good",           to: "/shop?sale=true&condition=Very+Good" },
          { label: "Good Condition",      to: "/shop?sale=true&condition=Good" },
        ],
      },
      {
        heading: "Best Deals",
        links: [
          { label: "Biggest Discounts", to: "/shop?sort=discount" },
          { label: "Clearance",         to: "/shop?sale=true&sort=discount" },
          { label: "Featured Deals",    to: "/shop?sale=true&sort=featured" },
          { label: "New Markdowns",     to: "/shop?sale=true&sort=newest" },
        ],
      },
    ],
  },
};

const NAV_ITEMS = ["Women", "Men", "Sale"] as const;
type NavItem = (typeof NAV_ITEMS)[number];

/* ─────────────────────────── component ─────────────────────────── */

export function Navbar() {
  const { getCartCount } = useCart();
  const { getFavoritesCount } = useFavorites();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<NavItem | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<NavItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownTop, setDropdownTop] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Keep dropdownTop in sync with the navbar's actual bottom edge,
  // both on mount and on every scroll/resize.
  useEffect(() => {
    const update = () => {
      if (navRef.current) {
        setDropdownTop(navRef.current.getBoundingClientRect().bottom);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [searchOpen]); // re-run when search bar opens/closes (changes nav height)

  const openMenu = useCallback((item: NavItem) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(item);
    if (navRef.current) {
      setDropdownTop(navRef.current.getBoundingClientRect().bottom);
    }
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  /* Translated nav labels */
  const navLabels: Record<NavItem, string> = {
    Women: t.nav.women,
    Men: t.nav.men,
    Sale: t.nav.sale,
  };

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div className="bg-black text-white text-center py-2 text-xs tracking-widest uppercase">
        {t.announcement}
      </div>

      {/* ── Main navbar ── */}
      <nav ref={navRef} className="sticky top-0 z-50 bg-white border-b border-gray-100" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src={logo} alt="988 Thrift Shop" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-base tracking-[0.1em] uppercase font-semibold text-gray-900 select-none hidden sm:block">
                988 Thrift
              </span>
            </Link>

            {/* ── Desktop main nav ── */}
            <div className="hidden lg:flex items-center justify-center gap-6">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => openMenu(item)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3 py-5 text-sm tracking-widest uppercase transition-colors duration-150 select-none ${
                      item === "Sale"
                        ? "text-[#FF6B6B] font-medium"
                        : activeMenu === item
                        ? "text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {navLabels[item]}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${activeMenu === item ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* active underline */}
                  <span
                    className={`absolute bottom-0 left-6 right-6 h-[2px] bg-black transition-all duration-200 ${activeMenu === item ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                    style={{ transformOrigin: "center" }}
                  />
                </div>
              ))}
            </div>

            {/* ── Desktop right icons ── */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
              {/* Wishlist */}
              <Link
                to="/favorites"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className="w-[18px] h-[18px]" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B6B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B6B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200" />

              {/* Language toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                <button
                  onClick={() => setLang("en")}
                  className="px-2.5 py-0.5 rounded-full text-[11px] tracking-wider font-semibold transition-all duration-200"
                  style={lang === "en"
                    ? { background: "#0A0A0A", color: "#fff" }
                    : { color: "#9CA3AF" }}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("mn")}
                  className="px-2.5 py-0.5 rounded-full text-[11px] tracking-wider font-semibold transition-all duration-200"
                  style={lang === "mn"
                    ? { background: "#FF6B6B", color: "#fff" }
                    : { color: "#9CA3AF" }}
                >
                  МН
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200" />

              {/* Auth section */}
              {localStorage.getItem("data") ? (
                <UserMenu user={user ?? undefined} onLogout={logout} />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs tracking-widest uppercase text-gray-600 hover:text-black transition-colors"
                  >
                    {t.nav.logIn}
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-widest uppercase bg-[#0A0A0A] text-white hover:bg-[#FF6B6B] transition-all duration-200"
                  >
                    {t.nav.signUp}
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile right ── */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile language toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                <button
                  onClick={() => setLang("en")}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
                  style={lang === "en" ? { background: "#0A0A0A", color: "#fff" } : { color: "#9CA3AF" }}
                >EN</button>
                <button
                  onClick={() => setLang("mn")}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
                  style={lang === "mn" ? { background: "#FF6B6B", color: "#fff" } : { color: "#9CA3AF" }}
                >МН</button>
              </div>
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B6B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button className="p-2" onClick={() => setMobileOpen((v) => !v)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search bar (slides down) ── */}
        <div
          className={`overflow-hidden transition-all duration-300 border-t border-gray-100 bg-white ${searchOpen ? "max-h-20" : "max-h-0"}`}
        >
          <form onSubmit={handleSearch} className="max-w-[1440px] mx-auto px-8 py-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder={t.nav.searchPlaceholder}
              className="flex-1 text-sm outline-none placeholder:text-gray-400 tracking-wide"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors" onClick={() => setSearchOpen(false)}>
              {t.nav.close}
            </button>
          </form>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${mobileOpen ? "max-h-screen" : "max-h-0"}`}
        >
          <div className="px-6 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item}>
                <button
                  className={`w-full flex items-center justify-between py-3 text-sm tracking-widest uppercase border-b border-gray-100 ${item === "Sale" ? "text-[#FF6B6B]" : "text-gray-800"}`}
                  onClick={() => setMobileExpanded(mobileExpanded === item ? null : item)}
                >
                  {navLabels[item]}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === item && (
                  <div className="pl-4 pb-3 pt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                    {megaMenus[item].columns.flatMap((col) =>
                      col.links.map((lnk) => (
                        <Link
                          key={lnk.label + col.heading}
                          to={lnk.to}
                          className="text-sm text-gray-600 hover:text-black py-1"
                          onClick={() => setMobileOpen(false)}
                        >
                          {lnk.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link to="/shop" className="block py-3 text-sm tracking-widest uppercase text-gray-800 border-b border-gray-100" onClick={() => setMobileOpen(false)}>
              {t.nav.shopAll}
            </Link>
            <Link to="/admin" className="block py-3 text-sm tracking-widest uppercase text-gray-800" onClick={() => setMobileOpen(false)}>
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mega menu dropdown — portalled to <body> so it escapes the sticky stacking context ── */}
      {activeMenu && createPortal(
        <>
          <div
            className="fixed left-0 right-0 bg-white border-b border-gray-200 shadow-2xl"
            style={{ top: dropdownTop, zIndex: 9999 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <MegaMenuPanel item={activeMenu} onClose={() => setActiveMenu(null)} />
          </div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/10"
            style={{ top: dropdownTop, zIndex: 9998 }}
            onClick={() => setActiveMenu(null)}
          />
        </>,
        document.body
      )}
    </>
  );
}

/* ─────────────────────────── MegaMenuPanel ─────────────────────────── */

function MegaMenuPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const { t } = useLanguage();
  const data = megaMenus[item];

  /* Translated column headings per item */
  const colHeadingMap: Record<string, string> = {
    "Shop by Size": t.mega.shopBySize,
    "Clothing": t.mega.clothing,

    "Featured": t.mega.featured,
    "Sale by Category": t.mega.saleByCategory,
    "By Price": t.mega.byPrice,
    "By Condition": t.mega.byCondition,
    "Best Deals": t.mega.bestDeals,
  };

  /* Translated link labels */
  const linkLabelMap: Record<string, string> = {
    "New Arrivals": t.mega.newArrivals,
    "Best Sellers": t.mega.bestSellers,
    "On Sale": t.mega.onSale,
    "All Women's": t.mega.allWomens,
    "All Men's": t.mega.allMens,
    "All Clothing": t.mega.allClothing,

    "All Sale Items": t.mega.allSaleItems,
    "Clothing Sale": t.mega.clothingSale,
    "Biggest Discounts": t.mega.biggestDiscounts,
    "Clearance": t.mega.clearance,
    "Featured Deals": t.mega.featuredDeals,
    "New Markdowns": t.mega.newMarkdowns,
    "Blouses & Shirts": t.mega.blousesShirts,
    "Dresses": t.mega.dresses,
    "Skirts": t.mega.skirts,
    "Coats & Jackets": t.mega.coatsJackets,
    "Knitwear": t.mega.knitwear,
    "T-Shirts & Tees": t.mega.tShirtsTees,
    "Polo Shirts": t.mega.poloShirts,
    "Hoodies": t.mega.hoodies,
    "Jackets": t.mega.jackets,
    "Jeans & Denim": t.mega.jeansDenim,
    "Watches": t.mega.watches,
    "Sunglasses": t.mega.sunglasses,
    "Leather Goods": t.mega.leatherGoods,
    "Scarves": t.mega.scarves,
    "Bags & Purses": t.mega.bagsPurses,
    "Tops & T-Shirts": t.mega.tops,
    "Denim": t.mega.denim,
    "Bags": t.mega.bags,
    "Excellent Condition": t.mega.excellentCondition,
    "Very Good": t.mega.veryGood,
    "Good Condition": t.mega.goodCondition,
  };

  const imageLabelMap: Record<string, string> = {
    "New Collection": t.mega.newCollection,
    "Men's Essentials": t.mega.mensEssentials,

    "Up to 70% Off": t.mega.upTo70,
  };

  const navLabelMap: Record<NavItem, string> = {
    Women: t.nav.women,
    Men: t.nav.men,

    Sale: t.nav.sale,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="grid grid-cols-[220px_1fr] gap-12">

        {/* ── Featured image ── */}
        <div className="relative group overflow-hidden rounded-sm">
          <img
            src={data.image}
            alt={item}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-xs tracking-widest uppercase mb-1 opacity-80">{navLabelMap[item]}</p>
            <p className="text-white text-lg font-light tracking-wide">{imageLabelMap[data.imageLabel] ?? data.imageLabel}</p>
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center text-xs text-white/80 hover:text-white tracking-widest uppercase underline underline-offset-4 transition-colors"
              onClick={onClose}
            >
              {t.mega.shopNow}
            </Link>
          </div>
        </div>

        {/* ── Columns ── */}
        <div className="grid grid-cols-4 gap-8">
          {data.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4 pb-2 border-b border-gray-100">
                {colHeadingMap[col.heading] ?? col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((lnk) => (
                  <li key={lnk.label}>
                    <Link
                      to={lnk.to}
                      className="text-sm text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1 group/lnk"
                      onClick={onClose}
                    >
                      <span className="w-0 group-hover/lnk:w-2 h-px bg-black transition-all duration-200" />
                      {linkLabelMap[lnk.label] ?? lnk.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────── UserMenu ─────────────────────────── */

function UserMenu({ user, onLogout }: { user?: { firstName: string; lastName: string; email: string; joinedAt: string }; onLogout: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = `${user?.firstName[0] ?? ""}${user?.lastName[0] ?? ""}`.toUpperCase();

  const gradients = [
    "linear-gradient(135deg,#FF6B6B,#FFE66D)",
    "linear-gradient(135deg,#4ECDC4,#95E1D3)",
    "linear-gradient(135deg,#C5B9E4,#F4A3A8)",
    "linear-gradient(135deg,#FFA07A,#FFE66D)",
  ];
  const gradientIdx = (user?.firstName.charCodeAt(0) || 0) % gradients.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] flex-shrink-0"
          style={{ background: gradients[gradientIdx], fontWeight: 700 }}
        >
          {initials}
        </div>
        <span className="text-sm text-gray-700 max-w-[80px] truncate">{user?.firstName}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-3 w-64 rounded-2xl overflow-hidden z-50"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #F3F4F6" }}
          >
            {/* Header */}
            <div className="bg-[#0A0A0A] px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: gradients[gradientIdx], fontWeight: 700 }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-white/40 text-xs truncate">{user?.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="bg-white/10 text-white/60 text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase">{t.user.memberSince}</span>
              </div>
            </div>

            {/* Menu items */}
            <div className="bg-white py-2">
              {[
                { icon: User,     label: t.user.myAccount,   sub: t.user.profileSettings,   to: "/" },
                { icon: Package,  label: t.user.myOrders,    sub: t.user.trackPurchases,    to: "/shop" },
                { icon: Heart,    label: t.user.wishlist,    sub: t.user.savedItems,        to: "/shop" },
                { icon: Settings, label: t.user.preferences, sub: t.user.notificationsMore, to: "/" },
              ].map(({ icon: Icon, label, sub, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B6B]/10 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#FF6B6B] transition-colors" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>{label}</p>
                    <p className="text-gray-400 text-[11px]">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              <button
                onClick={() => { onLogout(); setOpen(false); }}
                className="w-full flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B6B] transition-colors py-1"
              >
                <LogOut className="w-4 h-4" />
                {t.user.signOut}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}