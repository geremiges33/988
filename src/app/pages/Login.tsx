import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Check, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const PANEL_IMG =
  "https://images.unsplash.com/photo-1768845431912-a5b1861767af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMGRhcmslMjBtb29keSUyMGFlc3RoZXRpYyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjUwMTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080";

const SOCIAL_BUTTONS = [
  {
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    label: "Continue with Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.24.73 3.04.77.94-.15 1.84-.76 2.86-.82 1.22-.07 2.31.38 3.12 1.14-2.82 1.64-2.3 5.37.46 6.63-.57 1.44-1.3 2.87-2.48 4.14zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    ),
  },
];

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const a = t.auth;
  const from = (location.state as { from?: string })?.from || "/";

  const [role, setRole]           = useState<"customer" | "admin">("customer");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  /* redirect if already logged in */
  useEffect(() => { if (user) navigate(user.isAdmin ? "/admin" : from, { replace: true }); }, [user]);

  /* reset fields when switching roles */
  useEffect(() => {
    setEmail(""); setPassword(""); setError("");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      // navigate based on actual role returned
      setTimeout(() => {
        // user state hasn't updated yet in this closure, so check email
        const isAdminLogin = email.toLowerCase() === "admin@thrift.com";
        navigate(isAdminLogin ? "/admin" : from, { replace: true });
      }, 600);
    } else {
      setError(result.error || "Login failed.");
    }
  };

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <LeftPanel
        img={PANEL_IMG}
        headline={<>Welcome<br /><span style={{ color: isAdmin ? "#4ECDC4" : "#FF6B6B", fontStyle: "italic", fontWeight: 300 }}>{isAdmin ? "Admin." : "Back."}</span></>}
        sub={isAdmin ? "Sign in to your admin dashboard to manage products, orders, and more." : "Sign in to continue your journey through curated vintage finds."}
        quotes={[
          { text: "Found my dream jacket here!", author: "Sarah K." },
          { text: "Best thrift shopping experience online.", author: "Marcus T." },
        ]}
      />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FF6B6B,#4ECDC4)" }} />
            <span className="text-lg tracking-[0.15em] uppercase text-gray-900">988 Thrift</span>
          </Link>

          {/* Role toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={role === "customer"
                ? { background: "#fff", color: "#0A0A0A", fontWeight: 600, boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }
                : { color: "#9CA3AF" }}
            >
              <Users className="w-4 h-4" />
              {a.customer}
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={role === "admin"
                ? { background: "#0A0A0A", color: "#fff", fontWeight: 600, boxShadow: "0 1px 8px rgba(0,0,0,0.15)" }
                : { color: "#9CA3AF" }}
            >
              <ShieldCheck className="w-4 h-4" />
              {a.admin}
            </button>
          </div>

          <h1 className="text-gray-900 mb-2" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {isAdmin ? a.adminSignIn : a.signIn}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {isAdmin ? (
              <>{a.notAdmin}{" "}
                <button type="button" onClick={() => setRole("customer")} className="text-[#FF6B6B] hover:underline">
                  {a.signInAsCustomer}
                </button>
              </>
            ) : (
              <>{a.newHere}{" "}
                <Link to="/signup" state={{ from }} className="text-[#FF6B6B] hover:underline">
                  {a.createFree}
                </Link>
              </>
            )}
          </p>

          {/* Social buttons — customer only */}
          {!isAdmin && (
            <>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { label: a.socialGoogle, icon: SOCIAL_BUTTONS[0].icon },
                  { label: a.socialApple, icon: SOCIAL_BUTTONS[1].icon },
                ].map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ))}
              </div>
              <Divider label={a.orDivider} />
            </>
          )}

          {/* Hint box */}
          {isAdmin ? (
            <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-6 border"
              style={{ background: "linear-gradient(135deg,#0A0A0A08,#4ECDC408)", borderColor: "#4ECDC450" }}>
              <ShieldCheck className="w-4 h-4 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed" style={{ color: "#0D5E5A" }}>
                <span style={{ fontWeight: 600 }}>{a.adminHint}</span> use{" "}
                <button className="underline font-mono" onClick={() => { setEmail("admin@thrift.com"); setPassword("admin1234"); }}>
                  admin@thrift.com
                </button>{" "}
                / <span className="font-mono">admin1234</span>
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-[#FFF9F0] border border-[#FFE4B0] rounded-xl px-4 py-3 mb-6">
              <Sparkles className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#92400E] leading-relaxed">
                <span style={{ fontWeight: 600 }}>{a.demoHint}</span> use{" "}
                <button className="underline font-mono" onClick={() => { setEmail("demo@thrift.com"); setPassword("demo1234"); }}>
                  demo@thrift.com
                </button>{" "}
                / <span className="font-mono">demo1234</span>
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={a.email} error="">
              <input
                type="email"
                autoComplete="email"
                placeholder={isAdmin ? "admin@thrift.com" : "you@example.com"}
                className={inputCls(false)}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Field>

            <Field label={a.password} error="">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={inputCls(false) + " pr-12"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-gray-400 hover:text-[#FF6B6B] transition-colors">
                {a.forgotPassword}
              </button>
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-60"
              style={success
                ? { background: "#22C55E", color: "#fff" }
                : isAdmin
                ? { background: "#0A0A0A", color: "#fff" }
                : { background: "#0A0A0A", color: "#fff" }}
            >
              {success ? (
                <><Check className="w-4 h-4" />{isAdmin ? a.redirecting : a.signingIn}</>
              ) : loading ? (
                <Spinner />
              ) : (
                <>{isAdmin ? <><ShieldCheck className="w-4 h-4" />{a.accessDashboard}</> : <>{a.signInBtn} <ArrowRight className="w-4 h-4" /></>}</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            {a.bySigningIn}{" "}
            <span className="underline cursor-pointer hover:text-gray-600">{a.termsOfService}</span> {a.and}{" "}
            <span className="underline cursor-pointer hover:text-gray-600">{a.privacyPolicy}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared helpers used by both pages ──────────────────────────── */

export function LeftPanel({
  img, headline, sub, quotes,
}: {
  img: string;
  headline: React.ReactNode;
  sub: string;
  quotes: { text: string; author: string }[];
}) {
  return (
    <div className="hidden lg:flex w-[480px] xl:w-[560px] flex-shrink-0 relative flex-col overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.8) 100%)" }} />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "#FF6B6B" }} />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "#4ECDC4" }} />

      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        {/* Top */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2 mb-16">
            <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FF6B6B,#4ECDC4)" }} />
            <span className="text-white text-lg tracking-[0.15em] uppercase">988 Thrift</span>
          </Link>
          <h2
            className="text-white mb-5"
            style={{ fontSize: "clamp(2.8rem, 4vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}
          >
            {headline}
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-xs">{sub}</p>
        </div>

        {/* Quotes */}
        <div className="space-y-4">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-2xl px-5 py-4"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            >
              <p className="text-white/80 text-sm leading-relaxed mb-2">"{q.text}"</p>
              <p className="text-white/40 text-xs tracking-widest uppercase">— {q.author}</p>
            </div>
          ))}

          {/* Stats row */}
          <div className="flex gap-6 pt-2">
            {[["12K+", "Members"], ["4.9★", "Rated"], ["100%", "Sustainable"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-white text-lg" style={{ fontWeight: 700 }}>{n}</p>
                <p className="text-white/30 text-[10px] tracking-widest uppercase">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs text-gray-400 tracking-widest uppercase">{label ?? "or"}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2" style={{ fontWeight: 600 }}>{label}</label>
      {children}
      {error && <p className="text-[#FF6B6B] text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export const inputCls = (hasError: boolean) =>
  `w-full border rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${
    hasError
      ? "border-[#FF6B6B] bg-[#FFF5F5] focus:ring-2 focus:ring-[#FF6B6B]/20"
      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20"
  }`;

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-[#FFF5F5] border border-[#FECACA] rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
      <p className="text-[#DC2626] text-xs leading-relaxed">{message}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}