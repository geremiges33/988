import React from "react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #080e09;
    --bg2:          #0c1510;
    --surface:      #111a12;
    --surface2:     #162119;
    --g1:           #1a3a1c;
    --g2:           #2a5c2c;
    --g3:           #3d8a40;
    --g4:           #5cb860;
    --g5:           #85d488;
    --cream:        #e6dfc9;
    --cream-dim:    #9a9282;
    --cream-mute:   #5a554b;
    --border:       rgba(61,138,64,0.18);
    --border-hi:    rgba(92,184,96,0.45);
    --error:        #c0533a;
    --error-bg:     rgba(192,83,58,0.08);
  }

  html, body { height: 100%; background: var(--bg); }

  .auth-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Atmospheric background */
  .auth-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 15% 50%, rgba(42,92,44,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 85% 20%, rgba(26,58,28,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 80% 30% at 50% 100%, rgba(13,25,14,0.8) 0%, transparent 50%);
  }

  /* Grain texture */
  .auth-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 160px;
    mix-blend-mode: overlay;
  }

  /* ── Left branding panel ── */
  .auth-left {
    width: 52%;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 56px 64px;
    overflow: hidden;
  }

  /* Vertical green stripe accent */
  .auth-left::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent 0%, var(--border-hi) 30%, var(--border) 70%, transparent 100%);
  }

  /* Large decorative circle */
  .auth-deco-ring {
    position: absolute;
    bottom: -120px; left: -80px;
    width: 520px; height: 520px;
    border-radius: 50%;
    border: 1px solid rgba(61,138,64,0.06);
    pointer-events: none;
  }

  .auth-deco-ring2 {
    position: absolute;
    bottom: -180px; left: -140px;
    width: 660px; height: 660px;
    border-radius: 50%;
    border: 1px solid rgba(61,138,64,0.04);
    pointer-events: none;
  }

  /* Subtle green glow blob */
  .auth-glow {
    position: absolute;
    top: 30%; left: 10%;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(42,92,44,0.22) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  .auth-wordmark {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .auth-wordmark:hover {
    opacity: 0.8;
  }

  .auth-wordmark-icon {
    width: 36px; height: 36px;
    border: 1.5px solid var(--g3);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--g4);
    background: rgba(42,92,44,0.2);
  }

  .auth-wordmark-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream-dim);
  }

  .auth-hero {
    position: relative;
    z-index: 1;
    padding-bottom: 20px;
  }

  .auth-eyebrow {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--g4);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .auth-eyebrow::after {
    content: '';
    flex: 1;
    max-width: 48px;
    height: 1px;
    background: var(--g3);
    opacity: 0.5;
  }

  .auth-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(54px, 6vw, 80px);
    font-weight: 400;
    line-height: 1.0;
    color: var(--cream);
    letter-spacing: -0.02em;
    margin-bottom: 28px;
  }

  .auth-headline em {
    font-style: italic;
    background: linear-gradient(135deg, var(--g4) 0%, var(--g5) 50%, var(--g4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .auth-subtext {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--cream-mute);
    max-width: 340px;
  }

  .auth-stats {
    display: flex;
    gap: 40px;
    position: relative;
    z-index: 1;
  }

  .auth-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--cream);
    line-height: 1;
    margin-bottom: 4px;
  }

  .auth-stat-label {
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cream-mute);
  }

  /* ── Right auth panel ── */
  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    position: relative;
    z-index: 2;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Tab switcher */
  .auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
  }

  .auth-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--cream-mute);
    cursor: pointer;
    transition: all 0.25s ease;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .auth-tab.active {
    background: var(--g1);
    color: var(--g5);
    border: 1px solid rgba(61,138,64,0.3);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .auth-tab:hover:not(.active) {
    color: var(--cream-dim);
    background: rgba(255,255,255,0.03);
  }

  /* Card glass surface */
  .auth-glass {
    background: rgba(22, 33, 25, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px 36px;
    position: relative;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.02) inset,
      0 24px 60px rgba(0,0,0,0.5),
      0 0 40px rgba(42,92,44,0.08);
  }

  /* Top glow line */
  .auth-glass::before {
    content: '';
    position: absolute;
    top: -1px; left: 40px; right: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g3), var(--g4), var(--g3), transparent);
    opacity: 0.6;
  }

  .auth-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--cream);
    letter-spacing: -0.01em;
    margin-bottom: 6px;
  }

  .auth-card-sub {
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    color: var(--cream-mute);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-row {
    display: flex;
    gap: 12px;
  }

  .auth-row .auth-field {
    flex: 1;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .auth-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cream-mute);
    transition: color 0.2s;
  }

  .auth-field:focus-within .auth-label {
    color: var(--g4);
  }

  .auth-input-wrap {
    position: relative;
  }

  .auth-input {
    width: 100%;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(61,138,64,0.15);
    border-radius: 8px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--cream);
    outline: none;
    transition: all 0.22s ease;
    -webkit-appearance: none;
  }

  .auth-input::placeholder {
    color: rgba(154,146,130,0.3);
    font-style: italic;
  }

  .auth-input:focus {
    border-color: var(--g3);
    background: rgba(42,92,44,0.08);
    box-shadow: 0 0 0 3px rgba(61,138,64,0.1), 0 0 20px rgba(42,92,44,0.12);
  }

  .auth-input:hover:not(:focus) {
    border-color: rgba(61,138,64,0.3);
    background: rgba(255,255,255,0.035);
  }

  .auth-input.with-icon {
    padding-right: 42px;
  }

  .auth-input-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--cream-mute);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    transition: color 0.2s;
  }

  .auth-input-icon:hover { color: var(--g4); }
  .auth-input-icon svg { width: 15px; height: 15px; stroke-width: 1.8; }

  .auth-error {
    background: var(--error-bg);
    border: 1px solid rgba(192,83,58,0.25);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12.5px;
    color: #d9806a;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .auth-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 50%, var(--g1) 100%);
    background-size: 200% auto;
    border: 1px solid rgba(61,138,64,0.4);
    border-radius: 8px;
    color: var(--g5);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(26,58,28,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    margin-top: 4px;
  }

  .auth-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
  }

  .auth-btn:hover:not(:disabled) {
    background-position: right center;
    background: linear-gradient(135deg, var(--g2) 0%, var(--g3) 50%, var(--g2) 100%);
    border-color: rgba(61,138,64,0.6);
    box-shadow: 0 6px 28px rgba(42,92,44,0.5), 0 0 20px rgba(61,138,64,0.2);
    transform: translateY(-2px);
    color: #b8f5b8;
  }

  .auth-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .auth-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
  }

  .auth-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .auth-divider-txt {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cream-mute);
    opacity: 0.5;
  }

  .auth-footer {
    text-align: center;
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    color: var(--cream-mute);
  }

  .auth-footer a {
    color: var(--g4);
    text-decoration: none;
    font-style: normal;
    font-weight: 400;
    border-bottom: 1px solid rgba(92,184,96,0.3);
    padding-bottom: 1px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .auth-footer a:hover {
    color: var(--g5);
    border-color: var(--g4);
  }

  .auth-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(133,212,136,0.25);
    border-top-color: var(--g5);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-success-check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* Terms note */
  .auth-terms {
    font-size: 11px;
    font-weight: 300;
    color: var(--cream-mute);
    opacity: 0.6;
    text-align: center;
    line-height: 1.6;
  }

  .auth-terms a {
    color: var(--g3);
    text-decoration: underline;
    text-decoration-color: rgba(61,138,64,0.3);
  }

  /* Form slide animation */
  .auth-form-wrap {
    animation: formSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes formSlide {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @media (max-width: 720px) {
    .auth-left { display: none; }
    .auth-right { padding: 24px 20px; }
    .auth-glass { padding: 28px 22px; }
  }
`;

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Signup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const id = "auth-css-v2";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = css;
      document.head.appendChild(el);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    setError("");
    setSuccess(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPass) { setError("Бүх талбарыг бөглөнө үү"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Нэвтрэх амжилтгүй"); setLoading(false); return; }
      localStorage.setItem("data", data.data ?? "");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/"; }, 1200);
    } catch {
      setError("Сервертэй холбогдох боломжгүй");
    }
    setLoading(false);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !signupEmail || !signupPass) { setError("Бүх талбарыг бөглөнө үү"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email: signupEmail, password: signupPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Бүртгэл амжилтгүй"); setLoading(false); return; }
      localStorage.setItem("data", data.data ?? "");
      setSuccess(true);
      setTimeout(() => { window.location.href = "/"; }, 1200);
    } catch {
      setError("Сервертэй холбогдох боломжгүй");
    }
    setLoading(false);
  };

  return (
    <div className="auth-root">
      {/* ── Left branding ── */}
      <div className="auth-left">
        <div className="auth-glow" />
        <div className="auth-deco-ring" />
        <div className="auth-deco-ring2" />

        <Link to="/" className="auth-wordmark">
          <div className="auth-wordmark-icon">9</div>
          <div className="auth-wordmark-name">988 Thrift</div>
        </Link>

        <div className="auth-hero">
          <div className="auth-eyebrow">Pre-loved fashion</div>
          <h1 className="auth-headline">
            Find<br />your<br /><em>fit.</em>
          </h1>
          <p className="auth-subtext">
            Curated second-hand pieces for every style. Every item has a story — yours starts here.
          </p>
        </div>

        <div className="auth-stats">
          <div>
            <div className="auth-stat-val">4k+</div>
            <div className="auth-stat-label">Items listed</div>
          </div>
          <div>
            <div className="auth-stat-val">12k</div>
            <div className="auth-stat-label">Members</div>
          </div>
          <div>
            <div className="auth-stat-val">98%</div>
            <div className="auth-stat-label">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* ── Right auth ── */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>
              Sign in
            </button>
          </div>

          <div className="auth-glass">
            {mode === "login" ? (
              <div className="auth-form-wrap" key="login">
                <div className="auth-card-title">Welcome back</div>
                <div className="auth-card-sub">Good to see you — sign in to your wardrobe.</div>

                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="auth-field">
                    <label className="auth-label">Email address</label>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="you@email.com"
                      value={loginEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrap">
                      <input
                        type={showLoginPass ? "text" : "password"}
                        className="auth-input with-icon"
                        placeholder="············"
                        value={loginPass}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPass(e.target.value)}
                      />
                      <button type="button" className="auth-input-icon" onClick={() => setShowLoginPass(p => !p)}>
                        {showLoginPass ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && <div className="auth-error">⚠ {error}</div>}

                  <button className="auth-btn" type="submit" disabled={loading || success}>
                    {success ? <span className="auth-success-check">✓ Welcome back!</span>
                      : loading ? <span className="auth-spinner" />
                      : "Sign in"}
                  </button>

                  <div className="auth-divider">
                    <div className="auth-divider-line" />
                    <span className="auth-divider-txt">or</span>
                    <div className="auth-divider-line" />
                  </div>

                  <div className="auth-footer">
                    New here? <a onClick={() => switchMode("signup")}>Create an account</a>
                  </div>
                </form>
              </div>
            ) : (
              <div className="auth-form-wrap" key="signup">
                <div className="auth-card-sub" style={{marginBottom: "24px", marginTop: "4px"}}>Create your account and start finding pieces you'll love.</div>

                <form className="auth-form" onSubmit={handleSignup}>
                  <div className="auth-row">
                    <div className="auth-field">
                      <label className="auth-label">First name</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Alex"
                        value={firstName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Last name</label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Kim"
                        value={lastName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Email address</label>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="you@email.com"
                      value={signupEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupEmail(e.target.value)}
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrap">
                      <input
                        type={showSignupPass ? "text" : "password"}
                        className="auth-input with-icon"
                        placeholder="············"
                        value={signupPass}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupPass(e.target.value)}
                      />
                      <button type="button" className="auth-input-icon" onClick={() => setShowSignupPass(p => !p)}>
                        {showSignupPass ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && <div className="auth-error">⚠ {error}</div>}

                  <button className="auth-btn" type="submit" disabled={loading || success}>
                    {success ? <span className="auth-success-check">✓ Welcome to the shop!</span>
                      : loading ? <span className="auth-spinner" />
                      : "Create account"}
                  </button>

                  <div className="auth-terms">
                    By joining you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
                  </div>

                  <div className="auth-divider">
                    <div className="auth-divider-line" />
                    <span className="auth-divider-txt">or</span>
                    <div className="auth-divider-line" />
                  </div>

                  <div className="auth-footer">
                    Already a member? <a onClick={() => switchMode("login")}>Sign in</a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Also export as Login for backward compatibility
export { AuthPage as Login };