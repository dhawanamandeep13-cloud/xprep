import React from "react";

/* ─────────────────────────────────────────────────────────────
   Xprep – Home.js  (drop-in replacement)
   Stack : React + inline styles (no extra dependencies)
   Fonts : Sora + DM Sans  →  add to your public/index.html
           <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
───────────────────────────────────────────────────────────── */

/* ── DESIGN TOKENS ─────────────────────────────────────────── */
const T = {
  blue:        "#2563EB",
  blueDark:    "#1D4ED8",
  blueLight:   "#EFF6FF",
  purple:      "#7C3AED",
  purpleLight: "#F5F0FF",
  navy:        "#0F172A",
  slate:       "#1E293B",
  gray:        "#64748B",
  border:      "#E2E8F0",
  green:       "#059669",
  red:         "#DC2626",
  gold:        "#F59E0B",
  white:       "#FFFFFF",
};

/* ── KEYFRAME INJECTION (runs once) ────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("xprep-home-styles")) return;
  const style = document.createElement("style");
  style.id = "xprep-home-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    @keyframes xp-blink {
      0%,100% { opacity:1; }
      50%      { opacity:0.3; }
    }
    @keyframes xp-shine {
      0%   { left:-50px; }
      100% { left:100%;  }
    }
    @keyframes xp-badge-pulse {
      0%,100% { box-shadow: 0 6px 24px rgba(5,150,105,0.30); }
      50%      { box-shadow: 0 8px 32px rgba(5,150,105,0.50); }
    }
    @keyframes xp-card-in {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes xp-gradient-flow {
      0%   { background-position: 0%   50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0%   50%; }
    }

    .xp-nav-link {
      text-decoration: none;
      color: #64748B;
      font-size: 15px;
      font-weight: 500;
      transition: color .2s;
      font-family: 'DM Sans', sans-serif;
    }
    .xp-nav-link:hover { color: #2563EB; }

    .xp-btn-ghost {
      background: none;
      border: 1.5px solid #E2E8F0;
      padding: 9px 22px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #0F172A;
      cursor: pointer;
      transition: border-color .2s, color .2s;
    }
    .xp-btn-ghost:hover { border-color: #2563EB; color: #2563EB; }

    .xp-btn-nav {
      background: #2563EB;
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background .2s;
    }
    .xp-btn-nav:hover { background: #1D4ED8; }

    .xp-btn-hero {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      color: #fff;
      border: none;
      padding: 15px 32px;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform .25s, box-shadow .25s;
      box-shadow: 0 6px 20px rgba(37,99,235,0.38);
    }
    .xp-btn-hero:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(37,99,235,0.45);
    }

    .xp-btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      color: #0F172A;
      border: 1.5px solid #E2E8F0;
      padding: 15px 32px;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: border-color .25s, color .25s;
    }
    .xp-btn-outline:hover { border-color: #2563EB; color: #2563EB; }

    .xp-attr-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fff;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform .2s, box-shadow .2s;
      animation: xp-card-in 0.5s ease both;
    }
    .xp-attr-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.09);
    }
    .xp-attr-card.bad  { border: 1.5px solid #FEE2E2; }
    .xp-attr-card.good { border: 1.5px solid #D1FAE5; }

    .xp-tool-card {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 16px;
      padding: 28px 24px;
      cursor: pointer;
      transition: border-color .25s, transform .25s, box-shadow .25s;
      position: relative;
      overflow: hidden;
    }
    .xp-tool-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #2563EB, #7C3AED);
      opacity: 0;
      transition: opacity .25s;
    }
    .xp-tool-card:hover {
      border-color: #2563EB;
      transform: translateY(-4px);
      box-shadow: 0 14px 36px rgba(37,99,235,0.11);
    }
    .xp-tool-card:hover::after { opacity: 1; }

    .xp-proof-card {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      padding: 24px;
    }

    .xp-btn-white {
      background: #fff;
      color: #0F172A;
      border: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: background .25s, color .25s, transform .25s;
      box-shadow: 0 6px 24px rgba(0,0,0,0.22);
    }
    .xp-btn-white:hover {
      background: #EFF6FF;
      color: #2563EB;
      transform: translateY(-2px);
    }

    .xp-foot-link {
      text-decoration: none;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      transition: color .2s;
      font-family: 'DM Sans', sans-serif;
    }
    .xp-foot-link:hover { color: #fff; }

    .xp-badge-dot {
      width: 8px; height: 8px;
      background: #2563EB;
      border-radius: 50%;
      animation: xp-blink 1.8s ease-in-out infinite;
      display: inline-block;
    }

    .xp-shine {
      position: absolute;
      top: 0; left: -50px;
      width: 50px; height: 3px;
      background: rgba(255,255,255,0.75);
      border-radius: 2px;
      animation: xp-shine 1.8s linear infinite;
    }
    .xp-shine.delay { animation-delay: 0.6s; }

    .xp-outcome-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #059669, #10B981);
      border-radius: 14px;
      padding: 16px 18px;
      margin-top: 6px;
      animation: xp-badge-pulse 3s ease-in-out infinite;
    }

    .xp-stat-card-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border: 1.5px solid #FEE2E2;
      border-radius: 14px;
      padding: 14px 16px;
      margin-top: 6px;
    }

    .xp-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
      background-size: 56px 56px;
      pointer-events: none;
    }

    .xp-divider-line {
      position: absolute;
      top: 10%; bottom: 10%;
      width: 1px;
      background: linear-gradient(to bottom,
        transparent,
        #E2E8F0 30%,
        #E2E8F0 70%,
        transparent);
    }

    .xp-h1-gradient {
      background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .xp-stat-num-gradient {
      background: linear-gradient(135deg, #2563EB, #7C3AED);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Steps connector line */
    .xp-steps-wrap {
      position: relative;
    }
    .xp-steps-wrap::before {
      content: '';
      position: absolute;
      top: 36px; left: 12%; right: 12%;
      height: 2px;
      background: linear-gradient(90deg, #2563EB, #7C3AED);
      z-index: 0;
    }

    /* CTA banner dot grid */
    .xp-cta-banner {
      position: relative;
      overflow: hidden;
    }
    .xp-cta-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(99,102,241,0.18) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
};

/* ── BEFORE ATTRIBUTES ─────────────────────────────────────── */
const beforeAttrs = [
  { icon: "❌", title: "No Interview Practice",  sub: "Zero experience with real interview formats or pressure",        delay: "0.05s" },
  { icon: "📄", title: "Weak Resume",             sub: "Fails ATS filters, never reaches a human recruiter",            delay: "0.10s" },
  { icon: "📉", title: "Skill Gaps",              sub: "Missing domain knowledge expected at entry level",              delay: "0.15s" },
  { icon: "😟", title: "Low Confidence",          sub: "Nervous, blanks out under interview pressure",                  delay: "0.20s" },
  { icon: "🔍", title: "No Job Leads",            sub: "Applying blindly with no smart matching or strategy",           delay: "0.25s" },
];

/* ── AFTER ATTRIBUTES ──────────────────────────────────────── */
const afterAttrs = [
  { icon: "🎤", title: "Interview-Ready",         sub: "Practised 100+ AI mock sessions, sharp & confident",           delay: "0.05s" },
  { icon: "✅", title: "ATS-Optimised Resume",    sub: "Gets past filters and lands in front of real recruiters",       delay: "0.10s" },
  { icon: "📈", title: "Skills Certified",        sub: "Domain & aptitude skills verified and job-ready",              delay: "0.15s" },
  { icon: "💪", title: "High Confidence",         sub: "Calm, articulate, and prepared for any question",              delay: "0.20s" },
  { icon: "🎯", title: "Smart Job Matching",      sub: "AI matches you to the right roles and companies",              delay: "0.25s" },
];

/* ── TOOLS DATA ────────────────────────────────────────────── */
const tools = [
  { icon: "🎤", title: "Mock Interview",    desc: "Practice with an AI interviewer that adapts to your role and gives instant, detailed feedback on every answer.",         badge: "⭐ Most Popular",  badgeBg: "#EFF6FF", badgeColor: "#2563EB", cardBg: "#fff",                     link: "/MockInterview"  },
  { icon: "📄", title: "Resume Builder",   desc: "Build ATS-optimised resumes that pass screening filters and land in front of real hiring managers.",                     badge: "✓ ATS-Ready",     badgeBg: "#F0FDF4", badgeColor: "#166534", cardBg: "#fff",                     link: "/ResumeBuilder"  },
  { icon: "🔍", title: "Job Hunter",       desc: "Discover opportunities intelligently matched to your profile, skills, and career aspirations.",                          badge: "AI-Matched",       badgeBg: "#FDF4FF", badgeColor: "#7E22CE", cardBg: "#fff",                     link: "/JobHunter"      },
  { icon: "📚", title: "Learning Modules", desc: "Structured, bite-sized courses in communication, domain knowledge, aptitude, and soft skills.",                          badge: "Structured",       badgeBg: "#FFF7ED", badgeColor: "#C2410C", cardBg: "#fff",                     link: "/Modules"        },
  { icon: "❓", title: "Question Bank",    desc: "10,000+ curated questions across technical, HR, and behavioural categories with model answers.",                         badge: "10K+ Questions",   badgeBg: "#F0F9FF", badgeColor: "#0369A1", cardBg: "#fff",                     link: "/QuestionBank"   },
  { icon: "🤖", title: "AI Career Coach", desc: "Get personalised advice on career paths, salary negotiation, and long-term growth strategy.",                            badge: "Coming Soon",      badgeBg: "#fff",    badgeColor: "#4338CA", cardBg: "linear-gradient(135deg,#EFF6FF,#F5F0FF)", link: null },
];

/* ── STEPS DATA ────────────────────────────────────────────── */
const steps = [
  { num: "1", title: "Create Profile",  desc: "Tell us your target role, industry, and current skill level." },
  { num: "2", title: "Practice Daily",  desc: "AI mock interviews and skill modules tailored for you."       },
  { num: "3", title: "Build Resume",    desc: "ATS-optimised resume crafted from your real experience."      },
  { num: "4", title: "Get Hired",       desc: "Apply confidently and land your high-paying dream job."       },
];

/* ── TESTIMONIALS DATA ─────────────────────────────────────── */
const testimonials = [
  {
    initials: "AR", avatarBg: "linear-gradient(135deg,#2563EB,#7C3AED)",
    name: "Arjun Rao",    role: "Associate, Deloitte · ₹14 LPA",
    text: "The AI mock interviews were a game-changer. I went from blanking out to speaking confidently. Got placed at Deloitte within 3 weeks!",
  },
  {
    initials: "PS", avatarBg: "linear-gradient(135deg,#059669,#06B6D4)",
    name: "Priya Sharma",  role: "Analyst, KPMG · ₹11 LPA",
    text: "My resume was getting rejected everywhere. Xprep rebuilt it and I started getting calls within days. Hired at KPMG in 5 weeks!",
  },
  {
    initials: "RK", avatarBg: "linear-gradient(135deg,#F59E0B,#EF4444)",
    name: "Rahul Kumar",   role: "Consultant, EY · ₹16 LPA",
    text: "The Question Bank is incredibly thorough. Every interview question I faced, I had already practised. Landed a Big 4 offer!",
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Home = () => {
  React.useEffect(() => { injectStyles(); }, []);

  /* ── nav scroll shadow ── */
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: T.white, color: T.navy, overflowX: "hidden" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 60px", height: 68,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, zIndex: 200,
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow .3s",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 20 20" width={20} height={20} fill="none">
              <path d="M3 16L9 4L15 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 11H14.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 22, color: T.blue }}>Xprep</span>
        </a>

        {/* Links */}
        <ul style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
          {["Home", "AI Tools", "Modules", "Pricing"].map((l) => (
            <li key={l}><a href={l === "Home" ? "/" : `/${l.replace(" ", "")}`} className="xp-nav-link">{l}</a></li>
          ))}
        </ul>

        {/* Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="xp-btn-ghost">Sign In</button>
          <button className="xp-btn-nav">Get Started →</button>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr 280px",
        minHeight: "calc(100vh - 68px)",
        background: "linear-gradient(150deg, #EFF6FF 0%, #FFFFFF 50%, #F5F0FF 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* grid bg */}
        <div className="xp-grid-bg" />

        {/* ── LEFT PANEL: BEFORE ───────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 24px", position: "relative", zIndex: 2 }}>
          <div className="xp-divider-line" style={{ right: 0 }} />

          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#FEF2F2", border: "1.5px solid #FECACA",
            borderRadius: 24, padding: "8px 16px",
            fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700,
            color: T.red, marginBottom: 20, width: "fit-content",
          }}>
            😰 Before Xprep
          </div>

          {/* Attribute cards – BAD */}
          {beforeAttrs.map((a, i) => (
            <div key={i} className="xp-attr-card bad" style={{ animationDelay: a.delay }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, background: "#FEF2F2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, flexShrink: 0, marginTop: 1,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{a.sub}</div>
              </div>
            </div>
          ))}

          {/* Stat card */}
          <div className="xp-stat-card-inner">
            <div style={{ fontSize: 26 }}>📊</div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800, color: T.red, lineHeight: 1 }}>87%</div>
              <div style={{ fontSize: 12, color: T.gray, marginTop: 2 }}>freshers rejected in round 1</div>
            </div>
          </div>
        </div>

        {/* ── CENTER ───────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", textAlign: "center",
          padding: "60px 48px", position: "relative", zIndex: 5,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: T.blueLight, border: "1.5px solid #BFDBFE",
            borderRadius: 24, padding: "8px 20px",
            fontSize: 13, fontWeight: 600, color: T.blue, marginBottom: 30,
          }}>
            <span className="xp-badge-dot" />
            AI-Powered Career Intelligence Platform
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontSize: 54, fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 22,
          }}>
            <span style={{ color: T.navy, display: "block" }}>Get Interview Ready.</span>
            <span className="xp-h1-gradient" style={{ display: "block" }}>Career Ready.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 17, color: T.gray, lineHeight: 1.75, maxWidth: 390, margin: "0 auto 36px" }}>
            Master interviews with AI-powered mock sessions, build ATS-ready resumes,
            and land your dream job with intelligent career guidance.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
            <button className="xp-btn-hero" onClick={() => window.location.href = "/MockInterview"}>
              Start Free Trial &nbsp;→
            </button>
            <button className="xp-btn-outline">
              ▶ &nbsp;Watch Demo
            </button>
          </div>

          {/* Stats band */}
          <div style={{
            display: "flex", width: "100%",
            border: `1.5px solid ${T.border}`, borderRadius: 14,
            overflow: "hidden", background: T.white,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}>
            {[
              { num: "10K+",   lbl: "Jobs Secured"      },
              { num: "3,436",  lbl: "Interviews Now"     },
              { num: "49,928", lbl: "Interviews Today"   },
            ].map((s, i, arr) => (
              <div key={i} style={{
                flex: 1, padding: "20px 12px", textAlign: "center",
                borderRight: i < arr.length - 1 ? `1.5px solid ${T.border}` : "none",
              }}>
                <div className="xp-stat-num-gradient" style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 4,
                }}>{s.num}</div>
                <div style={{ fontSize: 12, color: T.gray, fontWeight: 500 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: AFTER ───────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 24px", position: "relative", zIndex: 2 }}>
          <div className="xp-divider-line" style={{ left: 0 }} />

          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#F0FDF4", border: "1.5px solid #A7F3D0",
            borderRadius: 24, padding: "8px 16px",
            fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700,
            color: T.green, marginBottom: 20, width: "fit-content",
          }}>
            🏆 After Xprep
          </div>

          {/* Attribute cards – GOOD */}
          {afterAttrs.map((a, i) => (
            <div key={i} className="xp-attr-card good" style={{ animationDelay: a.delay }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, background: "#F0FDF4",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, flexShrink: 0, marginTop: 1,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: "#065F46", marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{a.sub}</div>
              </div>
            </div>
          ))}

          {/* Outcome badge */}
          <div className="xp-outcome-badge">
            <div style={{ fontSize: 28 }}>🎊</div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 800, color: T.white, lineHeight: 1 }}>
                ₹18 LPA — Offer Accepted!
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>
                Average salary jump: 3× for Xprep users
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TRANSFORMATION STRIP ════════════════════════════ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 18, padding: "20px 60px",
        background: "linear-gradient(90deg, #EFF6FF, #F5F0FF)",
        borderTop: "1px solid #DDE8FF", borderBottom: "1px solid #DDE8FF",
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: T.red, whiteSpace: "nowrap" }}>😰 Struggling Fresher</span>
        <div style={{ display: "flex", alignItems: "center", flex: 1, maxWidth: 480, gap: 10 }}>
          {/* Left line */}
          <div style={{ flex: 1, height: 3, background: "linear-gradient(90deg,#FCA5A5,#93C5FD)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <span className="xp-shine" />
          </div>
          {/* Pill */}
          <div style={{
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            color: T.white, borderRadius: 24, padding: "10px 24px",
            fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 18px rgba(99,60,220,0.35)", whiteSpace: "nowrap", flexShrink: 0,
          }}>✦ &nbsp;Xprep AI &nbsp;✦</div>
          {/* Right line */}
          <div style={{ flex: 1, height: 3, background: "linear-gradient(90deg,#93C5FD,#6EE7B7)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <span className="xp-shine delay" />
          </div>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: T.green, whiteSpace: "nowrap" }}>🏆 Hired Professional</span>
      </div>

      {/* ══ AI TOOLS ════════════════════════════════════════ */}
      <div style={{ padding: "80px 60px", background: T.white }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, color: T.navy, marginBottom: 10 }}>
            AI-Powered Interview Tools
          </h2>
          <p style={{ fontSize: 16, color: T.gray }}>Everything you need to ace your interviews and land your dream job</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, maxWidth: 1000, margin: "0 auto" }}>
          {tools.map((t, i) => (
            <div
              key={i}
              className="xp-tool-card"
              style={{ background: t.cardBg, borderColor: i === 5 ? "#C7D2FE" : T.border }}
              onClick={() => t.link && (window.location.href = t.link)}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 12,
                background: i === 5 ? T.white : t.badgeBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 16,
              }}>{t.icon}</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{t.title}</h3>
              <p style={{ fontSize: 13.5, color: T.gray, lineHeight: 1.65 }}>{t.desc}</p>
              <div style={{
                display: "inline-block", marginTop: 14, fontSize: 11.5, fontWeight: 600,
                padding: "4px 12px", borderRadius: 20,
                background: t.badgeBg, color: t.badgeColor,
              }}>{t.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <div style={{ padding: "80px 60px", background: "#F8FAFF" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, color: T.navy, marginBottom: 10 }}>
            How Xprep Works
          </h2>
          <p style={{ fontSize: 16, color: T.gray }}>From sign-up to dream job in 4 simple steps</p>
        </div>

        <div className="xp-steps-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, maxWidth: 960, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 16px", position: "relative", zIndex: 1 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: T.white,
                marginBottom: 18, boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
              }}>{s.num}</div>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 6 }}>{s.title}</h4>
              <p style={{ fontSize: 12.5, color: T.gray, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TESTIMONIALS ════════════════════════════════════ */}
      <div style={{ padding: "80px 60px", background: T.white }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, color: T.navy, marginBottom: 10 }}>
            Success Stories
          </h2>
          <p style={{ fontSize: 16, color: T.gray }}>Real professionals who transformed their careers with Xprep</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, maxWidth: 960, margin: "0 auto" }}>
          {testimonials.map((t, i) => (
            <div key={i} className="xp-proof-card">
              <div style={{ color: T.gold, fontSize: 14, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 13.5, color: T.slate, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: t.avatarBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
                  color: T.white, flexShrink: 0,
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: T.gray }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA BANNER ══════════════════════════════════════ */}
      <div
        className="xp-cta-banner"
        style={{
          padding: "80px 60px",
          background: `linear-gradient(135deg, ${T.navy} 0%, ${T.slate} 60%, #1E1B4B 100%)`,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: T.white, marginBottom: 14, position: "relative" }}>
          Ready to Transform Your Career?
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", marginBottom: 36, position: "relative" }}>
          Join 10,000+ professionals who landed their dream jobs with Xprep
        </p>
        <button className="xp-btn-white" onClick={() => window.location.href = "/MockInterview"}>
          Start Free Today &nbsp;→
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, marginTop: 28, position: "relative" }}>
          {["Free to start", "No credit card needed", "Cancel anytime"].map((txt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              ✓ &nbsp;{txt}
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{
        padding: "28px 60px",
        background: "#070D1A",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: T.white }}>⚡ Xprep</div>
        <ul style={{ display: "flex", gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
          {["About", "Privacy Policy", "Terms", "Contact"].map((l) => (
            <li key={l}><a href={`/${l.replace(" ", "")}`} className="xp-foot-link">{l}</a></li>
          ))}
        </ul>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 Xprep.in · All rights reserved
        </div>
      </footer>

    </div>
  );
};

export default Home;