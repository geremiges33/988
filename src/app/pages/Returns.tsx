import { useLanguage } from "../context/LanguageContext";
import { AlertCircle, ShoppingBag, Phone, MapPin } from "lucide-react";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import React from "react";

export function Returns() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0D1A0D] border-b border-[#2E6B2E]/30">
        <div className="max-w-[1200px] mx-auto px-8 py-20 text-center">
          <img src={logo} alt="988 Thrift Shop" className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-[#4A9E4A]" />
          <div className="inline-flex items-center gap-3 bg-[#FF6B6B] text-white px-6 py-3 rounded-full text-lg mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span style={{ fontWeight: 700 }}>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</span>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>
            Store Return Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            988 Thrift Shop does <strong className="text-[#FF6B6B]">NOT</strong> accept returns or exchanges. All sales are final. Please review items carefully before purchasing.
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-8 py-16">
        {/* Big Notice */}
        <div className="bg-[#FF6B6B] rounded-3xl p-10 text-center text-white mb-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="mb-4" style={{ fontSize: "2rem", fontWeight: 900 }}>
            ❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ
          </h2>
          <p className="text-xl text-white/85 mb-6">No Returns · No Exchanges · All Sales Final</p>
          <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed">
            Once a purchase is made, it cannot be returned or exchanged for any reason. Please make sure to check the item's condition, size, and description before buying.
          </p>
        </div>

        {/* What to do before buying */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
          <h3 className="text-gray-900 mb-6" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Before You Buy — Check These ✅
          </h3>
          <div className="space-y-4">
            {[
              "Carefully read the item description and condition rating",
              "Review all product photos before purchasing",
              "Check the size guide and measurements",
              "Contact us with any questions BEFORE purchasing",
              "Verify the item meets your expectations",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A9E4A] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5" style={{ fontWeight: 700 }}>
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact for questions */}
        <div className="bg-[#F0FAF0] rounded-3xl p-8 border border-[#4A9E4A]/20">
          <h3 className="text-gray-900 mb-4" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
            Have Questions Before Buying?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Contact us before making a purchase if you have any questions about an item. We're happy to help!
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="tel:85144414" className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#4A9E4A]/20 hover:border-[#4A9E4A] transition-colors">
              <Phone className="w-5 h-5 text-[#4A9E4A]" />
              <div>
                <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>📲 85144414</p>
                <p className="text-gray-400 text-xs">Call us</p>
              </div>
            </a>
            <a href="tel:86310103" className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#4A9E4A]/20 hover:border-[#4A9E4A] transition-colors">
              <Phone className="w-5 h-5 text-[#4A9E4A]" />
              <div>
                <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>📲 86310103</p>
                <p className="text-gray-400 text-xs">Call us</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <MapPin className="w-5 h-5 text-[#4A9E4A]" />
              <div>
                <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>📍 Натур, 36A</p>
                <p className="text-gray-400 text-xs">11:00–20:00</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#2D7A2D] transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Browse Shop
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border border-[#4A9E4A] text-[#4A9E4A] px-6 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#4A9E4A] hover:text-white transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}