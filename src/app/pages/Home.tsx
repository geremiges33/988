import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "../../assets/logo.png";
import React from "react";

/* ── Images ─────────────────────────────────────────────────── */
const STORE_IMG = "https://images.unsplash.com/photo-1763888476700-aaf0881361da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdGhyaWZ0JTIwc3RvcmUlMjBjbG90aGluZyUyMHJhY2slMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM4MDEwODB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_WOMEN = "https://images.unsplash.com/photo-1651745314013-094e433d79a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd29tZW4lMjBmYXNoaW9uJTIwc2Vjb25kaGFuZCUyMHN0eWxlJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3MzgwMTA3OXww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_MEN   = "https://images.unsplash.com/photo-1741915313755-208c59c21165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjB2aW50YWdlJTIwc3RyZWV0d2VhciUyMHRocmlmdCUyMHN0eWxlfGVufDF8fHx8MTc3MzgwMTA4MHww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_ACC   = "https://images.unsplash.com/photo-1717201395289-03e4700ca8b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWNjZXNzb3JpZXMlMjB0aHJpZnQlMjBoYW5kYmFnJTIwc3VuZ2xhc3Nlc3xlbnwxfHx8fDE3NzM4MDEwODB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_KIDS  = "https://images.unsplash.com/photo-1656424692994-736ccef90d8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwdmludGFnZSUyMGNvbG9yZnVsJTIwY2xvdGhpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc3MzgwMTA4MHww&ixlib=rb-4.1.0&q=80&w=1080";
const ECO_IMG   = "https://images.unsplash.com/photo-1596456692790-2da19d2e6159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVjbyUyMGZhc2hpb24lMjBncmVlbiUyMGNsb3RoaW5nJTIwcHJlLWxvdmVkfGVufDF8fHx8MTc3MzgwMTA4M3ww&ixlib=rb-4.1.0&q=80&w=1080";
const DENIM_IMG = "https://images.unsplash.com/photo-1565532070333-43edd7d75c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGVuaW0lMjBqYWNrZXQlMjBzZWNvbmRoYW5kJTIwZmFzaGlvbiUyMHN0cmVldHxlbnwxfHx8fDE3NzM4MDEwODN8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ── Countdown ──────────────────────────────────────────────── */
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

  const tickerItems = [
    "PRE-LOVED CLOTHING",
    "ALL SALES FINAL",
    "NATUR BUILDING · UNIT 36A",
    "OPEN 11 AM – 7 PM DAILY",
    "CALL 8514 4414",
    "VINTAGE FINDS",
    "ULAANBAATAR",
    "SINCE DAY ONE",
  ];

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", color: "#0d0d0d", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        body { font-family: 'DM Sans', sans-serif; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .anim-1 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both 0.05s; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both 0.2s; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both 0.35s; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both 0.48s; }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; background: #0d0d0d; color: #faf9f7;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none;
          border: 1.5px solid #0d0d0d; border-radius: 2px; cursor: pointer;
          transition: background 0.22s, color 0.22s;
        }
        .btn-primary:hover { background: #2a2a2a; border-color: #2a2a2a; }

        .btn-ghost-light {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 31px; background: transparent; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.35); border-radius: 2px; cursor: pointer;
          transition: background 0.22s, color 0.22s, border-color 0.22s;
        }
        .btn-ghost-light:hover { background: #fff; color: #0d0d0d; border-color: #fff; }

        .btn-ghost-dark {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 31px; background: transparent; color: #0d0d0d;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none;
          border: 1.5px solid #0d0d0d; border-radius: 2px; cursor: pointer;
          transition: background 0.22s, color 0.22s;
        }
        .btn-ghost-dark:hover { background: #0d0d0d; color: #fff; }

        .btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; background: #fff; color: #0d0d0d;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none;
          border: 1.5px solid #fff; border-radius: 2px; cursor: pointer;
          transition: background 0.22s, color 0.22s;
        }
        .btn-white:hover { background: #e8e6e1; border-color: #e8e6e1; }

        /* ── Category Cards ── */
        .cat-card { position: relative; overflow: hidden; cursor: pointer; display: block; text-decoration: none; }
        .cat-card img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.65s cubic-bezier(.25,.8,.25,1); }
        .cat-card:hover img { transform: scale(1.06); }
        .cat-reveal { opacity: 0; transform: translateY(6px); transition: opacity 0.3s, transform 0.3s; }
        .cat-card:hover .cat-reveal { opacity: 1; transform: translateY(0); }

        /* ── Product Card ── */
        .prod-card { background: #fff; border: 1px solid #ece9e3; }
        .prod-card img { transition: transform 0.5s cubic-bezier(.25,.8,.25,1); }
        .prod-card:hover img { transform: scale(1.04); }
        .prod-atc { opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.25s; }
        .prod-card:hover .prod-atc { opacity: 1; transform: translateY(0); }

        /* ── Section labels ── */
        .eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: #8a8278;
        }

        .display-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900; letter-spacing: -0.02em; line-height: 0.93;
          color: #0d0d0d;
        }

        .body-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 400; line-height: 1.8;
          color: #5a554e;
        }

        .text-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #0d0d0d;
          text-decoration: none; border-bottom: 1.5px solid #0d0d0d;
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .text-link:hover { color: #8a8278; border-color: #8a8278; }

        /* ── Grids ── */
        .cat-mosaic { display: grid; grid-template-columns: 5fr 4fr 3fr; grid-template-rows: 1fr 1fr; gap: 4px; height: 600px; }
        .prod-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
        .info-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); border-top: 1px solid #e8e4dd; }
        .trust-row  { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

        /* ── Flash sale numerals ── */
        .fs-box { padding: 22px 28px; border: 1px solid rgba(255,255,255,0.08); }
        .fs-num { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1; }
        .fs-lbl { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 4px; }

        /* ── Dividers ── */
        .rule { border: none; border-top: 1px solid #e8e4dd; margin: 0; }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .flash-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .cat-mosaic { grid-template-columns: 1fr 1fr; grid-template-rows: auto; height: auto; }
        }
      `}</style>

      {/* ════════════════════════════════ HERO ════════════════════════════ */}
      <section style={{ position: "relative", height: "94vh", minHeight: 560, overflow: "hidden", background: "#1a1714" }}>
        <img
          src={STORE_IMG}
          alt="988 Thrift Shop"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
        />
        {/* Rich gradient — depth without flatness */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.9) 100%)" }} />

        {/* Top-left badge */}
        <div className="anim-1" style={{ position: "absolute", top: 36, left: 44 }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.18)",
            padding: "6px 14px", borderRadius: 1,
          }}>
            Ulaanbaatar · Est. 988
          </span>
        </div>

        {/* Centered bottom copy */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 44px 60px" }}>
          <p className="eyebrow anim-1" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
            Pre-Loved Clothing Store &nbsp;·&nbsp; Natur Building, Unit 36A
          </p>
          <h1 className="anim-2 display-heading" style={{
            fontSize: "clamp(3.8rem, 9vw, 8rem)",
            color: "#fff", margin: "0 0 20px", maxWidth: 900,
          }}>
            Wear the<br />past. Own<br />the moment.
          </h1>
          <p className="anim-3 body-text" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 34, maxWidth: 380, fontSize: 14 }}>
            Carefully curated second-hand pieces at prices that make sense. Every item has a story — find yours.
          </p>
          <div className="anim-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/shop" className="btn-white">Explore Collection</Link>
            <a href="tel:85144414" className="btn-ghost-light">8514 4414</a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ POLICY BAR ══════════════════════════ */}
      <div style={{ background: "#0d0d0d", padding: "12px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
          All Sales Final &nbsp;·&nbsp; No Returns or Exchanges
        </p>
      </div>

      {/* ══════════════════════════════ TICKER ════════════════════════════ */}
      <div style={{ background: "#f0ede7", borderBottom: "1px solid #e8e4dd", padding: "11px 0", overflow: "hidden" }}>
        <div style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "ticker 36s linear infinite" }}>
          {Array(6).fill(null).flatMap((_, i) =>
            tickerItems.map((item, j) => (
              <span key={`${i}-${j}`}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#4a4540", padding: "0 32px" }}>{item}</span>
                <span style={{ fontSize: 10, color: "#c4bfb7", padding: "0 2px" }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══════════════════════════ INFO STRIP ═══════════════════════════ */}
      <div className="info-strip">
        {[
          { label: "Find us", heading: "Natur Building, Unit 36A", sub: "Behind New Mongolia School · Ulaanbaatar" },
          { label: "Hours",   heading: "11:00 AM – 7:00 PM",       sub: "Open every day, no appointment needed" },
          { label: "Contact", heading: "8514 4414",                 sub: "Call or text us during store hours" },
          { label: "Policy",  heading: "All Sales Final",           sub: "Items sold as-is — no returns, no exchanges" },
        ].map(({ label, heading, sub }) => (
          <div key={label} style={{ padding: "28px 24px", borderRight: "1px solid #e8e4dd", borderBottom: "1px solid #e8e4dd" }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>{label}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#0d0d0d", letterSpacing: "-0.01em" }}>{heading}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", margin: 0, fontSize: 12, color: "#8a8278", lineHeight: 1.6 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════ CATEGORIES ══════════════════════════ */}
      <section style={{ padding: "72px 0 0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Shop by Category</p>
              <h2 className="display-heading" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", margin: 0 }}>
                {h.categoriesTitle}
              </h2>
            </div>
            <Link to="/shop" className="text-link">View all →</Link>
          </div>

          <div className="cat-mosaic">
            {/* Women — tall */}
            <Link to="/shop/clothing" className="cat-card" style={{ gridColumn: 1, gridRow: "1 / 3" }}>
              <img src={CAT_WOMEN} alt="Women" style={{ height: "100%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.82) 0%, rgba(13,13,13,0.05) 50%)" }} />
              <div style={{ position: "absolute", top: 20, left: 20 }}>
                <span style={{ background: "#faf9f7", color: "#0d0d0d", fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "5px 12px" }}>New In</span>
              </div>
              <div style={{ position: "absolute", bottom: 28, left: 28, right: 28 }}>
                <h3 className="display-heading" style={{ color: "#fff", fontSize: "2.6rem", margin: "0 0 18px" }}>{h.cat_women}</h3>
                <span className="btn-white cat-reveal" style={{ fontSize: 11, padding: "9px 20px" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Men */}
            <Link to="/shop/clothing" className="cat-card" style={{ gridColumn: 2, gridRow: 1 }}>
              <img src={CAT_MEN} alt="Men" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.75) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 22, left: 22 }}>
                <h3 className="display-heading" style={{ color: "#fff", fontSize: "1.8rem", margin: "0 0 12px" }}>{h.cat_men}</h3>
                <span className="btn-white cat-reveal" style={{ fontSize: 10, padding: "8px 18px" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Accessories */}
            <Link to="/shop/accessories" className="cat-card" style={{ gridColumn: 3, gridRow: 1 }}>
              <img src={CAT_ACC} alt="Accessories" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.75) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <h3 className="display-heading" style={{ color: "#fff", fontSize: "1.25rem", margin: "0 0 10px" }}>{h.cat_accessories}</h3>
                <span className="btn-white cat-reveal" style={{ fontSize: 10, padding: "7px 15px" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Kids */}
            <Link to="/shop" className="cat-card" style={{ gridColumn: "2 / 4", gridRow: 2 }}>
              <img src={CAT_KIDS} alt="Kids" style={{ objectPosition: "top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,0.75) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)" }}>
                <p className="eyebrow" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>For the little ones</p>
                <h3 className="display-heading" style={{ color: "#fff", fontSize: "2rem", margin: "0 0 16px" }}>{h.cat_kids}</h3>
                <span className="btn-white cat-reveal" style={{ fontSize: 10, padding: "8px 18px" }}>Explore</span>
              </div>
              <div style={{ position: "absolute", top: 20, right: 22 }}>
                <span style={{ background: "#faf9f7", color: "#0d0d0d", fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 12px" }}>Best Value</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRENDING ════════════════════════════ */}
      <section style={{ padding: "88px 0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Just Arrived</p>
              <h2 className="display-heading" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", margin: 0 }}>
                {h.trendingTitle}
              </h2>
            </div>
            <Link to="/shop" className="text-link">{h.viewAll} →</Link>
          </div>
          <div className="prod-grid">
            {trending.map((product, i) => (
              <ThriftCard key={product.id} product={product} index={i} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FLASH SALE ═════════════════════════ */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid #1c1c1c" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 48px 0", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ background: "#fff", color: "#0d0d0d", fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", padding: "6px 14px" }}>
                Flash Sale
              </span>
              <p style={{ margin: 0, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                Ends in
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[
                  { val: countdown.h, label: "hr" },
                  { val: countdown.m, label: "min" },
                  { val: countdown.s, label: "sec" },
                ].map(({ val, label }, idx) => (
                  <span key={label} style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    {idx > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 16, marginRight: 2 }}>:</span>}
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                      {String(val).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{label}</span>
                  </span>
                ))}
              </div>
            </div>
            <Link to="/shop?sale=true" className="btn-ghost-light" style={{ fontSize: 11, padding: "10px 22px" }}>View All Deals</Link>
          </div>

          {/* Main split */}
          <div className="flash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 460 }}>
            {/* Left: image */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: 420 }}>
              <img src={DENIM_IMG} alt="Flash Sale" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,13,13,0.65) 0%, transparent 65%)" }} />
              <div style={{ position: "absolute", top: 44, left: 44 }}>
                <h2 className="display-heading" style={{
                  fontSize: "clamp(3.2rem, 5.5vw, 5.5rem)",
                  color: "#fff", margin: 0, lineHeight: 0.88,
                }}>
                  Up to<br />70%<br />off.
                </h2>
              </div>
            </div>

            {/* Right: copy + stats */}
            <div style={{ padding: "44px 52px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 36 }}>
              <div>
                <p className="eyebrow" style={{ color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Today only</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: 0, maxWidth: 360 }}>
                  Hundreds of hand-picked pieces, steeply reduced. Affordable prices, real quality — the best deals we've had all season.
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)" }}>
                {[
                  { num: "70%",   lbl: "Max Off" },
                  { num: "200+",  lbl: "Items" },
                  { num: "1 Day", lbl: "Only" },
                ].map(({ num, lbl }, i) => (
                  <div key={lbl} className="fs-box" style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.06)" } : {}}>
                    <div className="fs-num">{num}</div>
                    <div className="fs-lbl">{lbl}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/shop?sale=true" className="btn-white">Shop the Sale</Link>
                <Link to="/shop" className="btn-ghost-light" style={{ fontSize: 11, padding: "10px 22px" }}>Browse All</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ ABOUT ══════════════════════════════ */}
      <section style={{ borderTop: "1px solid #e8e4dd", background: "#faf9f7" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "88px 52px" }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Our Story</p>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "start" }}>
            {/* Left */}
            <div>
              <h2 className="display-heading" style={{ fontSize: "clamp(2.6rem, 4vw, 4.2rem)", margin: "0 0 32px" }}>
                Ulaanbaatar's<br />favourite<br />thrift shop.
              </h2>
              <p className="body-text" style={{ marginBottom: 20, maxWidth: 460 }}>
                988 Thrift Shop is where Ulaanbaatar comes to find pre-loved clothing that doesn't cost a fortune. With over 54,000 followers on Instagram, we've built something bigger than a store — a community that believes in style without waste.
              </p>
              <p className="body-text" style={{ marginBottom: 40, maxWidth: 460 }}>
                Every piece is hand-selected for quality and character. Vintage denim, rare accessories, everyday staples — all at honest prices, because great fashion should be for everyone.
              </p>
              <Link to="/shop" className="btn-primary">Browse the Collection</Link>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 2, aspectRatio: "4/3" }}>
                <img src={ECO_IMG} alt="988 Thrift Shop" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ borderTop: "1px solid #e8e4dd" }}>
                {[
                  { label: "Address",   value: "Natur Building, Unit 36A\nBehind New Mongolia School, Ulaanbaatar" },
                  { label: "Hours",     value: "11:00 AM – 7:00 PM · Open every day" },
                  { label: "Phone",     value: "8514 4414" },
                  { label: "Policy",    value: "All sales final — no returns or exchanges" },
                  { label: "Community", value: "54,000+ followers on Instagram" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 24, padding: "14px 0", borderBottom: "1px solid #e8e4dd" }}>
                    <span className="eyebrow" style={{ width: 88, flexShrink: 0, paddingTop: 2 }}>{label}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#0d0d0d", lineHeight: 1.65, whiteSpace: "pre-line" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRUST STRIP ═════════════════════════ */}
      <section style={{ borderTop: "1px solid #e8e4dd", background: "#f0ede7" }}>
        <div className="trust-row">
          {[
            { title: "Pre-Loved Fashion",   sub: "Every piece carries a story" },
            { title: "One-of-a-Kind Finds", sub: "No two items are ever the same" },
            { title: "Honest Prices",       sub: "Great style, no markups" },
            { title: "54K Community",       sub: "Trusted across Ulaanbaatar" },
          ].map(({ title, sub }, i, arr) => (
            <div key={title} style={{ padding: "32px 28px", borderRight: i < arr.length - 1 ? "1px solid #e8e4dd" : "none" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "#0d0d0d", margin: "0 0 5px" }}>{title}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#8a8278", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ CONTACT CTA ═════════════════════════ */}
      <section style={{ background: "#0d0d0d", padding: "108px 28px", textAlign: "center" }}>
        <img
          src={logo}
          alt="988 Thrift Shop"
          style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginBottom: 36, display: "inline-block", border: "1.5px solid rgba(255,255,255,0.12)", filter: "grayscale(20%)" }}
        />
        <p className="eyebrow" style={{ color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Come see us</p>
        <h2 className="display-heading" style={{
          fontSize: "clamp(3rem, 8vw, 6.5rem)",
          color: "#fff", margin: "0 auto 24px", maxWidth: 760,
        }}>
          Visit us in<br />Ulaanbaatar.
        </h2>
        <p className="body-text" style={{ color: "rgba(255,255,255,0.35)", margin: "0 auto 44px", maxWidth: 380, fontSize: 14, lineHeight: 1.9 }}>
          Natur Building, Unit 36A<br />
          Behind New Mongolia School<br />
          Open 11:00 AM – 7:00 PM · Every day
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <a href="tel:85144414" className="btn-white">Call 8514 4414</a>
          <Link to="/shop" className="btn-ghost-light">Shop Online</Link>
        </div>
        <p className="eyebrow" style={{ color: "rgba(255,255,255,0.18)" }}>
          All Sales Final &nbsp;·&nbsp; No Returns or Exchanges
        </p>
      </section>

    </div>
  );
}

/* ════════════════════════════ PRODUCT CARD ══════════════════════════ */
function ThriftCard({
  product, onAddToCart,
}: {
  product: { id: string; name: string; price: number; originalPrice?: number; imageUrl: string; condition: string; category: string };
  index: number;
  onAddToCart: () => void;
}) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="prod-card">
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: "#f0ede7" }}>
        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

        {discount && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#0d0d0d", color: "#fff",
            fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "4px 10px",
          }}>
            −{discount}%
          </div>
        )}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(250,249,247,0.92)", color: "#0d0d0d",
          fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
          padding: "4px 9px",
        }}>
          {product.condition}
        </div>

        {/* Quick add */}
        <div className="prod-atc" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
          <button
            style={{
              width: "100%", padding: "11px",
              background: "#0d0d0d", color: "#fff",
              fontFamily: "'DM Sans',sans-serif",
              border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onClick={e => { e.preventDefault(); onAddToCart(); }}
            onMouseOver={e => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseOut={e => (e.currentTarget.style.background = "#0d0d0d")}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 12px 16px" }}>
        <p className="eyebrow" style={{ marginBottom: 3 }}>{product.category}</p>
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          margin: "0 0 8px", fontWeight: 600, fontSize: 14, color: "#0d0d0d",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em",
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "#0d0d0d" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#b0a99e", textDecoration: "line-through" }}>
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#5a7a5a" }}>
              {discount}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}