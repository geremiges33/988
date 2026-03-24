import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ArrowRight, Check, ShieldCheck, Users, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  LeftPanel, Divider, Field, inputCls, ErrorBanner, Spinner,
} from "./Login";

// Signup page component
const PANEL_IMG =
  "https://images.unsplash.com/photo-1701769454078-2ba2f3788bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHRocmlmdCUyMHN0b3JlJTIwY2xvdGhpbmclMjByYWNrJTIwYWVzdGhldGljJTIwd2FybXxlbnwxfHx8fDE3NzI1MDE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080";

const SOCIAL_BUTTONS = [
  {
    label: "Sign up with Google",
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
    label: "Sign up with Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.24.73 3.04.77.94-.15 1.84-.76 2.86-.82 1.22-.07 2.31.38 3.12 1.14-2.82 1.64-2.3 5.37.46 6.63-.57 1.44-1.3 2.87-2.48 4.14zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    ),
  },
];

/* Password strength */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "#E5E7EB" },
    { label: "Weak", color: "#FF6B6B" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#4ECDC4" },
    { label: "Strong", color: "#22C55E" },
  ];
  return { score, ...map[score] };
}

const PERKS = [
  "Early access to new arrivals",
  "Exclusive member-only discounts",
  "Personalised recommendations",
  "Track all your orders in one place",
];

const ADMIN_ACCESS_CODE = "THRIFT2024";

export function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const a = t.auth;
  const from = (location.state as { from?: string })?.from || "/";

  const [role, setRole]           = useState<"customer" | "admin">("customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (user) navigate(user.isAdmin ? "/admin" : from, { replace: true }); }, [user]);

  /* reset fields when switching roles */
  useEffect(() => {
    setEmail(""); setPassword(""); setConfirm(""); setAccessCode(""); setError(""); setFieldErrors({});
  }, [role]);

  const strength = getStrength(password);
  const isAdmin = role === "admin";

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Required";
    if (!lastName.trim()) errs.lastName = "Required";
    if (!email.includes("@")) errs.email = "Enter a valid email";
    if (password.length < 8) errs.password = "At least 8 characters required";
    if (password !== confirm) errs.confirm = "Passwords don't match";
    if (!agreed) errs.agreed = "You must agree to the terms";
    if (isAdmin && accessCode.toUpperCase() !== ADMIN_ACCESS_CODE)
      errs.accessCode = "Invalid admin access code";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await signup(firstName.trim(), lastName.trim(), email.trim(), password, isAdmin);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate(isAdmin ? "/admin" : from, { replace: true }), 700);
    } else {
      setError(result.error || "Sign up failed.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <LeftPanel
        img={PANEL_IMG}
        headline={<>Join the<br /><span style={{ color: isAdmin ? "#4ECDC4" : "#4ECDC4", fontStyle: "italic", fontWeight: 300 }}>{isAdmin ? "Team." : "Community."}</span></>}
        sub={isAdmin ? "Create an admin account to manage the 988 Thrift platform." : "Create your free account and discover thousands of unique pre-loved pieces."}
        quotes={[
          { text: "Signed up in 30 seconds, found something amazing within minutes!", author: "Priya M." },
          { text: "Love being notified about new vintage drops first.", author: "Jake R." },
        ]}
      />

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
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
            {isAdmin ? a.createAdminAccount : a.createAccount}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {a.alreadyHave}{" "}
            <Link to="/login" state={{ from }} className="text-[#FF6B6B] hover:underline">
              {a.signInInstead}
            </Link>
          </p>

          {/* Perks / Admin info */}
          {isAdmin ? (
            <div className="rounded-2xl p-4 mb-6 border" style={{ background: "linear-gradient(135deg,#0A0A0A04,#4ECDC410)", borderColor: "#4ECDC440" }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#4ECDC4]" />
                <span className="text-xs tracking-widest uppercase text-[#0D5E5A]" style={{ fontWeight: 700 }}>{a.adminPrivilegesTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[a.priv1, a.priv2, a.priv3, a.priv4].map(p => (
                  <div key={p} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "#CCFBF1" }}>
                      <Check className="w-2.5 h-2.5 text-[#0D9488]" />
                    </div>
                    <p className="text-gray-500 text-xs leading-snug">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[a.perk1, a.perk2, a.perk3, a.perk4].map(p => (
                  <div key={p} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "#DCFCE7" }}>
                      <Check className="w-2.5 h-2.5 text-[#16A34A]" />
                    </div>
                    <p className="text-gray-500 text-xs leading-snug">{p}</p>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex gap-3 mb-5">
                {[
                  { label: a.signUpGoogle, icon: SOCIAL_BUTTONS[0].icon },
                  { label: a.signUpApple, icon: SOCIAL_BUTTONS[1].icon },
                ].map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    {btn.icon}
                    <span className="hidden sm:inline text-xs">{btn.label.replace("Sign up with ", "")}</span>
                  </button>
                ))}
              </div>
              <Divider label={a.orDivider} />
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label={a.firstName} error={fieldErrors.firstName || ""}>
                <input
                  type="text"
                  placeholder="Alex"
                  autoComplete="given-name"
                  className={inputCls(!!fieldErrors.firstName)}
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); setFieldErrors(p => ({ ...p, firstName: "" })); }}
                />
              </Field>
              <Field label={a.lastName} error={fieldErrors.lastName || ""}>
                <input
                  type="text"
                  placeholder="Smith"
                  autoComplete="family-name"
                  className={inputCls(!!fieldErrors.lastName)}
                  value={lastName}
                  onChange={e => { setLastName(e.target.value); setFieldErrors(p => ({ ...p, lastName: "" })); }}
                />
              </Field>
            </div>

            <Field label={a.email} error={fieldErrors.email || ""}>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls(!!fieldErrors.email)}
                value={email}
                onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: "" })); }}
              />
            </Field>

            <Field label={a.password} error={fieldErrors.password || ""}>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={inputCls(!!fieldErrors.password) + " pr-12"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: "" })); }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength.score ? strength.color : "#E5E7EB" }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px]" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </Field>

            <Field label={a.confirmPassword} error={fieldErrors.confirm || ""}>
              <div className="relative">
                <input
                  type={showConf ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={inputCls(!!fieldErrors.confirm) + " pr-12"}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setFieldErrors(p => ({ ...p, confirm: "" })); }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConf(v => !v)}
                >
                  {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirm.length > 0 && password === confirm && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  </div>
                )}
              </div>
            </Field>

            {/* Admin access code */}
            {isAdmin && (
              <Field label={a.adminAccessCode} error={fieldErrors.accessCode || ""}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter access code"
                    className={inputCls(!!fieldErrors.accessCode) + " pr-12 font-mono tracking-widest uppercase"}
                    value={accessCode}
                    onChange={e => { setAccessCode(e.target.value); setFieldErrors(p => ({ ...p, accessCode: "" })); }}
                  />
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {a.adminCodeHint}: <span className="font-mono text-[#4ECDC4] cursor-pointer" onClick={() => setAccessCode("THRIFT2024")}>THRIFT2024</span>
                </p>
              </Field>
            )}

            {/* Terms */}
            <label
              className={`flex items-start gap-3 cursor-pointer ${fieldErrors.agreed ? "text-[#FF6B6B]" : ""}`}
              onClick={() => { setAgreed(v => !v); setFieldErrors(p => ({ ...p, agreed: "" })); }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150"
                style={agreed ? { background: "#FF6B6B", border: "2px solid #FF6B6B" } : { border: `2px solid ${fieldErrors.agreed ? "#FF6B6B" : "#E5E7EB"}` }}
              >
                {agreed && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {a.agreeTerms}{" "}
                <span className="underline text-gray-700 hover:text-black">{a.termsOfService}</span> {a.and}{" "}
                <span className="underline text-gray-700 hover:text-black">{a.privacyPolicy}</span>
              </p>
            </label>
            {fieldErrors.agreed && <p className="text-[#FF6B6B] text-xs -mt-2">{fieldErrors.agreed}</p>}

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-60"
              style={success ? { background: "#22C55E", color: "#fff" } : { background: "#0A0A0A", color: "#fff" }}
            >
              {success ? (
                <><Check className="w-4 h-4" />{isAdmin ? a.adminAccountCreated : a.accountCreated}</>
              ) : loading ? (
                <Spinner />
              ) : (
                <>{isAdmin ? <><ShieldCheck className="w-4 h-4" />{a.createAdminAccountBtn}</> : <>{a.createAccountBtn} <ArrowRight className="w-4 h-4" /></>}</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
            {a.byCreating}{" "}
            <span className="underline cursor-pointer hover:text-gray-600">{a.termsOfService}</span> {a.and}{" "}
            <span className="underline cursor-pointer hover:text-gray-600">{a.privacyPolicy}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}