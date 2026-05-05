import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  .su-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .su-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 15% 50%, rgba(42,92,44,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 85% 20%, rgba(26,58,28,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 80% 30% at 50% 100%, rgba(13,25,14,0.8) 0%, transparent 50%);
  }

  .su-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 160px;
    mix-blend-mode: overlay;
  }

  /* ── Left branding panel ── */
  .su-left {
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

  .su-left::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent 0%, var(--border-hi) 30%, var(--border) 70%, transparent 100%);
  }

  .su-deco-ring {
    position: absolute;
    bottom: -120px; left: -80px;
    width: 520px; height: 520px;
    border-radius: 50%;
    border: 1px solid rgba(61,138,64,0.06);
    pointer-events: none;
  }

  .su-deco-ring2 {
    position: absolute;
    bottom: -180px; left: -140px;
    width: 660px; height: 660px;
    border-radius: 50%;
    border: 1px solid rgba(61,138,64,0.04);
    pointer-events: none;
  }

  .su-glow {
    position: absolute;
    top: 30%; left: 10%;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(42,92,44,0.22) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  .su-wordmark {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .su-wordmark:hover { opacity: 0.8; }

  .su-wordmark-icon {
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

  .su-wordmark-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream-dim);
  }

  .su-hero {
    position: relative;
    z-index: 1;
    padding-bottom: 20px;
  }

  .su-eyebrow {
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

  .su-eyebrow::after {
    content: '';
    flex: 1;
    max-width: 48px;
    height: 1px;
    background: var(--g3);
    opacity: 0.5;
  }

  .su-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(54px, 6vw, 80px);
    font-weight: 400;
    line-height: 1.0;
    color: var(--cream);
    letter-spacing: -0.02em;
    margin-bottom: 28px;
  }

  .su-headline em {
    font-style: italic;
    background: linear-gradient(135deg, var(--g4) 0%, var(--g5) 50%, var(--g4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .su-subtext {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--cream-mute);
    max-width: 340px;
  }

  .su-stats {
    display: flex;
    gap: 40px;
    position: relative;
    z-index: 1;
  }

  .su-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--cream);
    line-height: 1;
    margin-bottom: 4px;
  }

  .su-stat-label {
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cream-mute);
  }

  /* ── Right auth panel ── */
  .su-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    position: relative;
    z-index: 2;
  }

  .su-card {
    width: 100%;
    max-width: 420px;
    animation: suCardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes suCardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .su-glass {
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

  .su-glass::before {
    content: '';
    position: absolute;
    top: -1px; left: 40px; right: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g3), var(--g4), var(--g3), transparent);
    opacity: 0.6;
  }

  .su-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--cream);
    letter-spacing: -0.01em;
    margin-bottom: 6px;
  }

  .su-card-sub {
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    color: var(--cream-mute);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .su-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .su-row {
    display: flex;
    gap: 12px;
  }

  .su-row .su-field { flex: 1; }

  .su-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .su-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cream-mute);
    transition: color 0.2s;
  }

  .su-field:focus-within .su-label { color: var(--g4); }

  .su-input-wrap { position: relative; }

  .su-input {
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

  .su-input::placeholder {
    color: rgba(154,146,130,0.3);
    font-style: italic;
  }

  .su-input:focus {
    border-color: var(--g3);
    background: rgba(42,92,44,0.08);
    box-shadow: 0 0 0 3px rgba(61,138,64,0.1), 0 0 20px rgba(42,92,44,0.12);
  }

  .su-input:hover:not(:focus) {
    border-color: rgba(61,138,64,0.3);
    background: rgba(255,255,255,0.035);
  }

  .su-input.with-icon { padding-right: 42px; }

  .su-input-icon {
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--cream-mute);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 2px;
    transition: color 0.2s;
  }

  .su-input-icon:hover { color: var(--g4); }
  .su-input-icon svg { width: 15px; height: 15px; stroke-width: 1.8; }

  .su-error {
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

  .su-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 50%, var(--g1) 100%);
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

  .su-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
  }

  .su-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--g2) 0%, var(--g3) 50%, var(--g2) 100%);
    border-color: rgba(61,138,64,0.6);
    box-shadow: 0 6px 28px rgba(42,92,44,0.5), 0 0 20px rgba(61,138,64,0.2);
    transform: translateY(-2px);
    color: #b8f5b8;
  }

  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .su-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
  }

  .su-divider-line { flex: 1; height: 1px; background: var(--border); }

  .su-divider-txt {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cream-mute);
    opacity: 0.5;
  }

  .su-footer {
    text-align: center;
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    color: var(--cream-mute);
  }

  .su-footer a {
    color: var(--g4);
    text-decoration: none;
    font-style: normal;
    font-weight: 400;
    border-bottom: 1px solid rgba(92,184,96,0.3);
    padding-bottom: 1px;
    transition: all 0.2s;
  }

  .su-footer a:hover { color: var(--g5); border-color: var(--g4); }

  .su-terms {
    font-size: 11px;
    font-weight: 300;
    color: var(--cream-mute);
    opacity: 0.6;
    text-align: center;
    line-height: 1.6;
  }

  .su-terms a {
    color: var(--g3);
    text-decoration: underline;
    text-decoration-color: rgba(61,138,64,0.3);
  }

  .su-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(133,212,136,0.25);
    border-top-color: var(--g5);
    border-radius: 50%;
    animation: suSpin 0.7s linear infinite;
    vertical-align: middle;
  }

  @keyframes suSpin { to { transform: rotate(360deg); } }

  .su-success-check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 720px) {
    .su-left { display: none; }
    .su-right { padding: 24px 20px; }
    .su-glass { padding: 28px 22px; }
    .su-row { flex-direction: column; }
  }
`;

interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  message?: string;
  data?: string;
}

export function Signup() {
  const navigate = useNavigate();

  const [firstName,    setFirstName]    = useState<string>("");
  const [lastName,     setLastName]     = useState<string>("");
  const [email,        setEmail]        = useState<string>("");
  const [password,     setPassword]     = useState<string>("");
  const [showPass,     setShowPass]     = useState<boolean>(false);
  const [error,        setError]        = useState<string>("");
  const [loading,      setLoading]      = useState<boolean>(false);
  const [success,      setSuccess]      = useState<boolean>(false);

  useEffect(() => {
    const id = "su-css";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = css;
      document.head.appendChild(el);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }

    setLoading(true);

    try {
      const payload: SignupPayload = { first_name: firstName, last_name: lastName, email, password };

      const res = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Бүртгэл амжилтгүй");
        setLoading(false);
        return;
      }

      if (data.data) localStorage.setItem("data", data.data);

      setSuccess(true);
      setTimeout(() => { window.location.href = "/"; }, 1200);

    } catch {
      setError("Сервертэй холбогдох боломжгүй");
    }

    setLoading(false);
  };

  return (
    <div className="su-root">
      {/* ── Left branding ── */}
      <div className="su-left">
        <div className="su-glow" />
        <div className="su-deco-ring" />
        <div className="su-deco-ring2" />

        <Link to="/" className="su-wordmark">
          <div className="su-wordmark-icon">9</div>
          <div className="su-wordmark-name">988 Thrift</div>
        </Link>

        <div className="su-hero">
          <div className="su-eyebrow">New arrivals daily</div>
          <h1 className="su-headline">
            Start<br />your<br /><em>story.</em>
          </h1>
          <p className="su-subtext">
            Pre-loved, hand-picked, and priced right. Every piece has a past — yours starts here.
          </p>
        </div>

        <div className="su-stats">
          <div>
            <div className="su-stat-val">4k+</div>
            <div className="su-stat-label">Items listed</div>
          </div>
          <div>
            <div className="su-stat-val">12k</div>
            <div className="su-stat-label">Members</div>
          </div>
          <div>
            <div className="su-stat-val">Free</div>
            <div className="su-stat-label">To join</div>
          </div>
        </div>
      </div>

      {/* ── Right auth ── */}
      <div className="su-right">
        <div className="su-card">
          <div className="su-glass">
            <div className="su-card-title">Join the shop</div>
            <div className="su-card-sub">Create a free account and start browsing.</div>

            <form className="su-form" onSubmit={handleSignup}>

              <div className="su-row">
                <div className="su-field">
                  <label className="su-label">First name</label>
                  <input
                    type="text"
                    className="su-input"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="su-field">
                  <label className="su-label">Last name</label>
                  <input
                    type="text"
                    className="su-input"
                    placeholder="Kim"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="su-field">
                <label className="su-label">Email address</label>
                <input
                  type="email"
                  className="su-input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>

              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-input-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    className="su-input with-icon"
                    placeholder="············"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="su-input-icon"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
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

              {error && <div className="su-error">⚠ {error}</div>}

              <button className="su-btn" type="submit" disabled={loading || success}>
                {success
                  ? <span className="su-success-check">✓ Welcome to the shop!</span>
                  : loading
                  ? <span className="su-spinner" />
                  : "Create account"
                }
              </button>

              <div className="su-terms">
                By joining you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </div>

              <div className="su-divider">
                <div className="su-divider-line" />
                <span className="su-divider-txt">or</span>
                <div className="su-divider-line" />
              </div>

              <div className="su-footer">
                Already a member? <a onClick={() => navigate("/login")}>Sign in</a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}