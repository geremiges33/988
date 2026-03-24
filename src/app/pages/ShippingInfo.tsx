import { Truck, MapPin, Package, Clock, Phone, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";
import logo from "/Documents and Settings/Nest/Downloads/Thrift Shop Website (0)/src/assets/logo.png";

export function ShippingInfo() {
  const { t } = useLanguage();

  const shippingOptions = [
    {
      icon: Truck,
      title: t.shipping.standardTitle,
      price: t.shipping.standardPrice,
      desc: t.shipping.standardDesc,
      time: t.shipping.standardTime,
      accent: "#4A9E4A",
      badge: "Standard",
    },
    {
      icon: Package,
      title: t.shipping.expressTitle,
      price: t.shipping.expressPrice,
      desc: t.shipping.expressDesc,
      time: t.shipping.expressTime,
      accent: "#FF6B6B",
      badge: "Express",
    },
    {
      icon: Clock,
      title: t.shipping.freeTitle,
      price: t.shipping.freePrice,
      desc: t.shipping.freeDesc,
      time: t.shipping.freeTime,
      accent: "#FFE66D",
      badge: "Free",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ── Hero ── */}
      <div className="bg-[#0D1A0D] relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: "#4ECDC4" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-20 text-center">
          <img src={logo} alt="988 Thrift Shop" className="w-16 h-16 rounded-full object-cover mx-auto mb-6 border-2 border-[#4A9E4A]" />
          <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">Delivery</p>
          <h1
            className="text-white mb-5"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {t.shipping.title}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.shipping.subtitle}
          </p>
        </div>
      </div>

      {/* ── No-returns reminder ── */}
      <div className="bg-[#FF6B6B] py-3">
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-center gap-3 text-white text-sm text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</strong> — All sales are final. No returns or exchanges.</span>
        </div>
      </div>

      <div className="max-w-[1060px] mx-auto px-8 py-16 space-y-8">

        {/* ── Shipping options ── */}
        <div>
          <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-2">Options</p>
          <h2 className="text-gray-900 mb-8" style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {t.shipping.options}
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {shippingOptions.map(({ icon: Icon, title, price, desc, time, accent, badge }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-7 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200"
                style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: `1px solid ${accent}22` }}
              >
                {/* Badge */}
                <span
                  className="absolute top-5 right-5 text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase"
                  style={{ background: accent + "20", color: accent === "#FFE66D" ? "#92700A" : accent, fontWeight: 700 }}
                >
                  {badge}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: accent + "15" }}
                >
                  <Icon className="w-6 h-6" style={{ color: accent === "#FFE66D" ? "#92700A" : accent }} />
                </div>

                <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700 }}>{title}</h3>
                <p
                  className="mb-3"
                  style={{ fontSize: "1.8rem", fontWeight: 900, color: accent === "#FFE66D" ? "#92700A" : accent, lineHeight: 1 }}
                >
                  {price}
                </p>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{desc}</p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{ background: accent + "12", color: accent === "#FFE66D" ? "#92700A" : accent }}
                >
                  <Clock className="w-3 h-3" />
                  {time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── International Shipping ── */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#4ECDC4]" />
            </div>
            <h2 className="text-gray-900" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              {t.shipping.international}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{t.shipping.internationalDesc}</p>
          <div className="space-y-3">
            {[t.shipping.intPoint1, t.shipping.intPoint2, t.shipping.intPoint3].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tracking ── */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#4A9E4A]/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#4A9E4A]" />
            </div>
            <h2 className="text-gray-900" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              {t.shipping.tracking}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{t.shipping.trackingDesc}</p>
        </div>

        {/* ── Visit Us / CTA ── */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: "#0D1A0D" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
          <div className="relative z-10 p-10 text-center">
            <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">{t.shipping.questions}</p>
            <h3 className="text-white mb-3" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              {t.shipping.questionsDesc}
            </h3>
            <p className="text-white/50 mb-8 text-sm">
              📍 Натур, Шинэ Монгол сургуулийн хойно 36A байр · 🟢 11:00–20:00
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:85144414"
                className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#72C172] transition-colors"
              >
                <Phone className="w-4 h-4" />
                📲 85144414
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-[#4A9E4A]/40 text-[#4A9E4A] px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:border-[#4A9E4A] transition-colors"
              >
                {t.shipping.contactUs}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
