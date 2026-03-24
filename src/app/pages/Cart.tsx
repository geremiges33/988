import { useState } from "react";
import { Link } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const c = t.cart;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-white" />
          </div>
          <h2 className="mb-4">{c.empty}</h2>
          <p className="text-gray-600 mb-8">{c.emptySub}</p>
          <Link
            to="/shop"
            className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-8 py-4 rounded-full inline-flex items-center space-x-2 hover:scale-105 transition-transform shadow-lg"
          >
            <span>{c.startShopping}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8F8] to-[#FFF5F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8">{c.title}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row gap-6"
              >
                {/* Product Image */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl"
                />

                {/* Product Info */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="hover:text-[#4ECDC4] transition-colors"
                      >
                        <h3>{item.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.category}
                        {item.size && ` • Size: ${item.size}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-[#FF6B6B] transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FF6B6B]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-[#FF6B6B] hover:underline text-sm"
            >
              {c.clearCart}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-20">
              <h3 className="mb-6">{c.orderSummary}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{c.subtotal}</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{c.shipping}</span>
                  <span className="text-[#95E1D3]">{c.shippingFree}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">{c.total}</span>
                    <span className="text-2xl font-bold text-[#FF6B6B]">
                      ${(getCartTotal() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/payment"
                className="block w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white py-4 rounded-full hover:scale-105 transition-transform shadow-lg mb-3 text-center"
              >
                {c.checkout}
              </Link>

              <Link
                to="/shop"
                className="block text-center text-[#4ECDC4] hover:underline"
              >
                {c.continueShopping}
              </Link>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block mb-2 text-sm">Promo Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                  />
                  <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#95E1D3] rounded-full" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#FF6B6B] rounded-full" />
                  <span className="text-[#FF6B6B]">❗️ No returns or exchanges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#F4A3A8] rounded-full" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}