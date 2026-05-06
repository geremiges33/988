import { useState } from "react";
import { Link } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import React from "react";

const sans = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" };

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const { t } = useLanguage();
  const c = t.cart;

  if (cartItems.length === 0) {
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
            <ShoppingBag className="w-16 h-16" style={{ color: "#ffffff" }} />
          </div>
          <h2
            className="mb-4 text-3xl font-semibold"
            style={{ color: "#1a3a2a", letterSpacing: "-0.01em" }}
          >
            {c.empty}
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#5a7a6a" }}>
            {c.emptySub}
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
            <span>{c.startShopping}</span>
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
            Review &amp; Confirm
          </p>
          <h1
            className="text-4xl"
            style={{
              color: "#1a3a2a",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {c.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-5 p-5"
                style={{ background: "#ffffff", border: "1px solid #dce8e2" }}
              >
                {/* Product Image */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover"
                />

                {/* Product Info */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3
                          className="text-base"
                          style={{
                            color: "#1a3a2a",
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.name}
                        </h3>
                      </Link>
                      <p
                        className="mt-1 uppercase"
                        style={{
                          color: "#7a9e8e",
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          fontWeight: 500,
                        }}
                      >
                        {item.category}
                        {item.size && ` · Size: ${item.size}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 transition-colors"
                      style={{ color: "#b0ccc4" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#1a3a2a")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "#b0ccc4")
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity Controls */}
                    <div
                      className="flex items-center"
                      style={{ border: "1px solid #dce8e2" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center transition-all"
                        style={{ background: "#f5f5f0", color: "#1a3a2a" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#1a3a2a";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#f5f5f0";
                          e.currentTarget.style.color = "#1a3a2a";
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        className="w-9 text-center text-sm"
                        style={{ color: "#1a3a2a", fontWeight: 600 }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center transition-all"
                        style={{ background: "#f5f5f0", color: "#1a3a2a" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#1a3a2a";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#f5f5f0";
                          e.currentTarget.style.color = "#1a3a2a";
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div
                        className="text-xl"
                        style={{ color: "#1a3a2a", fontWeight: 700 }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#b0ccc4" }}
                      >
                        ${item.price} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-xs uppercase mt-2 transition-colors"
              style={{
                color: "#b0ccc4",
                letterSpacing: "0.1em",
                fontWeight: 500,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#1a3a2a")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#b0ccc4")}
            >
              {c.clearCart}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20" style={{ background: "#1a3a2a" }}>
              <div className="p-7">
                <h3
                  className="mb-7 pb-5 uppercase"
                  style={{
                    color: "#ffffff",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    fontSize: "0.72rem",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {c.orderSummary}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span
                      className="uppercase text-xs"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                      }}
                    >
                      {c.subtotal}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="uppercase text-xs"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                      }}
                    >
                      {c.shipping}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#7ec8a0" }}
                    >
                      {c.shippingFree}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className="uppercase text-xs"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                      }}
                    >
                      Tax
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      ${(getCartTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <div
                    className="pt-5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="uppercase text-xs"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          letterSpacing: "0.1em",
                          fontWeight: 500,
                        }}
                      >
                        {c.total}
                      </span>
                      <span
                        className="text-2xl"
                        style={{
                          color: "#ffffff",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        ${(getCartTotal() * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/payment"
                  className="block w-full py-3.5 text-center transition-opacity hover:opacity-90 mb-3"
                  style={{
                    background: "#ffffff",
                    color: "#1a3a2a",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.72rem",
                  }}
                >
                  {c.checkout}
                </Link>

                <Link
                  to="/shop"
                  className="block text-center uppercase transition-opacity hover:opacity-75"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                  }}
                >
                  {c.continueShopping}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}