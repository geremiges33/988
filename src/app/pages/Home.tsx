import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowRight, Phone, MapPin, Clock, ShoppingBag,
  Recycle, Tag, ChevronRight, Sparkles, AlertCircle,
  Heart
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "/Documents and Settings/Nest/Downloads/Thrift Shop Website (0)/src/assets/logo.png";

/* ── Images ───────────────────────────────────────────────── */
const STORE_IMG   = "https://images.unsplash.com/photo-1763888476700-aaf0881361da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdGhyaWZ0JTIwc3RvcmUlMjBjbG90aGluZyUyMHJhY2slMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM4MDEwODB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_WOMEN   = "https://images.unsplash.com/photo-1651745314013-094e433d79a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd29tZW4lMjBmYXNoaW9uJTIwc2Vjb25kaGFuZCUyMHN0eWxlJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3MzgwMTA3OXww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_MEN     = "https://images.unsplash.com/photo-1741915313755-208c59c21165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjB2aW50YWdlJTIwc3RyZWV0d2VhciUyMHRocmlmdCUyMHN0eWxlfGVufDF8fHx8MTc3MzgwMTA4MHww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_ACC     = "https://images.unsplash.com/photo-1717201395289-03e4700ca8b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWNjZXNzb3JpZXMlMjB0aHJpZnQlMjBoYW5kYmFnJTIwc3VuZ2xhc3Nlc3xlbnwxfHx8fDE3NzM4MDEwODB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_KIDS    = "https://images.unsplash.com/photo-1656424692994-736ccef90d8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwdmludGFnZSUyMGNvbG9yZnVsJTIwY2xvdGhpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc3MzgwMTA4MHww&ixlib=rb-4.1.0&q=80&w=1080";
const ECO_IMG     = "https://images.unsplash.com/photo-1596456692790-2da19d2e6159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVjbyUyMGZhc2hpb24lMjBncmVlbiUyMGNsb3RoaW5nJTIwcHJlLWxvdmVkfGVufDF8fHx8MTc3MzgwMTA4M3ww&ixlib=rb-4.1.0&q=80&w=1080";
const DENIM_IMG   = "https://images.unsplash.com/photo-1565532070333-43edd7d75c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGVuaW0lMjBqYWNrZXQlMjBzZWNvbmRoYW5kJTIwZmFzaGlvbiUyMHN0cmVldHxlbnwxfHx8fDE3NzM4MDEwODN8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ── Countdown helper ─────────────────────────────────────── */
function useCountdown(h0: number, m0: number, s0: number) {
  const [time, setTime] = useState({ h: h0, m: m0, s: s0 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ═══════════════════════════════════════════════════════════ */
export function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const h = t.home;

  const trending = products.slice(0, 8);
  const countdown = useCountdown(6, 28, 44);

  /* Ticker */
  const tickerText = [
    "♻️ ХУУЧИН ХУВЦАСНЫ ДЭЛГҮҮР",
    "•",
    "❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ",
    "•",
    "📍 НАТУР, 36A БАЙР",
    "•",
    "🟢 11:00 – 20:00 ЦАГ",
    "•",
    "📲 85144414 / 86310103",
    "•",
    "VINTAGE FINDS · UNIQUE PIECES",
    "•",
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[100vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1A0D 0%, #1A3A1A 45%, #0D2010 100%)" }}
      >
        {/* Background store image */}
        <div className="absolute inset-0 lg:left-[50%] overflow-hidden">
          <img src={STORE_IMG} alt="988 Thrift Shop" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0D1A0D 0%, #0D1A0D/70 40%, transparent 100%)" }} />
        </div>

        {/* Green glow blobs */}
        <div className="absolute top-20 left-[35%] w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-20 left-[20%] w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "#72C172" }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 py-20 w-full">
          <div className="max-w-[600px]">

            {/* Logo + Name */}
            <div className="flex items-center gap-5 mb-10">
              <div className="relative">
                <img
                  src={logo}
                  alt="988 Thrift Shop"
                  className="w-28 h-28 rounded-full object-cover"
                  style={{ border: "3px solid #4A9E4A", boxShadow: "0 0 40px rgba(74,158,74,0.4)" }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#4A9E4A] text-white text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase">
                  Open
                </div>
              </div>
              <div>
                <h1
                  className="text-white"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}
                >
                  988<br />
                  <span style={{ color: "#4A9E4A" }}>Thrift</span>
                  <span className="text-white/70"> Shop</span>
                </h1>
              </div>
            </div>

            {/* Mongolian tagline */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">♻️</span>
              <p className="text-green-300 text-xl" style={{ fontWeight: 600 }}>
                Хуучин хувцасны дэлгүүр
              </p>
            </div>

            <p className="text-white/55 text-base mb-8 leading-relaxed max-w-md">
              Unique vintage & pre-loved fashion at unbeatable prices. Give clothes a second life.
            </p>

            {/* No-returns notice */}
            <div
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm"
              style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.4)", color: "#FF6B6B" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest uppercase transition-all duration-300"
                style={{ background: "#4A9E4A", color: "white" }}
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:85144414"
                className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 rounded-full text-sm tracking-widest uppercase hover:border-[#4A9E4A] hover:text-[#4A9E4A] transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>

            {/* Store quick info */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: MapPin, text: "Натур, 36A байр", color: "#4A9E4A" },
                { icon: Clock,  text: "11:00 – 20:00",   color: "#FFE66D" },
                { icon: Phone,  text: "85144414",          color: "#4ECDC4" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <span className="text-white/60 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-green-400 animate-pulse" />
          <span className="text-green-400 text-[10px] tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TICKER TAPE                                           */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-[#1A3A1A] py-3 overflow-hidden border-y border-[#2E6B2E]">
        <div
          className="whitespace-nowrap inline-block"
          style={{ animation: "ticker 30s linear infinite" }}
        >
          {Array(4).fill(tickerText.join("  ")).join("  ")}
        </div>
        <style>{`
          @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* NO-RETURNS POLICY ALERT                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="bg-[#FF6B6B] py-5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-center">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-base tracking-wide">
              <span className="font-bold">❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</span>
              <span className="mx-3 opacity-60">·</span>
              <span className="text-white/85">All sales final — No returns or exchanges accepted.</span>
            </p>
            <AlertCircle className="w-6 h-6 flex-shrink-0 hidden sm:block" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STORE INFO CARDS                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-10 bg-[#F7F5F2]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: MapPin,
                title: "Байршил",
                subtitle: "Our Location",
                text: "Натур, Шинэ Монгол сургуулийн хойно 36A байр",
                color: "#4A9E4A",
                bg: "#F0FAF0",
              },
              {
                icon: Clock,
                title: "Цагийн хуваарь",
                subtitle: "Working Hours",
                text: "🟢 11:00 – 20:00 цаг · Өдөр бүр",
                color: "#2D7A2D",
                bg: "#F0FAF0",
              },
              {
                icon: Phone,
                title: "Утас",
                subtitle: "Call Us",
                text: "📲 85144414\n86310103",
                color: "#4ECDC4",
                bg: "#F0FAFA",
              },
              {
                icon: AlertCircle,
                title: "Бодлого",
                subtitle: "Store Policy",
                text: "❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ",
                color: "#FF6B6B",
                bg: "#FFF5F5",
              },
            ].map(({ icon: Icon, title, subtitle, text, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: bg, border: `1px solid ${color}22` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{title}</p>
                  <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">{subtitle}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-snug">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CATEGORIES                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-2">Browse</p>
              <h2
                className="text-gray-900"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
              >
                {h.categoriesTitle}
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#4A9E4A] transition-colors tracking-widest uppercase"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px]">

            {/* Women – tall left */}
            <Link to="/shop/clothing" className="group col-span-5 row-span-2 relative overflow-hidden rounded-2xl">
              <img src={CAT_WOMEN} alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-[#4A9E4A] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">New In</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-white/60 text-xs tracking-widest uppercase">Collection</span>
                <h3 className="text-white mt-1 mb-3" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.1 }}>{h.cat_women}</h3>
                <div className="inline-flex items-center gap-2 text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#4A9E4A] px-4 py-2 rounded-full">
                  {h.shopNow} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Men – top right */}
            <Link to="/shop/clothing" className="group col-span-4 row-span-1 relative overflow-hidden rounded-2xl">
              <img src={CAT_MEN} alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{h.cat_men}</h3>
                <div className="flex items-center gap-1 text-white/70 text-xs tracking-widest uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {h.shopNow} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Accessories – top far right */}
            <Link to="/shop/accessories" className="group col-span-3 row-span-1 relative overflow-hidden rounded-2xl">
              <img src={CAT_ACC} alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{h.cat_accessories}</h3>
              </div>
            </Link>

            {/* Kids – bottom right wide */}
            <Link to="/shop" className="group col-span-7 row-span-1 relative overflow-hidden rounded-2xl">
              <img src={CAT_KIDS} alt="Kids" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <span className="text-white/60 text-xs tracking-widest uppercase">For the little ones</span>
                <h3 className="text-white mt-1" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{h.cat_kids}</h3>
                <div className="flex items-center gap-2 text-white text-xs tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute top-5 right-5 bg-[#FFE66D] text-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                Best Deals
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TRENDING NOW                                          */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F7F5F2]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-2">Just In</p>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "#0A0A0A" }}>
                {h.trendingTitle}
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 bg-[#1A3A1A] text-white px-6 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-[#4A9E4A] transition-colors"
            >
              {h.viewAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((product, i) => (
              <ThriftCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FLASH SALE BANNER                                     */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20" style={{ background: "#0D1A0D" }}>
        {/* Background denim image */}
        <div className="absolute inset-0">
          <img src={DENIM_IMG} alt="Sale" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0D1A0D 0%, transparent 60%)" }} />
        </div>

        {/* Green diagonal accent */}
        <div
          className="absolute inset-y-0 right-0 w-2/5 opacity-5"
          style={{ background: "linear-gradient(135deg, #4A9E4A, #72C172)", clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm tracking-widest uppercase mb-8"
              style={{ background: "#4A9E4A22", color: "#72C172", border: "1px solid #4A9E4A44" }}
            >
              <Sparkles className="w-4 h-4" />
              Flash Deals — Today Only
            </div>

            <h2
              className="text-white mb-4"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9 }}
            >
              UP TO<br />
              <span style={{ color: "#FFE66D" }}>70% OFF</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-sm leading-relaxed">
              Hundreds of pre-loved pieces, drastically reduced. Grab them before they're gone!
            </p>

            {/* Countdown */}
            <div className="flex gap-4 mb-10">
              {[
                { label: h.hours,   val: countdown.h },
                { label: h.minutes, val: countdown.m },
                { label: h.seconds, val: countdown.s },
              ].map(({ label, val }) => (
                <div key={label} className="text-center">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-white mb-2"
                    style={{ background: "rgba(74,158,74,0.12)", border: "1px solid rgba(74,158,74,0.25)", fontSize: "2.2rem", fontWeight: 800 }}
                  >
                    {String(val).padStart(2, "0")}
                  </div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/shop?sale=true"
              className="group inline-flex items-center gap-3 bg-[#4A9E4A] text-white px-10 py-5 rounded-full text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#FFE66D] hover:text-black"
            >
              {h.flashSaleTitle}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Floating badges */}
        {[
          { label: "Vintage", color: "#4A9E4A", top: "15%", right: "12%" },
          { label: "Unique",  color: "#FFE66D", top: "55%", right: "8%" },
          { label: "Sale ♻️", color: "#4ECDC4", top: "35%", right: "25%" },
        ].map((tag) => (
          <div
            key={tag.label}
            className="hidden lg:flex absolute items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-widest uppercase"
            style={{ top: tag.top, right: tag.right, background: tag.color + "22", color: tag.color, border: `1px solid ${tag.color}55` }}
          >
            <Tag className="w-3 h-3" />
            {tag.label}
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ABOUT / ECO BANNER                                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden h-96">
              <img src={ECO_IMG} alt="Sustainable" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,26,13,0.6) 0%, transparent 60%)" }} />
              <div className="absolute bottom-8 left-8">
                <div className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-4 py-2 rounded-full text-xs tracking-widest uppercase">
                  <Recycle className="w-4 h-4" />
                  Eco-Friendly Shopping
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">About 988 Thrift</p>
              <h2
                className="text-gray-900 mb-6"
                style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                ♻️ Хуучин хувцасны<br />
                <span style={{ color: "#4A9E4A" }}>дэлгүүр</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                We are 988 Thrift Shop — a vintage clothing store located in Ulaanbaatar, Mongolia.
                Every item we carry has its own story, and we believe pre-loved fashion deserves a second life.
              </p>

              {/* Info list */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: MapPin, label: "Натур, Шинэ Монгол сургуулийн хойно 36A байр", color: "#4A9E4A" },
                  { icon: Clock,  label: "Нээлттэй: 11:00 – 20:00 цаг, өдөр бүр",        color: "#2D7A2D" },
                  { icon: Phone,  label: "📲 85144414 · 86310103",                         color: "#4ECDC4" },
                  { icon: AlertCircle, label: "❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ",           color: "#FF6B6B" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "15" }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <p className="text-gray-700 text-sm pt-1.5">{label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-[#1A3A1A] text-white px-8 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#4A9E4A] transition-all duration-300"
              >
                Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TRUST BAR                                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0D1A0D] border-y border-[#2E6B2E]/30 py-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Recycle,     title: "♻️ Eco Fashion",   sub: "Give clothes a second life" },
              { icon: Tag,         title: "Unique Pieces",    sub: "One-of-a-kind vintage finds" },
              { icon: ShoppingBag, title: "Great Prices",     sub: "Quality at affordable costs" },
              { icon: Heart,       title: "Trusted Store",    sub: "Real vintage, real quality" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1A3A1A] flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#4A9E4A]" />
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTACT CTA                                           */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-[#0D1A0D] overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-8" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-6" style={{ background: "#72C172" }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="988 Thrift Shop"
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: "3px solid #4A9E4A44", boxShadow: "0 0 60px rgba(74,158,74,0.2)" }}
            />
          </div>

          <span className="inline-block text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-5">Come Visit Us</span>
          <h2
            className="text-white mx-auto mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, maxWidth: "700px" }}
          >
            Find Us in<br />
            <span style={{ color: "#4A9E4A" }}>Ulaanbaatar</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            📍 Натур, Шинэ Монгол сургуулийн хойно 36A байр<br />
            🟢 11:00 – 20:00 цаг · Өдөр бүр нээлттэй
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:85144414"
              className="inline-flex items-center gap-3 bg-[#4A9E4A] text-white px-8 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#72C172] transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              📲 85144414
            </a>
            <a
              href="tel:86310103"
              className="inline-flex items-center gap-3 border border-[#4A9E4A]/40 text-[#4A9E4A] px-8 py-4 rounded-full text-sm tracking-widest uppercase hover:border-[#4A9E4A] hover:bg-[#4A9E4A]/10 transition-all"
            >
              <Phone className="w-4 h-4" />
              📲 86310103
            </a>
          </div>

          {/* No-returns reminder */}
          <div
            className="inline-flex items-center gap-2 mt-10 px-5 py-2.5 rounded-full text-sm"
            style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)", color: "#FF6B6B" }}
          >
            <AlertCircle className="w-4 h-4" />
            ❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ — All sales are final.
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Thrift Card ──────────────────────────────────────────── */
function ThriftCard({
  product,
  index,
  onAddToCart,
}: {
  product: { id: string; name: string; price: number; originalPrice?: number; imageUrl: string; condition: string; category: string };
  index: number;
  onAddToCart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const tagColors = ["#4A9E4A", "#4ECDC4", "#FFE66D", "#FF6B6B", "#72C172", "#4A9E4A", "#FFE66D", "#4ECDC4"];
  const accent = tagColors[index % tagColors.length];
  const isDark = accent === "#4A9E4A" || accent === "#4ECDC4" || accent === "#FF6B6B" || accent === "#72C172";

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#F7F5F2]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: hovered ? 1 : 0 }}
        />

        {/* Discount badge */}
        {discount && (
          <div
            className="absolute top-3 left-3 text-[11px] tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ background: "#FF6B6B", color: "white", fontWeight: 700 }}
          >
            -{discount}%
          </div>
        )}

        {/* Condition badge */}
        <div
          className="absolute top-3 right-3 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: accent, color: isDark ? "white" : "#0A0A0A", fontWeight: 600 }}
        >
          {product.condition}
        </div>

        {/* Quick add on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(10px)" }}
        >
          <button
            className="w-full py-3 rounded-xl text-sm tracking-widest uppercase transition-colors"
            style={{ background: "#4A9E4A", color: "white", fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); onAddToCart(); }}
          >
            + Add to Cart
          </button>
        </div>

        {/* Recycle tag */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-0">
          <span className="text-lg">♻️</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
        <p className="text-gray-900 text-sm truncate mb-2" style={{ fontWeight: 600 }}>{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">${product.originalPrice.toFixed(2)}</span>
          )}
          <span className="ml-auto text-white text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "#4A9E4A", fontWeight: 600 }}>
            ♻️
          </span>
        </div>
      </div>
    </div>
  );
}
