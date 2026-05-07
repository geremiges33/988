import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router";
import { categories, Product } from "../data/products";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import {
  SlidersHorizontal, Grid3X3, Grid2X2, List, Heart,
  ShoppingBag, X, ChevronDown, Search, ArrowUpDown,
  Check, Eye, Zap,
} from "lucide-react";
import React from "react";

/* ─── Design tokens ─────────────────────────────────────────── */
const G = {
  ink:    "#0D1F0F",
  deep:   "#143318",
  mid:    "#1E4D24",
  sage:   "#2D6A35",
  mist:   "#EEF3EE",
  paper:  "#F8FAF8",
  line:   "#D4DDD4",
  white:  "#FFFFFF",
  dim:    "#8A9E8C",
};

const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair"];
const SIZES      = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_PRICE  = 400;

type GridCols = 2 | 3 | 4;

function parseSearchParams(sp: URLSearchParams, urlCat?: string) {
  return {
    cat:        urlCat || sp.get("cat") || "all",
    sizes:      sp.get("size")      ? sp.get("size")!.split(",").filter(Boolean)      : [],
    conditions: sp.get("condition") ? sp.get("condition")!.split(",").filter(Boolean) : [],
    minPrice:   parseInt(sp.get("minPrice") || "0"),
    maxPrice:   parseInt(sp.get("maxPrice") || String(MAX_PRICE)),
    sort:       sp.get("sort") || "featured",
    q:          sp.get("q") || "",
    saleOnly:   sp.get("sale") === "true",
  };
}

/* ═══════════════════════════════════════════════════════════════ */
export function Shop() {
  const { category: urlCat } = useParams();
  const [searchParams]       = useSearchParams();
  const navigate             = useNavigate();
  const { products }         = useProducts();
  const { addToCart }        = useCart();
  const { t }                = useLanguage();
  const s                    = t.shop;

  const init = parseSearchParams(searchParams, urlCat);
  const [selectedCat,        setSelectedCat]        = useState(init.cat);
  const [selectedSizes,      setSelectedSizes]       = useState<string[]>(init.sizes);
  const [selectedConditions, setSelectedConditions]  = useState<string[]>(init.conditions);
  const [priceRange,         setPriceRange]          = useState<[number, number]>([init.minPrice, init.maxPrice]);
  const [sortBy,             setSortBy]              = useState(init.sort);
  const [searchQuery,        setSearchQuery]         = useState(init.q);
  const [saleOnly,           setSaleOnly]            = useState(init.saleOnly);
  const [gridCols,           setGridCols]            = useState<GridCols>(3);
  const [viewMode,           setViewMode]            = useState<"grid" | "list">("grid");
  const [filterOpen,         setFilterOpen]          = useState(false);
  const [sortOpen,           setSortOpen]            = useState(false);
  const [visibleCount,       setVisibleCount]        = useState(12);

  useEffect(() => {
    const p = parseSearchParams(searchParams, urlCat);
    setSelectedCat(p.cat); setSelectedSizes(p.sizes); setSelectedConditions(p.conditions);
    setPriceRange([p.minPrice, p.maxPrice]); setSortBy(p.sort);
    setSearchQuery(p.q); setSaleOnly(p.saleOnly); setVisibleCount(12);
  }, [searchParams, urlCat]);

  const push = (overrides: Record<string, string | string[] | boolean | number | null>) => {
    const next = new URLSearchParams(searchParams);
    const cur: Record<string, string | string[] | boolean | number | null> = {
      cat: selectedCat, size: selectedSizes, condition: selectedConditions,
      minPrice: priceRange[0], maxPrice: priceRange[1],
      sort: sortBy, q: searchQuery, sale: saleOnly, ...overrides,
    };
    const newCat = (cur.cat as string) || "all";
    Object.entries(cur).forEach(([k, v]) => {
      const str = Array.isArray(v) ? v.join(",") : String(v);
      const skip = k === "cat" || (k === "minPrice" && str === "0") ||
        (k === "maxPrice" && str === String(MAX_PRICE)) || (k === "sort" && str === "featured") ||
        (k === "q" && str === "") || (k === "sale" && str === "false") ||
        (k === "size" && str === "") || (k === "condition" && str === "");
      if (skip) next.delete(k); else next.set(k, str);
    });
    const qs = next.toString();
    navigate({ pathname: newCat !== "all" ? `/shop/${newCat}` : "/shop", search: qs ? `?${qs}` : "" }, { replace: false });
  };

  const handleCat    = (c: string)           => push({ cat: c });
  const toggleCond   = (c: string)           => push({ condition: selectedConditions.includes(c) ? selectedConditions.filter(x => x !== c) : [...selectedConditions, c] });
  const toggleSize   = (sz: string)          => push({ size: selectedSizes.includes(sz) ? selectedSizes.filter(x => x !== sz) : [...selectedSizes, sz] });
  const handlePrice  = (r: [number, number]) => push({ minPrice: r[0], maxPrice: r[1] });
  const handleSort   = (v: string)           => { setSortOpen(false); push({ sort: v }); };
  const handleSearch = (v: string)           => push({ q: v });
  const toggleSale   = ()                    => push({ sale: !saleOnly });
  const clearAll     = ()                    => navigate(urlCat ? `/shop/${urlCat}` : "/shop");

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== "all") list = list.filter(p => p.category === selectedCat);
    if (selectedConditions.length) list = list.filter(p => selectedConditions.includes(p.condition));
    if (selectedSizes.length) list = list.filter(p => p.size ? selectedSizes.includes(p.size) : false);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (saleOnly) list = list.filter(p => !!p.originalPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-low":  list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "discount":   list.sort((a, b) => (b.originalPrice ? b.originalPrice - b.price : 0) - (a.originalPrice ? a.originalPrice - a.price : 0)); break;
      case "newest":     list.sort((a, b) => b.id.localeCompare(a.id)); break;
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [products, selectedCat, selectedConditions, selectedSizes, priceRange, sortBy, searchQuery, saleOnly]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const SORT_OPTIONS = [
    { value: "featured",   label: "Featured"    },
    { value: "newest",     label: "Newest"      },
    { value: "price-low",  label: "Price: Low"  },
    { value: "price-high", label: "Price: High" },
    { value: "name",       label: "Name A–Z"    },
    { value: "discount",   label: "Best Deals"  },
  ];
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Sort";

  const activeCount = [
    selectedCat !== "all", selectedConditions.length > 0, selectedSizes.length > 0,
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE, searchQuery.trim() !== "", saleOnly,
  ].filter(Boolean).length;

  const chips = [
    ...selectedConditions.map(c  => ({ label: c,              onRemove: () => toggleCond(c)  })),
    ...selectedSizes.map(sz      => ({ label: sz,             onRemove: () => toggleSize(sz) })),
    ...(priceRange[0] > 0 || priceRange[1] < MAX_PRICE
      ? [{ label: `$${priceRange[0]}–$${priceRange[1]}`, onRemove: () => handlePrice([0, MAX_PRICE]) }]
      : []),
    ...(searchQuery.trim() ? [{ label: `"${searchQuery}"`, onRemove: () => handleSearch("") }] : []),
    ...(saleOnly ? [{ label: "Sale", onRemove: toggleSale }] : []),
  ];

  return (
    <div style={{ background: G.paper, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── Dark header ──────────────────────────────────────────── */}
      <div style={{ background: G.ink }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>

          {/* Top utility row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.16em", textDecoration: "none", fontFamily: "sans-serif", fontWeight: 700 }}>HOME</Link>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: "sans-serif" }}>—</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.16em", fontFamily: "sans-serif", fontWeight: 700 }}>SHOP</span>
              {selectedCat !== "all" && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: "sans-serif" }}>—</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, letterSpacing: "0.16em", fontFamily: "sans-serif", fontWeight: 700 }}>
                    {categories.find(c => c.id === selectedCat)?.name?.toUpperCase()}
                  </span>
                </>
              )}
            </nav>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              padding: "9px 18px", width: 280,
            }}>
              <Search size={13} color="rgba(255,255,255,0.3)" />
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search pieces..."
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: 13, fontFamily: "sans-serif",
                  fontWeight: 700, letterSpacing: "0.05em", flex: 1,
                }}
              />
              {searchQuery && (
                <button onClick={() => handleSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex" }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Hero title */}
          <div style={{ padding: "36px 0 0" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <p style={{ color: G.sage, fontSize: 11, letterSpacing: "0.26em", fontFamily: "sans-serif", fontWeight: 800, margin: "0 0 10px" }}>
                  {filtered.length} PIECES AVAILABLE
                </p>
                <h1 style={{
                  color: G.white, fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
                  fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.92,
                  margin: 0, fontStyle: "italic",
                }}>
                  {saleOnly ? "Sale" : selectedCat !== "all"
                    ? categories.find(c => c.id === selectedCat)?.name
                    : "All Finds"}
                </h1>
              </div>
              {saleOnly && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: G.sage, padding: "10px 20px",
                }}>
                  <Zap size={12} color={G.white} />
                  <span style={{ color: G.white, fontSize: 11, letterSpacing: "0.2em", fontFamily: "sans-serif", fontWeight: 800 }}>UP TO 70% OFF</span>
                </div>
              )}
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
              {[{ id: "all", name: "All" }, ...categories.filter(c => c.id !== "all")].map(cat => {
                const isActive = selectedCat === cat.id;
                return (
                  <button key={cat.id} onClick={() => handleCat(cat.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "15px 20px", fontSize: 11, letterSpacing: "0.2em",
                    fontFamily: "sans-serif", fontWeight: 800, whiteSpace: "nowrap",
                    color: isActive ? G.white : "rgba(255,255,255,0.35)",
                    borderBottom: isActive ? `2px solid ${G.sage}` : "2px solid transparent",
                    transition: "all 0.15s",
                  }}>
                    {cat.name.toUpperCase()}
                  </button>
                );
              })}
              <button onClick={toggleSale} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "15px 20px", fontSize: 11, letterSpacing: "0.2em",
                fontFamily: "sans-serif", fontWeight: 800, whiteSpace: "nowrap",
                color: saleOnly ? "#7EF5A0" : "rgba(255,255,255,0.35)",
                borderBottom: saleOnly ? "2px solid #7EF5A0" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                SALE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky toolbar ──────────────────────────────────────── */}
      <div style={{ background: G.white, borderBottom: `1px solid ${G.line}`, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{
          maxWidth: 1440, margin: "0 auto", padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 54,
        }}>
          {/* Filter toggle + active chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, overflow: "hidden", minWidth: 0 }}>
            <button
              onClick={() => setFilterOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "6px 14px",
                background: filterOpen ? G.ink : "transparent",
                border: `1px solid ${filterOpen ? G.ink : G.line}`,
                cursor: "pointer", fontSize: 11, letterSpacing: "0.18em", fontWeight: 800,
                color: filterOpen ? G.white : G.ink, fontFamily: "sans-serif",
                flexShrink: 0, transition: "all 0.15s",
              }}
            >
              <SlidersHorizontal size={11} />
              FILTER{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>

            <div style={{ width: 1, height: 18, background: G.line, flexShrink: 0 }} />

            <div style={{ display: "flex", gap: 6, overflow: "hidden", alignItems: "center" }}>
              {chips.map(chip => (
                <span key={chip.label} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  border: `1px solid ${G.deep}`, padding: "4px 10px",
                  fontSize: 11, letterSpacing: "0.1em", color: G.deep, fontWeight: 700,
                  fontFamily: "sans-serif", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {chip.label.toUpperCase()}
                  <button onClick={chip.onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: G.dim, padding: 0, display: "flex" }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
              {activeCount > 0 && (
                <button onClick={clearAll} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 11, letterSpacing: "0.12em", color: G.dim, fontWeight: 700,
                  fontFamily: "sans-serif", textDecoration: "underline", flexShrink: 0,
                }}>
                  CLEAR ALL
                </button>
              )}
            </div>
          </div>

          {/* Sort + view toggles */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setSortOpen(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "6px 14px",
                  background: "transparent", border: `1px solid ${G.line}`,
                  cursor: "pointer", fontSize: 11, letterSpacing: "0.16em", fontWeight: 800,
                  color: G.ink, fontFamily: "sans-serif", transition: "all 0.15s",
                }}
              >
                <ArrowUpDown size={11} />
                {currentSortLabel.toUpperCase()}
                <ChevronDown size={10} style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "0.15s" }} />
              </button>
              {sortOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setSortOpen(false)} />
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 2px)",
                    background: G.white, border: `1px solid ${G.line}`, zIndex: 20, minWidth: 180,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
                  }}>
                    {SORT_OPTIONS.map((opt, i) => (
                      <button key={opt.value} onClick={() => handleSort(opt.value)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "11px 16px", background: "none", border: "none",
                        borderBottom: i < SORT_OPTIONS.length - 1 ? `1px solid ${G.line}` : "none",
                        cursor: "pointer", fontSize: 11, letterSpacing: "0.14em", fontWeight: 700,
                        color: sortBy === opt.value ? G.deep : G.ink,
                        fontFamily: "sans-serif", textAlign: "left",
                      }}>
                        {opt.label.toUpperCase()}
                        {sortBy === opt.value && <Check size={10} color={G.sage} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ width: 1, height: 18, background: G.line }} />

            <div style={{ display: "flex", border: `1px solid ${G.line}` }}>
              {([2, 3, 4] as GridCols[]).map((n, i) => (
                <button key={n} onClick={() => { setGridCols(n); setViewMode("grid"); }} style={{
                  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  background: gridCols === n && viewMode === "grid" ? G.ink : "transparent",
                  border: "none", borderRight: i < 2 ? `1px solid ${G.line}` : "none",
                  cursor: "pointer", color: gridCols === n && viewMode === "grid" ? G.white : G.dim,
                  transition: "all 0.15s",
                }}>
                  {n === 2 ? <Grid2X2 size={13} /> : n === 3 ? <Grid3X3 size={13} /> : (
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                      <rect x="0" y="0" width="4" height="4"/><rect x="6" y="0" width="4" height="4"/>
                      <rect x="12" y="0" width="4" height="4"/><rect x="0" y="6" width="4" height="4"/>
                      <rect x="6" y="6" width="4" height="4"/><rect x="12" y="6" width="4" height="4"/>
                      <rect x="0" y="12" width="4" height="4"/><rect x="6" y="12" width="4" height="4"/>
                      <rect x="12" y="12" width="4" height="4"/>
                    </svg>
                  )}
                </button>
              ))}
              <button onClick={() => setViewMode("list")} style={{
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                background: viewMode === "list" ? G.ink : "transparent",
                border: "none", borderLeft: `1px solid ${G.line}`,
                cursor: "pointer", color: viewMode === "list" ? G.white : G.dim,
                transition: "all 0.15s",
              }}>
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Collapsible filter panel ──────────────────────────── */}
        <div style={{
          maxHeight: filterOpen ? 320 : 0, overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          borderTop: filterOpen ? `1px solid ${G.line}` : "none",
        }}>
          <div style={{
            maxWidth: 1440, margin: "0 auto", padding: "26px 48px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 48,
          }}>
            {/* Price */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: G.dim, margin: "0 0 14px", fontFamily: "sans-serif", fontWeight: 800 }}>PRICE RANGE</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: G.ink, fontFamily: "sans-serif", fontWeight: 700 }}>${priceRange[0]}</span>
                <span style={{ fontSize: 13, color: G.ink, fontFamily: "sans-serif", fontWeight: 700 }}>${priceRange[1]}{priceRange[1] === MAX_PRICE ? "+" : ""}</span>
              </div>
              <div style={{ position: "relative", height: 1, background: G.line, marginBottom: 20 }}>
                <div style={{
                  position: "absolute", height: 1, background: G.deep,
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }} />
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  width: 9, height: 9, background: G.white, border: `2px solid ${G.deep}`,
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                }} />
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  width: 9, height: 9, background: G.white, border: `2px solid ${G.deep}`,
                  left: `${(priceRange[1] / MAX_PRICE) * 100}%`,
                }} />
                <div style={{ position: "relative", height: 0 }}>
                  <input type="range" min={0} max={MAX_PRICE} value={priceRange[0]}
                    onChange={e => { const v = +e.target.value; if (v < priceRange[1] - 5) handlePrice([v, priceRange[1]]); }}
                    style={{ position: "absolute", inset: "0 0 0 0", width: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} />
                  <input type="range" min={0} max={MAX_PRICE} value={priceRange[1]}
                    onChange={e => { const v = +e.target.value; if (v > priceRange[0] + 5) handlePrice([priceRange[0], v]); }}
                    style={{ position: "absolute", inset: "0 0 0 0", width: "100%", opacity: 0, cursor: "pointer", zIndex: 20 }} />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {([[0, 50], [0, 100], [0, 200], [50, 400]] as [number, number][]).map(([mn, mx]) => (
                  <button key={`${mn}-${mx}`} onClick={() => handlePrice([mn, mx])} style={{
                    fontSize: 10, letterSpacing: "0.12em", padding: "5px 10px", cursor: "pointer",
                    fontFamily: "sans-serif", fontWeight: 800,
                    background: priceRange[0] === mn && priceRange[1] === mx ? G.ink : "transparent",
                    color: priceRange[0] === mn && priceRange[1] === mx ? G.white : G.dim,
                    border: `1px solid ${priceRange[0] === mn && priceRange[1] === mx ? G.ink : G.line}`,
                    transition: "all 0.15s",
                  }}>
                    UNDER ${mx}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: G.dim, margin: "0 0 14px", fontFamily: "sans-serif", fontWeight: 800 }}>CONDITION</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CONDITIONS.map(c => (
                  <label key={c} onClick={() => toggleCond(c)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{
                      width: 14, height: 14, border: `1px solid ${selectedConditions.includes(c) ? G.deep : G.line}`,
                      background: selectedConditions.includes(c) ? G.deep : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s",
                    }}>
                      {selectedConditions.includes(c) && <Check size={9} color={G.white} />}
                    </div>
                    <span style={{ fontSize: 13, color: G.ink, fontFamily: "sans-serif", fontWeight: 700 }}>{c}</span>
                    <span style={{ fontSize: 11, color: G.dim, fontFamily: "sans-serif", fontWeight: 700, marginLeft: "auto" }}>
                      {products.filter(p => p.condition === c).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: G.dim, margin: "0 0 14px", fontFamily: "sans-serif", fontWeight: 800 }}>SIZE</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
                {SIZES.map(sz => {
                  const cnt = products.filter(p => p.size === sz).length;
                  return (
                    <button key={sz} onClick={() => toggleSize(sz)} disabled={cnt === 0} style={{
                      padding: "8px 0", fontSize: 11, letterSpacing: "0.14em", cursor: cnt > 0 ? "pointer" : "default",
                      fontFamily: "sans-serif", fontWeight: 800,
                      background: selectedSizes.includes(sz) ? G.ink : "transparent",
                      color: selectedSizes.includes(sz) ? G.white : cnt === 0 ? G.line : G.ink,
                      border: `1px solid ${selectedSizes.includes(sz) ? G.ink : G.line}`,
                      transition: "all 0.15s",
                    }}>
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: G.dim, margin: "0 0 14px", fontFamily: "sans-serif", fontWeight: 800 }}>CATEGORY</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {categories.map((cat) => {
                  const count = cat.id === "all" ? products.length : products.filter(p => p.category === cat.id).length;
                  const isActive = selectedCat === cat.id;
                  return (
                    <button key={cat.id} onClick={() => handleCat(cat.id)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "none", border: "none", borderBottom: `1px solid ${G.line}`,
                      cursor: "pointer", padding: "9px 0",
                    }}>
                      <span style={{ fontSize: 13, color: isActive ? G.deep : G.ink, fontFamily: "sans-serif", fontWeight: isActive ? 800 : 600 }}>
                        {cat.name}
                      </span>
                      <span style={{ fontSize: 11, color: G.dim, fontFamily: "sans-serif", fontWeight: 700 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product grid ───────────────────────────────────────── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "44px 48px" }}>
        {filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : viewMode === "list" ? (
          <div style={{ border: `1px solid ${G.line}`, borderBottom: "none" }}>
            {visible.map((product, i) => (
              <ListRow key={product.id} product={product} onAddToCart={() => addToCart(product)} isLast={i === visible.length - 1} />
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))`,
            gap: 0,
            border: `1px solid ${G.line}`,
            borderRight: "none", borderBottom: "none",
          }}>
            {visible.map(product => (
              <GridCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        )}

        {hasMore && (
          <div style={{ marginTop: 60, textAlign: "center" }}>
            <button
              onClick={() => setVisibleCount(v => v + 12)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "14px 52px", background: G.ink, color: G.white,
                border: "none", cursor: "pointer",
                fontSize: 11, letterSpacing: "0.22em", fontFamily: "sans-serif", fontWeight: 800,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = G.deep; }}
              onMouseLeave={e => { e.currentTarget.style.background = G.ink; }}
            >
              LOAD MORE
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700 }}>({filtered.length - visibleCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────── */
/* ─── Grid Card ─────────────────────────────────────────────── */
function GridCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const navigate        = useNavigate();
  const [added, setAdded] = useState(false);
  const [over, setOver]   = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      style={{
        background: G.white,
        borderRight: `1px solid ${G.line}`,
        borderBottom: `1px solid ${G.line}`,
        display: "flex",
        flexDirection: "column",
        transition: "background 0.2s",
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        style={{
          display: "block",
          position: "relative",
          overflow: "hidden",
          aspectRatio: "3/4",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
            transform: over ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(13,31,15,0.52)",
            opacity: over ? 1 : 0,
            transition: "opacity 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.id}`);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: G.white,
              fontSize: 10,
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: 800,
              backdropFilter: "blur(6px)",
            }}
          >
            <Eye size={11} /> VIEW
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              background: added ? "#22C55E" : G.sage,
              border: "none",
              color: G.white,
              fontSize: 10,
              letterSpacing: "0.2em",
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: 800,
              transition: "background 0.2s",
            }}
          >
            {added ? (
              <>
                <Check size={11} /> ADDED
              </>
            ) : (
              <>
                <ShoppingBag size={11} /> ADD
              </>
            )}
          </button>
        </div>

        {/* Discount flag */}
        {discount && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: G.deep,
              color: G.white,
              fontSize: 10,
              letterSpacing: "0.14em",
              padding: "6px 11px",
              fontFamily: "sans-serif",
              fontWeight: 800,
            }}
          >
            −{discount}%
          </div>
        )}

        {product.featured && !discount && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: G.ink,
              color: "rgba(255,255,255,0.55)",
              fontSize: 10,
              letterSpacing: "0.14em",
              padding: "6px 11px",
              fontFamily: "sans-serif",
              fontWeight: 800,
            }}
          >
            FEATURED
          </div>
        )}
      </Link>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: G.dim,
              fontFamily: "sans-serif",
              fontWeight: 800,
            }}
          >
            {product.category.toUpperCase()}
          </span>

          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: G.sage,
              fontFamily: "sans-serif",
              fontWeight: 800,
            }}
          >
            {product.condition.toUpperCase()}
          </span>
        </div>

        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: 16,
              color: G.ink,
              fontWeight: 700,
              margin: "0 0 11px",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span
              style={{
                fontSize: 17,
                color: G.ink,
                fontWeight: 800,
                fontFamily: "sans-serif",
              }}
            >
              ${product.price}
            </span>

            {product.originalPrice && (
              <span
                style={{
                  fontSize: 12,
                  color: G.dim,
                  textDecoration: "line-through",
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                }}
              >
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.size && (
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: G.dim,
                fontFamily: "sans-serif",
                fontWeight: 700,
                border: `1px solid ${G.line}`,
                padding: "2px 8px",
              }}
            >
              {product.size}
            </span>
          )}
        </div>

        {/* Hover underline */}
        <div
          style={{
            marginTop: 12,
            height: 1,
            background: G.deep,
            transform: over ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
/* ─── List Row ──────────────────────────────────────────────── */
function ListRow({ product, onAddToCart, isLast }: {
  product: Product; onAddToCart: () => void; isLast: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [over, setOver]   = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      style={{
        display: "grid", gridTemplateColumns: "130px 1fr auto",
        borderBottom: isLast ? "none" : `1px solid ${G.line}`,
        background: over ? G.mist : G.white, transition: "background 0.15s",
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      <Link to={`/product/${product.id}`} style={{ display: "block", overflow: "hidden" }}>
        <img
          src={product.imageUrl} alt={product.name}
          style={{
            width: "100%", height: "100%", minHeight: 150, objectFit: "cover", display: "block",
            transition: "transform 0.5s", transform: over ? "scale(1.05)" : "scale(1)",
          }}
        />
      </Link>

      <div style={{ padding: "20px 28px", borderLeft: `1px solid ${G.line}`, borderRight: `1px solid ${G.line}` }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: G.dim, fontFamily: "sans-serif", fontWeight: 800 }}>{product.category.toUpperCase()}</span>
          <span style={{ fontSize: 10, letterSpacing: "0.1em", color: G.sage, fontFamily: "sans-serif", fontWeight: 800 }}>{product.condition.toUpperCase()}</span>
          {product.size && <span style={{ fontSize: 10, letterSpacing: "0.1em", color: G.dim, fontFamily: "sans-serif", fontWeight: 700, border: `1px solid ${G.line}`, padding: "1px 7px" }}>{product.size}</span>}
        </div>
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3 style={{ fontSize: 20, color: G.ink, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Georgia', serif", fontStyle: "italic", letterSpacing: "-0.01em" }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ fontSize: 13, color: G.dim, fontFamily: "sans-serif", fontWeight: 600, lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
          {product.description}
        </p>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", minWidth: 160 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, color: G.ink, fontWeight: 800, fontFamily: "sans-serif" }}>${product.price}</div>
          {product.originalPrice && (
            <div style={{ fontSize: 12, color: G.dim, textDecoration: "line-through", fontFamily: "sans-serif", fontWeight: 600 }}>${product.originalPrice}</div>
          )}
          {discount && <div style={{ fontSize: 10, letterSpacing: "0.1em", color: G.sage, fontFamily: "sans-serif", fontWeight: 800, marginTop: 2 }}>−{discount}% OFF</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
          <button
            onClick={() => { onAddToCart(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 20px",
              background: added ? "#22C55E" : G.ink, border: "none", color: G.white,
              cursor: "pointer", fontSize: 10, letterSpacing: "0.2em", fontFamily: "sans-serif", fontWeight: 800,
              transition: "background 0.2s",
            }}
          >
            {added ? <><Check size={11} /> ADDED</> : <><ShoppingBag size={11} /> ADD TO BAG</>}
          </button>
          <button
            onClick={() => setLiked(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "none",
              border: `1px solid ${liked ? G.deep : G.line}`, cursor: "pointer",
              padding: "7px 13px", fontSize: 10, letterSpacing: "0.16em", fontWeight: 800,
              color: liked ? G.deep : G.dim, fontFamily: "sans-serif", transition: "all 0.15s",
            }}
          >
            <Heart size={11} style={{ fill: liked ? G.deep : "none", color: "inherit" }} />
            {liked ? "SAVED" : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ padding: "100px 0", textAlign: "center" }}>
      <div style={{
        width: 48, height: 48, border: `1px solid ${G.line}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
      }}>
        <SlidersHorizontal size={20} color={G.dim} />
      </div>
      <p style={{ fontSize: 26, color: G.ink, fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 700, margin: "0 0 8px" }}>No results found</p>
      <p style={{ fontSize: 13, color: G.dim, fontFamily: "sans-serif", fontWeight: 700, margin: "0 0 30px", letterSpacing: "0.04em" }}>Try adjusting or clearing your filters</p>
      <button
        onClick={onClear}
        style={{
          padding: "12px 40px", background: G.ink, color: G.white, border: "none",
          cursor: "pointer", fontSize: 10, letterSpacing: "0.24em", fontFamily: "sans-serif", fontWeight: 800,
        }}
      >
        CLEAR FILTERS
      </button>
    </div>
  );
}