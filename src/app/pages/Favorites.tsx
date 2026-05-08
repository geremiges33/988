import { Link } from "react-router";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import React from "react";

const sans = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

export function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f5f5f0", ...sans }}
      >
        <div className="text-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#1a3a2a" }}
          >
            <Heart className="w-16 h-16" style={{ color: "#ffffff" }} />
          </div>
          <h2
            className="mb-4 text-3xl font-semibold"
            style={{ color: "#1a3a2a", letterSpacing: "-0.01em" }}
          >
            {t.favorites.empty}
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#5a7a6a" }}>
            {t.favorites.emptySub}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3 transition-all hover:opacity-90"
            style={{
              background: "#1a3a2a",
              color: "#ffffff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span>{t.favorites.startShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12"
      style={{ background: "#f5f5f0", ...sans }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div
          className="mb-10 pb-6"
          style={{ borderBottom: "1.5px solid #1a3a2a" }}
        >
          <p
            className="text-xs uppercase mb-1"
            style={{
              color: "#5a7a6a",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}
          >
            Your curated collection
          </p>
          <h1
            className="text-4xl"
            style={{
              color: "#1a3a2a",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {t.favorites.title}
          </h1>
        </div>

        <div className="mb-6">
          <p
            className="text-xs uppercase"
            style={{
              color: "#5a7a6a",
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            {favorites.length}{" "}
            {favorites.length === 1 ? t.favorites.item : t.favorites.items}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="flex flex-col"
              style={{ background: "#ffffff", border: "1px solid #dce8e2" }}
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3
                    className="text-base mb-1"
                    style={{
                      color: "#1a3a2a",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-lg"
                    style={{ color: "#1a3a2a", fontWeight: 700 }}
                  >
                    ₮{product.price}
                  </span>
                  {product.originalPrice && (
                    <span
                      className="text-sm line-through"
                      style={{ color: "#b0ccc4" }}
                    >
                      ₮{product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {product.condition && (
                    <span
                      className="text-xs px-2 py-0.5 uppercase"
                      style={{
                        background: "#f5f5f0",
                        color: "#5a7a6a",
                        letterSpacing: "0.08em",
                        fontWeight: 500,
                        border: "1px solid #dce8e2",
                      }}
                    >
                      {product.condition}
                    </span>
                  )}
                  {product.size && (
                    <span
                      className="text-xs px-2 py-0.5 uppercase"
                      style={{
                        background: "#f5f5f0",
                        color: "#5a7a6a",
                        letterSpacing: "0.08em",
                        fontWeight: 500,
                        border: "1px solid #dce8e2",
                      }}
                    >
                      {product.size}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all hover:opacity-90"
                    style={{
                      background: "#1a3a2a",
                      color: "#ffffff",
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t.favorites.addToCart}
                  </button>
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="px-3 py-2.5 transition-all"
                    style={{
                      border: "1px solid #dce8e2",
                      color: "#b0ccc4",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#1a3a2a";
                      e.currentTarget.style.color = "#1a3a2a";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#dce8e2";
                      e.currentTarget.style.color = "#b0ccc4";
                    }}
                    title={t.favorites.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}