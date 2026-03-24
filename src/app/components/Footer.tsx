import { Heart, Facebook, Instagram, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import logo from "/Documents and Settings/Nest/Downloads/Thrift Shop Website (0)/src/assets/logo.png";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-[#0D1A0D] text-white mt-20">
      {/* No Returns Banner */}
      <div className="bg-[#FF6B6B] py-3 text-center">
        <p className="text-white text-sm tracking-widest uppercase">
          ❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ &nbsp;·&nbsp; NO RETURNS &nbsp;·&nbsp; NO EXCHANGES
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* About / Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="988 Thrift Shop" className="w-14 h-14 rounded-full object-cover border-2 border-[#4A9E4A]" />
              <div>
                <h3 className="text-white text-lg" style={{ fontWeight: 700 }}>988 Thrift</h3>
                <p className="text-green-400 text-xs tracking-widest">♻️ Vintage Shop</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">{f.aboutText}</p>
            {/* Store Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4A9E4A] mt-0.5 flex-shrink-0" />
                <p className="text-white/70 text-sm">Натур, Шинэ Монгол сургуулийн хойно 36A байр</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#4A9E4A] flex-shrink-0" />
                <p className="text-white/70 text-sm">🟢 11:00 – 20:00 цаг</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4A9E4A] flex-shrink-0" />
                <p className="text-white/70 text-sm">85144414 &nbsp;/&nbsp; 86310103</p>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white text-xs tracking-[0.25em] uppercase mb-5 pb-2 border-b border-white/10">{f.shop}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/shop" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.allItems}</a></li>
              <li><a href="/shop/clothing" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.vintageClothing}</a></li>
              <li><a href="/shop/accessories" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.accessoriesF}</a></li>
              <li><a href="/shop?sale=true" className="text-[#FF6B6B] hover:text-[#FFE66D] transition-colors">Sale Items</a></li>
              <li><a href="/shop?sort=newest" className="text-white/60 hover:text-[#4A9E4A] transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-xs tracking-[0.25em] uppercase mb-5 pb-2 border-b border-white/10">{f.customerService}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/faq" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.faq}</a></li>
              <li><a href="/contact" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.contactUs}</a></li>
              <li><a href="/size-guide" className="text-white/60 hover:text-[#4A9E4A] transition-colors">{f.sizeGuide}</a></li>
              <li>
                <a href="/returns" className="text-[#FF6B6B] hover:text-white transition-colors flex items-center gap-1">
                  <span>❗️</span> {f.returns}
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-white text-xs tracking-[0.25em] uppercase mb-5 pb-2 border-b border-white/10">{f.stayConnected}</h3>
            <p className="text-white/60 text-sm mb-5">{f.subscribeText}</p>

            {/* Policy Notice */}
            <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl p-4 mb-5">
              <p className="text-[#FF6B6B] text-xs tracking-wide">
                ❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ<br />
                <span className="text-white/50 text-[11px]">No returns or exchanges accepted.</span>
              </p>
            </div>

            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#4A9E4A] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#4A9E4A] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="tel:85144414" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#4A9E4A] flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 text-white/40 text-sm">
            <span>{f.madeWith}</span>
            <Heart className="w-3.5 h-3.5 fill-[#4A9E4A] text-[#4A9E4A]" />
            <span>{f.forSustainable}</span>
          </p>
          <p className="text-white/30 text-xs text-center">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}