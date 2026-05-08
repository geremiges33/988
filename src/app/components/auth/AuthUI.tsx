import { Link } from "react-router";
import { AlertCircle } from "lucide-react";
import React from "react";


/* ── LEFT PANEL ───────────────────────── */

export function LeftPanel({
  img,
  headline,
  sub,
  quotes,
}: {
  img: string;
  headline: React.ReactNode;
  sub: string;
  quotes: { text: string; author: string }[];
}) {
  return (
    <div className="hidden lg:flex w-[480px] xl:w-[560px] flex-shrink-0 relative flex-col overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        <div>
          <Link to="/" className="text-white text-lg mb-10 block">
            988 Thrift
          </Link>

          <h2 className="text-white text-4xl font-bold mb-4">
            {headline}
          </h2>

          <p className="text-gray-300 text-sm max-w-xs">{sub}</p>
        </div>

        <div className="space-y-3">
          {quotes.map((q, i) => (
            <div key={i} className="text-white/80 text-sm">
              "{q.text}" — {q.author}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── DIVIDER ───────────────────────── */

export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 uppercase">
        {label || "or"}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

/* ── FIELD ───────────────────────── */

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

/* ── INPUT CLASS ───────────────────────── */

export const inputCls = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-sm ${
    hasError
      ? "border-red-500 bg-red-50"
      : "border-gray-300 focus:border-black"
  }`;

/* ── ERROR BANNER ───────────────────────── */

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm">
      <AlertCircle className="w-4 h-4" />
      {message}
    </div>
  );
}

/* ── SPINNER ───────────────────────── */

export function Spinner() {
  return (
    <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-black rounded-full" />
  );
}