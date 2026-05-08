import { Link } from "react-router";
import {
  Plus, Trash2, Edit3, Package, X, Check,
  BarChart2, ShoppingBag, Tag, TrendingUp, Eye, Search,
  Upload, ChevronRight, AlertCircle
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { Product, categories } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import React, {
  useState,
  ChangeEvent,
} from "react";



const BLANK: Omit<Product, "id"> = {
  name: "",
  price: 0,
  originalPrice: undefined,
  category: "clothing",
  description: "",
  condition: "Good",
  size: "",
  imageUrl: "",
};

const CONDITIONS = ["New", "Excellent", "Very Good", "Good", "Fair"];

// Dark green palette
const G = {
  900: "#0a1a0e",
  800: "#132a18",
  700: "#1a3a20",
  600: "#245230",
  500: "#2d6a3f",
  400: "#3a854f",
  300: "#5aaa6e",
  200: "#8dcba0",
  100: "#c2e8ce",
  50:  "#edf7f1",
};

export function Admin() {
  const { products, addProduct, removeProduct, updateProduct } = useProducts();
  const { t } = useLanguage();
  const [view, setView] = useState<"dashboard" | "products" | "add" | "edit">("dashboard");
  const [form, setForm] = useState<Omit<Product, "id">>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);


  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e: Partial<Record<keyof Product, string>> = {};
    if (!form.name.trim()) e.name = t.adminPage.nameRequired;
    if (!form.price || form.price <= 0) e.price = t.adminPage.priceRequired;
    if (!form.description.trim()) e.description = t.adminPage.descriptionRequired;
    if (!form.imageUrl.trim()) e.imageUrl = t.adminPage.imageRequired;
    if (!form.category) e.category = t.adminPage.categoryRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId) {
      updateProduct({ ...form, id: editingId });
      showToast(t.adminPage.productUpdated);
    } else {
      const newId = `prod_${Date.now()}`;
      addProduct({ ...form, id: newId });
      showToast(t.adminPage.productAdded);
    }
    setForm(BLANK);
    setEditingId(null);
    setErrors({});
    setView("products");
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.readAsDataURL(file);
  
    reader.onloadend = () => {
      const base64 = reader.result as string;
  
      setForm((prev) => ({
        ...prev,
        imageUrl: base64,
      }));
    };
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description,
      condition: product.condition,
      size: product.size,
      imageUrl: product.imageUrl,

    });
    setEditingId(product.id);
    setErrors({});
    setView("edit");
  };

  const handleDelete = (id: string) => {
    removeProduct(id);
    setDeleteConfirm(null);
    showToast(t.adminPage.productRemoved, "error");
  };

  const filteredProducts = products.filter((p) => {
    const matchCat =
      filterCat === "all" || p.category === filterCat;
  
    const matchSearch =
      (p?.name ?? "")
        .toLowerCase()
        .includes((search ?? "").toLowerCase());
  
    return matchCat && matchSearch;
  });

  const totalValue = products.reduce((s, p) => s + p.price, 0);

  const categoryCount = new Set(products.map((p) => p.category)).size;

  return (
    <div className="min-h-screen" style={{ background: "#f6f8f6" }}>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-md text-white text-sm"
          style={{
            background: toast.type === "success" ? G[500] : "#b91c1c",
            letterSpacing: "0.01em",
          }}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(10,26,14,0.45)" }}>
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4" style={{ border: `1px solid ${G[100]}` }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
              style={{ background: "#fef2f2" }}
            >
              <Trash2 className="w-4 h-4" style={{ color: "#b91c1c" }} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">{t.adminPage.deleteConfirmTitle}</h3>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>{t.adminPage.deleteConfirmMsg}</p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-lg text-sm border transition-colors"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
                onClick={() => setDeleteConfirm(null)}
              >
                {t.adminPage.cancel}
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-sm text-white transition-colors"
                style={{ background: "#b91c1c" }}
                onClick={() => handleDelete(deleteConfirm)}
              >
                {t.adminPage.deleteProduct}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* ─── Sidebar ─── */}
        <aside
          className="w-60 min-h-screen flex-shrink-0 flex flex-col"
          style={{ background: G[900], borderRight: `1px solid ${G[800]}` }}
        >
          {/* Brand */}
          <div className="px-6 pt-7 pb-6" style={{ borderBottom: `1px solid ${G[800]}` }}>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: G[500] }}
              >
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold tracking-wide">{t.adminPage.adminPanel}</p>
                <p className="text-xs" style={{ color: G[300] }}>{t.adminPage.thriftStore}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 py-5 flex-1 space-y-0.5">
            {[
              { id: "dashboard", label: t.adminPage.dashboard, icon: BarChart2 },
              { id: "products", label: t.adminPage.allProducts, icon: ShoppingBag },
              { id: "add", label: t.adminPage.addProduct, icon: Plus },
            ].map(({ id, label, icon: Icon }) => {
              const active = view === id || (view === "edit" && id === "products");
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "add") { setForm(BLANK); setEditingId(null); setErrors({}); }
                    setView(id as any);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    background: active ? G[700] : "transparent",
                    color: active ? G[100] : G[300],
                    borderLeft: active ? `2px solid ${G[400]}` : "2px solid transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Footer link */}
          <div className="px-3 pb-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{ color: G[400] }}
            >
              <Eye className="w-4 h-4" />
              {t.adminPage.viewStore}
            </Link>
          </div>
        </aside>

        {/* ─── Main content ─── */}
        <main className="flex-1 p-8 min-h-screen">

          {/* ── Dashboard ── */}
          {view === "dashboard" && (
            <div>
              <div className="mb-8">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{t.adminPage.dashboard}</h1>
                <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>{t.adminPage.welcomeBack}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: t.adminPage.totalProducts, value: products.length, icon: Package, bg: G[50], iconColor: G[600] },
                  { label: t.adminPage.totalValue, value: `₮${totalValue.toLocaleString()}`, icon: TrendingUp, bg: "#f0fdf4", iconColor: "#15803d" },
                 
                  { label: t.adminPage.categories, value: categoryCount, icon: BarChart2, bg: "#f5f3ff", iconColor: "#7c3aed" },
                ].map(({ label, value, icon: Icon, bg, iconColor }) => (
                  <div
                    key={label}
                    className="rounded-xl p-5"
                    style={{ background: "#fff", border: "1px solid #e9f0ea" }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: iconColor }} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                    <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Category + Recent */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #e9f0ea" }}>
                  <h2
                    className="text-xs font-semibold uppercase tracking-widest mb-5"
                    style={{ color: G[600] }}
                  >{t.adminPage.byCategory}</h2>
                  <div className="space-y-3.5">
                    {categories.filter((c) => c.id !== "all").map((cat) => {
                      const count = products.filter((p) => p.category === cat.id).length;
                      const pct = products.length ? Math.round((count / products.length) * 100) : 0;
                      return (
                        <div key={cat.id}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm text-gray-600">{cat.name}</span>
                            <span className="text-xs" style={{ color: "#9ca3af" }}>{count} {t.adminPage.items}</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: G[400] }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #e9f0ea" }}>
                  <h2
                    className="text-xs font-semibold uppercase tracking-widest mb-5"
                    style={{ color: G[600] }}
                  >{t.adminPage.recentProducts}</h2>
                  <div className="space-y-3.5">
                    {products.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs" style={{ color: "#9ca3af" }}>{p.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">₮{p.price}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setView("products")}
                    className="mt-5 text-xs flex items-center gap-1 transition-colors"
                    style={{ color: G[500] }}
                  >
                    {t.adminPage.viewAllProducts} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Products list ── */}
          {view === "products" && (
            <div>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{t.adminPage.allProducts}</h1>
                  <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
                    {filteredProducts.length} {t.adminPage.ofProducts} {products.length} {t.adminPage.products}
                  </p>
                </div>
                <button
                  onClick={() => { setForm(BLANK); setEditingId(null); setErrors({}); setView("add"); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white"
                  style={{ background: G[600] }}
                >
                  <Plus className="w-4 h-4" /> {t.adminPage.addProduct}
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
                  <input
                    type="text"
                    placeholder={t.adminPage.searchProducts}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-lg outline-none transition-colors"
                    style={{ border: "1px solid #e5e7eb" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2.5 text-sm bg-white rounded-lg outline-none cursor-pointer"
                  style={{ border: "1px solid #e5e7eb" }}
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e9f0ea" }}>
                <table className="w-full">
                  <thead>
                    {/* ✅ Static <tr> — no .map() here, so no key warning */}
                    <tr style={{ borderBottom: "1px solid #f0f4f0", background: "#f9fbf9" }}>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{t.adminPage.product}</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{t.adminPage.category}</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{t.adminPage.condition}</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{t.adminPage.price}</th>
                     
                      <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{t.adminPage.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const cat = categories.find((c) => c.id === p.category);
                      return (
                        <tr key={p.id} className="transition-colors hover:bg-[#f9fbf9]" style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                {p.size && <p className="text-xs" style={{ color: "#9ca3af" }}>{t.adminPage.size}: {p.size}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                              style={{ background: G[50], color: G[700] }}
                            >
                              {cat?.name ?? p.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: "#6b7280" }}>{p.condition}</td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900">₮{p.price}</span>
                            {p.originalPrice && (
                              <span className="text-xs line-through ml-1" style={{ color: "#9ca3af" }}>₮{p.originalPrice}</span>
                            )}
                          </td>
                          
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/product/${p.id}`}
                                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                              </Link>
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: G[500] }}
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: "#ef4444" }}
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center text-sm" style={{ color: "#9ca3af" }}>
                          {t.adminPage.noProductsFound}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Add / Edit form ── */}
          {(view === "add" || view === "edit") && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={() => { setView("products"); setForm(BLANK); setEditingId(null); setErrors({}); }}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    {editingId ? t.adminPage.editProduct : t.adminPage.addNewProduct}
                  </h1>
                  <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
                    {editingId ? t.adminPage.updateProductDetails : t.adminPage.fillDetailsToAdd}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Left */}
                <div className="col-span-2 space-y-5">
                  <FormField label={t.adminPage.productName} error={errors.name} required>
                    <input
                      type="text"
                      placeholder={t.adminPage.productNamePlaceholder}
                      className={inputCls(!!errors.name)}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </FormField>

                  <FormField label={t.adminPage.description} error={errors.description} required>
                    <textarea
                      rows={4}
                      placeholder={t.adminPage.descriptionPlaceholder}
                      className={inputCls(!!errors.description) + " resize-none"}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label={t.adminPage.salePrice} error={errors.price} required>
                      <input
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        className={inputCls(!!errors.price)}
                        value={form.price || ""}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                      />
                    </FormField>
                    <FormField label={t.adminPage.originalPrice} hint={t.adminPage.optional}>
                      <input
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        className={inputCls(false)}
                        value={form.originalPrice || ""}
                        onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || undefined })}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label={t.adminPage.category} error={errors.category} required>
                      <select
                        className={inputCls(!!errors.category) + " cursor-pointer"}
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {categories.filter((c) => c.id !== "all").map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label={t.adminPage.condition} required>
                      <select
                        className={inputCls(false) + " cursor-pointer"}
                        value={form.condition}
                        onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      >
                        {CONDITIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label={t.adminPage.size} hint={t.adminPage.optionalLeaveBlank}>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setForm({ ...form, size: form.size === sz ? "" : sz })}
                          className="px-4 py-2 rounded-lg text-sm border transition-all duration-150"
                          style={
                            form.size === sz
                              ? { background: G[600], color: "#fff", borderColor: G[600] }
                              : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                          }
                        >
                          {sz}
                        </button>
                      ))}
                      <input
                        type="text"
                        placeholder={t.adminPage.customSize}
                        className="px-4 py-2 rounded-lg text-sm border outline-none transition-colors w-28"
                        style={{ borderColor: "#e5e7eb" }}
                        value={["XS","S","M","L","XL","XXL","One Size"].includes(form.size ?? "") ? "" : (form.size ?? "")}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                      />
                    </div>
                  </FormField>

                  <FormField label={t.adminPage.imageUrl} error={errors.imageUrl} required>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 rounded-lg text-sm border border-gray-200 bg-white"
                    />
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#9ca3af" }}>
                      <Upload className="w-3 h-3" />
                      {t.adminPage.pasteImageUrl}
                    </p>
                  </FormField>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e9f0ea" }}>
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid #f0f4f0" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: G[600] }}>
                        {t.adminPage.preview}
                      </p>
                    </div>
                    <div className="aspect-square bg-gray-50 relative">
                      {form.imageUrl ? (
                        <img
                          src={form.imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: "#d1d5db" }}>
                          <Package className="w-9 h-9 mb-2" />
                          <p className="text-xs">{t.adminPage.noImageYet}</p>
                        </div>
                      )}
                    </div>
                    {form.name && (
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900 truncate">{form.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-900">₮{form.price || "0"}</span>
                          {form.originalPrice && (
                            <span className="text-xs line-through" style={{ color: "#9ca3af" }}>₮{form.originalPrice}</span>
                          )}
                          {form.originalPrice && form.price < form.originalPrice && (
                            <span className="text-xs font-medium" style={{ color: "#dc2626" }}>
                              -{Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                    style={{ background: G[600] }}
                  >
                    {editingId ? (
                      <><Check className="w-4 h-4" /> {t.adminPage.saveProduct}</>
                    ) : (
                      <><Plus className="w-4 h-4" /> {t.adminPage.addProduct}</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setView("products"); setForm(BLANK); setEditingId(null); setErrors({}); }}
                    className="w-full py-2.5 rounded-lg text-sm border transition-colors"
                    style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                  >
                    {t.adminPage.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── helpers ─── */

function FormField({
  label, children, error, hint, required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>
        {label}
        {required && <span className="ml-1" style={{ color: "#ef4444" }}>*</span>}
        {hint && <span className="normal-case font-normal tracking-normal ml-1" style={{ color: "#9ca3af" }}>— {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-lg text-sm border outline-none transition-colors bg-white ${
    hasError ? "border-red-300" : "border-gray-200 focus:border-[#245230]"
  }`;
}