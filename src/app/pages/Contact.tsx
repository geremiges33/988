import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";
import logo from "/Documents and Settings/Nest/Downloads/Thrift Shop Website (0)/src/assets/logo.png";

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ── Hero ── */}
      <div className="bg-[#0D1A0D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: "#4ECDC4" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-20 text-center">
          <img src={logo} alt="988 Thrift Shop" className="w-16 h-16 rounded-full object-cover mx-auto mb-6 border-2 border-[#4A9E4A]" />
          <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
          <h1
            className="text-white mb-5"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {t.contact.title}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>

          {/* Quick contact pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="tel:85144414"
              className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-5 py-2.5 rounded-full text-sm tracking-widest uppercase hover:bg-[#72C172] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              📲 85144414
            </a>
            <a
              href="tel:86310103"
              className="inline-flex items-center gap-2 border border-[#4A9E4A]/40 text-[#4A9E4A] px-5 py-2.5 rounded-full text-sm tracking-widest uppercase hover:border-[#4A9E4A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              📲 86310103
            </a>
          </div>
        </div>
      </div>

      {/* ── No-returns banner ── */}
      <div className="bg-[#FF6B6B] py-3">
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-center gap-3 text-white text-sm text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</strong> — All sales are final. Please check items before purchasing.</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* ── Contact Form ── */}
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-2">Message</p>
            <h2 className="text-gray-900 mb-7" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              {t.contact.sendMessage}
            </h2>

            {submitted ? (
              <div className="text-center py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, #4A9E4A, #4ECDC4)" }}
                >
                  <Check className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-gray-900 mb-3" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                  {t.contact.successTitle}
                </h3>
                <p className="text-gray-500">{t.contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4A9E4A] transition-colors"
                      placeholder={t.contact.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4A9E4A] transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                    {t.contact.subject}
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4A9E4A] transition-colors bg-white"
                  >
                    <option value="">{t.contact.selectSubject}</option>
                    <option value="order">{t.contact.orderInquiry}</option>
                    <option value="product">{t.contact.productQuestion}</option>
                    <option value="return">{t.contact.returnExchange}</option>
                    <option value="shipping">{t.contact.shippingQuestion}</option>
                    <option value="other">{t.contact.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                    {t.contact.message}
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4A9E4A] transition-colors resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white text-sm tracking-widest uppercase transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0D1A0D, #1A3A1A)" }}
                >
                  <Send className="w-4 h-4" />
                  {t.contact.sendButton}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact Info sidebar ── */}
          <div className="space-y-4">

            {/* Phone */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#4A9E4A]/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#4A9E4A]" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1 text-sm" style={{ fontWeight: 700 }}>{t.contact.callUs}</h3>
                  <p className="text-gray-400 text-xs mb-3">🟢 11:00 – 20:00 цаг · Өдөр бүр</p>
                  <div className="space-y-1">
                    <a href="tel:85144414" className="flex items-center gap-2 text-[#4A9E4A] hover:text-[#2D7A2D] text-sm transition-colors group">
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      📲 85144414
                    </a>
                    <a href="tel:86310103" className="flex items-center gap-2 text-[#4A9E4A] hover:text-[#2D7A2D] text-sm transition-colors group">
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      📲 86310103
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FFE66D]/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#92700A]" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1 text-sm" style={{ fontWeight: 700 }}>{t.contact.visitUs}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t.contact.addressLine1}<br />
                    {t.contact.addressLine2}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#4ECDC4]/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#4ECDC4]" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1 text-sm" style={{ fontWeight: 700 }}>{t.contact.businessHours}</h3>
                  <p className="text-gray-500 text-sm">{t.contact.mondayFriday}</p>
                </div>
              </div>
            </div>

            {/* No-returns box */}
            <div
              className="rounded-3xl p-6"
              style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)" }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#FF6B6B] text-sm mb-1" style={{ fontWeight: 700 }}>
                    ❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    All sales are final. Please review items carefully and call us before purchasing if you have any questions.
                  </p>
                  <Link
                    to="/returns"
                    className="mt-3 inline-flex items-center gap-1.5 text-[#FF6B6B] text-xs tracking-widest uppercase hover:gap-2 transition-all"
                  >
                    View Policy <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
