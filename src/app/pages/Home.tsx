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
    "PRE-LOVED CLOTHING STORE",
    "ALL SALES FINAL — NO RETURNS OR EXCHANGES",
    "NATUR BUILDING · UNIT 36A",
    "OPEN 11:00 AM – 7:00 PM",
    "CALL 85144414",
    "VINTAGE FINDS",
    "UNIQUE PIECES",
    "PRE-LOVED FASHION",
  ];

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#fff", color: "#111", overflowX: "hidden" }}>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .nf1 { animation: fadeUp 0.55s ease both 0.05s; }
        .nf2 { animation: fadeUp 0.55s ease both 0.18s; }
        .nf3 { animation: fadeUp 0.55s ease both 0.3s; }
        .nf4 { animation: fadeUp 0.55s ease both 0.42s; }

        .n-btn-w {
          display: inline-block; padding: 14px 28px;
          background: #fff; color: #111; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          border-radius: 30px; border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .n-btn-w:hover { background: #e5e5e5; }

        .n-btn-b {
          display: inline-block; padding: 14px 28px;
          background: #111; color: #fff; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          border-radius: 30px; border: none; cursor: pointer;
          transition: background 0.18s;
        }
        .n-btn-b:hover { background: #333; }

        .n-btn-ol {
          display: inline-block; padding: 13px 27px;
          background: transparent; color: #fff; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          border-radius: 30px; border: 1.5px solid rgba(255,255,255,0.4); cursor: pointer;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }
        .n-btn-ol:hover { background: #fff; color: #111; border-color: #fff; }

        .n-btn-ol-dark {
          display: inline-block; padding: 13px 27px;
          background: transparent; color: #111; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          border-radius: 30px; border: 1.5px solid #111; cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .n-btn-ol-dark:hover { background: #111; color: #fff; }

        .n-cat { position: relative; overflow: hidden; cursor: pointer; display: block; text-decoration: none; }
        .n-cat img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s cubic-bezier(.25,.8,.25,1); }
        .n-cat:hover img { transform: scale(1.04); }
        .n-cat:hover .n-cat-btn { opacity: 1 !important; }

        .n-card { background: #f6f6f6; }
        .n-card img { transition: transform 0.45s cubic-bezier(.25,.8,.25,1); }
        .n-card:hover img { transform: scale(1.05); }
        .n-card:hover .n-qadd { opacity: 1 !important; transform: translateY(0) !important; }

        .n-lbl { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #757575; }
        .n-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #111; margin: 0 0 32px; }
        .n-ulink { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #111; text-decoration: underline; text-underline-offset: 3px; }
        .n-ulink:hover { color: #555; }

        .n-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); border-top: 1px solid #e5e5e5; border-left: 1px solid #e5e5e5; }
        .n-info-cell { padding: 28px 24px; border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; }

        .n-cat-grid { display: grid; grid-template-columns: 5fr 4fr 3fr; grid-template-rows: 1fr 1fr; gap: 6px; height: 580px; }

        .n-prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }

        .n-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 520px; }

        .n-trust { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

        /* Flash sale stat boxes */
        .fs-stat { display: flex; flex-direction: column; gap: 4px; padding: 20px 24px; border: 1px solid rgba(255,255,255,0.1); }
        .fs-stat-num { font-size: 2.2rem; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1; }
        .fs-stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.35); }

        @media (max-width: 900px) {
          .n-split { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .n-cat-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; height: auto; }
        }
      `}</style>

      {/* ════════════════════════════════ HERO ══════════════ */}
      <section style={{ position: "relative", height: "92vh", minHeight: 540, overflow: "hidden", background: "#111" }}>
        <img
          src={STORE_IMG}
          alt="988 Thrift Shop"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.52 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 56px" }}>
          <p className="n-lbl nf1" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
            Ulaanbaatar · Natur Building, Unit 36A · Open 11:00 AM – 7:00 PM
          </p>
          <h1 className="nf2" style={{
            fontWeight: 900,
            fontSize: "clamp(3.4rem, 8vw, 7rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            color: "#fff",
            margin: "0 0 22px",
            maxWidth: 860,
          }}>
            ♻️ Pre-Loved<br />Fashion<br />Store.
          </h1>
          <p className="nf3" style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 30, maxWidth: 400, lineHeight: 1.65 }}>
            Affordable prices, quality finds —<br />pre-loved fashion for everyone. Every piece has a story.
          </p>
          <div className="nf4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/shop" className="n-btn-w">Shop Now</Link>
            <a href="tel:85144414" className="n-btn-ol">Call Us: 85144414</a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ POLICY BAR ════════════ */}
      <div style={{ background: "#111", padding: "11px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
          ALL SALES FINAL &nbsp;·&nbsp; No Returns or Exchanges
        </p>
      </div>

      {/* ═══════════════════════════════ TICKER ════════════ */}
      <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e5e5e5", padding: "10px 0", overflow: "hidden" }}>
        <div style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "ticker 32s linear infinite" }}>
          {Array(5).fill(null).flatMap((_, i) =>
            tickerItems.map((item, j) => (
              <span key={`${i}-${j}`}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#111", padding: "0 28px" }}>{item}</span>
                <span style={{ fontSize: 11, color: "#bbb", padding: "0 4px" }}>·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══════════════════════ STORE INFO GRID ════════════ */}
      <div className="n-info-grid">
        {[
          { label: "Location", title: "Natur Building, Unit 36A",   text: "Behind New Mongolia School\nUlaanbaatar" },
          { label: "Hours",    title: "11:00 AM – 7:00 PM",         text: "Open every day\nNo appointment needed" },
          { label: "Contact",  title: "85144414",                    text: "Call or message\nduring store hours" },
          { label: "Policy",   title: "All Sales Final",             text: "No returns or exchanges\non any items" },
        ].map(({ label, title, text }) => (
          <div key={label} className="n-info-cell">
            <p style={{ margin: "0 0 5px", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>{label}</p>
            <p style={{ margin: "0 0 5px", fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "-0.01em" }}>{title}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5, whiteSpace: "pre-line" }}>{text}</p>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════ CATEGORIES ════════════ */}
      <section style={{ padding: "64px 0 0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <p className="n-lbl" style={{ marginBottom: 8 }}>Browse</p>
              <h2 className="n-title">{h.categoriesTitle}</h2>
            </div>
            <Link to="/shop" className="n-ulink">View All</Link>
          </div>

          <div className="n-cat-grid">

            {/* Women — tall */}
            <Link to="/shop/clothing" className="n-cat" style={{ gridColumn: 1, gridRow: "1 / 3" }}>
              <img src={CAT_WOMEN} alt="Women" style={{ height: "100%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", top: 20, left: 20 }}>
                <span style={{ background: "#fff", color: "#111", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 2 }}>New In</span>
              </div>
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                <h3 style={{ color: "#fff", fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 16px" }}>{h.cat_women}</h3>
                <span className="n-cat-btn n-btn-w" style={{ fontSize: 12, padding: "10px 22px", opacity: 0, transition: "opacity 0.3s" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Men */}
            <Link to="/shop/clothing" className="n-cat" style={{ gridColumn: 2, gridRow: 1 }}>
              <img src={CAT_MEN} alt="Men" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <h3 style={{ color: "#fff", fontSize: "1.7rem", fontWeight: 900, letterSpacing: "-0.02em", margin: "0 0 10px" }}>{h.cat_men}</h3>
                <span className="n-cat-btn n-btn-w" style={{ fontSize: 11, padding: "9px 18px", opacity: 0, transition: "opacity 0.3s" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Accessories */}
            <Link to="/shop/accessories" className="n-cat" style={{ gridColumn: 3, gridRow: 1 }}>
              <img src={CAT_ACC} alt="Accessories" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.01em", margin: "0 0 8px" }}>{h.cat_accessories}</h3>
                <span className="n-cat-btn n-btn-w" style={{ fontSize: 10, padding: "8px 16px", opacity: 0, transition: "opacity 0.3s" }}>{h.shopNow}</span>
              </div>
            </Link>

            {/* Kids — wide bottom */}
            <Link to="/shop" className="n-cat" style={{ gridColumn: "2 / 4", gridRow: 2 }}>
              <img src={CAT_KIDS} alt="Kids" style={{ objectPosition: "top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.68) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>For the little ones</p>
                <h3 style={{ color: "#fff", fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 14px" }}>{h.cat_kids}</h3>
                <span className="n-cat-btn n-btn-w" style={{ fontSize: 11, padding: "9px 18px", opacity: 0, transition: "opacity 0.3s" }}>Explore</span>
              </div>
              <div style={{ position: "absolute", top: 18, right: 20 }}>
                <span style={{ background: "#fff", color: "#111", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 2 }}>Best Value</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRENDING ══════════════ */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p className="n-lbl" style={{ marginBottom: 8 }}>Just In</p>
              <h2 className="n-title">{h.trendingTitle}</h2>
            </div>
            <Link to="/shop" className="n-ulink">{h.viewAll}</Link>
          </div>
          <div className="n-prod-grid">
            {trending.map((product, i) => (
              <ThriftCard key={product.id} product={product} index={i} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FLASH SALE — REDESIGNED ════════════ */}
      <section style={{ background: "#111", borderTop: "1px solid #222" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 48px 0", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ background: "#fff", color: "#111", fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 2 }}>Flash Sale</span>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>Ends in</p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[
                  { val: countdown.h, label: "hr" },
                  { val: countdown.m, label: "min" },
                  { val: countdown.s, label: "sec" },
                ].map(({ val, label }, idx) => (
                  <span key={label} style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    {idx > 0 && <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 900, fontSize: 18, marginRight: 3 }}>:</span>}
                    <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{String(val).padStart(2, "0")}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  </span>
                ))}
              </div>
            </div>
            <Link to="/shop?sale=true" className="n-btn-ol" style={{ fontSize: 12, padding: "10px 22px" }}>View All Deals</Link>
          </div>

          {/* Main content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 440 }}>
            {/* Left: image with overlay headline */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }}>
              <img src={DENIM_IMG} alt="Flash Sale" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 70%)" }} />
              <div style={{ position: "absolute", top: 40, left: 40 }}>
                <h2 style={{ fontWeight: 900, fontSize: "clamp(3rem, 5vw, 5rem)", letterSpacing: "-0.05em", lineHeight: 0.88, color: "#fff", margin: 0 }}>
                  Up To<br />70%<br />Off.
                </h2>
              </div>
            </div>

            {/* Right: stat grid + copy */}
            <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
              <div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  Hundreds of pre-loved pieces, drastically reduced. Affordable prices, quality finds — shop today's best deals before they're gone.
                </p>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="fs-stat">
                  <span className="fs-stat-num">70%</span>
                  <span className="fs-stat-label">Max Discount</span>
                </div>
                <div className="fs-stat" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="fs-stat-num">200+</span>
                  <span className="fs-stat-label">Items on Sale</span>
                </div>
                <div className="fs-stat" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="fs-stat-num">1 Day</span>
                  <span className="fs-stat-label">Only</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/shop?sale=true" className="n-btn-w">Shop the Sale</Link>
                <Link to="/shop" className="n-btn-ol" style={{ fontSize: 12, padding: "10px 22px" }}>Browse All</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ ABOUT — REDESIGNED ════════════ */}
      <section style={{ borderTop: "1px solid #e5e5e5", background: "#fafafa" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 48px" }}>

          {/* Top label */}
          <p className="n-lbl" style={{ marginBottom: 12 }}>Our Story</p>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

            {/* Left: headline + description */}
            <div>
              <h2 style={{ fontWeight: 900, fontSize: "clamp(2.4rem, 3.5vw, 3.8rem)", letterSpacing: "-0.04em", lineHeight: 0.95, color: "#111", margin: "0 0 28px" }}>
                Ulaanbaatar's<br />Favourite<br />Thrift Shop.
              </h2>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 20, maxWidth: 440 }}>
                988 Thrift Shop is Ulaanbaatar's go-to destination for pre-loved clothing. With over 54,000 followers on Instagram, we've built a community around the idea that great style shouldn't cost a fortune.
              </p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
                Every item we carry is hand-picked for quality and character. Whether you're hunting for a vintage denim jacket or a one-of-a-kind accessory, you'll find it here at an honest price.
              </p>
              <Link to="/shop" className="n-btn-b">Browse the Collection</Link>
            </div>

            {/* Right: info table + photo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Photo */}
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 4, aspectRatio: "4/3" }}>
                <img src={ECO_IMG} alt="988 Thrift Shop" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              {/* Details table */}
              <div style={{ borderTop: "1px solid #e5e5e5" }}>
                {[
                  { label: "Address",  value: "Natur Building, Unit 36A\nBehind New Mongolia School, Ulaanbaatar" },
                  { label: "Hours",    value: "11:00 AM – 7:00 PM · Open every day" },
                  { label: "Phone",    value: "85144414" },
                  { label: "Policy",   value: "All sales final — no returns or exchanges" },
                  { label: "Community", value: "54,000+ followers on Instagram" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 20, padding: "13px 0", borderBottom: "1px solid #e5e5e5" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", width: 90, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "#111", lineHeight: 1.6, whiteSpace: "pre-line" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRUST STRIP ══════════ */}
      <section style={{ borderTop: "1px solid #e5e5e5", background: "#f5f5f5" }}>
        <div className="n-trust">
          {[
            { title: "Pre-Loved Fashion",   sub: "Every piece has a second story" },
            { title: "One-of-a-Kind Finds", sub: "No two items are the same" },
            { title: "Affordable Prices",   sub: "Great style, honest prices" },
            { title: "54K Community",       sub: "Trusted by Ulaanbaatar" },
          ].map(({ title, sub }, i, arr) => (
            <div key={title} style={{ padding: "32px 28px", borderRight: i < arr.length - 1 ? "1px solid #e5e5e5" : "none" }}>
              <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", color: "#111", margin: "0 0 4px" }}>{title}</p>
              <p style={{ fontSize: 12, color: "#757575", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ CONTACT CTA ════════════ */}
      <section style={{ background: "#111", padding: "96px 24px", textAlign: "center" }}>
        <img
          src={logo}
          alt="988 Thrift Shop"
          style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 32, display: "inline-block", border: "1.5px solid rgba(255,255,255,0.15)", filter: "grayscale(15%)" }}
        />
        <p className="n-lbl" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>Find Us</p>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "-0.05em", lineHeight: 0.9, color: "#fff", margin: "0 auto 24px", maxWidth: 700 }}>
          Visit Us in<br />Ulaanbaatar.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: "0 auto 40px", maxWidth: 400 }}>
          Natur Building, Unit 36A<br />
          Behind New Mongolia School, Ulaanbaatar<br />
          Open 11:00 AM – 7:00 PM · Every day
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <a href="tel:85144414" className="n-btn-w">Call 85144414</a>
          <Link to="/shop" className="n-btn-ol">Shop Online</Link>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: 0 }}>
          ALL SALES FINAL · No Returns or Exchanges
        </p>
      </section>

    </div>
  );
}

/* ── Product Card ─────────────────────────────────────────── */
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
    <div className="n-card">
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: "#f6f6f6" }}>
        <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

        {discount && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "#111", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px" }}>
            {discount}% Off
          </div>
        )}
        <div style={{ position: "absolute", top: 12, right: 12, background: "#fff", color: "#111", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px" }}>
          {product.condition}
        </div>

        <div
          className="n-qadd"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, opacity: 0, transform: "translateY(6px)", transition: "opacity 0.25s, transform 0.25s" }}
        >
          <button
            style={{ width: "100%", padding: 11, background: "#111", color: "#fff", border: "none", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s" }}
            onClick={e => { e.preventDefault(); onAddToCart(); }}
            onMouseOver={e => (e.currentTarget.style.background = "#333")}
            onMouseOut={e => (e.currentTarget.style.background = "#111")}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 4px 16px" }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#757575" }}>{product.category}</p>
        <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{product.name}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111" }}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>${product.originalPrice.toFixed(2)}</span>
          )}
          {discount && (
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#388e3c" }}>{discount}% off</span>
          )}
        </div>
      </div>
    </div>
  );
}