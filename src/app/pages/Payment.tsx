import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import React from "react";

export function Payment() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    postalCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // =========================
  // FORMATTERS
  // =========================

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);

    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);

    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }

    return cleaned;
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;

    switch (name) {
      case "firstName":
      case "lastName":
        formattedValue = value.replace(
          /[^a-zA-Zа-яА-ЯөӨүҮёЁ\s-]/g,
          ""
        );
        break;

      case "postalCode":
        formattedValue = value.replace(/\D/g, "").slice(0, 5);
        break;

      case "cardNumber":
        formattedValue = formatCardNumber(value);
        break;

      case "expiryDate":
        formattedValue = formatExpiryDate(value);
        break;

      case "cvv":
        formattedValue = value.replace(/\D/g, "").slice(0, 3);
        break;

      case "cardName":
        formattedValue = value.replace(
          /[^a-zA-Zа-яА-ЯөӨүҮёЁ\s]/g,
          ""
        );
        break;

      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      return alert("Card number must be 16 digits");
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      return alert("Expiry date must be MM/YY");
    }

    if (!/^\d{5}$/.test(formData.postalCode)) {
      return alert("Postal code must be 5 digits");
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      return alert("CVV must be 3 digits");
    }

    setProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setSuccess(true);

    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 2000);
  };

  // =========================
  // INPUT STYLE
  // =========================

  const inputStyle = `
    w-full px-4 py-3
    border border-gray-200
    rounded-lg
    bg-gray-50
    text-gray-900
    text-sm
    placeholder:text-gray-400
    placeholder:text-sm
    focus:bg-white
    focus:outline-none
    focus:ring-2
    focus:ring-[#4ECDC4]
    transition-all
  `;

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t.payment.emptyCart}
          </h2>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white rounded-full hover:bg-[#FF6B6B] transition-all duration-200 text-sm tracking-widest uppercase"
          >
            {t.payment.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // SUCCESS
  // =========================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t.payment.successTitle}
          </h2>

          <p className="text-gray-600 mb-8">
            {t.payment.successMessage}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white rounded-full hover:bg-[#FF6B6B] transition-all duration-200 text-sm tracking-widest uppercase"
          >
            {t.payment.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.payment.backToCart}
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t.payment.title}
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* CONTACT */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t.payment.contactInfo}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.payment.email}
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  maxLength={50}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputStyle}
                />
              </div>
            </div>

            {/* SHIPPING */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t.payment.shippingAddress}
              </h2>

              <div className="space-y-4">
                {/* NAME */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.payment.firstName}
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      required
                      maxLength={20}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.payment.lastName}
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      required
                      maxLength={25}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.address}
                  </label>

                  <input
                    type="text"
                    name="address"
                    required
                    maxLength={80}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className={inputStyle}
                  />
                </div>

                {/* CITY + DISTRICT */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* CITY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.payment.city}
                    </label>

                    <input
                      type="text"
                      value="Ulaanbaatar"
                      disabled
                      readOnly
                      className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-lg
                        bg-gray-100
                        text-gray-500
                        text-sm
                        cursor-not-allowed
                        focus:outline-none
                      "
                    />
                  </div>

                  {/* DISTRICT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>

                    <select
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="
                        w-full px-4 py-3
                        border border-gray-200
                        rounded-lg
                        bg-gray-50
                        text-gray-900
                        text-sm
                        focus:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#4ECDC4]
                        transition-all
                      "
                    >
                      <option value="" className="text-gray-400">
                        Select your district
                      </option>

                      <option value="Baganuur">Baganuur</option>
                      <option value="Bagakhangai">
                        Bagakhangai
                      </option>
                      <option value="Bayangol">Bayangol</option>
                      <option value="Bayanzurkh">
                        Bayanzurkh
                      </option>
                      <option value="Chingeltei">
                        Chingeltei
                      </option>
                      <option value="Khan-Uul">Khan-Uul</option>
                      <option value="Nalaikh">Nalaikh</option>
                      <option value="Songinokhairkhan">
                        Songinokhairkhan
                      </option>
                      <option value="Sukhbaatar">
                        Sukhbaatar
                      </option>
                    </select>
                  </div>
                </div>

                {/* POSTAL CODE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.postalCode}
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    required
                    inputMode="numeric"
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-gray-400" />

                <h2 className="text-xl font-bold text-gray-900">
                  {t.payment.paymentInfo}
                </h2>
              </div>

              <div className="space-y-4">
                {/* CARD NUMBER */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.cardNumber}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      inputMode="numeric"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Enter your card number"
                      maxLength={19}
                      className={`${inputStyle} pl-12`}
                    />

                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* CARD NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.payment.cardName}
                  </label>

                  <input
                    type="text"
                    name="cardName"
                    required
                    maxLength={26}
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Enter cardholder name"
                    className={inputStyle}
                  />
                </div>

                {/* EXPIRY + CVV */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* EXPIRY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.payment.expiryDate}
                    </label>

                    <input
                      type="text"
                      name="expiryDate"
                      required
                      inputMode="numeric"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={inputStyle}
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.payment.cvv}
                    </label>

                    <input
                      type="password"
                      name="cvv"
                      required
                      inputMode="numeric"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="CVV"
                      maxLength={3}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* SECURITY MESSAGE */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#4ECDC4]" />

                <p className="text-xs text-gray-600">
                  {t.payment.secureMessage}
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-[#0A0A0A] text-white rounded-lg hover:bg-[#FF6B6B] transition-all duration-200 text-sm tracking-widest uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing
                ? t.payment.processing
                : `${t.payment.payNow} $${total.toFixed(2)}`}
            </button>
          </form>

          {/* ORDER SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t.payment.orderSummary}
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {item.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {t.payment.qty} {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t.payment.subtotal}
                  </span>

                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t.payment.shipping}
                  </span>

                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? t.payment.free
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t.payment.tax}
                  </span>

                  <span className="font-medium text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">
                    {t.payment.total}
                  </span>

                  <span className="font-bold text-xl text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}