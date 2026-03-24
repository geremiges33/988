import { Ruler, AlertCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";
import logo from "/Documents and Settings/Nest/Downloads/Thrift Shop Website (0)/src/assets/logo.png";

export function SizeGuide() {
  const { t } = useLanguage();

  const womenRows = [
    { size: "XS", bust: "30–32", waist: "23–25", hips: "33–35" },
    { size: "S",  bust: "32–34", waist: "25–27", hips: "35–37" },
    { size: "M",  bust: "34–36", waist: "27–29", hips: "37–39" },
    { size: "L",  bust: "36–38", waist: "29–31", hips: "39–41" },
    { size: "XL", bust: "38–40", waist: "31–33", hips: "41–43" },
    { size: "XXL",bust: "40–42", waist: "33–35", hips: "43–45" },
  ];

  const menRows = [
    { size: "XS", chest: "32–34", waist: "26–28", hips: "33–35" },
    { size: "S",  chest: "34–36", waist: "28–30", hips: "35–37" },
    { size: "M",  chest: "36–38", waist: "30–32", hips: "37–39" },
    { size: "L",  chest: "38–40", waist: "32–34", hips: "39–41" },
    { size: "XL", chest: "40–42", waist: "34–36", hips: "41–43" },
    { size: "XXL",chest: "42–44", waist: "36–38", hips: "43–45" },
  ];

  const measureInstructions = [
    { label: t.sizeGuide.bustChest, desc: t.sizeGuide.bustChestDesc, color: "#4A9E4A" },
    { label: t.sizeGuide.waist, desc: t.sizeGuide.waistDesc, color: "#4ECDC4" },
    { label: t.sizeGuide.hips, desc: t.sizeGuide.hipsDesc, color: "#FFE66D" },
    { label: t.sizeGuide.inseam, desc: t.sizeGuide.inseamDesc, color: "#FF6B6B" },
  ];

  const tips = [t.sizeGuide.tip1, t.sizeGuide.tip2, t.sizeGuide.tip3];
  const tipColors = ["#4A9E4A", "#4ECDC4", "#FFE66D"];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ── Hero ── */}
      <div className="bg-[#0D1A0D] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: "#4ECDC4" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-20 text-center">
          <img src={logo} alt="988 Thrift Shop" className="w-16 h-16 rounded-full object-cover mx-auto mb-6 border-2 border-[#4A9E4A]" />
          <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-4">Sizing</p>
          <h1
            className="text-white mb-5"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {t.sizeGuide.title}
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.sizeGuide.subtitle}
          </p>
        </div>
      </div>

      {/* ── Vintage sizing note ── */}
      <div className="bg-[#FFE66D] py-3">
        <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-center gap-3 text-black text-sm text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span style={{ fontWeight: 600 }}>Vintage items may run smaller — always check the product description for exact measurements.</span>
        </div>
      </div>

      <div className="max-w-[1060px] mx-auto px-8 py-16 space-y-8">

        {/* ── Women's Table ── */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div className="px-8 pt-8 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4A3A8]/20 flex items-center justify-center">
              <span className="text-lg">👗</span>
            </div>
            <h2 className="text-gray-900" style={{ fontSize: "1.3rem", fontWeight: 700 }}>{t.sizeGuide.womens}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F7F5F2" }}>
                  <th className="text-left py-3 px-8 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.size}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.bust}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.waist}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400 pr-8">{t.sizeGuide.hips}</th>
                </tr>
              </thead>
              <tbody>
                {womenRows.map((row, i) => (
                  <tr
                    key={row.size}
                    className="border-t border-gray-50 hover:bg-[#F7F5F2]/60 transition-colors group"
                  >
                    <td className="py-4 px-8">
                      <span
                        className="inline-flex items-center justify-center w-10 h-7 rounded-lg text-xs tracking-widest uppercase"
                        style={{
                          background: i % 2 === 0 ? "#4A9E4A15" : "#4ECDC415",
                          color: i % 2 === 0 ? "#4A9E4A" : "#4ECDC4",
                          fontWeight: 700,
                        }}
                      >
                        {row.size}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{row.bust}"</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{row.waist}"</td>
                    <td className="py-4 px-4 text-gray-600 text-sm pr-8">{row.hips}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 pb-6" />
        </div>

        {/* ── Men's Table ── */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div className="px-8 pt-8 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4ECDC4]/15 flex items-center justify-center">
              <span className="text-lg">👔</span>
            </div>
            <h2 className="text-gray-900" style={{ fontSize: "1.3rem", fontWeight: 700 }}>{t.sizeGuide.mens}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F7F5F2" }}>
                  <th className="text-left py-3 px-8 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.size}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.chest}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400">{t.sizeGuide.waist}</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-gray-400 pr-8">{t.sizeGuide.hips}</th>
                </tr>
              </thead>
              <tbody>
                {menRows.map((row, i) => (
                  <tr
                    key={row.size}
                    className="border-t border-gray-50 hover:bg-[#F7F5F2]/60 transition-colors"
                  >
                    <td className="py-4 px-8">
                      <span
                        className="inline-flex items-center justify-center w-10 h-7 rounded-lg text-xs tracking-widest uppercase"
                        style={{
                          background: i % 2 === 0 ? "#4ECDC415" : "#4A9E4A15",
                          color: i % 2 === 0 ? "#4ECDC4" : "#4A9E4A",
                          fontWeight: 700,
                        }}
                      >
                        {row.size}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{row.chest}"</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{row.waist}"</td>
                    <td className="py-4 px-4 text-gray-600 text-sm pr-8">{row.hips}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 pb-6" />
        </div>

        {/* ── How to Measure ── */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 rounded-xl bg-[#4A9E4A]/15 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#4A9E4A]" />
            </div>
            <h2 className="text-gray-900" style={{ fontSize: "1.3rem", fontWeight: 700 }}>{t.sizeGuide.howToMeasure}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {measureInstructions.map(({ label, desc, color }) => (
              <div
                key={label}
                className="rounded-2xl p-5"
                style={{ background: color + "10", border: `1px solid ${color}20` }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ background: color }}
                />
                <h3 className="text-gray-900 mb-2 text-sm" style={{ fontWeight: 700 }}>{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tips ── */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: "#0D1A0D" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "#4A9E4A" }} />
          <div className="relative z-10 p-8">
            <p className="text-[#4A9E4A] text-xs tracking-[0.3em] uppercase mb-3">Pro Tips</p>
            <h3 className="text-white mb-6" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{t.sizeGuide.tips}</h3>
            <div className="space-y-4">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span
                    className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ background: tipColors[i] + "20", color: tipColors[i] === "#FFE66D" ? "#92700A" : tipColors[i], fontWeight: 700 }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-white/60 text-sm leading-relaxed pt-0.5">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/40 text-sm">Still unsure about your size?</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#4A9E4A] text-white px-6 py-2.5 rounded-full text-sm tracking-widest uppercase hover:bg-[#72C172] transition-colors"
              >
                Ask Us <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
