import { useState } from "react";
import { ChevronDown, Phone, MapPin, AlertCircle, MessageCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import React from "react";

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1, accent: "#4A9E4A" },
    { q: t.faq.q2, a: t.faq.a2, accent: "#4ECDC4" },
    { q: t.faq.q3, a: t.faq.a3, accent: "#FF6B6B" },
    { q: t.faq.q4, a: t.faq.a4, accent: "#FFE66D" },
    { q: t.faq.q5, a: t.faq.a5, accent: "#4A9E4A" },
    { q: t.faq.q6, a: t.faq.a6, accent: "#4ECDC4" },
    { q: t.faq.q7, a: t.faq.a7, accent: "#FFE66D" },
    { q: t.faq.q8, a: t.faq.a8, accent: "#FF6B6B" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ── Hero ── */}
      <div className="bg-[#0D1A0D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: "#72C172" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-20 text-center">
          <img src={logo} alt="988 Thrift Shop" className="w-16 h-16 rounded-full object-cover mx-auto mb-6 border-2 border-[#4A9E4A]" />
          <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">Help Center</p>
          <h1
            className="text-white mb-5"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {t.faq.title}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.faq.subtitle}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              { label: "Questions answered", val: "8+" },
              { label: "Open daily", val: "11–20" },
              { label: "Phone lines", val: "2" },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-white text-2xl" style={{ fontWeight: 800 }}>{val}</p>
                <p className="text-white/40 text-xs tracking-widest uppercase mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── No-returns banner ── */}
      <div className="bg-[#FF6B6B] py-3">
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-center gap-3 text-white text-sm text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</strong> — All sales are final. No returns or exchanges.</span>
        </div>
      </div>

      {/* ── FAQ List ── */}
      <div className="max-w-[860px] mx-auto px-8 py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: isOpen ? "0 8px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                  border: isOpen ? `1px solid ${faq.accent}33` : "1px solid transparent",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs transition-all duration-200"
                      style={{
                        background: isOpen ? faq.accent : "#F3F4F6",
                        color: isOpen ? (faq.accent === "#FFE66D" ? "#0A0A0A" : "#fff") : "#9CA3AF",
                        fontWeight: 700,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-base transition-colors duration-150"
                      style={{ fontWeight: 600, color: isOpen ? "#0A0A0A" : "#374151" }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: isOpen ? faq.accent : "#9CA3AF" }}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
                >
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <div
                      className="w-full h-px mb-4"
                      style={{ background: faq.accent + "33" }}
                    />
                    <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Still have questions ── */}
        <div
          className="mt-12 rounded-3xl overflow-hidden"
          style={{ background: "#0D1A0D" }}
        >
          <div className="p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-15" style={{ background: "#4A9E4A" }} />
            <div className="relative z-10">
              <MessageCircle className="w-10 h-10 text-[#4A9E4A] mx-auto mb-4" />
              <h3 className="text-white mb-3" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                {t.faq.stillHaveQuestions}
              </h3>
              <p className="text-white/50 mb-8 max-w-sm mx-auto leading-relaxed">
                {t.faq.contactPrompt}
              </p>

              {/* Contact methods */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <a
                  href="tel:85144414"
                  className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#72C172] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  📲 85144414
                </a>
                <a
                  href="tel:86310103"
                  className="inline-flex items-center gap-2 border border-[#4A9E4A]/40 text-[#4A9E4A] px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:border-[#4A9E4A] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  📲 86310103
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span>Натур, Шинэ Монгол сургуулийн хойно 36A байр · 11:00–20:00</span>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors"
              >
                {t.faq.contactUs}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
