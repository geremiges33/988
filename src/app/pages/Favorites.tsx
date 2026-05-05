import { Link } from "react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import React from "react";

export function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-8 h-8 text-[#FF6B6B]" fill="#FF6B6B" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {t.favorites.title}
            </h1>
          </div>
          <p className="text-gray-500 text-lg">
            {t.favorites.subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.favorites.empty}
            </h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              {t.favorites.emptySub}
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#0A0A0A] text-white rounded-full hover:bg-[#FF6B6B] transition-all duration-200 text-sm tracking-widest uppercase"
            >
              {t.favorites.startShopping}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {favorites.length} {favorites.length === 1 ? t.favorites.item : t.favorites.items}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#FF6B6B] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {product.condition}
                      </span>
                      {product.size && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {product.size}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addToCart(product);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-lg hover:bg-[#4ECDC4] transition-all duration-200 text-xs tracking-wider uppercase"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {t.favorites.addToCart}
                      </button>
                      <button
                        onClick={() => removeFromFavorites(product.id)}
                        className="px-3 py-2 border border-gray-200 rounded-lg hover:border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all duration-200"
                        title={t.favorites.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
