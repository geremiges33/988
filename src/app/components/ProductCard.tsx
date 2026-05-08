import { Link } from "react-router";
import { ShoppingBag, Heart, Eye, Check } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";
import React from "react";

interface ProductCardProps {
  product: Product;
  accent?: string;
  index?: number;
}

const ACCENT_COLORS = ["#FF6B6B","#4ECDC4","#FFE66D","#F4A3A8","#95E1D3","#FFA07A","#C5B9E4","#A8DADC"];

const CONDITION_COLORS: Record<string, { bg: string; text: string }> = {
  Excellent: { bg: "#DCFCE7", text: "#16A34A" },
  "Very Good": { bg: "#DBEAFE", text: "#2563EB" },
  Good: { bg: "#FEF9C3", text: "#CA8A04" },
  Fair: { bg: "#FEE2E2", text: "#DC2626" },
};

export function ProductCard({ product, accent, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cardAccent = accent || ACCENT_COLORS[index % ACCENT_COLORS.length];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const cond = CONDITION_COLORS[product.condition] || { bg: "#F3F4F6", text: "#6B7280" };
  const isLiked = isFavorite(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
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
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)", opacity: hovered ? 1 : 0 }}
        />

        {/* Discount badge */}
        {discount && (
          <span
            className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full"
            style={{ background: cardAccent, color: "#0A0A0A", fontWeight: 700 }}
          >
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Heart
            className="w-3.5 h-3.5 transition-colors"
            style={{ fill: isLiked ? "#FF6B6B" : "none", color: isLiked ? "#FF6B6B" : "#9CA3AF" }}
          />
        </button>

        {/* Hover actions */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(12px)" }}
        >
          <Link
            to={`/product/${product.id}`}
            onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase hover:bg-white/25 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-200"
            style={{ background: added ? "#22C55E" : cardAccent, color: "#0A0A0A", fontWeight: 600 }}
          >
            {added ? <><Check className="w-3.5 h-3.5" />Added</> : <><ShoppingBag className="w-3.5 h-3.5" />Add</>}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase">{product.category}</p>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: cond.bg, color: cond.text, fontWeight: 600 }}
          >
            {product.condition}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3
            className="text-gray-900 text-sm mb-3 line-clamp-2 hover:text-[#FF6B6B] transition-colors"
            style={{ fontWeight: 600 }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              ₮{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">₮{product.originalPrice}</span>
            )}
          </div>
          {product.size && (
            <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-lg">
              {product.size}
            </span>
          )}
        </div>
        {/* Accent bottom line */}
        <div
          className="mt-3 h-[2px] rounded-full transition-all duration-300"
          style={{ background: cardAccent, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}