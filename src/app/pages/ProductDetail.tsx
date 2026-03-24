import { useParams, useNavigate, Link } from "react-router";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useFavorites } from "../context/FavoritesContext";
import { ShoppingCart, Heart, ArrowLeft, Star, Package, Shield, AlertCircle, Recycle } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const p = t.product;
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Product not found</h2>
          <Link to="/shop" className="text-[#4ECDC4] hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] to-[#FFF5F5]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {p.backToShop}
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl sticky top-20">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-sm text-[#4ECDC4] uppercase tracking-wide mb-2">
                {product.category}
              </div>
              <h1 className="mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#FFE66D] text-[#FFE66D]"
                    />
                  ))}
                </div>
                <span className="text-gray-600">(47 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-[#FF6B6B]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-sm">
                      Save ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Condition</div>
                  <div className="font-medium">{product.condition}</div>
                </div>
                {product.size && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Size</div>
                    <div className="font-medium">{product.size}</div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-white transition-all duration-300"
                  style={{ background: justAdded ? "#22C55E" : "linear-gradient(135deg, #FF6B6B, #4ECDC4)" }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {justAdded ? p.addedToCart : p.addToCart}
                </button>
                <button
                  onClick={() => {
                    if (isFavorite(product.id)) {
                      removeFromFavorites(product.id);
                    } else {
                      addToFavorites(product);
                    }
                  }}
                  className="p-4 rounded-full border-2 transition-all duration-200"
                  style={{ borderColor: isFavorite(product.id) ? "#FF6B6B" : "#E5E7EB", color: isFavorite(product.id) ? "#FF6B6B" : "#9CA3AF" }}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Package className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <span className="text-green-600 text-sm">{p.inStock}</span>
                </div>
                <div className="text-center">
                  <AlertCircle className="w-4 h-4 text-[#FF6B6B] mx-auto mb-1" />
                  <span className="text-[#FF6B6B] text-sm">No Returns</span>
                </div>
                <div className="text-center">
                  <Recycle className="w-4 h-4 text-[#4A9E4A] mx-auto mb-1" />
                  <span className="text-[#4A9E4A] text-sm">{p.sustainableNote}</span>
                </div>
              </div>

              {/* No-returns notice */}
              <div
                className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)" }}
              >
                <AlertCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0" />
                <p className="text-[#FF6B6B] text-xs">
                  <strong>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</strong> — All sales final. No returns or exchanges accepted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8">{p.relatedTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}