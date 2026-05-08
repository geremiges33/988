import React from "react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
// ADD THIS IMPORT
import { useAuth } from "../context/AuthContext";

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
    --admin-accent: #c8a96e;
    --admin-dim:    #8a7048;
    --admin-bg:     rgba(200,169,110,0.06);
    --admin-border: rgba(200,169,110,0.22);
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

  .auth-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 15% 50%, rgba(42,92,44,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 85% 20%, rgba(26,58,28,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 80% 30% at 50% 100%, rgba(13,25,14,0.8) 0%, transparent 50%);
  }

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

  .auth-left::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent 0%, var(--border-hi) 30%, var(--border) 70%, transparent 100%);
  }

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

  .auth-wordmark:hover { opacity: 0.8; }

  .auth-wordmark-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

  .auth-wordmark-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream-dim);
  }

  .auth-hero { position: relative; z-index: 1; padding-bottom: 20px; }

  .auth-eyebrow {
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--g4); margin-bottom: 28px;
    display: flex; align-items: center; gap: 12px;
  }

  .auth-eyebrow::after {
    content: ''; flex: 1; max-width: 48px; height: 1px;
    background: var(--g3); opacity: 0.5;
  }

  .auth-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(54px, 6vw, 80px);
    font-weight: 400; line-height: 1.0;
    color: var(--cream); letter-spacing: -0.02em;
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
    font-size: 14px; font-weight: 300; line-height: 1.8;
    color: var(--cream-mute); max-width: 340px;
  }

  .auth-stats { display: flex; gap: 40px; position: relative; z-index: 1; }

  .auth-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700;
    color: var(--cream); line-height: 1; margin-bottom: 4px;
  }

  .auth-stat-label {
    font-size: 11px; font-weight: 300;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--cream-mute);
  }

  /* ── Right auth panel ── */
  .auth-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 32px;
    position: relative; z-index: 2;
  }

  .auth-card {
    width: 100%; max-width: 420px;
    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Glass card ── */
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
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .auth-glass.admin-mode {
    border-color: var(--admin-border);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.02) inset,
      0 24px 60px rgba(0,0,0,0.5),
      0 0 40px rgba(200,169,110,0.1);
  }

  .auth-glass::before {
    content: '';
    position: absolute;
    top: -1px; left: 40px; right: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--g3), var(--g4), var(--g3), transparent);
    opacity: 0.6;
    transition: opacity 0.4s ease, background 0.4s ease;
  }

  .auth-glass.admin-mode::before {
    background: linear-gradient(90deg, transparent, var(--admin-dim), var(--admin-accent), var(--admin-dim), transparent);
    opacity: 0.8;
  }

  /* ── Card header ── */
  .auth-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 12px;
  }

  .auth-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 400;
    color: var(--cream); letter-spacing: -0.01em;
  }

  /* ── Admin toggle button ── */
  .admin-toggle-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: none;
    border: 1px solid var(--cream-mute);
    border-radius: 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream-mute);
    cursor: pointer;
    transition: all 0.25s ease;
    margin-top: 4px;
  }

  .admin-toggle-btn:hover {
    border-color: var(--admin-accent);
    color: var(--admin-accent);
    background: var(--admin-bg);
  }

  .admin-toggle-btn.active {
    border-color: var(--admin-accent);
    color: var(--admin-accent);
    background: var(--admin-bg);
    box-shadow: 0 0 12px rgba(200,169,110,0.15);
  }

  .admin-toggle-btn svg {
    width: 12px; height: 12px;
    stroke: currentColor; stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }

  /* ── Admin mode badge ── */
  .admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.3);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--admin-accent);
    margin-bottom: 20px;
  }

  .admin-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--admin-accent);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .auth-card-sub {
    font-size: 13px; font-weight: 300; font-style: italic;
    color: var(--cream-mute); margin-bottom: 28px; line-height: 1.6;
  }

  .auth-form { display: flex; flex-direction: column; gap: 16px; }

  .auth-field { display: flex; flex-direction: column; gap: 6px; }

  .auth-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--cream-mute); transition: color 0.2s;
  }

  .auth-field:focus-within .auth-label { color: var(--g4); }
  .admin-mode .auth-field:focus-within .auth-label { color: var(--admin-accent); }

  .auth-input-wrap { position: relative; }

  .auth-input {
    width: 100%;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(61,138,64,0.15);
    border-radius: 8px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 300;
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

  .auth-input.with-icon { padding-right: 42px; }

  /* Admin inputs */
  .admin-mode .auth-input:focus {
    border-color: var(--admin-dim);
    background: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.08), 0 0 20px rgba(200,169,110,0.08);
  }

  .admin-mode .auth-input:hover:not(:focus) {
    border-color: rgba(200,169,110,0.2);
  }

  .auth-input-icon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--cream-mute);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    padding: 2px; transition: color 0.2s;
  }

  .auth-input-icon:hover { color: var(--g4); }
  .admin-mode .auth-input-icon:hover { color: var(--admin-accent); }
  .auth-input-icon svg { width: 15px; height: 15px; stroke-width: 1.8; }

  .auth-error {
    background: var(--error-bg);
    border: 1px solid rgba(192,83,58,0.25);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12.5px;
    color: #d9806a; font-style: italic;
    display: flex; align-items: center; gap: 8px;
  }

  /* ── Primary buttons ── */
  .auth-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 50%, var(--g1) 100%);
    background-size: 200% auto;
    border: 1px solid rgba(61,138,64,0.4);
    border-radius: 8px;
    color: var(--g5);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(26,58,28,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    margin-top: 4px;
  }

  .auth-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
  }

  .auth-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--g2) 0%, var(--g3) 50%, var(--g2) 100%);
    border-color: rgba(61,138,64,0.6);
    box-shadow: 0 6px 28px rgba(42,92,44,0.5), 0 0 20px rgba(61,138,64,0.2);
    transform: translateY(-2px);
    color: #b8f5b8;
  }

  .auth-btn:active:not(:disabled) { transform: translateY(0); }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Admin submit button */
  .auth-btn.admin-btn {
    background: linear-gradient(135deg, rgba(100,75,30,0.6) 0%, rgba(140,105,45,0.5) 50%, rgba(100,75,30,0.6) 100%);
    border-color: rgba(200,169,110,0.35);
    color: var(--admin-accent);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .auth-btn.admin-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(140,105,45,0.6) 0%, rgba(180,140,60,0.55) 50%, rgba(140,105,45,0.6) 100%);
    border-color: rgba(200,169,110,0.6);
    box-shadow: 0 6px 28px rgba(0,0,0,0.4), 0 0 20px rgba(200,169,110,0.15);
    color: #f0d898;
    transform: translateY(-2px);
  }

  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }

  .auth-divider-line { flex: 1; height: 1px; background: var(--border); }

  .auth-divider-txt {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cream-mute); opacity: 0.5;
  }

  .auth-footer {
    text-align: center; font-size: 13px;
    font-weight: 300; font-style: italic; color: var(--cream-mute);
  }

  .auth-footer a {
    color: var(--g4); text-decoration: none;
    font-style: normal; font-weight: 400;
    border-bottom: 1px solid rgba(92,184,96,0.3);
    padding-bottom: 1px; transition: all 0.2s; cursor: pointer;
  }

  .auth-footer a:hover { color: var(--g5); border-color: var(--g4); }

  .auth-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(133,212,136,0.25);
    border-top-color: var(--g5);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }

  .auth-spinner.admin-spinner {
    border-color: rgba(200,169,110,0.2);
    border-top-color: var(--admin-accent);
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-success-check {
    display: inline-flex; align-items: center; gap: 8px;
  }

  /* Form slide animation */
  .auth-form-wrap {
    animation: formSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes formSlide {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Admin panel slide-down */
  .admin-panel {
    overflow: hidden;
    animation: adminSlideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes adminSlideDown {
    from { opacity: 0; transform: translateY(-10px); max-height: 0; }
    to   { opacity: 1; transform: translateY(0); max-height: 600px; }
  }

  /* Separator between user and admin sections */
  .auth-mode-sep {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0 0;
  }

  .auth-mode-sep-line { flex: 1; height: 1px; background: rgba(200,169,110,0.15); }

  .auth-mode-sep-txt {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(200,169,110,0.4);
  }

  @media (max-width: 720px) {
    .auth-left { display: none; }
    .auth-right { padding: 24px 20px; }
    .auth-glass { padding: 28px 22px; }
  }
`;

export function AuthPage() {
  const [isAdminMode, setIsAdminMode] =
    useState(false);

  /* =========================
     USER LOGIN
  ========================= */

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPass, setLoginPass] =
    useState("");

  const [showLoginPass, setShowLoginPass] =
    useState(false);

  /* =========================
     ADMIN LOGIN
  ========================= */

  const [adminEmail, setAdminEmail] =
    useState("");

  const [adminPass, setAdminPass] =
    useState("");

  const [showAdminPass, setShowAdminPass] =
    useState(false);

  /* =========================
     UI STATES
  ========================= */

  const [error, setError] =
    useState("");

  const [adminError, setAdminError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [adminLoading, setAdminLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [adminSuccess, setAdminSuccess] =
    useState(false);

  /* =========================
     AUTH
  ========================= */

  const { updateUser } =
    useAuth();

  /* =========================
     CSS
  ========================= */

  useEffect(() => {
    const id = "auth-css-v3";

    if (!document.getElementById(id)) {
      const el =
        document.createElement("style");

      el.id = id;

      el.textContent = css;

      document.head.appendChild(el);
    }

    return () => {
      document
        .getElementById(id)
        ?.remove();
    };
  }, []);

  /* =========================
     TOGGLE ADMIN MODE
  ========================= */

  const toggleAdminMode = () => {
    setIsAdminMode((p) => !p);

    setAdminError("");

    setAdminSuccess(false);
  };

  /* =========================
     USER LOGIN
  ========================= */

  const handleLogin = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      !loginEmail.trim() ||
      !loginPass.trim()
    ) {
      setError(
        "Бүх талбарыг бөглөнө үү"
      );

      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: loginEmail,
            password: loginPass,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Нэвтрэх амжилтгүй"
        );

        return;
      }

      /* USER */

      const firstName =
        data.user?.firstName ||
        data.user?.first_name ||
        "";

      const lastName =
        data.user?.lastName ||
        data.user?.last_name ||
        "";

      const loggedUser = {
        id:
          data.user?._id ||
          data.user?.id ||
          "",

        firstName,

        lastName,

        username:
          data.user?.username ||
          `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,

        email:
          data.user?.email || "",

        avatar:
          data.user?.avatar || "",

        joinedAt:
          data.user?.joinedAt ||
          new Date().toISOString(),

        isAdmin: false,
      };

      /* TOKEN */

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      /* SAVE USER */

      localStorage.setItem(
        "thrift_user",
        JSON.stringify(loggedUser)
      );

      /* UPDATE CONTEXT */

      updateUser(loggedUser);

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.log(err);

      setError(
        "Сервертэй холбогдох боломжгүй"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADMIN LOGIN
  ========================= */

  const handleAdminLogin = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setAdminError("");

    if (
      !adminEmail.trim() ||
      !adminPass.trim()
    ) {
      setAdminError(
        "Бүх талбарыг бөглөнө үү"
      );

      return;
    }

    try {
      setAdminLoading(true);

      const res = await fetch(
        "http://localhost:8080/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: adminEmail,
            password: adminPass,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setAdminError(
          data.message ||
            "Admin нэвтрэлт амжилтгүй"
        );

        return;
      }

      const adminFirstName =
        data.user?.firstName ||
        data.user?.first_name ||
        "Admin";

      const adminLastName =
        data.user?.lastName ||
        data.user?.last_name ||
        "User";

      const adminUser = {
        id:
          data.user?._id ||
          data.user?.id ||
          "admin",

        firstName:
          adminFirstName,

        lastName:
          adminLastName,

        username:
          data.user?.username ||
          "admin",

        email:
          data.user?.email || "",

        avatar:
          data.user?.avatar || "",

        joinedAt:
          data.user?.joinedAt ||
          new Date().toISOString(),

        isAdmin: true,
      };

      /* TOKEN */

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      /* SAVE */

      localStorage.setItem(
        "thrift_user",
        JSON.stringify(adminUser)
      );

      /* CONTEXT */

      updateUser(adminUser);

      setAdminSuccess(true);

      setTimeout(() => {
        window.location.href =
          "/admin";
      }, 1000);
    } catch (err) {
      console.log(err);

      setAdminError("Сервер алдаа");
    } finally {
      setAdminLoading(false);
    }
  };

  /* =========================
     ICONS
  ========================= */

  const EyeOpen = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const EyeOff = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="auth-root">
      {/* LEFT */}

      <div className="auth-left">
        <div className="auth-glow" />

        <div className="auth-deco-ring" />

        <div className="auth-deco-ring2" />

        <Link
          to="/"
          className="auth-wordmark"
        >
          <img
            src={logo}
            alt="988 Thrift"
            className="auth-wordmark-icon"
          />

          <span className="auth-wordmark-name">
            988 THRIFT
          </span>
        </Link>

        <div className="auth-hero">
          <div className="auth-eyebrow">
            Pre-loved fashion
          </div>

          <h1 className="auth-headline">
            Find
            <br />
            your
            <br />
            <em>fit.</em>
          </h1>

          <p className="auth-subtext">
            Curated second-hand pieces
            for every style.
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div className="auth-right">
        <div className="auth-card">
          <div
            className={`auth-glass ${
              isAdminMode
                ? "admin-mode"
                : ""
            }`}
          >
            {/* HEADER */}

            <div className="auth-card-header">
              <div className="auth-card-title">
                Welcome back
              </div>

              <button
                className={`admin-toggle-btn ${
                  isAdminMode
                    ? "active"
                    : ""
                }`}
                onClick={
                  toggleAdminMode
                }
                type="button"
              >
                Admin
              </button>
            </div>

            {/* USER LOGIN */}

            <form
              className="auth-form"
              onSubmit={handleLogin}
            >
              <div className="auth-field">
                <label className="auth-label">
                  Email
                </label>

                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  Password
                </label>

                <div className="auth-input-wrap">
                  <input
                    type={
                      showLoginPass
                        ? "text"
                        : "password"
                    }
                    className="auth-input with-icon"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) =>
                      setLoginPass(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="auth-input-icon"
                    onClick={() =>
                      setShowLoginPass(
                        (p) => !p
                      )
                    }
                  >
                    {showLoginPass ? (
                      <EyeOff />
                    ) : (
                      <EyeOpen />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  ⚠ {error}
                </div>
              )}

              <button
                className="auth-btn"
                type="submit"
                disabled={
                  loading || success
                }
              >
                {success ? (
                  "✓ Welcome back!"
                ) : loading ? (
                  <span className="auth-spinner" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* ADMIN LOGIN */}

            {isAdminMode && (
              <form
                className="auth-form"
                onSubmit={
                  handleAdminLogin
                }
              >
                <div className="auth-field">
                  <label className="auth-label">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    className="auth-input"
                    value={adminEmail}
                    onChange={(e) =>
                      setAdminEmail(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">
                    Admin Password
                  </label>

                  <div className="auth-input-wrap">
                    <input
                      type={
                        showAdminPass
                          ? "text"
                          : "password"
                      }
                      className="auth-input with-icon"
                      value={adminPass}
                      onChange={(e) =>
                        setAdminPass(
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="auth-input-icon"
                      onClick={() =>
                        setShowAdminPass(
                          (p) => !p
                        )
                      }
                    >
                      {showAdminPass ? (
                        <EyeOff />
                      ) : (
                        <EyeOpen />
                      )}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div className="auth-error">
                    ⚠ {adminError}
                  </div>
                )}

                <button
                  className="auth-btn admin-btn"
                  type="submit"
                  disabled={
                    adminLoading ||
                    adminSuccess
                  }
                >
                  {adminSuccess ? (
                    "✓ Dashboard"
                  ) : adminLoading ? (
                    <span className="auth-spinner" />
                  ) : (
                    "Access dashboard"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AuthPage as Login };