import { Heart, Facebook, Instagram, Phone, MapPin, Clock, Settings } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import logo from "../../assets/logo.png";
import React from "react";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer style={{ background: "#0d1f11", color: "#fff" }} className="mt-20">
      {/* No Returns Banner */}
      <div style={{ background: "#c0392b", borderBottom: "1px solid rgba(255,255,255,0.08)" }} className="py-2.5 text-center">
        <p className="text-white text-xs tracking-[0.2em] uppercase font-medium">
          ❗ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ &nbsp;·&nbsp; NO RETURNS &nbsp;·&nbsp; NO EXCHANGES
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="988 Thrift Shop"
                className="w-12 h-12 rounded-full object-cover"
                style={{ border: "2px solid #2d6a3f" }}
              />
              <div>
                <h3 className="text-white text-base font-bold tracking-wide">988 Thrift</h3>
                <p className="text-xs tracking-widest" style={{ color: "#5aaa6e" }}>♻ Vintage Shop</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{f.aboutText}</p>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#3a854f" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Натур, Шинэ Монгол сургуулийн хойно 36A байр
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#3a854f" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>🟢 11:00 – 20:00</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#3a854f" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>85144414 &nbsp;/&nbsp; 86310103</p>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-5 pb-2 font-semibold"
              style={{ color: "#5aaa6e", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >{f.shop}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/shop" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.allItems}</a></li>
              <li><a href="/shop/clothing" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.vintageClothing}</a></li>
              <li><a href="/shop/accessories" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.accessoriesF}</a></li>
              <li>
                <a href="/shop?sale=true" className="transition-colors" style={{ color: "#f87171" }}>
                  Sale Items
                </a>
              </li>
              <li>
                <a href="/shop?sort=newest" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Customer + Social */}
          <div>
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-5 pb-2 font-semibold"
              style={{ color: "#5aaa6e", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >{f.customerService}</h3>
            <ul className="space-y-2.5 text-sm mb-8">
              <li><a href="/faq" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.faq}</a></li>
              <li><a href="/contact" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.contactUs}</a></li>
              <li><a href="/size-guide" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>{f.sizeGuide}</a></li>
              <li>
                <a href="/returns" className="transition-colors flex items-center gap-1" style={{ color: "#f87171" }}>
                  <span>❗</span> {f.returns}
                </a>
              </li>
            </ul>

            {/* Social */}
            <h3
              className="text-xs tracking-[0.25em] uppercase mb-4 font-semibold"
              style={{ color: "#5aaa6e" }}
            >{f.stayConnected}</h3>
            <div className="flex gap-2">
              {[
                { href: "#", icon: Facebook },
                { href: "#", icon: Instagram },
                { href: "tel:85144414", icon: Phone },
              ].map(({ href, icon: Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#2d6a3f";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {f.madeWith}
            <Heart className="w-3 h-3" style={{ fill: "#3a854f", color: "#3a854f" }} />
            {f.forSustainable}
          </p>

          <div className="flex items-center gap-5">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{f.copyright}</p>

            {/* Admin button */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#5aaa6e";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2d6a3f";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <Settings className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}