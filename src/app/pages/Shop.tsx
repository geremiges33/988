import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router";
import { categories, Product } from "../data/products";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import {
  SlidersHorizontal, Grid3X3, Grid2X2, List, Heart, ShoppingBag, X, ChevronDown,
  Search, ArrowUpDown, Sparkles, Tag, Check, Eye, Zap,
} from "lucide-react";

/* ── constants ─────────────────────────────────────────────────── */
const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_PRICE = 400;

const CONDITION_COLORS: Record<string, { backgroundColor: string; color: string }> = {
  Excellent:   { backgroundColor: "#DCFCE7", color: "#16A34A" },
  "Very Good": { backgroundColor: "#DBEAFE", color: "#2563EB" },
  Good:        { backgroundColor: "#FEF9C3", color: "#CA8A04" },
  Fair:        { backgroundColor: "#FEE2E2", color: "#DC2626" },
};

const CAT_ICONS: Record<string, string> = {
  all: "✦", women: "👗", men: "👔", clothing: "🧥", accessories: "👜",
  furniture: "🪑", decor: "🏺", books: "📚", electronics: "📻", toys: "🎲",
};

const SORT_OPTIONS_KEYS = [
  { value: "featured",   key: "sortFeatured"  },
  { value: "newest",     key: "sortNewest"    },
  { value: "price-low",  key: "sortPriceLow"  },
  { value: "price-high", key: "sortPriceHigh" },
  { value: "name",       key: "name"          },
  { value: "discount",   key: "sortDiscount"  },
] as const;

type GridCols = 2 | 3 | 4;

/* ── helpers ────────────────────────────────────────────────────── */
function parseSearchParams(sp: URLSearchParams, urlCat?: string): {
  cat: string; sizes: string[]; conditions: string[]; minPrice: number; maxPrice: number;
  sort: string; q: string; saleOnly: boolean;
} {
  return {
    cat:        urlCat || sp.get("cat") || "all",
    sizes:      sp.get("size") ? sp.get("size")!.split(",").filter(Boolean) : [],
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const s = t.shop;

  /* ── state — initialised from URL ─────────────────────────── */
  const initial = parseSearchParams(searchParams, urlCat);
  const [selectedCat,        setSelectedCat]        = useState(initial.cat);
  const [selectedSizes,      setSelectedSizes]       = useState<string[]>(initial.sizes);
  const [selectedConditions, setSelectedConditions]  = useState<string[]>(initial.conditions);
  const [priceRange,         setPriceRange]          = useState<[number, number]>([initial.minPrice, initial.maxPrice]);
  const [sortBy,             setSortBy]              = useState(initial.sort);
  const [searchQuery,        setSearchQuery]         = useState(initial.q);
  const [saleOnly,           setSaleOnly]            = useState(initial.saleOnly);
  const [gridCols,           setGridCols]            = useState<GridCols>(3);
  const [viewMode,           setViewMode]            = useState<"grid" | "list">("grid");
  const [sidebarOpen,        setSidebarOpen]         = useState(false);
  const [sortOpen,           setSortOpen]            = useState(false);
  const [visibleCount,       setVisibleCount]        = useState(12);

  /* ── sync URL → state when navigation happens ──────────────── */
  useEffect(() => {
    const p = parseSearchParams(searchParams, urlCat);
    setSelectedCat(p.cat);
    setSelectedSizes(p.sizes);
    setSelectedConditions(p.conditions);
    setPriceRange([p.minPrice, p.maxPrice]);
    setSortBy(p.sort);
    setSearchQuery(p.q);
    setSaleOnly(p.saleOnly);
    setVisibleCount(12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, urlCat]);

  /* ── sync state → URL ──────────────────────────────────────── */
  const pushFilters = (overrides: Record<string, string | string[] | boolean | number | null>) => {
    const next = new URLSearchParams(searchParams);
    const current: Record<string, string | string[] | boolean | number | null> = {
      cat:        selectedCat,
      size:       selectedSizes,
      condition:  selectedConditions,
      minPrice:   priceRange[0],
      maxPrice:   priceRange[1],
      sort:       sortBy,
      q:          searchQuery,
      sale:       saleOnly,
      ...overrides,
    };

    // cat goes in the path
    const newCat = (current.cat as string) || "all";

    const setOrDel = (key: string, val: string | string[] | boolean | number | null) => {
      const str = Array.isArray(val) ? val.join(",") : String(val);
      const skip = (
        (key === "cat")       ||
        (key === "minPrice"  && str === "0") ||
        (key === "maxPrice"  && str === String(MAX_PRICE)) ||
        (key === "sort"      && str === "featured") ||
        (key === "q"         && str === "") ||
        (key === "sale"      && str === "false") ||
        (key === "size"      && str === "") ||
        (key === "condition" && str === "")
      );
      if (skip) next.delete(key); else next.set(key, str);
    };
    Object.entries(current).forEach(([k, v]) => setOrDel(k, v));

    const catPath = newCat !== "all" ? `/shop/${newCat}` : "/shop";
    const qs = next.toString();
    navigate({ pathname: catPath, search: qs ? `?${qs}` : "" }, { replace: false });
  };

  /* ── filter helpers ─────────────────────────────────────────── */
  const handleCatChange = (c: string) => pushFilters({ cat: c });
  const toggleCondition = (c: string) => {
    const next = selectedConditions.includes(c) ? selectedConditions.filter(x => x !== c) : [...selectedConditions, c];
    pushFilters({ condition: next });
  };
  const toggleSize = (s: string) => {
    const next = selectedSizes.includes(s) ? selectedSizes.filter(x => x !== s) : [...selectedSizes, s];
    pushFilters({ size: next });
  };
  const handlePriceChange = (r: [number, number]) => pushFilters({ minPrice: r[0], maxPrice: r[1] });
  const handleSortChange = (s: string) => { setSortOpen(false); pushFilters({ sort: s }); };
  const handleSearchChange = (v: string) => pushFilters({ q: v });
  const handleSaleToggle = () => pushFilters({ sale: !saleOnly });

  const clearAll = () => {
    navigate(urlCat ? `/shop/${urlCat}` : "/shop");
  };

  /* ── computed ───────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== "all") list = list.filter(p => p.category === selectedCat);
    if (selectedConditions.length) list = list.filter(p => selectedConditions.includes(p.condition));
    if (selectedSizes.length) list = list.filter(p => p.size ? selectedSizes.includes(p.size) : false);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (saleOnly) list = list.filter(p => !!p.originalPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-low":  list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "discount":   list.sort((a, b) => {
        const dA = a.originalPrice ? a.originalPrice - a.price : 0;
        const dB = b.originalPrice ? b.originalPrice - b.price : 0;
        return dB - dA;
      }); break;
      case "newest":     list.sort((a, b) => b.id.localeCompare(a.id)); break;
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [products, selectedCat, selectedConditions, selectedSizes, priceRange, sortBy, searchQuery, saleOnly]);

  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  const activeFiltersCount = [
    selectedCat !== "all",
    selectedConditions.length > 0,
    selectedSizes.length > 0,
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE,
    searchQuery.trim() !== "",
    saleOnly,
  ].filter(Boolean).length;

  const catLabel   = categories.find(c => c.id === selectedCat)?.name || "All Items";

  const SORT_OPTIONS = [
    { value: "featured",   label: s.sortFeatured  },
    { value: "newest",     label: s.sortNewest    },
    { value: "price-low",  label: s.sortPriceLow  },
    { value: "price-high", label: s.sortPriceHigh },
    { value: "name",       label: "Name A–Z"      },
    { value: "discount",   label: s.sortDiscount  },
  ];

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)?.label || s.sortBy;

  /* ── active chip list ───────────────────────────────────────── */
  const chips: { label: string; onRemove: () => void }[] = [
    ...selectedConditions.map(c => ({ label: c, onRemove: () => toggleCondition(c) })),
    ...selectedSizes.map(s => ({ label: `Size ${s}`, onRemove: () => toggleSize(s) })),
    ...(priceRange[0] > 0 || priceRange[1] < MAX_PRICE
      ? [{ label: `$${priceRange[0]}–$${priceRange[1]}`, onRemove: () => handlePriceChange([0, MAX_PRICE]) }]
      : []),
    ...(searchQuery.trim() ? [{ label: `"${searchQuery}"`, onRemove: () => handleSearchChange("") }] : []),
    ...(saleOnly ? [{ label: "Sale Only", onRemove: handleSaleToggle }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ── Page Hero ───────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #FF6B6B 0%, transparent 50%), radial-gradient(circle at 80% 50%, #4ECDC4 0%, transparent 50%)" }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase mb-4">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white/60">Shop</span>
                {selectedCat !== "all" && (
                  <><span>/</span><span className="text-[#FF6B6B]">{catLabel}</span></>
                )}
              </div>
              <h1
                className="text-white mb-2"
                style={{ fontSize: "clamp(2.5rem,4vw,4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                {saleOnly ? (
                  <>Flash <span style={{ color: "#FF6B6B", fontStyle: "italic", fontWeight: 300 }}>Sale</span></>
                ) : selectedCat !== "all" ? (
                  catLabel
                ) : (
                  <>All <span style={{ color: "#FF6B6B", fontStyle: "italic", fontWeight: 300 }}>Finds</span></>
                )}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-white/40 text-base">
                  {filtered.length} pre-loved piece{filtered.length !== 1 ? "s" : ""}
                </p>
                {saleOnly && (
                  <span className="inline-flex items-center gap-1.5 bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30 text-xs px-3 py-1 rounded-full tracking-widest uppercase">
                    <Zap className="w-3 h-3" />Up to 70% off
                  </span>
                )}
              </div>
            </div>

            {/* Hero search */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-3 lg:w-80">
              <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
              <input
                type="text"
                placeholder={s.searchPlaceholder}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => handleSearchChange("")} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(cat => {
              const count = cat.id === "all"
                ? products.length
                : products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCatChange(cat.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-200"
                  style={
                    selectedCat === cat.id
                      ? { background: cat.color, color: "#0A0A0A", fontWeight: 600 }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  <span>{CAT_ICONS[cat.id] || "•"}</span>
                  {cat.name}
                  <span className="opacity-50 text-[10px]">{count}</span>
                </button>
              );
            })}

            {/* Sale toggle pill */}
            <button
              onClick={handleSaleToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-200"
              style={
                saleOnly
                  ? { background: "#FF6B6B", color: "#fff", fontWeight: 600 }
                  : { background: "rgba(255,107,107,0.15)", color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.3)" }
              }
            >
              <Zap className="w-3 h-3" />
              {s.sale}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-10">
        <div className="flex gap-8">

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-5">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF6B6B]" />
                  <span className="text-gray-900 text-sm tracking-widest uppercase" style={{ fontWeight: 600 }}>{s.filters}</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#FF6B6B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:text-[#FF6B6B] transition-colors tracking-widest uppercase">
                    {s.clearAll}
                  </button>
                )}
              </div>

              {/* Filter panel */}
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>

                {/* Sale toggle */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <button
                    onClick={handleSaleToggle}
                    className="w-full flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150"
                        style={saleOnly ? { background: "#FF6B6B", border: "2px solid #FF6B6B" } : { border: "2px solid #E5E7EB" }}
                      >
                        {saleOnly && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">Sale items only</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]" style={{ fontWeight: 600 }}>Hot</span>
                  </button>
                </div>

                {/* Price range */}
                <FilterSection title="Price Range" defaultOpen>
                  <PriceRangeSlider
                    value={priceRange}
                    onChange={handlePriceChange}
                    max={MAX_PRICE}
                  />
                </FilterSection>

                <div className="h-px bg-gray-100 mx-5" />

                {/* Condition */}
                <FilterSection title="Condition" defaultOpen>
                  <div className="space-y-2.5">
                    {CONDITIONS.map(c => {
                      const cnt = products.filter(p => p.condition === c).length;
                      return (
                        <label key={c} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCondition(c)}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150"
                              style={selectedConditions.includes(c) ? { background: "#FF6B6B", border: "2px solid #FF6B6B" } : { border: "2px solid #E5E7EB" }}
                            >
                              {selectedConditions.includes(c) && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{c}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-[9px] px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: CONDITION_COLORS[c].backgroundColor, color: CONDITION_COLORS[c].color }}
                            >
                              {c.slice(0, 1)}
                            </span>
                            <span className="text-[10px] text-gray-400">{cnt}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                <div className="h-px bg-gray-100 mx-5" />

                {/* Size */}
                <FilterSection title="Size">
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map(s => {
                      const cnt = products.filter(p => p.size === s).length;
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className="relative py-2 rounded-xl text-xs tracking-widest uppercase transition-all duration-150"
                          style={
                            selectedSizes.includes(s)
                              ? { background: "#0A0A0A", color: "#fff", fontWeight: 600 }
                              : cnt === 0
                              ? { background: "#F7F5F2", color: "#D1D5DB", cursor: "not-allowed" }
                              : { background: "#F7F5F2", color: "#6B7280" }
                          }
                          disabled={cnt === 0}
                        >
                          {s}
                          {cnt > 0 && (
                            <span
                              className="absolute -top-1 -right-1 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center"
                              style={
                                selectedSizes.includes(s)
                                  ? { background: "#FF6B6B", color: "#fff" }
                                  : { background: "#E5E7EB", color: "#9CA3AF" }
                              }
                            >
                              {cnt}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                <div className="h-px bg-gray-100 mx-5" />

                {/* Category */}
                <FilterSection title="Category">
                  <div className="space-y-1">
                    {categories.map(cat => {
                      const count = cat.id === "all"
                        ? products.length
                        : products.filter(p => p.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCatChange(cat.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 group"
                          style={selectedCat === cat.id ? { background: "#0A0A0A" } : {}}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                            <span style={{ color: selectedCat === cat.id ? "#fff" : undefined }} className={selectedCat === cat.id ? "" : "text-gray-700 group-hover:text-black"}>
                              {cat.name}
                            </span>
                          </div>
                          <span className={`text-xs ${selectedCat === cat.id ? "text-white/50" : "text-gray-400"}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

              </div>

              {/* Promo card */}
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)" }}>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-4 w-28 h-28 rounded-full bg-white/10" />
                <div className="relative z-10">
                  <Sparkles className="w-5 h-5 text-white mb-3" />
                  <p className="text-white text-sm mb-1" style={{ fontWeight: 700 }}>New items weekly!</p>
                  <p className="text-white/70 text-xs leading-relaxed">Fresh vintage picks land every Monday.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Products area ───────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-500 text-sm">
                  <span className="text-gray-900" style={{ fontWeight: 600 }}>{filtered.length}</span> {s.results}
                </span>
                {chips.map(chip => (
                  <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white rounded-full px-4 py-2 text-xs tracking-widest uppercase text-gray-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {s.filters} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(v => !v)}
                    className="flex items-center gap-2 border border-gray-200 bg-white rounded-full px-4 py-2 text-xs tracking-widest uppercase text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    {currentSort}
                    <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <div
                        className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl overflow-hidden z-20 min-w-[210px]"
                        style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                      >
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleSortChange(opt.value)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {opt.label}
                            {sortBy === opt.value && <Check className="w-4 h-4 text-[#FF6B6B]" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Grid controls */}
                <div className="hidden lg:flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                  {([2, 3, 4] as GridCols[]).map(n => (
                    <button
                      key={n}
                      onClick={() => { setGridCols(n); setViewMode("grid"); }}
                      className="w-9 h-9 flex items-center justify-center transition-all duration-150"
                      style={gridCols === n && viewMode === "grid" ? { background: "#0A0A0A", color: "#fff" } : { color: "#9CA3AF" }}
                      title={`${n} columns`}
                    >
                      {n === 2 ? <Grid2X2 className="w-4 h-4" /> : n === 3 ? <Grid3X3 className="w-4 h-4" /> : (
                        <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0" y="0" width="4" height="4" rx="0.5"/><rect x="6" y="0" width="4" height="4" rx="0.5"/>
                          <rect x="12" y="0" width="4" height="4" rx="0.5"/><rect x="0" y="6" width="4" height="4" rx="0.5"/>
                          <rect x="6" y="6" width="4" height="4" rx="0.5"/><rect x="12" y="6" width="4" height="4" rx="0.5"/>
                          <rect x="0" y="12" width="4" height="4" rx="0.5"/><rect x="6" y="12" width="4" height="4" rx="0.5"/>
                          <rect x="12" y="12" width="4" height="4" rx="0.5"/>
                        </svg>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => setViewMode("list")}
                    className="w-9 h-9 flex items-center justify-center transition-all duration-150 border-l border-gray-100"
                    style={viewMode === "list" ? { background: "#0A0A0A", color: "#fff" } : { color: "#9CA3AF" }}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} chips={chips} />
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {visible.map(product => (
                  <ListCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
                ))}
              </div>
            ) : (
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {visible.map((product, i) => (
                  <ShopCard key={product.id} product={product} index={i} onAddToCart={() => addToCart(product)} />
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount(v => v + 12)}
                  className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-10 py-4 text-sm tracking-widest uppercase text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                >
                  Load More
                  <span className="text-gray-400 text-xs">({filtered.length - visibleCount} more)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm tracking-widest uppercase" style={{ fontWeight: 600 }}>{s.filters}</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <PriceRangeSlider value={priceRange} onChange={handlePriceChange} max={MAX_PRICE} />
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3" style={{ fontWeight: 600 }}>Condition</p>
                <div className="space-y-2">
                  {CONDITIONS.map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCondition(c)}>
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={selectedConditions.includes(c) ? { background: "#FF6B6B", border: "2px solid #FF6B6B" } : { border: "2px solid #E5E7EB" }}
                      >
                        {selectedConditions.includes(c) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3" style={{ fontWeight: 600 }}>Size</p>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className="py-2 rounded-lg text-xs tracking-widest uppercase"
                      style={selectedSizes.includes(s) ? { background: "#0A0A0A", color: "#fff" } : { background: "#F7F5F2", color: "#6B7280" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={() => { clearAll(); setSidebarOpen(false); }}
                  className="w-full py-3 rounded-full border border-gray-200 text-xs tracking-widest uppercase text-gray-500 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors">
                  {s.clearAll}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function FilterSection({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="px-5 py-4">
      <button className="flex items-center justify-between w-full" onClick={() => setOpen(v => !v)}>
        <span className="text-xs tracking-[0.15em] uppercase text-gray-500" style={{ fontWeight: 600 }}>{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0", marginTop: open ? "14px" : "0", opacity: open ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

function PriceRangeSlider({ value, onChange, max }: {
  value: [number, number]; onChange: (v: [number, number]) => void; max: number;
}) {
  const minPct = (value[0] / max) * 100;
  const maxPct = (value[1] / max) * 100;
  return (
    <div>
      <div className="flex justify-between mb-3">
        <span className="text-xs text-gray-500">${value[0]}</span>
        <span className="text-xs text-gray-500">${value[1]}{value[1] === max ? "+" : ""}</span>
      </div>
      <div className="relative h-1.5 bg-gray-100 rounded-full mb-5">
        <div
          className="absolute h-full rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%`, background: "linear-gradient(to right, #FF6B6B, #4ECDC4)" }}
        />
        {/* Min thumb dot */}
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#FF6B6B] shadow"
          style={{ left: `calc(${minPct}% - 7px)` }} />
        {/* Max thumb dot */}
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#4ECDC4] shadow"
          style={{ left: `calc(${maxPct}% - 7px)` }} />
      </div>
      {/* Hidden overlapping range inputs */}
      <div className="relative h-0">
        <input type="range" min={0} max={max} value={value[0]}
          onChange={e => { const v = parseInt(e.target.value); if (v < value[1] - 5) onChange([v, value[1]]); }}
          className="absolute inset-x-0 -top-1.5 w-full opacity-0 h-3 cursor-pointer z-10" />
        <input type="range" min={0} max={max} value={value[1]}
          onChange={e => { const v = parseInt(e.target.value); if (v > value[0] + 5) onChange([value[0], v]); }}
          className="absolute inset-x-0 -top-1.5 w-full opacity-0 h-3 cursor-pointer z-20" />
      </div>
      {/* Quick presets */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {([[0, 25], [0, 50], [0, 100], [50, 200]] as [number, number][]).map(([mn, mx]) => (
          <button
            key={`${mn}-${mx}`}
            onClick={() => onChange([mn, mx])}
            className="text-[10px] px-2.5 py-1 rounded-full border transition-all duration-150"
            style={
              value[0] === mn && value[1] === mx
                ? { background: "#FF6B6B", color: "#fff", borderColor: "#FF6B6B" }
                : { borderColor: "#E5E7EB", color: "#9CA3AF" }
            }
          >
            Under ${mx}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
      {label}
      <button onClick={onRemove} className="text-gray-400 hover:text-[#FF6B6B] transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

const ACCENT_COLORS = ["#FF6B6B","#4ECDC4","#FFE66D","#F4A3A8","#95E1D3","#FFA07A","#C5B9E4","#A8DADC"];

function ShopCard({ product, index, onAddToCart }: {
  product: Product; index: number; onAddToCart: () => void;
}) {
  const navigate = useNavigate();
  const [liked, setLiked]   = useState(false);
  const [added, setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const accent   = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const cond = CONDITION_COLORS[product.condition] || { bg: "#F3F4F6", text: "#6B7280" };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)", opacity: hovered ? 1 : 0 }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: accent, color: "#0A0A0A", fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
          {product.featured && !discount && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/90 text-gray-700" style={{ fontWeight: 600 }}>
              ✦ Featured
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setLiked(v => !v); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Heart className="w-3.5 h-3.5" style={{ fill: liked ? "#FF6B6B" : "none", color: liked ? "#FF6B6B" : "#9CA3AF" }} />
        </button>
        {/* Hover actions */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(12px)" }}
        >
          <button
            onClick={e => { e.preventDefault(); navigate(`/product/${product.id}`); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase hover:bg-white/25 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-200"
            style={{ background: added ? "#22C55E" : accent, color: "#0A0A0A", fontWeight: 600 }}
          >
            {added ? <><Check className="w-3.5 h-3.5" />Added</> : <><ShoppingBag className="w-3.5 h-3.5" />Add</>}
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase">{product.category}</p>
          <span className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: cond.backgroundColor, color: cond.color, fontWeight: 600 }}>
            {product.condition}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-900 text-sm mb-3 line-clamp-2 hover:text-[#FF6B6B] transition-colors" style={{ fontWeight: 600 }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.05rem" }}>${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.size && (
            <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-lg">{product.size}</span>
          )}
        </div>
        <div
          className="mt-3 h-[2px] rounded-full transition-all duration-300"
          style={{ background: accent, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

function ListCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const { t } = useLanguage();
  const [liked, setLiked]   = useState(false);
  const [added, setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const cond = CONDITION_COLORS[product.condition] || { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex group transition-all duration-300"
      style={{ boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.04)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="relative flex-shrink-0 w-44 overflow-hidden">
        <img
          src={product.imageUrl} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ minHeight: "160px", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-[#FF6B6B] text-white text-[10px] px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}>
            -{discount}%
          </span>
        )}
      </Link>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase">{product.category}</p>
            <div className="flex items-center gap-2">
              {product.size && (
                <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-lg">{product.size}</span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: cond.backgroundColor, color: cond.color, fontWeight: 600 }}>
                {product.condition}
              </span>
            </div>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-gray-900 mb-1.5 hover:text-[#FF6B6B] transition-colors" style={{ fontWeight: 600 }}>{product.name}</h3>
          </Link>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-900 text-lg" style={{ fontWeight: 700 }}>${product.price}</span>
            {product.originalPrice && <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(v => !v)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#FF6B6B] transition-colors"
            >
              <Heart className="w-4 h-4" style={{ fill: liked ? "#FF6B6B" : "none", color: liked ? "#FF6B6B" : "#9CA3AF" }} />
            </button>
            <button
              onClick={() => { onAddToCart(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-200"
              style={added ? { background: "#22C55E", color: "#fff" } : { background: "#0A0A0A", color: "#fff" }}
            >
              {added
                ? <><Check className="w-3.5 h-3.5" />Added</>
                : <><ShoppingBag className="w-3.5 h-3.5" />{t.shop.addToCart}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear, chips }: { onClear: () => void; chips: { label: string }[] }) {
  const { t } = useLanguage();
  const s = t.shop;
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
        <Tag className="w-9 h-9 text-gray-300" />
      </div>
      <h3 className="text-gray-900 text-xl mb-2" style={{ fontWeight: 700 }}>{s.noProducts}</h3>
      <p className="text-gray-400 mb-4 max-w-sm leading-relaxed">
        {s.noProductsSub}
      </p>
      {chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {chips.map(c => (
            <span key={c.label} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{c.label}</span>
          ))}
        </div>
      )}
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#FF6B6B] transition-colors duration-200"
      >
        {s.clearFilters}
      </button>
    </div>
  );
}