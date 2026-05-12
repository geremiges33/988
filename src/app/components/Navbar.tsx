import { Link, useLocation, useNavigate } from "react-router";
import {
  ShoppingCart,
  Search,
  Heart,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";
import React from "react";

const COLORS = {
  primary: "#1F3A2E",
  secondary: "#2D4A3A",
  accent: "#4F6F52",
  soft: "#F5F7F4",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
};

const WOMEN_IMAGE =
  "https://images.unsplash.com/photo-1629922949137-e236a5ab497d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const MEN_IMAGE =
  "https://images.unsplash.com/photo-1630173250799-2813d34ed14b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const SALE_IMAGE =
  "https://images.unsplash.com/photo-1766524871302-88590e1fa1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

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
        { label: "XS", to: "/shop/women?size=XS" },
        { label: "S", to: "/shop/women?size=S" },
        { label: "M", to: "/shop/women?size=M" },
        { label: "L", to: "/shop/women?size=L" },
        { label: "XL", to: "/shop/women?size=XL" },
      ],
    },

    {
      heading: "Price",
      links: [
        { label: "Under 50,000₮", to: "/shop/women?maxPrice=50000" },
        { label: "50,000₮ - 100,000₮", to: "/shop/women?minPrice=50000&maxPrice=100000" },
        { label: "100,000₮ - 300,000₮", to: "/shop/women?minPrice=100000&maxPrice=300000" },
        { label: "Over 300,000₮", to: "/shop/women?minPrice=300000" },
      ],
    },
  ],
},

  Men: {
  image: MEN_IMAGE,
  imageLabel: "Men Essentials",
  columns: [
    {
      heading: "Shop by Size",
      links: [
        { label: "S", to: "/shop/men?size=S" },
        { label: "M", to: "/shop/men?size=M" },
        { label: "L", to: "/shop/men?size=L" },
        { label: "XL", to: "/shop/men?size=XL" },
      ],
    },
    {
      heading: "Price",
      links: [
        { label: "Under 50,000₮", to: "/shop/men?maxPrice=50000" },
        { label: "50,000₮ - 100,000₮", to: "/shop/men?minPrice=50000&maxPrice=100000" },
        { label: "100,000₮ - 300,000₮", to: "/shop/men?minPrice=100000&maxPrice=300000" },
        { label: "Over 300,000₮", to: "/shop/men?minPrice=300000" },
      ],
    },
  ],
},

  Sale: {
    image: SALE_IMAGE,
    imageLabel: "Up to 70% Off",

    columns: [
      {
        heading: "Sale",
        links: [
          { label: "All Sale", to: "/shop?sale=true" },
          { label: "Best Deals", to: "/shop?sort=discount" },
        ],
      },
    ],
  },
};

const NAV_ITEMS = ["Women", "Men", "Sale"] as const;

type NavItem = (typeof NAV_ITEMS)[number];

export function Navbar() {
  const { getCartCount } = useCart();
  const { getFavoritesCount } = useFavorites();

  

  // AUTH
  const { user, logout } = useAuth();

  const { lang, setLang, t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

const minPrice = params.get("minPrice");
const maxPrice = params.get("maxPrice");

const isAdmin = location.pathname.startsWith("/admin");

  const [activeMenu, setActiveMenu] =
    useState<NavItem | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const navRef = useRef<HTMLElement>(null);

  const closeTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dropdownTop, setDropdownTop] = useState(0);

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const update = () => {
      if (navRef.current) {
        setDropdownTop(
          navRef.current.getBoundingClientRect().bottom
        );
      }
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const openMenu = useCallback((item: NavItem) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setActiveMenu(item);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/shop?q=${encodeURIComponent(searchQuery.trim())}`
      );

      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* TOP BAR */}

      <div
        className="text-white text-center py-2 text-[11px] uppercase"
        style={{
          background: COLORS.primary,
          letterSpacing: "0.22em",
        }}
      >
        {t.announcement}
      </div>

      {/* NAVBAR */}

      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-white border-b"
        style={{
          borderColor: COLORS.border,
          boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">
            {/* LOGO */}

            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="988 Thrift"
                className="w-10 h-10 rounded-full object-cover"
              />

              <span
                className="hidden sm:block uppercase select-none"
                style={{
                  color: COLORS.primary,
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                }}
              >
                988 THRIFT
              </span>
            </Link>

            {/* DESKTOP NAV */}

            <div className="hidden lg:flex items-center justify-center gap-8">
              {NAV_ITEMS
  .filter((item) => {
    if (!isAdmin) return true;

    // admin үед нуух зүйлс
    const hidden = ["Women", "Men", "Sale"];

    return !hidden.includes(item);
  })
  .map((item) => (
    <div
      key={item}
      className="relative"
      onMouseEnter={() => openMenu(item)}
      onMouseLeave={scheduleClose}
    >
      <button
        className="flex items-center gap-1.5 px-3 py-5 text-[12px] uppercase"
        style={{
          color:
            item === "Sale"
              ? "#557C55"
              : activeMenu === item
              ? COLORS.primary
              : COLORS.muted,
        }}
      >
        {item}

        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            activeMenu === item ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  ))}
            </div>

            {/* RIGHT SIDE */}

            <div className="hidden lg:flex items-center gap-4">

              {!isAdmin && (
  <>
    {/* SEARCH */}
    <button
      className="p-2 rounded-full hover:bg-[#F3F5F2]"
      onClick={() => setSearchOpen((v) => !v)}
    >
      <Search className="w-[18px] h-[18px]" />
    </button>

    {/* FAVORITES */}
    <Link
      to="/favorites"
      className="relative p-2 rounded-full hover:bg-[#F3F5F2]"
    >
      <Heart className="w-[18px] h-[18px]" />
      {getFavoritesCount() > 0 && (
        <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {getFavoritesCount()}
        </span>
      )}
    </Link>

    {/* CART */}
    <Link
      to="/cart"
      className="relative p-2 rounded-full hover:bg-[#F3F5F2]"
    >
      <ShoppingCart className="w-[18px] h-[18px]" />
      {getCartCount() > 0 && (
        <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {getCartCount()}
        </span>
      )}
    </Link>
  </>
)}
              

              {/* FAVORITES */}

              

              {/* CART */}

              <div className="w-px h-5 bg-gray-200" />

              {/* LANGUAGE */}

              <div className="flex items-center rounded-full p-1 gap-1 bg-[#F3F5F2]">
                <button
                  onClick={() => setLang("en")}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={
                    lang === "en"
                      ? {
                          background: COLORS.primary,
                          color: "#fff",
                        }
                      : {
                          color: COLORS.muted,
                        }
                  }
                >
                  EN
                </button>

                <button
                  onClick={() => setLang("mn")}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={
                    lang === "mn"
                      ? {
                          background: COLORS.secondary,
                          color: "#fff",
                        }
                      : {
                          color: COLORS.muted,
                        }
                  }
                >
                  МН
                </button>
              </div>

              <div className="w-px h-5 bg-gray-200" />

              {/* AUTH */}

              {user ? (
                <UserMenu
                  user={user}
                  onLogout={logout}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-[11px] uppercase"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    {t.nav.logIn}
                  </Link>

                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[11px] uppercase"
                    style={{
                      background: COLORS.primary,
                      color: "#fff",
                    }}
                  >
                    {t.nav.signUp}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}

        <div
          className={`overflow-hidden transition-all duration-300 border-t bg-white ${
            searchOpen ? "max-h-20" : "max-h-0"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="max-w-[1440px] mx-auto px-8 py-3 flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-gray-400" />

            <input
              autoFocus={searchOpen}
              type="text"
              placeholder={t.nav.searchPlaceholder}
              className="flex-1 text-sm outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

            <button
              type="button"
              className="text-xs uppercase"
              style={{
                color: COLORS.muted,
              }}
              onClick={() => setSearchOpen(false)}
            >
              {t.nav.close}
            </button>
          </form>
        </div>
      </nav>

      {/* MEGA MENU */}

      {activeMenu &&
        createPortal(
          <div
            className="fixed left-0 right-0 bg-white border-b"
            style={{
              top: dropdownTop,
              zIndex: 9999,
              borderColor: COLORS.border,
              boxShadow:
                "0 30px 60px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={() => {
              if (closeTimer.current) {
                clearTimeout(closeTimer.current);
              }
            }}
            onMouseLeave={scheduleClose}
          >
            <MegaMenuPanel item={activeMenu} />
          </div>,
          document.body
        )}
    </>
  );
}

function MegaMenuPanel({
  item,
}: {
  item: NavItem;
}) {
  const data = megaMenus[item];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="grid grid-cols-[220px_1fr] gap-12">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={data.image}
            alt={item}
            className="w-full h-64 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs uppercase opacity-80">
              {item}
            </p>

            <p className="text-xl font-light mt-1">
              {data.imageLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {data.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[11px] uppercase mb-4">
                {col.heading}
              </h3>

              <ul className="space-y-3">
                {col.links.map((lnk) => (
                  <li key={lnk.label}>
                    <Link
                      to={lnk.to}
                      className="text-sm"
                    >
                      {lnk.label}
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

function UserMenu({
  user,
  onLogout,
}: {
  user?: any;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);

  const initials = `${user?.firstName?.[0] ?? ""}${
    user?.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="relative">
      {/* PROFILE BUTTON */}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3"
      >
        {/* AVATAR */}

        <div className="w-9 h-9 rounded-full bg-[#1F3A2E] flex items-center justify-center text-white text-xs font-bold">
          {initials || "U"}
        </div>

        {/* USERNAME */}

        <div className="flex flex-col items-start">
          <span className="text-[13px] font-semibold text-[#1F3A2E] leading-none">
            {user?.username ||
              `${user?.firstName}_${user?.lastName}`}
          </span>

          <span className="text-[11px] text-gray-400 leading-none mt-1">
            {user?.email}
          </span>
        </div>

        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-72 rounded-2xl overflow-hidden z-50 bg-white"
          style={{
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.08)",
            border: "1px solid #EEF1ED",
          }}
        >
          {/* HEADER */}

          <div className="px-5 py-4 bg-[#1F3A2E]">
            <p className="text-white font-semibold text-lg">
              @{user?.username}
            </p>

            <p className="text-white/80 text-sm mt-1">
              {user?.firstName}{" "}
              {user?.lastName}
            </p>

            <p className="text-white/60 text-xs mt-1">
              {user?.email}
            </p>
          </div>

          {/* BODY */}

          <div className="p-2">
            <Link
              to="/favorites"
              className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-[#1F3A2E] py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <Heart className="w-4 h-4" />
              Favorites
            </Link>

            <Link
              to="/cart"
              className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-[#1F3A2E] py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 text-sm text-red-500 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 mt-1"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}