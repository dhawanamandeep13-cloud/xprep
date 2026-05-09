import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ── Inline styles & keyframes injected once ──────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --blue-950: #020b18;
      --blue-900: #061529;
      --blue-800: #0a2540;
      --blue-700: #0e3460;
      --blue-600: #1a4f8a;
      --blue-500: #2370c4;
      --blue-400: #4090e0;
      --blue-300: #7ab8f5;
      --blue-100: #dbeeff;
      --white:    #ffffff;
      --grey-100: #f0f5fb;
      --grey-200: #d8e4f0;
      --grey-500: #6b87a8;
      --accent:   #f7c948;
      --font-display: 'Sora', sans-serif;
      --font-body:    'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--white);
      color: var(--blue-900);
      overflow-x: hidden;
    }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes floatA {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-18px) rotate(4deg); }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-12px) rotate(-3deg); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(35,112,196,0.5); }
      70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(35,112,196,0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(35,112,196,0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .animate-fade-up   { animation: fadeUp 0.7s ease forwards; }
    .animate-fade-in   { animation: fadeIn 0.6s ease forwards; }
    .animate-float-a   { animation: floatA 6s ease-in-out infinite; }
    .animate-float-b   { animation: floatB 8s ease-in-out infinite; }
    .delay-1 { animation-delay: 0.15s; }
    .delay-2 { animation-delay: 0.30s; }
    .delay-3 { animation-delay: 0.45s; }
    .delay-4 { animation-delay: 0.60s; }
    .delay-5 { animation-delay: 0.75s; }

    /* ── Nav ── */
    .xp-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5%;
      height: 68px;
      transition: background 0.3s, box-shadow 0.3s;
    }
    .xp-nav.scrolled {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 var(--grey-200);
    }
    .xp-nav-logo {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.5rem;
      color: var(--blue-800);
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .xp-nav-logo span { color: var(--blue-500); }
    .xp-nav-links { display: flex; gap: 2rem; align-items: center; }
    .xp-nav-links a {
      font-size: 0.9rem; font-weight: 500;
      color: var(--blue-700); text-decoration: none;
      transition: color 0.2s;
    }
    .xp-nav-links a:hover { color: var(--blue-500); }
    .xp-nav-cta {
      background: var(--blue-500);
      color: var(--white) !important;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 600 !important;
      transition: background 0.2s, transform 0.2s !important;
    }
    .xp-nav-cta:hover { background: var(--blue-600) !important; transform: translateY(-1px); }

    /* ── Hero ── */
    .xp-hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding: 100px 5% 60px;
      background: linear-gradient(135deg, #f8fbff 0%, #eaf3ff 50%, #f0f7ff 100%);
      position: relative; overflow: hidden;
    }
    .xp-hero-bg-circle {
      position: absolute; border-radius: 50%;
      pointer-events: none;
    }
    .xp-hero-bg-circle-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(35,112,196,0.08) 0%, transparent 70%);
      top: -150px; right: -100px;
    }
    .xp-hero-bg-circle-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(35,112,196,0.06) 0%, transparent 70%);
      bottom: -100px; left: -80px;
    }
    .xp-hero-inner {
      max-width: 1200px; margin: 0 auto; width: 100%;
      display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
    }
    .xp-hero-badge {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: rgba(35,112,196,0.1);
      border: 1px solid rgba(35,112,196,0.2);
      border-radius: 100px;
      padding: 0.35rem 1rem;
      font-size: 0.8rem; font-weight: 600;
      color: var(--blue-600);
      margin-bottom: 1.5rem;
    }
    .xp-hero-badge-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--blue-500);
      animation: pulse-ring 2s infinite;
    }
    .xp-hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 4.5vw, 3.6rem);
      font-weight: 800;
      line-height: 1.1;
      color: var(--blue-950);
      letter-spacing: -1.5px;
      margin-bottom: 1.25rem;
      opacity: 0;
    }
    .xp-hero-title .highlight {
      background: linear-gradient(135deg, var(--blue-500), var(--blue-400));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .xp-hero-sub {
      font-size: 1.1rem; font-weight: 300; line-height: 1.7;
      color: var(--grey-500);
      max-width: 480px;
      margin-bottom: 2.5rem;
      opacity: 0;
    }
    .xp-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; opacity: 0; }
    .xp-btn-primary {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--blue-500);
      color: var(--white);
      padding: 0.85rem 2rem;
      border-radius: 10px;
      font-family: var(--font-display);
      font-weight: 700; font-size: 1rem;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(35,112,196,0.35);
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .xp-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(35,112,196,0.45);
      background: var(--blue-600);
    }
    .xp-btn-secondary {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: transparent;
      border: 2px solid var(--blue-300);
      color: var(--blue-700);
      padding: 0.85rem 1.75rem;
      border-radius: 10px;
      font-family: var(--font-display);
      font-weight: 600; font-size: 1rem;
      text-decoration: none;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .xp-btn-secondary:hover {
      border-color: var(--blue-500);
      background: rgba(35,112,196,0.05);
      color: var(--blue-500);
    }

    /* Hero visual card */
    .xp-hero-visual { position: relative; opacity: 0; }
    .xp-hero-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(14,52,96,0.12), 0 4px 16px rgba(14,52,96,0.06);
      position: relative; z-index: 2;
    }
    .xp-hero-card-header {
      display: flex; align-items: center; gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .xp-hero-card-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue-500), var(--blue-400));
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
    }
    .xp-hero-card-name { font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: var(--blue-900); }
    .xp-hero-card-role { font-size: 0.78rem; color: var(--grey-500); }
    .xp-hero-card-q {
      background: var(--grey-100);
      border-radius: 10px; padding: 1rem;
      font-size: 0.88rem; color: var(--blue-800);
      font-style: italic; margin-bottom: 1rem;
      border-left: 3px solid var(--blue-400);
    }
    .xp-hero-card-answer {
      font-size: 0.85rem; color: var(--grey-500);
      line-height: 1.6; margin-bottom: 1.25rem;
    }
    .xp-score-bar-label {
      display: flex; justify-content: space-between;
      font-size: 0.8rem; font-weight: 600;
      color: var(--blue-700); margin-bottom: 0.4rem;
    }
    .xp-score-bar-track {
      height: 8px; background: var(--grey-200);
      border-radius: 100px; overflow: hidden;
    }
    .xp-score-bar-fill {
      height: 100%; border-radius: 100px;
      background: linear-gradient(90deg, var(--blue-500), var(--blue-300));
      transition: width 1.5s ease;
    }
    .xp-hero-float-1 {
      position: absolute; top: -20px; right: -20px; z-index: 3;
      background: var(--white);
      border-radius: 12px; padding: 0.75rem 1rem;
      box-shadow: 0 8px 24px rgba(14,52,96,0.1);
      font-size: 0.8rem; font-weight: 600; color: var(--blue-800);
      display: flex; align-items: center; gap: 0.5rem;
    }
    .xp-hero-float-2 {
      position: absolute; bottom: -16px; left: -24px; z-index: 3;
      background: var(--blue-500);
      border-radius: 12px; padding: 0.75rem 1rem;
      box-shadow: 0 8px 24px rgba(35,112,196,0.35);
      font-size: 0.8rem; font-weight: 600; color: var(--white);
      display: flex; align-items: center; gap: 0.5rem;
    }

    /* ── Stats ── */
    .xp-stats {
      background: var(--blue-800);
      padding: 3.5rem 5%;
    }
    .xp-stats-inner {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 2rem; text-align: center;
    }
    .xp-stat-num {
      font-family: var(--font-display);
      font-size: 2.8rem; font-weight: 800;
      color: var(--white); line-height: 1;
      margin-bottom: 0.4rem;
    }
    .xp-stat-num span { color: var(--accent); }
    .xp-stat-label {
      font-size: 0.9rem; color: var(--blue-300);
      font-weight: 400; letter-spacing: 0.3px;
    }

    /* ── Features ── */
    .xp-features {
      padding: 6rem 5%;
      background: var(--white);
    }
    .xp-section-tag {
      font-family: var(--font-display);
      font-size: 0.78rem; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      color: var(--blue-500);
      margin-bottom: 0.75rem;
    }
    .xp-section-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 800; line-height: 1.15;
      color: var(--blue-950);
      letter-spacing: -1px;
      margin-bottom: 1rem;
    }
    .xp-section-sub {
      font-size: 1rem; color: var(--grey-500);
      line-height: 1.7; max-width: 520px;
    }
    .xp-features-header { text-align: center; margin-bottom: 4rem; }
    .xp-features-header .xp-section-sub { margin: 0 auto; }
    .xp-features-grid {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }
    .xp-feature-card {
      background: var(--grey-100);
      border-radius: 18px; padding: 2rem;
      border: 1.5px solid transparent;
      transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
      cursor: default;
    }
    .xp-feature-card:hover {
      border-color: var(--blue-300);
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(35,112,196,0.1);
    }
    .xp-feature-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; margin-bottom: 1.25rem;
    }
    .xp-feature-title {
      font-family: var(--font-display);
      font-weight: 700; font-size: 1.05rem;
      color: var(--blue-900); margin-bottom: 0.6rem;
    }
    .xp-feature-desc {
      font-size: 0.88rem; color: var(--grey-500);
      line-height: 1.65;
    }
    .xp-feature-link {
      display: inline-flex; align-items: center; gap: 0.3rem;
      margin-top: 1.25rem;
      font-size: 0.85rem; font-weight: 600;
      color: var(--blue-500); text-decoration: none;
      transition: gap 0.2s;
    }
    .xp-feature-link:hover { gap: 0.6rem; }

    /* ── How it works ── */
    .xp-how {
      padding: 6rem 5%;
      background: linear-gradient(180deg, #f4f9ff 0%, #eaf3ff 100%);
    }
    .xp-how-inner { max-width: 1100px; margin: 0 auto; }
    .xp-how-header { text-align: center; margin-bottom: 4rem; }
    .xp-how-header .xp-section-sub { margin: 0 auto; }
    .xp-steps {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem; position: relative;
    }
    .xp-steps::before {
      content: '';
      position: absolute;
      top: 36px; left: calc(12.5% + 24px); right: calc(12.5% + 24px);
      height: 2px;
      background: linear-gradient(90deg, var(--blue-300), var(--blue-500), var(--blue-300));
      z-index: 0;
    }
    .xp-step { text-align: center; position: relative; z-index: 1; }
    .xp-step-num {
      width: 72px; height: 72px; border-radius: 50%;
      background: var(--white);
      border: 2.5px solid var(--blue-300);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      font-family: var(--font-display);
      font-weight: 800; font-size: 1.3rem;
      color: var(--blue-500);
      box-shadow: 0 4px 16px rgba(35,112,196,0.12);
      transition: background 0.3s, border-color 0.3s;
    }
    .xp-step:hover .xp-step-num {
      background: var(--blue-500);
      border-color: var(--blue-500);
      color: var(--white);
    }
    .xp-step-title {
      font-family: var(--font-display);
      font-weight: 700; font-size: 0.95rem;
      color: var(--blue-900); margin-bottom: 0.5rem;
    }
    .xp-step-desc {
      font-size: 0.83rem; color: var(--grey-500); line-height: 1.6;
    }

    /* ── Testimonials ── */
    .xp-testimonials {
      padding: 6rem 5%;
      background: var(--white);
    }
    .xp-testimonials-header { text-align: center; margin-bottom: 4rem; }
    .xp-testimonials-header .xp-section-sub { margin: 0 auto; }
    .xp-testimonials-grid {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }
    .xp-tcard {
      background: var(--grey-100);
      border-radius: 18px; padding: 2rem;
      border: 1.5px solid var(--grey-200);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .xp-tcard:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(35,112,196,0.08);
    }
    .xp-tcard-stars { color: var(--accent); font-size: 1rem; margin-bottom: 1rem; letter-spacing: 2px; }
    .xp-tcard-quote {
      font-size: 0.9rem; line-height: 1.7;
      color: var(--blue-800); font-style: italic;
      margin-bottom: 1.5rem;
    }
    .xp-tcard-footer { display: flex; align-items: center; gap: 0.75rem; }
    .xp-tcard-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 700;
      color: var(--white);
    }
    .xp-tcard-name { font-family: var(--font-display); font-weight: 600; font-size: 0.9rem; color: var(--blue-900); }
    .xp-tcard-role { font-size: 0.78rem; color: var(--grey-500); }

    /* ── CTA Banner ── */
    .xp-cta-banner {
      margin: 0 5% 6rem;
      background: linear-gradient(135deg, var(--blue-800) 0%, var(--blue-600) 100%);
      border-radius: 24px;
      padding: 4rem 3rem;
      text-align: center;
      position: relative; overflow: hidden;
    }
    .xp-cta-banner::before {
      content: '';
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .xp-cta-banner-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800; color: var(--white);
      margin-bottom: 1rem; letter-spacing: -0.5px;
      position: relative;
    }
    .xp-cta-banner-sub {
      color: var(--blue-300); font-size: 1rem;
      margin-bottom: 2rem; position: relative;
    }
    .xp-cta-banner-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; }
    .xp-btn-white {
      background: var(--white); color: var(--blue-700);
      padding: 0.85rem 2rem; border-radius: 10px;
      font-family: var(--font-display); font-weight: 700; font-size: 1rem;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .xp-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
    .xp-btn-outline-white {
      border: 2px solid rgba(255,255,255,0.4); color: var(--white);
      padding: 0.85rem 1.75rem; border-radius: 10px;
      font-family: var(--font-display); font-weight: 600; font-size: 1rem;
      text-decoration: none;
      transition: border-color 0.2s, background 0.2s;
    }
    .xp-btn-outline-white:hover { border-color: var(--white); background: rgba(255,255,255,0.08); }

    /* ── Footer ── */
    .xp-footer {
      background: var(--blue-950);
      padding: 4rem 5% 2rem;
    }
    .xp-footer-top {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem; padding-bottom: 3rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .xp-footer-brand-name {
      font-family: var(--font-display);
      font-size: 1.4rem; font-weight: 800;
      color: var(--white); margin-bottom: 0.75rem;
    }
    .xp-footer-brand-name span { color: var(--blue-400); }
    .xp-footer-brand-desc {
      font-size: 0.87rem; color: var(--grey-500);
      line-height: 1.65; max-width: 280px;
    }
    .xp-footer-col-title {
      font-family: var(--font-display);
      font-weight: 700; font-size: 0.85rem;
      color: var(--white); margin-bottom: 1.25rem;
      letter-spacing: 0.3px;
    }
    .xp-footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
    .xp-footer-links a {
      font-size: 0.85rem; color: var(--grey-500);
      text-decoration: none;
      transition: color 0.2s;
    }
    .xp-footer-links a:hover { color: var(--blue-300); }
    .xp-footer-bottom {
      max-width: 1100px; margin: 0 auto;
      padding-top: 2rem;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 1rem;
    }
    .xp-footer-copy { font-size: 0.82rem; color: var(--grey-500); }
    .xp-footer-bottom-links { display: flex; gap: 1.5rem; }
    .xp-footer-bottom-links a { font-size: 0.82rem; color: var(--grey-500); text-decoration: none; transition: color 0.2s; }
    .xp-footer-bottom-links a:hover { color: var(--blue-300); }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .xp-hero-inner { grid-template-columns: 1fr; }
      .xp-hero-visual { display: none; }
      .xp-stats-inner { grid-template-columns: repeat(2, 1fr); }
      .xp-features-grid { grid-template-columns: repeat(2, 1fr); }
      .xp-steps { grid-template-columns: repeat(2, 1fr); }
      .xp-steps::before { display: none; }
      .xp-testimonials-grid { grid-template-columns: 1fr; }
      .xp-footer-top { grid-template-columns: 1fr 1fr; }
      .xp-nav-links { display: none; }
    }
    @media (max-width: 600px) {
      .xp-features-grid { grid-template-columns: 1fr; }
      .xp-steps { grid-template-columns: 1fr; }
      .xp-stats-inner { grid-template-columns: repeat(2, 1fr); }
      .xp-footer-top { grid-template-columns: 1fr; }
      .xp-cta-banner { margin: 0 0 4rem; border-radius: 0; }
    }
  `}</style>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "🎯", color: "#dbeeff", iconBg: "#dbeeff",
    title: "AI Mock Interviews",
    desc: "Practice with our AI interviewer that asks real questions, listens to your answers, and gives instant, detailed feedback using the STAR method.",
    link: "/MockInterview", label: "Start Practicing"
  },
  {
    icon: "📄", color: "#e8f5e9", iconBg: "#e8f5e9",
    title: "AI Resume Builder",
    desc: "Build an ATS-optimized resume in minutes. Our AI suggests impactful bullet points, relevant keywords, and formats for your target role.",
    link: "/ResumeBuilder", label: "Build Resume"
  },
  {
    icon: "💼", color: "#fff3e0", iconBg: "#fff3e0",
    title: "AI Job Hunter",
    desc: "Get matched with jobs that fit your skills, location, and salary expectations. Apply smarter, not harder.",
    link: "/JobHunter", label: "Find Jobs"
  },
  {
    icon: "📚", color: "#f3e5f5", iconBg: "#f3e5f5",
    title: "Learning Modules",
    desc: "Structured learning paths covering communication, aptitude, technical skills, and domain knowledge — all in one place.",
    link: "/Modules", label: "Start Learning"
  },
  {
    icon: "❓", color: "#e8eaf6", iconBg: "#e8eaf6",
    title: "Question Bank",
    desc: "10,000+ curated interview questions across industries, roles, and difficulty levels. Filter by company, topic, or experience.",
    link: "/QuestionBank", label: "Browse Questions"
  },
  {
    icon: "📊", color: "#e0f7fa", iconBg: "#e0f7fa",
    title: "Progress Tracker",
    desc: "Track your preparation score, interview performance trends, and readiness level with a personalised dashboard.",
    link: "/", label: "Coming Soon"
  }
];

const steps = [
  { num: "01", title: "Create Your Profile", desc: "Tell us your background, target role, and experience level in 2 minutes." },
  { num: "02", title: "Take AI Mock Interview", desc: "Answer real interview questions and get instant AI feedback on every response." },
  { num: "03", title: "Build Your Resume", desc: "Use AI to craft an ATS-ready resume tailored to your dream job." },
  { num: "04", title: "Land Your Dream Job", desc: "Apply to matched jobs with confidence and track your applications." }
];

const testimonials = [
  {
    stars: "★★★★★",
    quote: "xprep's AI mock interviews were a game changer. I practiced 20+ questions and got detailed feedback every time. Landed my first job at Infosys within 3 weeks!",
    name: "Priya Sharma", role: "Software Engineer, Infosys", color: "#2370c4", initial: "P"
  },
  {
    stars: "★★★★★",
    quote: "The resume builder helped me create an ATS-friendly resume that actually got calls. Before xprep, I had zero responses for 2 months. Everything changed after.",
    name: "Rahul Verma", role: "Data Analyst, TCS", color: "#1a8c6f", initial: "R"
  },
  {
    stars: "★★★★★",
    quote: "As a fresher from a tier-3 college, I felt lost. xprep gave me a structured path and the confidence to crack interviews at top MNCs. Highly recommend!",
    name: "Anjali Singh", role: "Business Analyst, Wipro", color: "#7b3fbf", initial: "A"
  }
];

const stats = [
  { num: "50,000", suffix: "+", label: "Students Prepared" },
  { num: "10,000", suffix: "+", label: "Interview Questions" },
  { num: "85", suffix: "%", label: "Placement Rate" },
  { num: "500", suffix: "+", label: "Companies Hiring" }
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    // Trigger score bar animation after mount
    setTimeout(() => setBarWidth(82), 800);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trigger hero text animations
  useEffect(() => {
    const els = heroRef.current?.querySelectorAll(".xp-hero-title, .xp-hero-sub, .xp-hero-actions, .xp-hero-visual");
    els?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.15}s`;
      el.classList.add("animate-fade-up");
    });
  }, []);

  return (
    <>
      <GlobalStyles />

      {/* ── NAV ── */}
      <nav className={`xp-nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="xp-nav-logo">x<span>prep</span>.in</a>
        <div className="xp-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Success Stories</a>
          <Link to="/MockInterview" className="xp-nav-cta">Start Free →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="xp-hero" ref={heroRef}>
        <div className="xp-hero-bg-circle xp-hero-bg-circle-1" />
        <div className="xp-hero-bg-circle xp-hero-bg-circle-2" />
        <div className="xp-hero-inner">
          <div className="xp-hero-content">
            <div className="xp-hero-badge">
              <div className="xp-hero-badge-dot" />
              AI-Powered Career Preparation Platform
            </div>
            <h1 className="xp-hero-title">
              Land Your<br />
              <span className="highlight">Dream Job</span><br />
              With Confidence
            </h1>
            <p className="xp-hero-sub">
              Practice real interviews with AI, build an ATS-ready resume, and get matched with top companies — everything a fresher needs, in one place.
            </p>
            <div className="xp-hero-actions">
              <Link to="/MockInterview" className="xp-btn-primary">
                Start Mock Interview <span>→</span>
              </Link>
              <Link to="/ResumeBuilder" className="xp-btn-secondary">
                Build My Resume
              </Link>
            </div>
          </div>

          <div className="xp-hero-visual animate-float-a">
            <div className="xp-hero-float-1 animate-float-b">
              ✅ Interview Score: 82/100
            </div>
            <div className="xp-hero-card">
              <div className="xp-hero-card-header">
                <div className="xp-hero-card-avatar">🎓</div>
                <div>
                  <div className="xp-hero-card-name">AI Interview Coach</div>
                  <div className="xp-hero-card-role">xprep.in • Live Session</div>
                </div>
              </div>
              <div className="xp-hero-card-q">
                "Tell me about yourself and why you're the right fit for this role?"
              </div>
              <div className="xp-hero-card-answer">
                "I'm a recent Computer Science graduate with a passion for building scalable web applications. During my internship at..."
              </div>
              <div>
                <div className="xp-score-bar-label">
                  <span>Communication</span><span>82%</span>
                </div>
                <div className="xp-score-bar-track">
                  <div className="xp-score-bar-fill" style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            </div>
            <div className="xp-hero-float-2">
              🎯 Job Match Found!
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="xp-stats">
        <div className="xp-stats-inner">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="xp-stat-num">{s.num}<span>{s.suffix}</span></div>
              <div className="xp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="xp-features" id="features">
        <div className="xp-features-header">
          <div className="xp-section-tag">Everything You Need</div>
          <h2 className="xp-section-title">Your Complete Career<br />Preparation Toolkit</h2>
          <p className="xp-section-sub">Six powerful AI tools working together to take you from fresher to hired — faster than any coaching class.</p>
        </div>
        <div className="xp-features-grid">
          {features.map((f, i) => (
            <div className="xp-feature-card" key={i}>
              <div className="xp-feature-icon" style={{ background: f.iconBg }}>
                {f.icon}
              </div>
              <div className="xp-feature-title">{f.title}</div>
              <div className="xp-feature-desc">{f.desc}</div>
              <Link to={f.link} className="xp-feature-link">
                {f.label} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="xp-how" id="how-it-works">
        <div className="xp-how-inner">
          <div className="xp-how-header">
            <div className="xp-section-tag">The Process</div>
            <h2 className="xp-section-title">From Zero to Hired<br />in 4 Simple Steps</h2>
            <p className="xp-section-sub">A clear, structured path designed specifically for freshers entering the job market.</p>
          </div>
          <div className="xp-steps">
            {steps.map((s, i) => (
              <div className="xp-step" key={i}>
                <div className="xp-step-num">{s.num}</div>
                <div className="xp-step-title">{s.title}</div>
                <div className="xp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="xp-testimonials" id="testimonials">
        <div className="xp-testimonials-header">
          <div className="xp-section-tag">Success Stories</div>
          <h2 className="xp-section-title">Freshers Who Made It</h2>
          <p className="xp-section-sub">Real students. Real results. See how xprep helped them land their first job.</p>
        </div>
        <div className="xp-testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="xp-tcard" key={i}>
              <div className="xp-tcard-stars">{t.stars}</div>
              <div className="xp-tcard-quote">"{t.quote}"</div>
              <div className="xp-tcard-footer">
                <div className="xp-tcard-avatar" style={{ background: t.color }}>{t.initial}</div>
                <div>
                  <div className="xp-tcard-name">{t.name}</div>
                  <div className="xp-tcard-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="xp-cta-banner">
        <h2 className="xp-cta-banner-title">Ready to Land Your Dream Job?</h2>
        <p className="xp-cta-banner-sub">Join 50,000+ freshers who are already preparing smarter with xprep.</p>
        <div className="xp-cta-banner-actions">
          <Link to="/MockInterview" className="xp-btn-white">Start Free Mock Interview →</Link>
          <Link to="/QuestionBank" className="xp-btn-outline-white">Browse Question Bank</Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="xp-footer">
        <div className="xp-footer-top">
          <div>
            <div className="xp-footer-brand-name">x<span>prep</span>.in</div>
            <div className="xp-footer-brand-desc">
              India's smartest AI-powered career preparation platform, built for freshers and early-career professionals who want to compete and win.
            </div>
          </div>
          <div>
            <div className="xp-footer-col-title">Platform</div>
            <ul className="xp-footer-links">
              <li><Link to="/MockInterview">Mock Interview</Link></li>
              <li><Link to="/ResumeBuilder">Resume Builder</Link></li>
              <li><Link to="/JobHunter">Job Hunter</Link></li>
              <li><Link to="/QuestionBank">Question Bank</Link></li>
              <li><Link to="/Modules">Learning Modules</Link></li>
            </ul>
          </div>
          <div>
            <div className="xp-footer-col-title">Prepare For</div>
            <ul className="xp-footer-links">
              <li><a href="#features">Software Engineer</a></li>
              <li><a href="#features">Data Analyst</a></li>
              <li><a href="#features">Product Manager</a></li>
              <li><a href="#features">Finance & CA</a></li>
              <li><a href="#features">Marketing</a></li>
            </ul>
          </div>
          <div>
            <div className="xp-footer-col-title">Company</div>
            <ul className="xp-footer-links">
              <li><a href="#features">About Us</a></li>
              <li><a href="#testimonials">Success Stories</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="mailto:hello@xprep.in">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="xp-footer-bottom">
          <div className="xp-footer-copy">© 2026 xprep.in · All rights reserved · Made with ❤️ in India</div>
          <div className="xp-footer-bottom-links">
            <a href="#features">Privacy Policy</a>
            <a href="#features">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
