import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import AdminPanel from "./AdminPanel";

/* ═══════════════════════════════════════════
   DYNAMIC GLOBAL STYLE — بتاخد الألوان من state
═══════════════════════════════════════════ */
const GlobalStyle = ({ colors }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    :root {
      --primary: ${colors.primary};
      --background: ${colors.background};
      --text: ${colors.text};
      --accent: ${colors.accent};
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body { font-family: 'DM Sans', sans-serif; background: ${colors.background}; color: ${colors.text}; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb { background: ${colors.primary}; border-radius: 2px; }
    a { color: inherit; text-decoration: none; }
    button { font-family: 'DM Sans', sans-serif; }
    input { font-family: 'DM Sans', sans-serif; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    .fade-up  { animation: fadeUp  0.4s ease forwards; }
    .fade-in  { animation: fadeIn  0.3s ease forwards; }

    .app { min-height: 100vh; background: ${colors.background}; }

    .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(201,169,110,0.12); position: sticky; top: 0; z-index: 200; }
    .logo { font-family:'Playfair Display',serif; font-size:20px; color:${colors.primary}; cursor:pointer; }
    .logo span { color:${colors.text}; }
    .nav-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .nav-tab { padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(201,169,110,0.25); background: transparent; color: #8a7a6a; cursor: pointer; font-size: 13px; transition: all 0.2s; }
    .nav-tab:hover { border-color:${colors.primary}; color:${colors.primary}; }
    .nav-tab.active { background:${colors.primary}; color:#0a0a0a; border-color:${colors.primary}; font-weight:600; }
    .nav-user { font-size:12px; color:#6a5a4a; padding:8px 14px; border:1px solid rgba(255,255,255,0.06); border-radius:20px; }
    .nav-logout { padding:7px 14px; border-radius:20px; border:1px solid rgba(255,60,60,0.25); background:transparent; color:#c06060; cursor:pointer; font-size:12px; transition:all 0.2s; }
    .nav-logout:hover { background:rgba(255,60,60,0.1); }

    .hero { text-align: center; padding: 88px 20px 64px; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 65%); }
    .hero-tag { display:inline-block; padding:5px 16px; border:1px solid rgba(201,169,110,0.35); border-radius:20px; font-size:11px; color:${colors.primary}; letter-spacing:2px; text-transform:uppercase; margin-bottom:22px; }
    .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(34px,6vw,68px); line-height:1.1; margin-bottom:18px; color:${colors.text}; }
    .hero h1 em { font-style:italic; color:${colors.primary}; }
    .hero p { color:#7a6a5a; font-size:16px; max-width:480px; margin:0 auto 40px; line-height:1.75; }
    .hero-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

    .btn-gold { padding: 13px 30px; background: ${colors.primary}; color: #0a0a0a; border: none; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space:nowrap; }
    .btn-gold:hover { opacity:0.9; transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,169,110,0.28); }
    .btn-gold:disabled { opacity:0.35; cursor:not-allowed; transform:none; box-shadow:none; }
    .btn-outline { padding: 13px 30px; background: transparent; color: ${colors.primary}; border: 1px solid rgba(201,169,110,0.4); border-radius: 4px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .btn-outline:hover { background:rgba(201,169,110,0.08); }
    .btn-ghost { padding:8px 16px; background:transparent; border:none; color:#6a5a4a; cursor:pointer; font-size:13px; transition:color 0.2s; }
    .btn-ghost:hover { color:${colors.primary}; }

    .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(201,169,110,0.08); margin: 0 32px 64px; border: 1px solid rgba(201,169,110,0.08); border-radius: 8px; overflow: hidden; }
    .stat { padding:26px 20px; text-align:center; background:#0d0d0d; }
    .stat-num { font-family:'Playfair Display',serif; font-size:34px; color:${colors.primary}; display:block; }
    .stat-lbl { font-size:11px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }

    .section { max-width:840px; margin:0 auto; padding:0 20px 80px; }
    .section-title { font-family:'Playfair Display',serif; font-size:30px; text-align:center; margin-bottom:6px; color:${colors.text}; }
    .section-sub { color:#5a4a3a; text-align:center; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:36px; }

    .progress-wrap { margin-bottom:44px; }
    .progress-bar { height:1px; background:#1a1a1a; border-radius:1px; }
    .progress-fill { height:100%; background: linear-gradient(90deg,${colors.primary},#e0c080); border-radius:1px; transition:width 0.5s ease; }
    .progress-label { font-size:11px; color:#5a4a3a; text-align:left; margin-bottom:10px; letter-spacing:1px; }

    .step-q { font-family:'Playfair Display',serif; font-size:24px; margin-bottom:28px; color:${colors.text}; }
    .opts-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; }
    .opt { padding:22px 14px; border:1px solid rgba(255,255,255,0.07); border-radius:8px; cursor:pointer; text-align:center; background:#0d0d0d; transition:all 0.2s; }
    .opt:hover { border-color:rgba(201,169,110,0.35); background:#131313; }
    .opt.on { border-color:${colors.primary}; background:rgba(201,169,110,0.07); }
    .opt-emoji { font-size:30px; display:block; margin-bottom:10px; }
    .opt-name { font-size:14px; font-weight:500; color:${colors.text}; }
    .opt-hint { font-size:11px; color:#5a4a3a; margin-top:5px; line-height:1.4; }
    .multi-hint { font-size:12px; color:#5a4a3a; margin-bottom:14px; font-style:italic; }

    .budget-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
    .bcard { padding:24px 18px; border:1px solid rgba(255,255,255,0.07); border-radius:8px; cursor:pointer; text-align:center; background:#0d0d0d; transition:all 0.2s; }
    .bcard:hover { border-color:rgba(201,169,110,0.3); }
    .bcard.on { border-color:${colors.primary}; background:rgba(201,169,110,0.06); }
    .bcard-icon { font-size:26px; margin-bottom:10px; }
    .bcard-price { font-family:'Playfair Display',serif; font-size:18px; color:${colors.primary}; }
    .bcard-desc { font-size:11px; color:#5a4a3a; margin-top:6px; }

    .concern-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; }
    .ccard { padding:22px 16px; border:1px solid rgba(255,255,255,0.07); border-radius:8px; cursor:pointer; text-align:center; background:#0d0d0d; transition:all 0.2s; }
    .ccard:hover { border-color:rgba(201,169,110,0.35); background:#131313; }
    .ccard.on { border-color:${colors.primary}; background:rgba(201,169,110,0.07); }

    .result-header { text-align:center; margin-bottom:44px; }
    .result-badge { display:inline-block; padding:7px 18px; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.25); border-radius:20px; font-size:11px; color:${colors.primary}; letter-spacing:2px; text-transform:uppercase; margin-bottom:18px; }
    .result-title { font-family:'Playfair Display',serif; font-size:26px; margin-bottom:6px; color:${colors.text}; }
    .result-sub { color:#5a4a3a; font-size:13px; }

    .steps-list { display:flex; flex-direction:column; gap:14px; margin-bottom:36px; }
    .step-card { display:grid; grid-template-columns:46px 1fr auto; gap:16px; align-items:start; padding:20px; border:1px solid rgba(255,255,255,0.05); border-radius:8px; background:#0d0d0d; transition:all 0.2s; }
    .step-card:hover { border-color:rgba(201,169,110,0.18); background:#111; }
    .step-num { width:46px; height:46px; border-radius:50%; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.25); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; color:${colors.primary}; font-size:16px; flex-shrink:0; }
    .step-cat { font-size:10px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px; }
    .step-name { font-size:14px; font-weight:500; margin-bottom:3px; color:${colors.text}; }
    .step-brand { font-size:11px; color:#5a4a3a; }
    .step-note { font-size:11px; color:#7a6a5a; margin-top:5px; font-style:italic; }
    .step-ingr { font-size:10px; color:#3a3030; margin-top:3px; }
    .step-right { text-align:right; flex-shrink:0; }
    .step-price { font-family:'Playfair Display',serif; color:${colors.primary}; font-size:18px; }
    .step-where { font-size:10px; color:#3a3030; margin-top:3px; }
    .buy-btn { display:inline-block; margin-top:8px; padding:6px 13px; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.25); border-radius:3px; color:${colors.primary}; font-size:11px; cursor:pointer; transition:all 0.2s; text-decoration:none; font-family:'DM Sans',sans-serif; }
    .buy-btn:hover { background:${colors.primary}; color:#0a0a0a; }

    .total-box { padding:22px 26px; background:linear-gradient(135deg,rgba(201,169,110,0.07),rgba(201,169,110,0.02)); border:1px solid rgba(201,169,110,0.18); border-radius:8px; display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
    .total-lbl { font-size:12px; color:#7a6a5a; text-transform:uppercase; letter-spacing:1px; }
    .total-note { font-size:10px; color:#3a3030; margin-top:3px; }
    .total-amount { font-family:'Playfair Display',serif; font-size:30px; color:${colors.primary}; }
    .action-row { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }

    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; }
    .modal { background:#111; border:1px solid rgba(201,169,110,0.18); border-radius:12px; padding:40px; width:100%; max-width:420px; animation: fadeUp 0.3s ease; }
    .modal-title { font-family:'Playfair Display',serif; font-size:24px; margin-bottom:6px; color:${colors.text}; }
    .modal-sub { font-size:13px; color:#5a4a3a; margin-bottom:28px; }
    .field { margin-bottom:18px; }
    .field label { display:block; font-size:12px; color:#7a6a5a; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
    .field input { width:100%; padding:12px 16px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:${colors.text}; font-size:14px; outline:none; transition:border-color 0.2s; }
    .field input:focus { border-color:rgba(201,169,110,0.4); }
    .auth-err { font-size:12px; color:#c05050; margin-bottom:16px; padding:10px 14px; background:rgba(200,80,80,0.08); border-radius:4px; }
    .auth-switch { text-align:center; margin-top:20px; font-size:13px; color:#5a4a3a; }
    .auth-switch button { background:none; border:none; color:${colors.primary}; cursor:pointer; font-size:13px; text-decoration:underline; }
    .modal-close { position:absolute; top:16px; right:16px; background:none; border:none; color:#5a4a3a; font-size:20px; cursor:pointer; }

    .saved-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
    .saved-card { padding:22px; border:1px solid rgba(255,255,255,0.06); border-radius:8px; background:#0d0d0d; transition:all 0.2s; cursor:pointer; }
    .saved-card:hover { border-color:rgba(201,169,110,0.25); }
    .saved-card-tag { font-size:10px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px; }
    .saved-card-title { font-family:'Playfair Display',serif; font-size:18px; margin-bottom:4px; color:${colors.text}; }
    .saved-card-date { font-size:11px; color:#3a3030; }
    .saved-card-steps { font-size:12px; color:#5a4a3a; margin-top:10px; }
    .empty-state { text-align:center; padding:60px 20px; color:#3a3030; }
    .empty-icon { font-size:48px; margin-bottom:16px; }
    .empty-text { font-size:14px; }

    .dash-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:40px; }
    .dash-card { padding:24px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.06); border-radius:8px; }
    .dash-num { font-family:'Playfair Display',serif; font-size:32px; color:${colors.primary}; }
    .dash-lbl { font-size:11px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
    .users-table { width:100%; border-collapse:collapse; font-size:13px; }
    .users-table th { padding:10px 14px; text-align:right; font-size:10px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.05); }
    .users-table td { padding:12px 14px; border-bottom:1px solid rgba(255,255,255,0.03); color:#a09080; }
    .users-table tr:hover td { background:rgba(255,255,255,0.02); }

    .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); padding:12px 24px; background:#1a1a1a; border:1px solid rgba(201,169,110,0.3); border-radius:6px; font-size:13px; color:${colors.primary}; z-index:999; animation: fadeUp 0.3s ease; }
    .back-btn { display:flex; align-items:center; gap:6px; background:none; border:none; color:#5a4a3a; cursor:pointer; font-size:13px; margin-bottom:28px; transition:color 0.2s; padding:0; }
    .back-btn:hover { color:${colors.primary}; }

    /* SALE BADGE */
    .sale-badge { display:inline-block; padding:3px 10px; background:linear-gradient(135deg,#c0392b,#e74c3c); color:#fff; border-radius:12px; font-size:10px; font-weight:700; letter-spacing:0.5px; margin-left:6px; vertical-align:middle; }
    .sale-badge-card { position:absolute; top:10px; right:10px; padding:4px 10px; background:linear-gradient(135deg,#c0392b,#e74c3c); color:#fff; border-radius:12px; font-size:10px; font-weight:700; }

    /* SALES PAGE */
    .sales-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:18px; }
    .sale-card { position:relative; padding:20px; background:#0d0d0d; border:1px solid rgba(220,60,60,0.2); border-radius:10px; transition:all 0.2s; cursor:pointer; }
    .sale-card:hover { border-color:rgba(220,60,60,0.45); transform:translateY(-2px); box-shadow:0 8px 24px rgba(200,50,50,0.1); }
    .sale-card-img { width:100%; height:140px; object-fit:contain; border-radius:6px; background:#111; margin-bottom:14px; }
    .sale-card-img-placeholder { width:100%; height:140px; background:#111; border-radius:6px; margin-bottom:14px; display:flex; align-items:center; justify-content:center; font-size:36px; }
    .sale-card-brand { font-size:10px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:4px; }
    .sale-card-name { font-size:14px; font-weight:500; color:#f5f0eb; margin-bottom:8px; line-height:1.4; }
    .sale-card-price-wrap { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px; }
    .sale-card-price { font-family:'Playfair Display',serif; font-size:20px; color:${colors.primary}; }
    .sale-card-original { font-size:13px; color:#3a3030; text-decoration:line-through; }
    .sale-card-pct { padding:2px 8px; background:rgba(220,60,60,0.15); border:1px solid rgba(220,60,60,0.3); color:#e74c3c; border-radius:10px; font-size:11px; font-weight:700; }
    .sale-card-skin { font-size:11px; color:#5a4a3a; margin-top:4px; }
    .sale-label-tag { display:inline-block; padding:3px 10px; background:rgba(220,60,60,0.15); border:1px solid rgba(220,60,60,0.3); color:#e74c3c; border-radius:12px; font-size:11px; font-weight:600; margin-bottom:8px; }

    /* LANG BUTTON */
    .lang-btn { padding:6px 12px; border-radius:20px; border:1px solid rgba(201,169,110,0.3); background:transparent; color:${colors.primary}; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.2s; }
    .lang-btn:hover { background:rgba(201,169,110,0.1); }

    /* NOTIF DOT */
    .notif-dot { display:inline-block; width:7px; height:7px; background:#e74c3c; border-radius:50%; margin-left:4px; vertical-align:middle; }

    /* CONSULTATION PAGE */
    .consult-page { max-width:680px; margin:0 auto; }
    .consult-premium-banner { padding:18px 22px; background:linear-gradient(135deg,rgba(201,169,110,0.08),rgba(201,169,110,0.03)); border:1px solid rgba(201,169,110,0.2); border-radius:10px; margin-bottom:28px; display:flex; align-items:center; gap:14px; }
    .consult-form { padding:28px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.06); border-radius:12px; margin-bottom:24px; }
    .consult-form textarea { width:100%; padding:12px 16px; background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:#f5f0eb; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; resize:vertical; min-height:120px; box-sizing:border-box; transition:border-color 0.2s; }
    .consult-form textarea:focus { border-color:rgba(201,169,110,0.4); }
    .consult-form select { width:100%; padding:11px 14px; background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:#f5f0eb; font-size:13px; outline:none; }
    .consult-history { padding:22px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:10px; }
    .consult-item { padding:18px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
    .consult-item:last-child { border-bottom:none; }
    .consult-q { font-size:14px; color:#c9c0b0; margin-bottom:10px; line-height:1.6; }
    .consult-reply { padding:14px; background:rgba(201,169,110,0.05); border:1px solid rgba(201,169,110,0.15); border-radius:8px; margin-top:10px; }
    .consult-reply-label { font-size:10px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:6px; }
    .consult-reply-text { font-size:13px; color:#c9a96e; line-height:1.7; }

    /* PRODUCT PAGE */
    .product-page { max-width:720px; margin:0 auto; }
    .product-hero { padding:28px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.06); border-radius:12px; margin-bottom:24px; }
    .product-brand { font-size:11px; color:${colors.primary}; text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; }
    .product-name { font-family:'Playfair Display',serif; font-size:26px; margin-bottom:8px; color:${colors.text}; }
    .product-type-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; margin-bottom:16px; }
    .product-price-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05); }
    .product-price-big { font-family:'Playfair Display',serif; font-size:32px; color:${colors.primary}; }
    .product-where { font-size:12px; color:#5a4a3a; margin-top:2px; }
    .product-buy-btn { padding:12px 28px; background:${colors.primary}; color:#0a0a0a; border:none; border-radius:6px; font-size:14px; font-weight:600; cursor:pointer; text-decoration:none; font-family:'DM Sans',sans-serif; transition:all 0.2s; display:inline-block; }
    .product-buy-btn:hover { opacity:0.88; }
    .product-section { padding:22px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:10px; margin-bottom:16px; }
    .product-section-title { font-size:11px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; }
    .product-note { font-size:14px; color:#9a8a7a; line-height:1.7; }
    .product-ingr { font-size:13px; color:#7a6a5a; line-height:1.8; }
    .doctor-note-box { padding:20px; background:rgba(201,169,110,0.04); border:1px solid rgba(201,169,110,0.18); border-radius:10px; margin-bottom:16px; }
    .doctor-note-label { font-size:11px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
    .doctor-note-text { font-size:14px; color:#c9a96e; line-height:1.8; }

    /* REVIEWS */
    .review-item { padding:18px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
    .review-item:last-child { border-bottom:none; }
    .review-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
    .review-user { font-size:13px; font-weight:500; color:${colors.text}; }
    .review-date { font-size:11px; color:#3a3030; }
    .review-stars { color:${colors.primary}; font-size:13px; margin-bottom:6px; }
    .review-text { font-size:13px; color:#7a6a5a; line-height:1.7; }
    .review-form { margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); }
    .review-form textarea { width:100%; padding:12px 16px; background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:6px; color:${colors.text}; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; resize:vertical; min-height:90px; box-sizing:border-box; transition:border-color 0.2s; }
    .review-form textarea:focus { border-color:rgba(201,169,110,0.4); }
    .stars-select { display:flex; gap:8px; margin-bottom:14px; }
    .star-btn { background:none; border:none; font-size:22px; cursor:pointer; transition:transform 0.1s; opacity:0.35; }
    .star-btn.on { opacity:1; }
    .star-btn:hover { transform:scale(1.2); }
    .step-card { cursor:pointer; }
    .step-card:hover .step-name { color:${colors.primary}; }

    /* COMPARE */
    .compare-bar { position:fixed; bottom:0; left:0; right:0; background:#111; border-top:1px solid rgba(201,169,110,0.2); padding:14px 24px; display:flex; align-items:center; gap:16px; z-index:400; flex-wrap:wrap; }
    .compare-item { display:flex; align-items:center; gap:8px; padding:6px 14px; background:"#0d0d0d"; border:1px solid rgba(201,169,110,0.25); border-radius:20px; font-size:12px; color:#f5f0eb; }
    .compare-remove { background:none; border:none; color:#c05050; cursor:pointer; font-size:14px; padding:0; }
    .compare-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
    .compare-col { padding:22px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.06); border-radius:10px; }
    .compare-col-name { font-family:'Playfair Display',serif; font-size:18px; color:#f5f0eb; margin-bottom:4px; }
    .compare-col-brand { font-size:11px; color:${colors.primary}; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
    .compare-row { padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.04); display:flex; justify-content:space-between; align-items:center; font-size:13px; }
    .compare-row:last-child { border-bottom:none; }
    .compare-label { color:#5a4a3a; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
    .compare-val { color:#f5f0eb; text-align:left; max-width:60%; }
    .compare-winner { color:${colors.primary}; font-weight:600; }

    @media(max-width:640px) {
      .nav { padding:12px 16px; }
      .stats-row { grid-template-columns:repeat(2,1fr); margin:0 16px 40px; }
      .hero { padding:60px 16px 48px; }
      .budget-grid { grid-template-columns:1fr; }
      .step-card { grid-template-columns:40px 1fr; }
      .step-right { grid-column:2; }
      .total-box { flex-direction:column; gap:12px; text-align:center; }
      .dash-grid { grid-template-columns:1fr; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════
   DATABASE
═══════════════════════════════════════════ */
const PRODUCTS = [
  {id:"c1",name:"DEOC Acneminty Cleanser 3-in-1",brand:"Deoc",type:"cleanser",skin:["oily","combo","acne"],concerns:["acne","pores"],price:200,where:"نون، أمازون",link:"https://noon.com",ingredients:"Rhassoul Clay, Tea Tree, Mint",note:"الأشهر لبشرة دهنية"},
  {id:"c2",name:"SESH Super Cleanse Clarifying",brand:"SESH",type:"cleanser",skin:["oily","acne"],concerns:["acne","pores"],price:350,where:"نون",link:"https://noon.com",ingredients:"2% Salicylic Acid, Niacinamide",note:"تنظيف عميق + حب الشباب"},
  {id:"c3",name:"SESH Simply Polish Dry/Normal",brand:"SESH",type:"cleanser",skin:["dry","normal","sensitive"],concerns:["hydration","sensitivity"],price:350,where:"نون",link:"https://noon.com",ingredients:"Ceramides, HA, Centella",note:"لطيف + يقوي الـ Barrier"},
  {id:"c4",name:"Bobana Vitamin C Face Wash",brand:"Bobana",type:"cleanser",skin:["all"],concerns:["brightening"],price:35,where:"bobana-eg.com",link:"https://bobana-eg.com",ingredients:"Vitamin C, Aloe Vera",note:"إشراق + تنظيف بأرخص سعر"},
  {id:"c5",name:"Dermatique Vitamin C Cleanser",brand:"Dermatique",type:"cleanser",skin:["all"],concerns:["brightening"],price:220,where:"صيدليات، نون",link:"https://noon.com",ingredients:"Vitamin C, AHA, Niacinamide",note:"تنظيف + إشراق"},
  {id:"c6",name:"Kolagra Vitamin C Cleanser 200ml",brand:"Kolagra",type:"cleanser",skin:["all"],concerns:["brightening"],price:90,where:"أمازون، نون",link:"https://amazon.eg",ingredients:"Vitamin C, Tea Tree, Collagen",note:"بأفضل سعر"},
  {id:"c7",name:"Garnier SkinActive Cleanser Gel",brand:"Garnier",type:"cleanser",skin:["oily","combo"],concerns:["oiliness"],price:150,where:"سوبر ماركت، نون",link:"https://noon.com",ingredients:"Salicylic Acid, Lemon",note:"في كل مكان – سهل التوفر"},
  {id:"c8",name:"Neutrogena Oil-Free Acne Wash",brand:"Neutrogena",type:"cleanser",skin:["oily","acne"],concerns:["acne"],price:350,where:"صيدليات، نون",link:"https://noon.com",ingredients:"2% Salicylic Acid",note:"Derm-recommended #1"},
  {id:"c9",name:"Vichy Normaderm PhytoAction",brand:"Vichy",type:"cleanser",skin:["oily","acne"],concerns:["acne","pores"],price:520,where:"نون، صيدليات",link:"https://noon.com",ingredients:"Salicylic + Glycolic + Niacinamide",note:"درماتولوجي فرنسي"},
  {id:"c10",name:"Raw African Facial Cleanser",brand:"Raw African",type:"cleanser",skin:["all","sensitive"],concerns:["sensitivity"],price:320,where:"ZYNAH، Source Beauty",link:"https://zynah.me",ingredients:"Natural Organic Botanicals",note:"100% طبيعي فيجان"},
  {id:"t1",name:"Anua Heartleaf 77% Soothing Toner",brand:"Anua",type:"toner",skin:["sensitive","dry","all"],concerns:["sensitivity","hydration"],price:550,where:"Korean Beautys، نون",link:"https://koreanbeautys.com",ingredients:"77% Heartleaf, Centella",note:"الأفضل للحساسة"},
  {id:"t2",name:"Some By Mi AHA BHA PHA Toner",brand:"Some By Mi",type:"toner",skin:["oily","acne","combo"],concerns:["acne","pores","brightening"],price:445,where:"Korean Beautys، نون",link:"https://koreanbeautys.com",ingredients:"AHA+BHA+PHA, Tea Tree, Niacinamide",note:"30 يوم miracle"},
  {id:"t3",name:"COSRX BHA Blackhead Power Liquid",brand:"COSRX",type:"toner",skin:["oily","acne"],concerns:["pores","acne"],price:1999,where:"نون، Source Beauty",link:"https://noon.com",ingredients:"4% Betaine Salicylate",note:"رؤوس سوداء – الأقوى"},
  {id:"s1",name:"COSRX Advanced Snail 96 Mucin",brand:"COSRX",type:"serum",skin:["all","sensitive"],concerns:["hydration","sensitivity","brightening"],price:1499,where:"نون، Source Beauty",link:"https://noon.com",ingredients:"96% Snail Secretion Filtrate",note:"⭐ الأكثر مبيعاً عالمياً"},
  {id:"s2",name:"SESH Super Smooth Pore Refining Gel",brand:"SESH",type:"serum",skin:["oily","combo"],concerns:["pores","acne"],price:640,where:"نون",link:"https://noon.com",ingredients:"2% SA, 4% Niacinamide",note:"تقليل مسامات"},
  {id:"s3",name:"Telofill Lightening Serum 30ml",brand:"Telofil",type:"serum",skin:["all"],concerns:["brightening","darkspots"],price:320,where:"نون، أمازون",link:"https://noon.com",ingredients:"3% Tranexamic Acid",note:"تفتيح بقع – الأفضل مصري"},
  {id:"s4",name:"Dermatique Niacinamide 10% Serum",brand:"Dermatique",type:"serum",skin:["oily","combo"],concerns:["pores","brightening"],price:280,where:"صيدليات، نون",link:"https://noon.com",ingredients:"10% Niacinamide, HA",note:"#1 SkinSort مصري"},
  {id:"s5",name:"Dr. Althea Centella Ampoule 30ml",brand:"Dr. Althea",type:"serum",skin:["sensitive","all"],concerns:["sensitivity"],price:680,where:"koreanbeautys.com",link:"https://koreanbeautys.com",ingredients:"Centella Asiatica 74%, Panthenol",note:"تهدئة كوري قوية"},
  {id:"s6",name:"Dr. Althea Retinol Intense Serum",brand:"Dr. Althea",type:"serum",skin:["normal","dry"],concerns:["aging"],price:850,where:"koreanbeautys.com",link:"https://koreanbeautys.com",ingredients:"Retinol 0.1%, Centella",note:"ريتينول + تهدئة"},
  {id:"s7",name:"Vichy Minéral 89 Hyaluronic Serum",brand:"Vichy",type:"serum",skin:["all","sensitive","dry"],concerns:["hydration"],price:899,where:"نون، صيدليات",link:"https://noon.com",ingredients:"89% Vichy Thermal Water, HA",note:"تقوية Barrier + ترطيب"},
  {id:"s8",name:"L'Oreal Hyaluron Expert Serum 50ml",brand:"L'Oreal",type:"serum",skin:["dry","normal"],concerns:["hydration","aging"],price:375,where:"نون، سوبر ماركت",link:"https://noon.com",ingredients:"Micro+Macro HA, Vitamin CG",note:"ترطيب + ملء تجاعيد"},
  {id:"s9",name:"Eva Skin Clinic 1.5% HA Serum",brand:"Eva Cosmetics",type:"serum",skin:["dry","normal","sensitive"],concerns:["hydration"],price:220,where:"نون، أمازون",link:"https://noon.com",ingredients:"1.5% HA, Provitamin B5",note:"ترطيب مكثف بسعر ممتاز"},
  {id:"s10",name:"Kolagra Vitamin C & E Serum",brand:"Kolagra",type:"serum",skin:["all"],concerns:["brightening"],price:140,where:"أمازون",link:"https://amazon.eg",ingredients:"Vitamin C, Vitamin E",note:"أرخص سيروم فيتامين C فعال"},
  {id:"s11",name:"Kolagra Retinol Serum 30ml",brand:"Kolagra",type:"serum",skin:["normal","dry"],concerns:["aging"],price:186,where:"نون",link:"https://noon.com",ingredients:"Retinol, Peptides",note:"ريتينول بأرخص سعر"},
  {id:"s12",name:"Infinity Retinol Serum 30ml",brand:"Infinity Pharma",type:"serum",skin:["normal","dry"],concerns:["aging"],price:380,where:"نون",link:"https://noon.com",ingredients:"Retinol, Vitamin E",note:"مكافحة شيخوخة"},
  {id:"s13",name:"Dermaelle Brightening Vit C Serum",brand:"Dermaelle",type:"serum",skin:["all"],concerns:["brightening","darkspots"],price:490,where:"e-dermaelle.com، نون",link:"https://noon.com",ingredients:"Vit C, Tranexamic, Alpha Arbutin",note:"تفتيح بقع + إشراق"},
  {id:"s14",name:"Anua Heartleaf Quercetinol Pore Serum",brand:"Anua",type:"serum",skin:["oily","combo"],concerns:["pores"],price:750,where:"Korean Beautys",link:"https://koreanbeautys.com",ingredients:"Heartleaf, Quercetinol, Niacinamide",note:"تقليل مسامات + تهدئة"},
  {id:"s15",name:"Telofill Eye Contour Serum 17ml",brand:"Telofil",type:"serum",skin:["all"],concerns:["darkcircles","aging"],price:370,where:"نون",link:"https://noon.com",ingredients:"HA, Peptides, Retinol, Caffeine",note:"هالات + انتفاخ + تجاعيد"},
  {id:"s16",name:"Bel Clinic Eye Repair Serum 15ml",brand:"Bel Clinic",type:"serum",skin:["all"],concerns:["darkcircles"],price:320,where:"ZYNAH، نون",link:"https://zynah.me",ingredients:"Vitamin K, Caviar Extract, HA",note:"هالات العيون"},
  {id:"s17",name:"Garnier Bright Complete Vit C Serum",brand:"Garnier",type:"serum",skin:["all"],concerns:["brightening"],price:200,where:"سوبر ماركت، نون",link:"https://noon.com",ingredients:"Vitamin C, Lemon Essence",note:"إشراق في أسبوع"},
  {id:"s18",name:"Some By Mi Snail Truecica Repair Serum",brand:"Some By Mi",type:"serum",skin:["sensitive","all"],concerns:["sensitivity","acne"],price:600,where:"Korean Beautys",link:"https://koreanbeautys.com",ingredients:"Snail Secretion, Truecica, Centella",note:"إصلاح Barrier"},
  {id:"s19",name:"Kolagra Alpha Arbutin 1.5% Cream",brand:"Kolagra",type:"serum",skin:["all"],concerns:["brightening","darkspots"],price:145,where:"نون",link:"https://noon.com",ingredients:"Alpha Arbutin 1.5%, Niacinamide",note:"تفتيح بقع بأفضل سعر"},
  {id:"m1",name:"Dermatique Refine Shine Moisturizer",brand:"Dermatique",type:"moisturizer",skin:["oily","combo"],concerns:["pores","oiliness"],price:280,where:"صيدليات، نون",link:"https://noon.com",ingredients:"Niacinamide, Salicylic Acid",note:"#1 SkinSort مصري – مات"},
  {id:"m2",name:"SESH Super Clear Mattifying Cream",brand:"SESH",type:"moisturizer",skin:["oily","acne"],concerns:["acne","oiliness"],price:680,where:"نون",link:"https://noon.com",ingredients:"14 Active Ingredients, Niacinamide",note:"مات + ترطيب + 14 مكون"},
  {id:"m3",name:"DEOC Hydrolight Gel Moisturizer",brand:"Deoc",type:"moisturizer",skin:["oily","combo"],concerns:["oiliness","hydration"],price:320,where:"نون",link:"https://noon.com",ingredients:"Hyaluronic Acid, Aloe Vera",note:"جل خفيف للدهنية"},
  {id:"m4",name:"Anua Heartleaf 70% Daily Relief Cream",brand:"Anua",type:"moisturizer",skin:["sensitive","dry"],concerns:["sensitivity","hydration"],price:680,where:"Korean Beautys، نون",link:"https://koreanbeautys.com",ingredients:"Heartleaf 70%, Ceramides, Panthenol",note:"مهدئ كوري للحساسة"},
  {id:"m5",name:"Neutrogena Hydro Boost Water Gel",brand:"Neutrogena",type:"moisturizer",skin:["all"],concerns:["hydration"],price:400,where:"صيدليات، نون",link:"https://noon.com",ingredients:"Hyaluronic Acid, Glycerin",note:"⭐ الأكثر مبيعاً عالمياً"},
  {id:"m6",name:"Garnier Hyaluronic Aloe Moisturizer",brand:"Garnier",type:"moisturizer",skin:["dry","normal"],concerns:["hydration"],price:200,where:"سوبر ماركت، نون",link:"https://noon.com",ingredients:"HA, Aloe Vera",note:"ترطيب 48 ساعة"},
  {id:"m7",name:"ISIS Pharma Aquaruva Cream 50ml",brand:"ISIS Pharma",type:"moisturizer",skin:["dry","sensitive"],concerns:["hydration","sensitivity"],price:350,where:"صيدليات",link:"https://noon.com",ingredients:"Hyaluronic Acid, Shea Butter",note:"فرنسي للجافة والحساسة"},
  {id:"m8",name:"Vichy Aqualia Thermal Cream",brand:"Vichy",type:"moisturizer",skin:["dry","normal"],concerns:["hydration"],price:780,where:"نون، صيدليات",link:"https://noon.com",ingredients:"Thermal Water, HA",note:"ترطيب 48 ساعة فرنسي"},
  {id:"m9",name:"Eva Skin Care 7 in 1 Facial Cream",brand:"Eva Cosmetics",type:"moisturizer",skin:["all"],concerns:["hydration"],price:180,where:"ZYNAH، سوبر ماركت",link:"https://zynah.me",ingredients:"Vitamins B3, B5, C, E",note:"7 فوائد بسعر ممتاز"},
  {id:"sun1",name:"SESH Simply ONE 7-in-1 SPF50+",brand:"SESH",type:"sunscreen",skin:["all"],concerns:["all"],price:550,where:"نون، Tay Pharmacies",link:"https://noon.com",ingredients:"7 UV Filters, SPF50+, Niacinamide",note:"⭐ الأفضل مصري – 7 فوائد"},
  {id:"sun2",name:"DEOC Sun Amor Sunscreen SPF50+",brand:"Deoc",type:"sunscreen",skin:["all"],concerns:["all"],price:300,where:"نون، ZYNAH",link:"https://noon.com",ingredients:"Zinc Oxide, Avobenzone, Chamomile",note:"خفيف 8 ساعات"},
  {id:"sun3",name:"Kolagra Sunscreen SPF50+",brand:"Kolagra",type:"sunscreen",skin:["all"],concerns:["all"],price:84,where:"أمازون، نون",link:"https://amazon.eg",ingredients:"Chemical + Physical Filters",note:"⭐ أرخص واقي فعال"},
  {id:"sun4",name:"ISIS Pharma Uveblock SPF80 Tinted",brand:"ISIS Pharma",type:"sunscreen",skin:["sensitive","all"],concerns:["sensitivity"],price:369,where:"نون، صيدليات",link:"https://noon.com",ingredients:"SPF80, Mineral Filters",note:"SPF80 للحساسة"},
  {id:"sun5",name:"Dermacy Labs Glow Sunscreen SPF50+",brand:"Dermacy Labs",type:"sunscreen",skin:["all"],concerns:["brightening"],price:399,where:"dermacylabs.com، نون",link:"https://noon.com",ingredients:"SPF50+, Niacinamide, Vit C",note:"ينتج توهج طبيعي"},
  {id:"sun6",name:"COSRX Ultra-Light Invisible SPF50",brand:"COSRX",type:"sunscreen",skin:["oily","combo"],concerns:["acne","oiliness"],price:1400,where:"نون، Source Beauty",link:"https://noon.com",ingredients:"SPF50, PA++++, Aloe Vera",note:"لا يسبب رؤوس بيضاء"},
  {id:"sun7",name:"Vichy Capital Soleil UV-Age SPF50+",brand:"Vichy",type:"sunscreen",skin:["all"],concerns:["aging","brightening"],price:1200,where:"نون",link:"https://noon.com",ingredients:"SPF50+, Niacinamide 5%, HA",note:"واقي + مكافحة شيخوخة"},
  {id:"sun8",name:"Telofill Sunscreen SPF50+ 60g",brand:"Telofil",type:"sunscreen",skin:["all"],concerns:["all"],price:185,where:"نون، أمازون",link:"https://noon.com",ingredients:"SPF50+, Light-texture",note:"خفيف يومي مصري"},
  {id:"sun9",name:"Neutrogena Ultra Sheer Dry-Touch SPF50+",brand:"Neutrogena",type:"sunscreen",skin:["oily","combo"],concerns:["oiliness"],price:450,where:"نون، أمازون",link:"https://noon.com",ingredients:"SPF50+, PA++++, Helioplex",note:"Derm #1 – غير دهني"},
  {id:"sun10",name:"Starville SPF50+ Sunscreen",brand:"Starville",type:"sunscreen",skin:["all"],concerns:["all"],price:120,where:"نون، صيدليات",link:"https://noon.com",ingredients:"SPF50+",note:"budget يومي"},
  {id:"sun11",name:"ISIS Pharma Ruboril Expert SPF50+",brand:"ISIS Pharma",type:"sunscreen",skin:["sensitive"],concerns:["sensitivity"],price:900,where:"نون",link:"https://noon.com",ingredients:"B-Calm Complex, SPF50+",note:"للاحمرار الدائم"},
  {id:"sun12",name:"Dr. Althea UV Shield SPF50+",brand:"Dr. Althea",type:"sunscreen",skin:["sensitive","all"],concerns:["sensitivity"],price:850,where:"koreanbeautys.com",link:"https://koreanbeautys.com",ingredients:"SPF50+, PA++++, Centella",note:"واقي مهدئ كوري"},
];

const ROUTINES = {
  skin:{
    dry:{budget:{cleanser:"c4",serum:"s9",moisturizer:"m7",sunscreen:"sun3",total:689},mid:{cleanser:"c3",toner:"t1",serum:"s9",moisturizer:"m6",sunscreen:"sun4",total:1355},premium:{cleanser:"c3",toner:"t1",serum:"s7",serum2:"s8",moisturizer:"m8",sunscreen:"sun7",total:3762}},
    oily:{budget:{cleanser:"c1",serum:"s4",moisturizer:"m1",sunscreen:"sun3",total:654},mid:{cleanser:"c2",serum:"s2",moisturizer:"m2",sunscreen:"sun2",total:1670},premium:{cleanser:"c2",toner:"t3",serum:"s2",moisturizer:"m2",sunscreen:"sun6",total:4669}},
    combo:{budget:{cleanser:"c7",serum:"s10",moisturizer:"m3",sunscreen:"sun3",total:544},mid:{cleanser:"c1",serum:"s4",moisturizer:"m3",sunscreen:"sun8",total:985},premium:{cleanser:"c2",toner:"t2",serum:"s2",moisturizer:"m3",sunscreen:"sun1",total:2235}},
    sensitive:{budget:{cleanser:"c4",serum:"s9",moisturizer:"m7",sunscreen:"sun4",total:974},mid:{cleanser:"c3",toner:"t1",serum:"s5",moisturizer:"m4",sunscreen:"sun4",total:2409},premium:{cleanser:"c10",toner:"t1",serum:"s1",serum2:"s5",moisturizer:"m4",sunscreen:"sun11",total:4329}},
    normal:{budget:{cleanser:"c6",serum:"s10",moisturizer:"m6",sunscreen:"sun10",total:550},mid:{cleanser:"c7",serum:"s8",moisturizer:"m5",sunscreen:"sun8",total:935},premium:{cleanser:"c9",toner:"t2",serum:"s7",moisturizer:"m5",sunscreen:"sun7",total:2594}},
  },
  concern:{
    brightening:{budget:{cleanser:"c6",serum:"s10",serum2:"s19",moisturizer:"m9",sunscreen:"sun3",total:549},mid:{cleanser:"c5",serum:"s3",serum2:"s17",moisturizer:"m1",sunscreen:"sun5",total:1429},premium:{cleanser:"c5",toner:"t2",serum:"s13",serum2:"s3",moisturizer:"m1",sunscreen:"sun7",total:2885}},
    acne:{budget:{cleanser:"c1",serum:"s4",moisturizer:"m1",sunscreen:"sun2",total:1060},mid:{cleanser:"c2",toner:"t2",serum:"s2",moisturizer:"m2",sunscreen:"sun1",total:2625},premium:{cleanser:"c2",toner:"t3",serum:"s2",moisturizer:"m2",sunscreen:"sun6",total:4669}},
    aging:{budget:{cleanser:"c7",serum:"s9",serum2:"s11",moisturizer:"m6",sunscreen:"sun10",total:756},mid:{cleanser:"c7",serum:"s8",serum2:"s12",moisturizer:"m5",sunscreen:"sun8",total:1285},premium:{cleanser:"c9",serum:"s7",serum2:"s6",moisturizer:"m8",sunscreen:"sun7",total:4299}},
    hydration:{budget:{cleanser:"c4",serum:"s9",moisturizer:"m7",sunscreen:"sun3",total:689},mid:{cleanser:"c3",toner:"t1",serum:"s9",moisturizer:"m4",sunscreen:"sun4",total:1749},premium:{cleanser:"c3",toner:"t1",serum:"s1",serum2:"s7",moisturizer:"m8",sunscreen:"sun7",total:4878}},
    sensitivity:{budget:{cleanser:"c4",serum:"s9",moisturizer:"m7",sunscreen:"sun4",total:974},mid:{cleanser:"c3",toner:"t1",serum:"s5",moisturizer:"m4",sunscreen:"sun4",total:2409},premium:{cleanser:"c10",toner:"t1",serum:"s1",serum2:"s18",moisturizer:"m4",sunscreen:"sun12",total:4578}},
    pores:{budget:{cleanser:"c1",serum:"s4",moisturizer:"m3",sunscreen:"sun2",total:1100},mid:{cleanser:"c2",toner:"t2",serum:"s2",moisturizer:"m1",sunscreen:"sun1",total:2225}},
    darkcircles:{budget:{cleanser:"c7",serum:"s16",moisturizer:"m9",sunscreen:"sun3",total:744},mid:{cleanser:"c3",serum:"s15",moisturizer:"m5",sunscreen:"sun5",total:1505}},
    darkspots:{budget:{cleanser:"c6",serum:"s19",serum2:"s17",moisturizer:"m9",sunscreen:"sun2",total:769},mid:{cleanser:"c2",toner:"t2",serum:"s3",serum2:"s4",moisturizer:"m2",sunscreen:"sun5",total:2274},premium:{cleanser:"c9",toner:"t2",serum:"s13",serum2:"s3",moisturizer:"m2",sunscreen:"sun7",total:3534}},
  },
};

const TYPE_LABELS_APP = { cleanser:"غسول", serum:"سيروم", moisturizer:"مرطب", sunscreen:"واقي شمس", toner:"تونر", mask:"ماسك", makeup_remover:"مزيل مكياج", body_moisturizer:"مرطب جسم", eye_cream:"كريم عيون", exfoliator:"مقشر", spot_treatment:"علاج موضعي", oil:"زيت" };
const TYPE_LABELS_EN  = { cleanser:"Cleanser", serum:"Serum", moisturizer:"Moisturizer", sunscreen:"Sunscreen", toner:"Toner", mask:"Mask", makeup_remover:"Makeup Remover", body_moisturizer:"Body Moisturizer", eye_cream:"Eye Cream", exfoliator:"Exfoliator", spot_treatment:"Spot Treatment", oil:"Oil" };

// الكاتيجوريز المتاحة للاختيار مع أيقونة
const SELECTABLE_TYPES = [
  {key:"cleanser",      icon:"🧼"}, {key:"toner",       icon:"💧"},
  {key:"serum",         icon:"🧪"}, {key:"moisturizer", icon:"🫧"},
  {key:"sunscreen",     icon:"☀️"}, {key:"eye_cream",   icon:"👁️"},
  {key:"mask",          icon:"🎭"}, {key:"exfoliator",  icon:"✨"},
  {key:"spot_treatment",icon:"🎯"}, {key:"oil",         icon:"🫙"},
];

const SKIN_TYPES = [
  {key:"dry",emoji:"💧",label:"جافة",hint:"بتحسي بشدة + بتقشر"},
  {key:"oily",emoji:"✨",label:"دهنية",hint:"لامعة + مسامات واسعة"},
  {key:"combo",emoji:"⚖️",label:"مختلطة",hint:"T-zone دهنية + الخدين عادي"},
  {key:"sensitive",emoji:"🌸",label:"حساسة",hint:"بتحمر بسرعة + بتتهيج"},
  {key:"normal",emoji:"🌿",label:"عادية",hint:"متوازنة – مشاكل بسيطة"},
];
const CONCERNS_LIST = [
  {key:"brightening",emoji:"✨",label:"تفتيح وإشراق"},
  {key:"acne",emoji:"🫧",label:"حب الشباب"},
  {key:"aging",emoji:"⏳",label:"شيخوخة وتجاعيد"},
  {key:"hydration",emoji:"💧",label:"ترطيب عميق"},
  {key:"sensitivity",emoji:"🌹",label:"حساسية واحمرار"},
  {key:"pores",emoji:"🔬",label:"مسامات واسعة"},
  {key:"darkcircles",emoji:"👁️",label:"هالات العيون"},
  {key:"darkspots",emoji:"🌑",label:"آثار حب الشباب"},
];
const BUDGETS = [
  {key:"budget",icon:"💸",price:"أقل من 600 ج",desc:"فعال بأقل تكلفة"},
  {key:"mid",icon:"💛",price:"600 – 1500 ج",desc:"توازن مثالي"},
  {key:"premium",icon:"💜",price:"1500+ ج",desc:"أفضل نتيجة"},
];

const getP = (id, productsList) => productsList.find(p=>p.id===id);
const budgetNames = {budget:"💸 Budget",mid:"💛 Mid-Range",premium:"💜 Premium"};
const skinLabels  = {dry:"جافة",oily:"دهنية",combo:"مختلطة",sensitive:"حساسة",normal:"عادية"};
const skinEmojis  = {dry:"💧",oily:"✨",combo:"⚖️",sensitive:"🌸",normal:"🌿"};

// حدود السعر الكلي للروتين — المجموع مش كل منتج
const BUDGET_MAX_TOTAL = { budget: 600, mid: 1500, premium: 99999 };

// ── Smart Ranking — حساب الـ final_score لكل منتج ──
// final_score = (boost × 0.5) + (reviews_score × 0.3) + (appearance × 0.2)
function calcFinalScore(product, reviewsMap) {
  const boost        = (product.boost_score || 0);
  const appearance   = Math.min(product.appearance_count || 0, 100) / 10.0;
  const reviewData   = reviewsMap[product.id] || {};
  const reviewsScore = reviewData.reviews_score || 0;
  return (boost * 0.5) + (reviewsScore * 0.3) + (appearance * 0.2);
}

// بيبني الخطوات من curated_routines مع Smart Ranking + Budget Total Guard
function buildRoutineStepsFromDB(dbRoutine, productsList, reviewsMap={}) {
  if(!dbRoutine) return [];
  const steps = typeof dbRoutine.steps === "string" ? JSON.parse(dbRoutine.steps) : dbRoutine.steps;
  const maxTotal = BUDGET_MAX_TOTAL[dbRoutine.budget] || 99999;
  const numSteps = steps.length || 1;
  // الحد الأقصى لكل منتج = إجمالي الـ budget ÷ عدد المنتجات
  const maxPerProduct = Math.floor(maxTotal / numSteps);

  return steps.map(s=>{
    const base = getP(s.product_id, productsList);
    if(!base) return null;
    // جيب كل المنتجات نفس الـ type اللي سعرها ≤ حصتها من الـ budget
    const sameType = productsList.filter(p =>
      p.type === base.type && (p.price || 0) <= maxPerProduct
    );
    // لو مفيش بديل في الـ range — خد الأرخص من نفس الـ type
    const pool = sameType.length > 0
      ? sameType
      : productsList.filter(p => p.type === base.type).sort((a,b) => (a.price||0) - (b.price||0));
    // رتّبهم بالـ final_score
    const ranked = (pool.length > 0 ? pool : [base])
      .sort((a,b) => calcFinalScore(b, reviewsMap) - calcFinalScore(a, reviewsMap));
    return { label:s.label, product: ranked[0] };
  }).filter(Boolean);
}

// بيزود appearance_count بعد ما الروتين يتعرض
async function incrementAppearance(productIds, supabaseClient) {
  if(!productIds || productIds.length === 0) return;
  for(const id of productIds) {
    await supabaseClient.rpc("increment_appearance", { product_id_input: id })
      .catch(()=>{});
  }
}

const DEFAULT_COLORS = {primary:"#c9a96e",background:"#0a0a0a",text:"#f5f0eb",accent:"#1a1a2e"};

export default function App() {
  const [user, setUser]         = useState(null);
  const [viewHistory, setViewHistory] = useState([]); // stack للـ navigation history
  // استعادة الـ view من sessionStorage لو عمل refresh
  const [view, setViewRaw] = useState(()=>{
    try { return sessionStorage.getItem("sm_view") || "home"; } catch{ return "home"; }
  });
  const [quizStep, setQuizStep] = useState(()=>{
    try { return parseInt(sessionStorage.getItem("sm_quizStep")||"0"); } catch{ return 0; }
  });

  // setView الجديدة — بتحفظ في history وفي sessionStorage
  const setView = (newView, options={}) => {
    if(!options.replace) {
      setViewHistory(prev => [...prev, view]); // حفظ الـ view الحالي في الـ stack
    }
    setViewRaw(newView);
    try { sessionStorage.setItem("sm_view", newView); } catch{}
  };

  // رجوع للصفحة اللي قبلها
  const goBack = () => {
    setViewHistory(prev => {
      if(prev.length === 0){ setViewRaw("home"); return []; }
      const last = prev[prev.length - 1];
      setViewRaw(last);
      try { sessionStorage.setItem("sm_view", last); } catch{}
      return prev.slice(0, -1);
    });
  };

  // زرار الرجوع الذكي — يرجع للكويز لو كان فيه
  const handleBack = (currentView) => {
    if(currentView === "quiz" && quizStep > 0){
      setQuizStep(s => { const ns = s-1; try{sessionStorage.setItem("sm_quizStep",ns)}catch{}; return ns; });
      return;
    }
    if(viewHistory.length > 0){ goBack(); return; }
    setView("home", {replace:true});
  };
  const [answers, setAnswers]   = useState({skin:null,concerns:[],budget:null});
  const [selectedTypes, setSelectedTypes] = useState([]); // الكاتيجوريز اللي اختارتها
  // Smart Quiz state
  const [quizAnswers, setQuizAnswers] = useState({}); // {q0:val, q1:val, ...}
  const [currentRoutine, setCurrentRoutine] = useState(null); // "none"|"cleanser_only"|"full"|"full_no_result"
  const [currentProducts, setCurrentProducts] = useState(""); // نص حر
  const [routine, setRoutine]   = useState(null);
  const [savedRoutines, setSaved] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [authModal, setAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({name:"",age:"",phone:"",email:"",password:""});
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [selectedSaved, setSelectedSaved] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [productNotes, setProductNotes] = useState({});
  const [reviewForm, setReviewForm] = useState({rating:5, text:""});
  const [reviewSent, setReviewSent] = useState(false);
  const [compareList, setCompareList] = useState([]); // max 2 products
  const [compareMode, setCompareMode] = useState(false);
  const [authErr, setAuthErr]   = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [toast, setToast]       = useState("");
  const [siteColors, setSiteColors] = useState(DEFAULT_COLORS);
  const [curatedRoutines, setCuratedRoutines] = useState([]);
  const [dbProducts, setDbProducts] = useState(PRODUCTS);
  const [reviewsMap, setReviewsMap] = useState({}); // { product_id: { avg_rating, reviews_score } }
  const [lang, setLang] = useState("ar"); // "ar" | "en"
  const [consultations, setConsultations] = useState([]);
  const [consultForm, setConsultForm] = useState({question:"", skin_type:"", concerns:""});
  const [consultMsg, setConsultMsg] = useState("");
  const [consultLoading, setConsultLoading] = useState(false);
  const [myConsultations, setMyConsultations] = useState([]);
  const [hasNewReply, setHasNewReply] = useState(false);
  const [saleProducts, setSaleProducts] = useState([]);

  const ADMIN_EMAIL = "sara.amin.nassar@gmail.com";

  // ── TRANSLATIONS ──
  const T = {
    ar: {
      brand: "SkinMatch",
      tagline: "روتين البشرة المثالي ليكِ",
      heroSub: "أدخلي نوع بشرتك وميزانيتك — وهنختار ليكِ أفضل المنتجات المتاحة في مصر مع روابط الشراء",
      quiz: "اكتشفي نوع بشرتك",
      browse: "عارفة بشرتك؟ اختاري مباشرة",
      concern: "روتين حسب مشكلتك",
      consult: "استشارة",
      sales: "العروض",
      myRoutines: "روتيناتي",
      login: "دخول",
      signup: "تسجيل مجاني",
      logout: "خروج",
      products: "منتج موثق",
      brands: "براند",
      routines: "روتين جاهز",
      local: "مصري أو متاح بمصر",
      back: "← رجوع",
      save: "حفظ الروتين",
      salesPage: "العروض الحالية",
      salesSub: "منتجات مختارة بخصومات وعروض مميزة",
      noSales: "مفيش عروض دلوقتي — تابعينا",
      consultPage: "استشارة الدكتورة",
      consultSub: "اسألي طبيبة الجلد المتخصصة — رد خلال 24-48 ساعة",
      consultPremium: "خدمة مدفوعة",
      consultPremiumSub: "كل استشارة بتتحفظ في بروفايلك وبتفضل سرية",
      consultQ: "سؤالك أو مشكلتك",
      consultQPlaceholder: "اكتبي سؤالك بالتفصيل — مثال: عندي حبوب من شهرين وجربت منتجات كتير...",
      consultSkin: "نوع بشرتك",
      consultConcerns: "مشاكلك الحالية",
      consultConcernsPlaceholder: "حبوب، جفاف، هالات...",
      consultPayNote: "الاستشارة مدفوعة — هتوصلك كود دفع من الأدمن على إيميلك",
      consultSend: "إرسال الاستشارة",
      consultSent: "وصلت! هيوصلك كود الدفع على إيميلك خلال ساعات",
      consultHistory: "استشاراتي السابقة",
      consultPending: "في الانتظار",
      consultAnswered: "تم الرد",
      consultLoginNote: "سجلي دخول عشان تقدري ترسلي استشارة",
      skinType: "نوع البشرة",
      browseSkinTitle: "اختاري نوع بشرتك",
      browseSkinSub: "عارفة بشرتك؟ اختاري مباشرة وهنديكِ الروتين",
      browseBudgetTitle: "الميزانية؟",
      concernTitle: "إيه مشكلتك الأساسية؟",
      concernSub: "روتين مخصص لكل كونسيرن",
      budgetTitle: "ميزانيتك؟",
      resultBadge: "روتينك المخصص",
      resultTotal: "إجمالي تكلفة الروتين",
      resultTotalNote: "تُجدد كل 2–3 أشهر تقريباً",
      saveRoutineBtn: "احفظي الروتين",
      restartBtn: "ابدأي من جديد",
      tryConcern: "جربي كونسيرن تاني",
      changeChoice: "غيري الاختيار",
      buyBtn: "اشتري",
      buyNow: "اشتري دلوقتي",
      comingSoon: "قريباً",
      savedTitle: "روتيناتي المحفوظة",
      savedCount: "روتين محفوظ",
      savedEmpty: "لسه مفيش روتينات محفوظة!",
      startQuiz: "ابدأي Quiz",
      savedTotal: "إجمالي",
      savedBack: "الروتينات",
      home: "الرئيسية",
      productDetails: "تفاصيل المنتجات مش متاحة",
      doctorNotes: "ملاحظات الطبيبة",
      totalLabel: "الإجمالي",
      aboutProduct: "عن المنتج",
      ingredients: "المكونات الأساسية",
      reviewsTitle: "آراء البنات",
      noReviews: "لسه مفيش ريفيوز — كوني أول واحدة!",
      writeReview: "اكتبي رأيك",
      loginToReview: "سجلي دخول عشان تكتبي ريفيو",
      reviewPlaceholder: "شاركي تجربتك مع المنتج ده...",
      sendReview: "إرسال الريفيو",
      reviewSent: "شكراً! ريفيوك اتبعت وهيظهر بعد المراجعة",
      saleTag: "عرض",
      saleTagDefault: "عرض خاص",
      forgotTitle: "نسيتِ الباسورد؟",
      forgotSub: "هنبعتلك رابط على إيميلك تغيري منه الباسورد",
      forgotEmailLabel: "الإيميل",
      forgotSend: "إرسال الرابط",
      forgotBack: "رجوع لتسجيل الدخول",
      forgotErrEmail: "اكتبي إيميلك الأول",
      forgotErrGeneral: "في مشكلة — تأكدي من الإيميل",
      forgotSuccess: "✅ تم إرسال رابط تغيير الباسورد على إيميلك!",
      signupTitle: "تسجيل حساب جديد",
      loginTitle: "أهلاً بيكِ مجدداً",
      loginBtn: "دخول",
      signupSub: "سجلي عشان تحفظي روتينك وترجعيله",
      loginSub: "ادخلي إيميلك وباسورد",
      nameLabel: "الاسم",
      namePlaceholder: "اسمك",
      ageLabel: "السن (اختياري)",
      agePlaceholder: "مثال: 25",
      phoneLabel: "رقم الموبايل (اختياري)",
      emailLabel: "الإيميل",
      passLabel: "الباسورد",
      passPlaceholder: "6 حروف على الأقل",
      signupBtn: "سجلي الآن",
      loading: "جاري...",
      forgotPassLink: "نسيتِ الباسورد؟",
      haveAccount: "عندك حساب؟",
      noAccount: "مفيش حساب؟",
      signupFree: "سجلي مجاناً",
      toastSignup: "✅ تم التسجيل! أهلاً بيكِ",
      toastLogin: "✅ أهلاً بيكِ مجدداً",
      toastLogout: "تم تسجيل الخروج",
      toastSaved: "✅ تم حفظ الروتين!",
      toastSaveErr: "❌ في مشكلة في الحفظ",
      consultErr: "اكتبي سؤالك الأول",
      consultErrGeneral: "في مشكلة — حاولي تاني",
      footerText: "جميع الأسعار تقريبية ومحدثة من المواقع الرسمية",
      quizNext: "التالي ←",
      quizSeeRoutine: "شوفي روتينك",
      quizQuestion: "سؤال",
      quizOf: "من",
      concernsStep: "إيه أهم مشاكلك؟",
      concernsHint: "اختاري أكتر من واحدة",
      budgetStep: "ميزانيتك الشهرية للسكين كير؟",
      currentProductsLabel: "اكتبي المنتجات اللي بتستخدميها (اختياري)",
      currentProductsPlaceholder: "مثال: غسول SESH، مرطب Neutrogena...",
      anonymous: "مجهول",
      reviewLoginBtn: "دخولي عشان تكتبي ريفيو",
      currency: "ج",
    },
    en: {
      brand: "SkinMatch",
      tagline: "Your Perfect Skincare Routine",
      heroSub: "Enter your skin type and budget — we'll pick the best products available in Egypt with direct purchase links",
      quiz: "Discover Your Skin Type",
      browse: "Know Your Skin? Choose Directly",
      concern: "Routine By Concern",
      consult: "Consultation",
      sales: "Deals",
      myRoutines: "My Routines",
      login: "Login",
      signup: "Free Sign Up",
      logout: "Logout",
      products: "Verified Products",
      brands: "Brands",
      routines: "Ready Routines",
      local: "Egyptian or Available in Egypt",
      back: "← Back",
      save: "Save Routine",
      salesPage: "Current Deals",
      salesSub: "Selected products with special discounts and offers",
      noSales: "No deals right now — stay tuned",
      consultPage: "Dermatologist Consultation",
      consultSub: "Ask our specialist dermatologist — reply within 24-48 hours",
      consultPremium: "Premium Service",
      consultPremiumSub: "Every consultation is saved in your profile and stays private",
      consultQ: "Your Question or Problem",
      consultQPlaceholder: "Describe your question in detail — e.g. I've had breakouts for 2 months and tried many products...",
      consultSkin: "Your Skin Type",
      consultConcerns: "Current Concerns",
      consultConcernsPlaceholder: "Acne, dryness, dark circles...",
      consultPayNote: "This is a paid service — you'll receive a payment code from admin via email",
      consultSend: "Send Consultation",
      consultSent: "Received! You'll get a payment code via email within hours",
      consultHistory: "My Previous Consultations",
      consultPending: "Pending",
      consultAnswered: "Answered",
      consultLoginNote: "Login to send a consultation",
      skinType: "Skin Type",
      browseSkinTitle: "Choose Your Skin Type",
      browseSkinSub: "Know your skin? Choose directly and we'll give you the routine",
      browseBudgetTitle: "Budget?",
      concernTitle: "What's Your Main Concern?",
      concernSub: "A tailored routine for every concern",
      budgetTitle: "Your Budget?",
      resultBadge: "Your Custom Routine",
      resultTotal: "Total Routine Cost",
      resultTotalNote: "Renewed every 2–3 months approximately",
      saveRoutineBtn: "Save Routine",
      restartBtn: "Start Over",
      tryConcern: "Try Another Concern",
      changeChoice: "Change Selection",
      buyBtn: "Buy",
      buyNow: "Buy Now",
      comingSoon: "Coming Soon",
      savedTitle: "My Saved Routines",
      savedCount: "saved routines",
      savedEmpty: "No saved routines yet!",
      startQuiz: "Start Quiz",
      savedTotal: "Total",
      savedBack: "Routines",
      home: "Home",
      productDetails: "Product details not available",
      doctorNotes: "Doctor's Notes",
      totalLabel: "Total",
      aboutProduct: "About This Product",
      ingredients: "Key Ingredients",
      reviewsTitle: "Reviews",
      noReviews: "No reviews yet — be the first!",
      writeReview: "Write Your Review",
      loginToReview: "Login to write a review",
      reviewPlaceholder: "Share your experience with this product...",
      sendReview: "Send Review",
      reviewSent: "Thank you! Your review was submitted and will appear after moderation",
      saleTag: "Sale",
      saleTagDefault: "Special Offer",
      forgotTitle: "Forgot Password?",
      forgotSub: "We'll send you a reset link to your email",
      forgotEmailLabel: "Email",
      forgotSend: "Send Link",
      forgotBack: "Back to Login",
      forgotErrEmail: "Please enter your email first",
      forgotErrGeneral: "Something went wrong — check your email",
      forgotSuccess: "✅ Password reset link sent to your email!",
      signupTitle: "Create New Account",
      loginTitle: "Welcome Back",
      loginBtn: "Login",
      signupSub: "Sign up to save your routine and come back to it",
      loginSub: "Enter your email and password",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      ageLabel: "Age (optional)",
      agePlaceholder: "e.g. 25",
      phoneLabel: "Phone (optional)",
      emailLabel: "Email",
      passLabel: "Password",
      passPlaceholder: "At least 6 characters",
      signupBtn: "Sign Up",
      loading: "Loading...",
      forgotPassLink: "Forgot password?",
      haveAccount: "Have an account?",
      noAccount: "No account?",
      signupFree: "Sign up free",
      toastSignup: "✅ Registered! Welcome",
      toastLogin: "✅ Welcome back",
      toastLogout: "Logged out",
      toastSaved: "✅ Routine saved!",
      toastSaveErr: "❌ Error saving",
      consultErr: "Please write your question first",
      consultErrGeneral: "Something went wrong — try again",
      footerText: "All prices are approximate and updated from official websites",
      quizNext: "Next →",
      quizSeeRoutine: "See My Routine",
      quizQuestion: "Question",
      quizOf: "of",
      concernsStep: "What are your main concerns?",
      concernsHint: "Choose one or more",
      budgetStep: "What is your monthly skincare budget?",
      currentProductsLabel: "List products you currently use (optional)",
      currentProductsPlaceholder: "e.g. SESH cleanser, Neutrogena moisturizer...",
      anonymous: "Anonymous",
      reviewLoginBtn: "Login to write a review",
      currency: "EGP",
    }
  };
  const t = T[lang];

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  // ── LOAD COLORS + ROUTINES + PRODUCTS FROM SUPABASE ──
  useEffect(()=>{
    const loadSiteData = async()=>{
      // ألوان
      const {data:settings} = await supabase.from("settings").select("*");
      if(settings && settings.length > 0){
        const c = {...DEFAULT_COLORS};
        settings.forEach(s => { if(c.hasOwnProperty(s.key)) c[s.key] = s.value; });
        setSiteColors(c);
      }
      // منتجات من Supabase
      const {data:prods} = await supabase.from("products").select("*");
      if(prods && prods.length > 0){
        setDbProducts(prods);
        setSaleProducts(prods.filter(p=>p.on_sale));
      }
      // روتينات
      const {data:routines} = await supabase.from("curated_routines").select("*");
      if(routines && routines.length > 0) setCuratedRoutines(routines);
      // reviews scores — جيب متوسط التقييم لكل منتج (approved فقط)
      const {data:reviewScores} = await supabase
        .from("reviews")
        .select("product_id, rating")
        .eq("status", "approved");
      if(reviewScores && reviewScores.length > 0){
        // اجمع الـ scores لكل منتج
        const map = {};
        reviewScores.forEach(r=>{
          if(!map[r.product_id]) map[r.product_id] = { total:0, count:0 };
          map[r.product_id].total += r.rating;
          map[r.product_id].count += 1;
        });
        // احسب المتوسط والـ reviews_score (0-10)
        Object.keys(map).forEach(pid=>{
          const avg = map[pid].total / map[pid].count;
          map[pid].avg_rating    = Math.round(avg * 100) / 100;
          map[pid].reviews_score = Math.round((avg / 5) * 10 * 100) / 100;
        });
        setReviewsMap(map);
      }
    };
    loadSiteData();
  },[]);

  // ── CHECK SESSION ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setUser(session?.user ?? null); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{ setUser(session?.user ?? null); });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(user){ loadSaved(); loadMyConsultations(); } },[user]);

  const loadMyConsultations = async()=>{
    if(!user) return;
    const {data} = await supabase.from("consultations").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(data){
      setMyConsultations(data);
      setHasNewReply(data.some(c=>c.status==="answered" && c.doctor_reply));
    }
  };

  const submitConsultation = async()=>{
    if(!user){ setAuthModal("login"); return; }
    if(!consultForm.question.trim()){ setConsultMsg(t.consultErr); return; }
    setConsultLoading(true);
    const {error} = await supabase.from("consultations").insert({
      user_id: user.id,
      user_name: user.user_metadata?.name || user.email.split("@")[0],
      user_email: user.email,
      question: consultForm.question.trim(),
      skin_type: consultForm.skin_type,
      concerns: consultForm.concerns,
      status: "pending",
      is_paid: false,
    });
    setConsultLoading(false);
    if(error){ setConsultMsg(t.consultErrGeneral); return; }
    setConsultMsg("sent");
    setConsultForm({question:"", skin_type:"", concerns:""});
    loadMyConsultations();
  };

  const loadSaved = async()=>{
    const {data} = await supabase.from("routines").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(data) setSaved(data);
  };

  const loadAllUsers = async()=>{
    const {data} = await supabase.from("profiles").select("*").order("created_at",{ascending:false});
    if(data) setAllUsers(data);
  };

  const handleSignup = async()=>{
    setAuthLoading(true); setAuthErr("");
    const {data, error} = await supabase.auth.signUp({email:authForm.email,password:authForm.password,options:{data:{name:authForm.name,age:authForm.age}}});
    if(error){ setAuthErr(error.message); setAuthLoading(false); return; }
    if(data?.user){
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: authForm.email,
        name: authForm.name,
        age: authForm.age||null,
        phone: authForm.phone||null
      }, {onConflict:"id"});
    }
    setAuthModal(null); showToast(t.toastSignup); setAuthLoading(false);
  };

  const handleForgotPassword = async()=>{
    if(!forgotEmail){ setForgotMsg(t.forgotErrEmail); return; }
    const {error} = await supabase.auth.resetPasswordForEmail(forgotEmail, {redirectTo: window.location.origin});
    if(error){ setForgotMsg(t.forgotErrGeneral); return; }
    setForgotMsg(t.forgotSuccess);
  };

  const handleLogin = async()=>{
    setAuthLoading(true); setAuthErr("");
    const {error} = await supabase.auth.signInWithPassword({email:authForm.email,password:authForm.password});
    if(error){ setAuthErr(error.message); setAuthLoading(false); return; }
    setAuthModal(null); showToast(t.toastLogin); setAuthLoading(false);
  };

  const handleLogout = async()=>{
    await supabase.auth.signOut();
    setUser(null);
    setSaved([]);
    setViewHistory([]);
    setViewRaw("home");
    setRoutine(null);
    setSelectedTypes([]);
    setAnswers({skin:null,concerns:[],budget:null});
    setQuizStep(0);
    setQuizAnswers({});
    try{ sessionStorage.setItem("sm_view","home"); sessionStorage.setItem("sm_quizStep","0"); }catch{}
    showToast(t.toastLogout);
  };

  const saveRoutine = async()=>{
    if(!user){ setAuthModal("signup"); return; }
    const title = routine.skin ? `روتين ${skinLabels[routine.skin]} ${skinEmojis[routine.skin]}` : `روتين ${CONCERNS_LIST.find(c=>c.key===routine.concern)?.label}`;
    const {error} = await supabase.from("routines").insert({user_id:user.id,title,skin_type:routine.skin||null,concern:routine.concern||null,budget:routine.budget,steps_json:JSON.stringify(routine.steps.map(s=>s.product.id)),total_price:routine.total});
    if(error){ showToast(t.toastSaveErr); return; }
    showToast(t.toastSaved); loadSaved();
  };

  const toggleConcern = (key)=>{ setAnswers(a=>({...a,concerns:a.concerns.includes(key)?a.concerns.filter(c=>c!==key):[...a.concerns,key]})); };

  // ── SMART QUIZ LOGIC ──
  const SMART_QUIZ = [
    {
      id:"q0", q:"بعد ما تغسلي وشك وما تحطيش أي كريم — بشرتك بتحسيها إزاي بعد نص ساعة؟",
      opts:[
        {label:"مشدودة / فيها قشور",      scores:{dry:3, sensitive:1}},
        {label:"عادية / مريحة",            scores:{normal:3}},
        {label:"لمعان خفيف",               scores:{oily:1, combo:2}},
        {label:"لمعان واضح في كل الوجه",   scores:{oily:3}},
      ]
    },
    {
      id:"q1", q:"بشرتك بتلمع أو بتفرز دهون في منطقة الأنف والجبهة خلال اليوم؟",
      opts:[
        {label:"كتير جداً",               scores:{oily:3}},
        {label:"أحياناً",                 scores:{combo:2, oily:1}},
        {label:"نادراً / مش بتلاحظي",     scores:{dry:2, normal:1}},
      ]
    },
    {
      id:"q2", q:"هل بتحسي إن بشرتك بتتهيج أو بتحمر بسهولة من منتجات أو عطور أو الشمس؟",
      opts:[
        {label:"آه كتير",                 scores:{sensitive:3}},
        {label:"أحياناً",                 scores:{sensitive:2}},
        {label:"نادراً / مش بتلاحظي",     scores:{oily:1, normal:1}},
      ]
    },
    {
      id:"q3", q:"هل بتلاحظي إن بعض مناطق وشك دهنية (أنف / جبهة) وأماكن تانية جافة (خدود)؟",
      opts:[
        {label:"آه بالظبط",               scores:{combo:3}},
        {label:"شوية بس مش واضح",         scores:{combo:1}},
        {label:"لأ، كلها زي بعض",          scores:{normal:1, dry:1, oily:1}},
      ]
    },
    {
      id:"q4", q:"هل بيظهر عندك حبوب أو رؤوس سوداء خصوصاً في منطقة الـ T-Zone؟",
      opts:[
        {label:"كتير",                    scores:{oily:2, combo:1}},
        {label:"أحياناً",                 scores:{combo:1, oily:1}},
        {label:"نادراً",                  scores:{dry:1, normal:1, sensitive:1}},
      ]
    },
    {
      id:"q5", q:"المكياج بيثبت على بشرتك بسهولة ولا بيسيح بسرعة؟",
      opts:[
        {label:"بيسيح بسرعة جداً",        scores:{oily:2}},
        {label:"بيثبت معقول",             scores:{normal:1, combo:1}},
        {label:"بيبقى جاف وبيتكسر",       scores:{dry:2}},
        {label:"مش بستخدم مكياج",         scores:{}},
      ]
    },
    {
      id:"q6", q:"روتينك الحالي إيه؟",
      isRoutineQ: true,
      opts:[
        {label:"مفيش روتين خالص",                    val:"none"},
        {label:"بستخدم غسول بس",                     val:"cleanser_only"},
        {label:"عندي روتين بس مش شايفة نتيجة",       val:"full_no_result"},
        {label:"عندي روتين كامل وعايزة أحسنه",        val:"full"},
      ]
    },
  ];

  const detectSkinType = (qAnswers)=>{
    const scores = {dry:0, oily:0, combo:0, sensitive:0, normal:0};
    SMART_QUIZ.slice(0,6).forEach(q=>{
      const ans = qAnswers[q.id];
      if(ans !== undefined){
        const opt = q.opts[ans];
        if(opt?.scores) Object.entries(opt.scores).forEach(([k,v])=>{ scores[k]=(scores[k]||0)+v; });
      }
    });
    return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  };

  const TOTAL_QUIZ_STEPS = SMART_QUIZ.length + 2; // +2 for concerns + budget
  const canNextSmart = ()=>{
    if(quizStep < SMART_QUIZ.length) return quizAnswers[SMART_QUIZ[quizStep]?.id] !== undefined;
    if(quizStep === SMART_QUIZ.length) return answers.concerns.length > 0;
    if(quizStep === SMART_QUIZ.length + 1) return !!answers.budget;
    return false;
  };
  const handleSmartQuizNext = ()=>{
    if(quizStep < SMART_QUIZ.length - 1){ setQuizStep(s=>s+1); return; }
    if(quizStep === SMART_QUIZ.length - 1){ setQuizStep(s=>s+1); return; } // concerns
    if(quizStep === SMART_QUIZ.length){ setQuizStep(s=>s+1); return; } // budget
    if(quizStep === SMART_QUIZ.length + 1){
      const skin = detectSkinType(quizAnswers);
      setAnswers(a=>({...a, skin}));
      setSelectedTypes([]);
      setView("select-types");
    }
  };

  // canNext removed — canNextSmart() is the active implementation
  const buildSkinRoutine = (skin,budget)=>{
    const r = curatedRoutines.find(x=>x.mode==="skin"&&x.category===skin&&x.budget===budget);
    if(!r) return null;
    let steps = buildRoutineStepsFromDB(r, dbProducts, reviewsMap);
    const maxTotal = BUDGET_MAX_TOTAL[budget] || 99999;
    // لو المجموع بيعدي الـ budget — شيل المنتج الأغلى لحد ما يبقى في الحدود
    let total = steps.reduce((sum,s) => sum + (s.product.price||0), 0);
    if(total > maxTotal){
      steps = steps.sort((a,b) => (b.product.price||0) - (a.product.price||0));
      while(total > maxTotal && steps.length > 1){
        const removed = steps.shift();
        total -= (removed.product.price||0);
      }
    }
    incrementAppearance(steps.map(s=>s.product.id), supabase);
    return {steps, total, skin, budget};
  };
  const buildConcernRoutine = (concern,budget)=>{
    const r = curatedRoutines.find(x=>x.mode==="concern"&&x.category===concern&&x.budget===budget);
    if(!r) return null;
    let steps = buildRoutineStepsFromDB(r, dbProducts, reviewsMap);
    const maxTotal = BUDGET_MAX_TOTAL[budget] || 99999;
    let total = steps.reduce((sum,s) => sum + (s.product.price||0), 0);
    if(total > maxTotal){
      steps = steps.sort((a,b) => (b.product.price||0) - (a.product.price||0));
      while(total > maxTotal && steps.length > 1){
        const removed = steps.shift();
        total -= (removed.product.price||0);
      }
    }
    incrementAppearance(steps.map(s=>s.product.id), supabase);
    return {steps, total, concern, budget};
  };

  // ── Dynamic Routine Builder — بيبني الروتين من الكاتيجوريز اللي اختارتها البنت ──
  const buildDynamicRoutine = (types, skin, budget, concern=null)=>{
    const maxTotal = BUDGET_MAX_TOTAL[budget] || 99999;
    let steps = types.map(type=>{
      const skinMatched = dbProducts.filter(p=>{
        if(p.type !== type) return false;
        if(skin && p.skin && Array.isArray(p.skin) && p.skin.length > 0){
          return p.skin.includes(skin) || p.skin.includes("all");
        }
        return true;
      });
      const pool = skinMatched.length > 0
        ? skinMatched
        : dbProducts.filter(p=>p.type===type);
      if(pool.length === 0) return null;
      const ranked = [...pool].sort((a,b)=>calcFinalScore(b,reviewsMap)-calcFinalScore(a,reviewsMap));
      // حفظ الـ typeKey عشان Budget Guard يقدر يدور على بديل بالـ type مش بالـ label
      return { label: TYPE_LABELS_APP[type]||type, typeKey: type, product: ranked[0] };
    }).filter(Boolean);

    // Budget Guard — استبدل الأغلى بأرخص بديل لو المجموع عدى الـ budget
    let total = steps.reduce((sum,s)=>sum+(s.product.price||0),0);
    let iterations = 0;
    while(total > maxTotal && iterations < 20){
      iterations++;
      let maxIdx = 0;
      steps.forEach((s,i)=>{ if((s.product.price||0) > (steps[maxIdx].product.price||0)) maxIdx=i; });
      const expensiveTypeKey = steps[maxIdx].typeKey;  // استخدم الـ key مش الـ label
      const expensivePrice   = steps[maxIdx].product.price||0;
      const cheaper = dbProducts.filter(p=>
        p.type === expensiveTypeKey &&          // مقارنة بالـ type key — مش الـ label
        (p.price||0) < expensivePrice
      ).sort((a,b)=>(b.price||0)-(a.price||0));
      if(cheaper.length > 0){
        steps[maxIdx] = { label: steps[maxIdx].label, typeKey: expensiveTypeKey, product: cheaper[0] };
      } else {
        steps.splice(maxIdx,1);
      }
      total = steps.reduce((sum,s)=>sum+(s.product.price||0),0);
    }
    incrementAppearance(steps.map(s=>s.product.id), supabase);
    return { steps, total, skin, budget, concern, mode: concern?"concern":"skin" };
  };
  // handleQuizNext removed — quiz uses inline next handler with select-types flow
  const resetAll = ()=>{
    setViewRaw("home");
    setViewHistory([]);
    setQuizStep(0);
    setAnswers({skin:null,concerns:[],budget:null});
    setSelectedTypes([]);
    setRoutine(null);
    setQuizAnswers({});
    try{ sessionStorage.setItem("sm_view","home"); sessionStorage.setItem("sm_quizStep","0"); }catch{}
  };

  const openProduct = async(product)=>{
    setSelectedProduct(product);
    setView("product");
    setReviewSent(false);
    setReviewForm({rating:5, text:""});
    // جيب الريفيوز المعتمدة
    const {data:revs} = await supabase.from("reviews").select("*").eq("product_id", product.id).eq("status","approved").order("created_at",{ascending:false});
    setProductReviews(revs||[]);
    // جيب ملاحظات الدكتورة من curated_routines
    const {data:notes} = await supabase.from("product_notes").select("*").eq("product_id", product.id).single();
    setProductNotes(notes||{});
  };

  const submitReview = async()=>{
    if(!user){ setAuthModal("signup"); return; }
    if(!reviewForm.text.trim() || reviewForm.text.trim().length < 5){ return; }
    const {error} = await supabase.from("reviews").insert({
      product_id: selectedProduct.id,
      user_id: user.id,
      user_name: user.user_metadata?.name || "مجهول",
      rating: reviewForm.rating,
      text: reviewForm.text.trim(),
      status: "pending"
    });
    if(error){ showToast(lang==="ar"?"في مشكلة — حاولي تاني":"Something went wrong, try again"); return; }
    setReviewSent(true);
    setReviewForm({rating:5, text:""});
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  // ── AUTH GATE — شاشة كاملة بالـ hero والـ stats ──
  if(!user) return (
    <>
      <GlobalStyle colors={siteColors} />
      <div className="app" dir={lang==="ar"?"rtl":"ltr"}>
        <nav className="nav">
          <div className="logo">Skin<span>Match</span></div>
          <div className="nav-right">
            <button className="lang-btn" onClick={()=>setLang(l=>l==="ar"?"en":"ar")}>{lang==="ar"?"EN":"عر"}</button>
            <button className="nav-tab" onClick={()=>{ setAuthForm({name:"",age:"",phone:"",email:"",password:""}); setAuthErr(""); setAuthModal("login"); }}>{t.login}</button>
            <button className="btn-gold" style={{padding:"8px 18px",fontSize:"13px"}} onClick={()=>{ setAuthForm({name:"",age:"",phone:"",email:"",password:""}); setAuthErr(""); setAuthModal("signup"); }}>{t.signup}</button>
          </div>
        </nav>
        <div className="fade-in">
          <div className="hero">
            <div className="hero-tag">Skincare Recommendation Tool</div>
            <h1>{lang==="ar"?<>روتين البشرة<br/><em>المثالي</em> ليكِ</>:<>Your Perfect<br/><em>Skincare</em> Routine</>}</h1>
            <p>{t.heroSub}</p>
            <div className="hero-btns">
              <button className="btn-gold" style={{padding:"14px 36px",fontSize:15}} onClick={()=>{ setAuthForm({name:"",age:"",phone:"",email:"",password:""}); setAuthErr(""); setAuthModal("signup"); }}>
                {lang==="ar"?"ابدأي مجاناً":"Get Started Free"}
              </button>
              <button className="btn-outline" style={{padding:"14px 36px",fontSize:15}} onClick={()=>{ setAuthForm({name:"",age:"",phone:"",email:"",password:""}); setAuthErr(""); setAuthModal("login"); }}>
                {lang==="ar"?"دخول":"Login"}
              </button>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat"><span className="stat-num">130+</span><div className="stat-lbl">{t.products}</div></div>
            <div className="stat"><span className="stat-num">29</span><div className="stat-lbl">{t.brands}</div></div>
            <div className="stat"><span className="stat-num">40+</span><div className="stat-lbl">{t.routines}</div></div>
            <div className="stat"><span className="stat-num">100%</span><div className="stat-lbl">{t.local}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,padding:"0 32px 64px",maxWidth:960,margin:"0 auto"}}>
            {[
              {icon:"🔍",ar:"كويز ذكي يحدد نوع بشرتك",en:"Smart quiz identifies your skin type"},
              {icon:"💄",ar:"روتين مخصص لبشرتك وميزانيتك",en:"Routine tailored to your skin & budget"},
              {icon:"🛒",ar:"روابط شراء مباشرة من مصر",en:"Direct purchase links from Egypt"},
              {icon:"👩‍⚕️",ar:"ملاحظات طبيبة جلدية على كل منتج",en:"Dermatologist notes on every product"},
            ].map((f,i)=>(
              <div key={i} style={{padding:"24px 20px",background:"rgba(201,169,110,0.04)",border:"1px solid rgba(201,169,110,0.1)",borderRadius:8,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:12}}>{f.icon}</div>
                <div style={{fontSize:14,color:"#c9a96e",lineHeight:1.6}}>{lang==="ar"?f.ar:f.en}</div>
              </div>
            ))}
          </div>
        </div>
        {authModal && (
          <div className="modal-overlay" onClick={()=>{ setAuthModal(null); setForgotMode(false); setForgotMsg(""); }}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              {forgotMode ? <>
                <div className="modal-title">{lang==="ar"?"استعادة الباسورد":"Reset Password"}</div>
                <div className="field"><label>{t.emailLabel}</label><input type="email" placeholder="email@example.com" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/></div>
                {forgotMsg && <div style={{fontSize:13,color:"#c9a96e",textAlign:"center",marginBottom:8}}>{forgotMsg}</div>}
                <button className="btn-gold" style={{width:"100%",marginTop:8}} onClick={handleForgotPassword}>
                  {lang==="ar"?"إرسال":"Send"}
                </button>
                <div className="auth-switch"><button onClick={()=>{ setForgotMode(false); setForgotMsg(""); }}>← {t.forgotBack}</button></div>
              </> : <>
                <div className="modal-title">{authModal==="signup"?t.signupTitle:t.loginTitle}</div>
                <div className="modal-sub">{authModal==="signup"?t.signupSub:t.loginSub}</div>
                {authErr && <div className="auth-err">{authErr}</div>}
                {authModal==="signup" && <>
                  <div className="field"><label>{t.nameLabel}</label><input placeholder={t.namePlaceholder} value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="field"><label>{t.ageLabel}</label><input placeholder={t.agePlaceholder} value={authForm.age||""} onChange={e=>setAuthForm(f=>({...f,age:e.target.value}))}/></div>
                  <div className="field"><label>{t.phoneLabel}</label><input type="tel" placeholder="01xxxxxxxxx" value={authForm.phone||""} onChange={e=>setAuthForm(f=>({...f,phone:e.target.value}))}/></div>
                </>}
                <div className="field"><label>{t.emailLabel}</label><input type="email" placeholder="email@example.com" value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))}/></div>
                <div className="field"><label>{t.passLabel}</label><input type="password" placeholder={t.passPlaceholder} value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))}/></div>
                <button className="btn-gold" style={{width:"100%",marginTop:8}} onClick={authModal==="signup"?handleSignup:handleLogin} disabled={authLoading}>
                  {authLoading?"...":(authModal==="signup"?t.signupBtn:t.loginBtn)}
                </button>
                {authModal==="login" && <div style={{textAlign:"center",marginTop:10}}><button style={{background:"none",border:"none",color:"#5a4a3a",cursor:"pointer",fontSize:12,textDecoration:"underline"}} onClick={()=>{ setForgotMode(true); setForgotEmail(authForm.email); }}>{t.forgotPassLink}</button></div>}
                <div className="auth-switch">{authModal==="signup"
                  ? <>{t.haveAccount} <button onClick={()=>{ setAuthErr(""); setAuthModal("login"); }}>{t.login}</button></>
                  : <>{t.noAccount} <button onClick={()=>{ setAuthErr(""); setAuthModal("signup"); }}>{t.signupFree}</button></>
                }</div>
              </>}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <GlobalStyle colors={siteColors} />
      <div className="app" dir={lang==="ar"?"rtl":"ltr"}>

        <nav className="nav">
          <div className="logo" onClick={resetAll}>Skin<span>Match</span></div>
          <div className="nav-right">
            <button className="lang-btn" onClick={()=>setLang(l=>l==="ar"?"en":"ar")}>{lang==="ar"?"EN":"عر"}</button>
            <button className="nav-tab" onClick={async()=>{ const {data} = await supabase.from("products").select("*").eq("on_sale",true); if(data) setSaleProducts(data); setView("sales"); }}>{t.sales}</button>
            {view==="home" && <>
              <button className={`nav-tab ${view==="quiz"?"active":""}`} onClick={()=>{setView("quiz");setQuizStep(0);}}>{lang==="ar"?"Quiz":"Quiz"}</button>
              <button className="nav-tab" onClick={()=>setView("concern")}>{lang==="ar"?"حسب المشكلة":"By Concern"}</button>
            </>}
            {user ? <>
              <button className="nav-tab" onClick={()=>setView("consultation")}>
                {t.consult}{hasNewReply && <span className="notif-dot"/>}
              </button>
              <button className="nav-tab" onClick={()=>{loadSaved();setView("saved");}}>{t.myRoutines}</button>
              {isAdmin && <button className="nav-tab" onClick={()=>setView("admin")}>⚙️ Admin</button>}
              <span className="nav-user">{user.user_metadata?.name || user.email.split("@")[0]}</span>
              <button className="nav-logout" onClick={handleLogout}>{t.logout}</button>
            </> : <>
              <button className="nav-tab" onClick={()=>{setAuthForm({name:"",age:"",email:"",password:""});setAuthModal("login");}}>{t.login}</button>
              <button className="btn-gold" style={{padding:"8px 18px",fontSize:"13px"}} onClick={()=>{setAuthForm({name:"",age:"",email:"",password:""});setAuthModal("signup");}}>{t.signup}</button>
            </>}
          </div>
        </nav>

        {view==="home" && <div className="fade-in">
          <div className="hero">
            <div className="hero-tag">Skincare Recommendation Tool</div>
            <h1>{lang==="ar"?<>روتين البشرة<br/><em>المثالي</em> ليكِ</>:<>Your Perfect<br/><em>Skincare</em> Routine</>}</h1>
            <p>{t.heroSub}</p>
            <div className="hero-btns">
              <button className="btn-gold" onClick={()=>{setView("quiz");setQuizStep(0);setQuizAnswers({});}}>{t.quiz}</button>
              <button className="btn-outline" onClick={()=>setView("browse")}>{t.browse}</button>
              <button className="btn-outline" onClick={()=>setView("concern")}>{t.concern}</button>
              <button className="btn-outline" onClick={()=>setView("consultation")}>{t.consult}</button>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat"><span className="stat-num">130+</span><div className="stat-lbl">{t.products}</div></div>
            <div className="stat"><span className="stat-num">29</span><div className="stat-lbl">{t.brands}</div></div>
            <div className="stat"><span className="stat-num">40+</span><div className="stat-lbl">{t.routines}</div></div>
            <div className="stat"><span className="stat-num">100%</span><div className="stat-lbl">{t.local}</div></div>
          </div>
        </div>}

        {/* ── SMART QUIZ ── */}
        {view==="quiz" && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("quiz")}>← {t.back}</button>
          <div className="progress-wrap">
            <div className="progress-label">{t.quizQuestion} {quizStep+1} {t.quizOf} {TOTAL_QUIZ_STEPS}</div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${((quizStep)/TOTAL_QUIZ_STEPS)*100}%`}}/></div>
          </div>

          {/* Smart quiz questions 0-6 */}
          {quizStep < SMART_QUIZ.length && (()=>{
            const q = SMART_QUIZ[quizStep];
            return <>
              <div className="step-q">{q.q}</div>
              {q.isRoutineQ && <div className="multi-hint">{lang==="ar"?"اختاري اللي يوصف وضعك دلوقتي":"Choose what describes your current situation"}</div>}
              <div className="opts-grid">
                {q.opts.map((opt,i)=>(
                  <div key={i}
                    className={`opt ${quizAnswers[q.id]===i?"on":""}`}
                    onClick={()=>setQuizAnswers(a=>({...a,[q.id]:i}))}>
                    <div className="opt-name" style={{fontSize:14}}>{opt.label}</div>
                  </div>
                ))}
              </div>
              {/* لو سؤال الروتين وعندها منتجات */}
              {q.isRoutineQ && quizAnswers[q.id] !== undefined && [1,2,3].includes(quizAnswers[q.id]) && <div className="field" style={{marginTop:16}}>
                <label style={{fontSize:12,color:"#5a4a3a",display:"block",marginBottom:8}}>{t.currentProductsLabel}</label>
                <textarea
                  placeholder={t.currentProductsPlaceholder}
                  value={currentProducts}
                  onChange={e=>setCurrentProducts(e.target.value)}
                  style={{width:"100%",padding:"12px 16px",background:"#0d0d0d",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#f5f0eb",fontSize:13,fontFamily:"DM Sans,sans-serif",outline:"none",resize:"vertical",minHeight:80,boxSizing:"border-box"}}
                />
              </div>}
            </>;
          })()}

          {/* Concerns step */}
          {quizStep === SMART_QUIZ.length && <>
            <div className="step-q">{t.concernsStep}</div>
            <div className="multi-hint">{t.concernsHint}</div>
            <div className="opts-grid">{CONCERNS_LIST.map(c=>(<div key={c.key} className={`opt ${answers.concerns.includes(c.key)?"on":""}`} onClick={()=>toggleConcern(c.key)}><span className="opt-emoji">{c.emoji}</span><div className="opt-name">{c.label}</div></div>))}</div>
          </>}

          {/* Budget step */}
          {quizStep === SMART_QUIZ.length + 1 && <>
            <div className="step-q">{t.budgetStep}</div>
            <div className="budget-grid">{BUDGETS.map(b=>(<div key={b.key} className={`bcard ${answers.budget===b.key?"on":""}`} onClick={()=>setAnswers(a=>({...a,budget:b.key}))}><div className="bcard-icon">{b.icon}</div><div className="bcard-price">{b.price}</div><div className="bcard-desc">{b.desc}</div></div>))}</div>
          </>}

          <div style={{textAlign:"center",marginTop:36}}>
            <button className="btn-gold" onClick={()=>{
              if(quizStep < SMART_QUIZ.length && quizAnswers[SMART_QUIZ[quizStep]?.id] === undefined) return;
              if(quizStep === SMART_QUIZ.length && answers.concerns.length===0) return;
              if(quizStep === SMART_QUIZ.length+1){
                if(!answers.budget) return;
                const skin = detectSkinType(quizAnswers);
                setAnswers(a=>({...a,skin}));
                setSelectedTypes([]);
                setView("select-types");
              } else { setQuizStep(s=>s+1); }
            }} disabled={
              (quizStep < SMART_QUIZ.length && quizAnswers[SMART_QUIZ[quizStep]?.id] === undefined) ||
              (quizStep === SMART_QUIZ.length && answers.concerns.length===0) ||
              (quizStep === SMART_QUIZ.length+1 && !answers.budget)
            }>
              {quizStep === SMART_QUIZ.length+1 ? t.quizSeeRoutine : t.quizNext}
            </button>
          </div>
        </div>}

        {/* ── BROWSE (عارفة بشرتك) ── */}
        {view==="browse" && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("browse")}>← {t.back}</button>
          <h2 className="section-title">{t.browseSkinTitle}</h2>
          <p className="section-sub">{t.browseSkinSub}</p>
          <div className="opts-grid" style={{marginBottom:32}}>
            {SKIN_TYPES.map(s=>(<div key={s.key} className={`opt ${answers.skin===s.key?"on":""}`} onClick={()=>setAnswers(a=>({...a,skin:s.key}))}><span className="opt-emoji">{s.emoji}</span><div className="opt-name">{s.label}</div><div className="opt-hint">{s.hint}</div></div>))}
          </div>
          {answers.skin && <>
            <h2 className="section-title" style={{marginTop:0}}>{t.browseBudgetTitle}</h2>
            <div className="budget-grid" style={{maxWidth:480,margin:"20px auto 0"}}>
              {BUDGETS.map(b=>{
                return (<div key={b.key} className="bcard" style={{cursor:"pointer"}} onClick={()=>{
                  setAnswers(a=>({...a,budget:b.key}));
                  setSelectedTypes([]);
                  setView("select-types");
                }}>
                  <div className="bcard-icon">{b.icon}</div>
                  <div className="bcard-price">{b.price}</div>
                  <div className="bcard-desc">{b.desc}</div>
                </div>);
              })}
            </div>
          </>}
        </div>}

        {view==="concern" && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("concern")}>← {t.back}</button>
          <h2 className="section-title">{t.concernTitle}</h2>
          <p className="section-sub">{t.concernSub}</p>
          <div className="concern-grid">{CONCERNS_LIST.map(c=>(<div key={c.key} className="ccard" onClick={()=>{setAnswers(a=>({...a,concerns:[c.key]}));setView("concern-budget");}}><span className="opt-emoji">{c.emoji}</span><div className="opt-name">{c.label}</div></div>))}</div>
        </div>}

        {view==="concern-budget" && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("concern-budget")}>← {t.back}</button>
          <h2 className="section-title">{t.budgetTitle}</h2>
          <div className="budget-grid" style={{maxWidth:480,margin:"36px auto"}}>{BUDGETS.map(b=>{
            return (<div key={b.key} className="bcard" style={{cursor:"pointer"}} onClick={()=>{
              setAnswers(a=>({...a,budget:b.key}));
              setSelectedTypes([]);
              setView("select-types");
            }}>
              <div className="bcard-icon">{b.icon}</div>
              <div className="bcard-price">{b.price}</div>
              <div className="bcard-desc">{b.desc}</div>
            </div>);
          })}</div>
        </div>}

        {/* ── SELECT TYPES — اختاري الكاتيجوريز ── */}
        {view==="select-types" && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("select-types")}>← {t.back}</button>
          <h2 className="section-title">{lang==="ar"?"إيه المنتجات اللي عايزاها في روتينك؟":"What products do you want in your routine?"}</h2>
          <p className="section-sub" style={{marginBottom:24}}>{lang==="ar"?"اختاري كاتيجوري أو أكتر وإحنا هنرشحلك الأفضل في ميزانيتك":"Choose one or more categories and we'll recommend the best for your budget"}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12,maxWidth:700,margin:"0 auto 32px"}}>
            {SELECTABLE_TYPES.map(t2=>{
              const isOn = selectedTypes.includes(t2.key);
              return (
                <div key={t2.key}
                  onClick={()=>setSelectedTypes(prev=>isOn?prev.filter(x=>x!==t2.key):[...prev,t2.key])}
                  style={{padding:"18px 12px",background:isOn?"rgba(201,169,110,0.12)":"rgba(255,255,255,0.02)",
                    border:`1px solid ${isOn?"rgba(201,169,110,0.6)":"rgba(255,255,255,0.06)"}`,
                    borderRadius:8,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:28,marginBottom:8}}>{t2.icon}</div>
                  <div style={{fontSize:13,color:isOn?"#c9a96e":"#8a7a6a",fontWeight:isOn?600:400}}>
                    {lang==="ar"?TYPE_LABELS_APP[t2.key]:TYPE_LABELS_EN[t2.key]}
                  </div>
                  {isOn && <div style={{fontSize:10,color:"#c9a96e",marginTop:4}}>✓</div>}
                </div>
              );
            })}
          </div>
          {selectedTypes.length > 0 && (
            <div style={{textAlign:"center"}}>
              <p style={{color:"#7a6a5a",marginBottom:16,fontSize:14}}>
                {lang==="ar"?`اخترتِ ${selectedTypes.length} كاتيجوري`:`Selected ${selectedTypes.length} categories`}
              </p>
              <button className="btn-gold" style={{padding:"13px 40px",fontSize:15}}
                onClick={()=>{
                  const r = buildDynamicRoutine(selectedTypes, answers.skin, answers.budget, answers.concerns[0]||null);
                  setRoutine(r);
                  setView("results");
                }}>
                {lang==="ar"?"شوفي روتينك":"Show My Routine"}
              </button>
            </div>
          )}
          {selectedTypes.length === 0 && (
            <p style={{textAlign:"center",color:"#5a4a3a",fontSize:13}}>
              {lang==="ar"?"اختاري كاتيجوري واحدة على الأقل":"Select at least one category"}
            </p>
          )}
        </div>}

        {view==="results" && routine && <div className="section fade-up">
          <button className="back-btn" onClick={()=>handleBack("results")}>← {t.back}</button>
          <div className="result-header">
            <div className="result-badge">{t.resultBadge}</div>
            <div className="result-title">{routine.concern ? `${CONCERNS_LIST.find(c=>c.key===routine.concern)?.label} ${CONCERNS_LIST.find(c=>c.key===routine.concern)?.emoji}` : `${skinLabels[routine.skin]} ${skinEmojis[routine.skin]}`}</div>
            <div className="result-sub">{budgetNames[routine.budget]}</div>
          </div>
          <div className="steps-list">{routine.steps.map((step,i)=>(<div key={i} className="step-card fade-up" style={{animationDelay:`${i*0.06}s`}} onClick={()=>openProduct(step.product)}><div className="step-num">{i+1}</div><div style={{flex:1}}><div className="step-cat">{step.label}</div><div className="step-name">{step.product.name}</div><div className="step-brand">{step.product.brand}</div><div className="step-note">{step.product.note}</div></div>{step.product.image_url && <img src={step.product.image_url} alt="" style={{width:52,height:52,objectFit:"contain",borderRadius:6,background:"#111",flexShrink:0}} onError={e=>e.target.style.display="none"}/>}<div className="step-right"><div className="step-price">{step.product.price.toLocaleString()} {t.currency}</div><div className="step-where">{step.product.where_to_buy||step.product.where}</div><a className="buy-btn" href={step.product.link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>{t.buyBtn}</a></div></div>))}</div>
          <div className="total-box"><div><div className="total-lbl">{t.resultTotal}</div><div className="total-note">{t.resultTotalNote}</div></div><div className="total-amount">~{routine.total?.toLocaleString()} {t.currency}</div></div>
          <div className="action-row">
            <button className="btn-gold" onClick={saveRoutine}>{t.saveRoutineBtn}</button>
            <button className="btn-outline" onClick={resetAll}>{t.restartBtn}</button>
            <button className="btn-ghost" onClick={()=>setView("concern")}>{t.tryConcern}</button>
          </div>
        </div>}

        {view==="saved" && <div className="section fade-in">
          <button className="back-btn" onClick={()=>{ if(selectedSaved) setSelectedSaved(null); else handleBack("saved"); }}>← {selectedSaved?t.savedBack:t.back}</button>
          {!selectedSaved ? <>
            <h2 className="section-title">{t.savedTitle}</h2>
            <p className="section-sub">{savedRoutines.length} {t.savedCount}</p>
            {savedRoutines.length===0
              ? <div className="empty-state"><div className="empty-icon">🌿</div><div className="empty-text">{t.savedEmpty}</div><button className="btn-gold" style={{marginTop:20}} onClick={()=>{setView("quiz");setQuizStep(0);}}>{t.startQuiz}</button></div>
              : <div className="saved-grid">{savedRoutines.map(r=>(
                  <div key={r.id} className="saved-card" onClick={()=>setSelectedSaved(r)}>
                    <div className="saved-card-tag">{budgetNames[r.budget]}</div>
                    <div className="saved-card-title">{r.title}</div>
                    <div className="saved-card-date">{new Date(r.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</div>
                    <div className="saved-card-steps">{t.savedTotal}: {r.total_price?.toLocaleString()} {t.currency}</div>
                  </div>
                ))}</div>
            }
          </> : <>
            <h2 className="section-title">{selectedSaved.title}</h2>
            <p className="section-sub">{budgetNames[selectedSaved.budget]} — {new Date(selectedSaved.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</p>
            {/* Steps */}
            {(()=>{
              let ids = [];
              try { ids = JSON.parse(selectedSaved.steps_json||"[]"); } catch{ ids = []; }
              const steps = ids.map(id=>dbProducts.find(p=>p.id===id)).filter(Boolean);
              return steps.length > 0
                ? <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
                    {steps.map((p,i)=>(
                      <div key={i} onClick={()=>openProduct(p)} style={{padding:"18px 22px",background:"#0d0d0d",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,display:"flex",alignItems:"center",gap:16,cursor:"pointer",transition:"border-color 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(201,169,110,0.3)"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(201,169,110,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                          {i===0?"🧼":i===steps.length-1?"☀️":"🧪"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,color:siteColors.primary,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{p.brand}</div>
                          <div style={{fontSize:15,color:"#f5f0eb",fontWeight:500}}>{p.name}</div>
                          <div style={{fontSize:12,color:"#5a4a3a",marginTop:2}}>{p.where_to_buy} — {p.price?.toLocaleString()} {t.currency}</div>
                        </div>
                        {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{padding:"7px 14px",background:siteColors.primary,color:"#0a0a0a",borderRadius:4,fontSize:12,fontWeight:600,textDecoration:"none",flexShrink:0}}>{t.buyBtn}</a>}
                      </div>
                    ))}
                  </div>
                : <div style={{color:"#3a3030",fontSize:13,marginBottom:24}}>{t.productDetails}</div>;
            })()}
            {/* Doctor notes */}
            {selectedSaved.doctor_notes && <div style={{padding:"16px 20px",background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.15)",borderRadius:8,marginBottom:24}}>
              <div style={{fontSize:11,color:siteColors.primary,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{t.doctorNotes}</div>
              <div style={{fontSize:14,color:"#c9a96e",lineHeight:1.7}}>{selectedSaved.doctor_notes}</div>
            </div>}
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <div style={{fontSize:16,fontFamily:"Playfair Display,serif",color:siteColors.primary}}>{t.totalLabel}: {selectedSaved.total_price?.toLocaleString()} {t.currency}</div>
            </div>
          </>}
        </div>}

        {view==="product" && selectedProduct && <div className="section fade-in">
          <button className="back-btn" onClick={()=>handleBack("product")}>← {t.back}</button>
          <div className="product-page">
            <div className="product-hero">
              <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}>
                {selectedProduct.image_url && <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{width:120,height:120,objectFit:"contain",borderRadius:8,background:"#111",border:"1px solid rgba(255,255,255,0.06)",flexShrink:0}} onError={e=>e.target.style.display="none"}/>}
                <div style={{flex:1}}>
                  <div className="product-brand">{selectedProduct.brand}</div>
                  <div className="product-name">{selectedProduct.name}</div>
                  <span className="product-type-badge" style={{background:"rgba(201,169,110,0.08)",color:"#c9a96e",border:"1px solid rgba(201,169,110,0.2)"}}>{TYPE_LABELS_APP[selectedProduct.type]||selectedProduct.type}</span>
                  <div className="product-price-row">
                    <div>
                      <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
                        <div className="product-price-big">
                          {selectedProduct.price?.toLocaleString()} {t.currency}
                        </div>
                        {selectedProduct.on_sale && selectedProduct.original_price && selectedProduct.original_price > selectedProduct.price && (
                          <div style={{fontSize:16,color:"#3a3030",textDecoration:"line-through"}}>
                            {selectedProduct.original_price.toLocaleString()} {t.currency}
                          </div>
                        )}
                        {selectedProduct.on_sale && <span className="sale-badge">{selectedProduct.sale_label||t.saleTag}</span>}
                      </div>
                      <div className="product-where">{selectedProduct.where_to_buy || selectedProduct.where}</div>
                    </div>
                    {selectedProduct.link && <a className="product-buy-btn" href={selectedProduct.link} target="_blank" rel="noreferrer">{t.buyNow}</a>}
                  </div>
                </div>
              </div>
            </div>
            {productNotes?.notes && <div className="doctor-note-box">
              <div className="doctor-note-label">{t.doctorNotes}</div>
              <div className="doctor-note-text">{productNotes.notes}</div>
            </div>}
            {selectedProduct.note && <div className="product-section">
              <div className="product-section-title">{t.aboutProduct}</div>
              <div className="product-note">{selectedProduct.note}</div>
            </div>}
            {selectedProduct.ingredients && <div className="product-section">
              <div className="product-section-title">{t.ingredients}</div>
              <div className="product-ingr">{selectedProduct.ingredients}</div>
            </div>}
            <div className="product-section">
              <div className="product-section-title">{t.reviewsTitle} ({productReviews.length})</div>
              {productReviews.length === 0
                ? <div style={{color:"#3a3030",fontSize:13,marginBottom:16}}>{t.noReviews}</div>
                : productReviews.map(r=>(
                  <div key={r.id} className="review-item">
                    <div className="review-header">
                      <div className="review-user">{r.user_name||t.anonymous}</div>
                      <div className="review-date">{new Date(r.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</div>
                    </div>
                    <div className="review-stars">{"⭐".repeat(r.rating||5)}</div>
                    <div className="review-text">{r.text}</div>
                  </div>
                ))
              }
              <div className="review-form">
                <div className="product-section-title" style={{marginBottom:12}}>{user?t.writeReview:t.loginToReview}</div>
                {reviewSent
                  ? <div style={{padding:"12px 16px",background:"rgba(46,204,113,0.08)",border:"1px solid rgba(46,204,113,0.2)",borderRadius:6,fontSize:13,color:"#2ecc71"}}>{t.reviewSent}</div>
                  : user ? <>
                    <div className="stars-select">
                      {[1,2,3,4,5].map(s=>(
                        <button key={s} className={`star-btn ${s<=reviewForm.rating?"on":""}`} onClick={()=>setReviewForm(f=>({...f,rating:s}))}>⭐</button>
                      ))}
                    </div>
                    <textarea placeholder={t.reviewPlaceholder} value={reviewForm.text} onChange={e=>setReviewForm(f=>({...f,text:e.target.value}))}/>
                    <button className="btn-gold" style={{marginTop:12,padding:"10px 24px",fontSize:13}} onClick={submitReview} disabled={!reviewForm.text.trim()}>{t.sendReview}</button>
                  </>
                  : <button className="btn-outline" style={{fontSize:13}} onClick={()=>setAuthModal("login")}>{t.reviewLoginBtn}</button>
                }
              </div>
            </div>
          </div>
        </div>}

        {view==="admin" && <AdminPanel lang={lang} onBack={async()=>{ setSiteColors(DEFAULT_COLORS); const {data:prods} = await supabase.from("products").select("*"); if(prods){ setDbProducts(prods); setSaleProducts(prods.filter(p=>p.on_sale)); } const {data}=await supabase.from("settings").select("*"); if(data&&data.length>0){const c={...DEFAULT_COLORS};data.forEach(s=>{if(c.hasOwnProperty(s.key))c[s.key]=s.value;});setSiteColors(c);} setView("home"); }} />}

        <div style={{textAlign:"center",padding:"36px 20px",borderTop:"1px solid rgba(255,255,255,0.03)",color:"#2a2a2a",fontSize:"11px"}}>
          SkinMatch Egypt © 2025 — {t.footerText}
        </div>

        {authModal && <div className="modal-overlay" onClick={e=>{if(e.target.classList.contains("modal-overlay")){setAuthModal(null);setForgotMode(false);setForgotMsg("");}}}>
          <div className="modal" style={{position:"relative"}}>
            <button className="modal-close" onClick={()=>{setAuthModal(null);setForgotMode(false);setForgotMsg("");}}>×</button>

            {forgotMode ? <>
              <div className="modal-title">{t.forgotTitle}</div>
              <div className="modal-sub">{t.forgotSub}</div>
              {forgotMsg && <div style={{padding:"10px 14px",borderRadius:4,marginBottom:14,fontSize:13,background:forgotMsg.startsWith("✅")?"rgba(46,204,113,0.08)":"rgba(200,80,80,0.08)",color:forgotMsg.startsWith("✅")?"#2ecc71":"#c05050"}}>{forgotMsg}</div>}
              <div className="field"><label>{t.forgotEmailLabel}</label><input type="email" placeholder="email@example.com" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/></div>
              <button className="btn-gold" style={{width:"100%",marginTop:8}} onClick={handleForgotPassword}>{t.forgotSend}</button>
              <div className="auth-switch"><button onClick={()=>{setForgotMode(false);setForgotMsg("");}}>← {t.forgotBack}</button></div>
            </> : <>
              <div className="modal-title">{authModal==="signup"?t.signupTitle:t.loginTitle}</div>
              <div className="modal-sub">{authModal==="signup"?t.signupSub:t.loginSub}</div>
              {authErr && <div className="auth-err">{authErr}</div>}
              {authModal==="signup" && <>
                <div className="field"><label>{t.nameLabel}</label><input placeholder={t.namePlaceholder} value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))}/></div>
                <div className="field"><label>{t.ageLabel}</label><input placeholder={t.agePlaceholder} value={authForm.age} onChange={e=>setAuthForm(f=>({...f,age:e.target.value}))}/></div>
                <div className="field"><label>{t.phoneLabel}</label><input type="tel" placeholder="01xxxxxxxxx" value={authForm.phone} onChange={e=>setAuthForm(f=>({...f,phone:e.target.value}))}/></div>
              </>}
              <div className="field"><label>{t.emailLabel}</label><input type="email" placeholder="email@example.com" value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="field"><label>{t.passLabel}</label><input type="password" placeholder={t.passPlaceholder} value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))}/></div>
              <button className="btn-gold" style={{width:"100%",marginTop:8}} onClick={authModal==="signup"?handleSignup:handleLogin} disabled={authLoading}>{authLoading?t.loading:(authModal==="signup"?t.signupBtn:t.login)}</button>
              {authModal==="login" && <div style={{textAlign:"center",marginTop:10}}><button style={{background:"none",border:"none",color:"#5a4a3a",cursor:"pointer",fontSize:12,textDecoration:"underline"}} onClick={()=>{setForgotMode(true);setForgotEmail(authForm.email);}}>{t.forgotPassLink}</button></div>}
              <div className="auth-switch">{authModal==="signup" ? <>{t.haveAccount} <button onClick={()=>setAuthModal("login")}>{t.login}</button></> : <>{t.noAccount} <button onClick={()=>setAuthModal("signup")}>{t.signupFree}</button></>}</div>
            </>}
          </div>
        </div>}

        {/* ══ SALES PAGE ══ */}
        {view==="sales" && <div className="section fade-in">
          <button className="back-btn" onClick={()=>handleBack("sales")}>← {t.back}</button>
          <div className="result-header">
            <div className="result-badge">🏷️ DEALS</div>
            <div className="result-title">{t.salesPage}</div>
            <div className="result-sub">{t.salesSub}</div>
          </div>
          {saleProducts.length === 0
            ? <div className="empty-state"><div className="empty-icon">🌿</div><div className="empty-text">{t.noSales}</div></div>
            : <div className="sales-grid">
                {saleProducts.map(p=>{
                  const orig = p.original_price;
                  const curr = p.price;
                  const pct  = orig && curr && orig>curr ? Math.round((orig-curr)/orig*100) : null;
                  return (
                  <div key={p.id} className="sale-card" onClick={()=>openProduct(p)}>
                    <div className="sale-label-tag">
                      {p.sale_label || (pct ? (lang==="ar"?`خصم ${pct}%`:`${pct}% Off`) : t.saleTagDefault)}
                    </div>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="sale-card-img" onError={e=>e.target.style.display="none"}/>
                      : <div className="sale-card-img-placeholder">🧴</div>
                    }
                    <div className="sale-card-brand">{p.brand}</div>
                    <div className="sale-card-name">{p.name}</div>
                    <div className="sale-card-price-wrap">
                      <div className="sale-card-price">{curr?.toLocaleString()} {t.currency}</div>
                      {orig && orig>curr && (
                        <div className="sale-card-original">{orig.toLocaleString()} {t.currency}</div>
                      )}
                      {pct && <div className="sale-card-pct">-{pct}%</div>}
                    </div>
                    <div className="sale-card-skin">
                      {t.skinType}: {Array.isArray(p.skin) ? p.skin.join("، ") : (p.skin||"")}
                    </div>
                    {p.link && <a className="buy-btn" href={p.link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>{t.buyNow}</a>}
                  </div>
                  );
                })}
              </div>
          }
        </div>}

        {/* ══ CONSULTATION PAGE ══ */}
        {view==="consultation" && <div className="section fade-in">
          <button className="back-btn" onClick={()=>handleBack("sales")}>← {t.back}</button>
          <div className="consult-page">
            <div className="result-header">
              <div className="result-badge">👩‍⚕️ DERMA</div>
              <div className="result-title">{t.consultPage}</div>
              <div className="result-sub">{t.consultSub}</div>
            </div>

            <div className="consult-premium-banner">
              <span style={{fontSize:28}}>💎</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#c9a96e",marginBottom:3}}>{t.consultPremium}</div>
                <div style={{fontSize:12,color:"#5a4a3a"}}>{t.consultPremiumSub}</div>
              </div>
            </div>

            {!user
              ? <div className="empty-state">
                  <div className="empty-icon">🔐</div>
                  <div className="empty-text" style={{marginBottom:16}}>{t.consultLoginNote}</div>
                  <button className="btn-gold" onClick={()=>setAuthModal("login")}>{t.login}</button>
                </div>
              : <>
                  {/* FORM */}
                  {consultMsg !== "sent"
                    ? <div className="consult-form">
                        <div className="field" style={{marginBottom:18}}>
                          <label style={{display:"block",fontSize:12,color:"#7a6a5a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{t.consultQ}</label>
                          <textarea
                            placeholder={t.consultQPlaceholder}
                            value={consultForm.question}
                            onChange={e=>setConsultForm(f=>({...f,question:e.target.value}))}
                          />
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
                          <div className="field" style={{marginBottom:0}}>
                            <label style={{display:"block",fontSize:12,color:"#7a6a5a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{t.consultSkin}</label>
                            <select value={consultForm.skin_type} onChange={e=>setConsultForm(f=>({...f,skin_type:e.target.value}))}>
                              <option value="">{lang==="ar"?"اختاري":"Select"}</option>
                              <option value="oily">{lang==="ar"?"دهنية":"Oily"}</option>
                              <option value="dry">{lang==="ar"?"جافة":"Dry"}</option>
                              <option value="combo">{lang==="ar"?"مختلطة":"Combination"}</option>
                              <option value="sensitive">{lang==="ar"?"حساسة":"Sensitive"}</option>
                              <option value="normal">{lang==="ar"?"عادية":"Normal"}</option>
                            </select>
                          </div>
                          <div className="field" style={{marginBottom:0}}>
                            <label style={{display:"block",fontSize:12,color:"#7a6a5a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{t.consultConcerns}</label>
                            <input
                              style={{width:"100%",padding:"11px 14px",background:"#111",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#f5f0eb",fontSize:13,outline:"none",boxSizing:"border-box"}}
                              placeholder={t.consultConcernsPlaceholder}
                              value={consultForm.concerns}
                              onChange={e=>setConsultForm(f=>({...f,concerns:e.target.value}))}
                            />
                          </div>
                        </div>
                        <div style={{padding:"12px 16px",background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.15)",borderRadius:8,fontSize:12,color:"#7a6a5a",marginBottom:20}}>{t.consultPayNote}</div>
                        {consultMsg && consultMsg!=="sent" && <div style={{fontSize:12,color:"#c05050",marginBottom:12}}>{consultMsg}</div>}
                        <button className="btn-gold" onClick={submitConsultation} disabled={consultLoading}>
                          {consultLoading?"...":`${t.consultSend} 📩`}
                        </button>
                      </div>
                    : <div style={{textAlign:"center",padding:"40px 20px",background:"#0d0d0d",border:"1px solid rgba(46,204,113,0.2)",borderRadius:12,marginBottom:24}}>
                        <div style={{fontSize:36,marginBottom:12}}>✅</div>
                        <div style={{fontSize:15,color:"#f5f0eb",marginBottom:6}}>{t.consultSent}</div>
                        <button className="btn-outline" style={{marginTop:16}} onClick={()=>setConsultMsg("")}>
                          {lang==="ar"?"استشارة جديدة":"New Consultation"}
                        </button>
                      </div>
                  }

                  {/* HISTORY */}
                  {myConsultations.length > 0 && <div className="consult-history">
                    <div style={{fontSize:11,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:16}}>{t.consultHistory}</div>
                    {myConsultations.map(c=>(
                      <div key={c.id} className="consult-item">
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <span style={{fontSize:11,color:c.status==="answered"?"#2ecc71":"#f1c40f"}}>
                            {c.status==="answered"?t.consultAnswered:t.consultPending}
                          </span>
                          <span style={{fontSize:11,color:"#3a3030"}}>{new Date(c.created_at).toLocaleDateString("ar-EG")}</span>
                        </div>
                        <div className="consult-q">{c.question}</div>
                        {c.doctor_reply && <div className="consult-reply">
                          <div className="consult-reply-label">👩‍⚕️ {lang==="ar"?"رد الدكتورة":"Doctor's Reply"}</div>
                          <div className="consult-reply-text">{c.doctor_reply}</div>
                        </div>}
                      </div>
                    ))}
                  </div>}
                </>
            }
          </div>
        </div>}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
