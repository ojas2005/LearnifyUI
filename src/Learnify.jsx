import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "";

//CSS Injection─────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --clay-white: rgba(255,255,255,0.88);
  --clay-shadow: 6px 6px 0px rgba(0,0,0,0.13);
  --clay-inset: inset -2px -2px 7px rgba(0,0,0,0.08), inset 2px 2px 7px rgba(255,255,255,0.65);
  --clay-border: 2.5px solid rgba(0,0,0,0.07);
  --clay-radius: 24px;
  --purple: #7C3AED;
  --purple-dark: #5B21B6;
  --purple-light: #C4B5FD;
  --lilac: #EDE9FE;
  --mint: #A7F3D0;
  --sky: #BAE6FD;
  --peach: #FED7AA;
  --rose: #FECDD3;
  --lemon: #FEF08A;
  --cream: #FDFCFB;
  --font: 'Nunito', sans-serif;
}

body { font-family: var(--font); background: #F5F0FF; }

/*Clay primitives*/
.clay-card {
  background: var(--clay-white);
  border-radius: var(--clay-radius);
  border: var(--clay-border);
  box-shadow: var(--clay-shadow), var(--clay-inset);
  backdrop-filter: blur(4px);
}

.clay-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px;
  border-radius: 9999px;
  border: 2.5px solid var(--purple-dark);
  background: var(--purple);
  color: white;
  font-family: var(--font);
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--purple-dark);
  transition: transform 0.12s, box-shadow 0.12s;
  text-decoration: none;
  white-space: nowrap;
}
.clay-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px var(--purple-dark); }
.clay-btn:active { transform: translate(2px,2px); box-shadow: 2px 2px 0px var(--purple-dark); }
.clay-btn.outline {
  background: rgba(255,255,255,0.9);
  color: var(--purple);
  border-color: var(--purple-light);
  box-shadow: 4px 4px 0px var(--purple-light);
}
.clay-btn.outline:hover { box-shadow: 6px 6px 0px var(--purple-light); }
.clay-btn.outline:active { box-shadow: 2px 2px 0px var(--purple-light); }
.clay-btn.sm { padding: 8px 18px; font-size: 13px; }
.clay-btn.danger { background: #EF4444; border-color: #B91C1C; box-shadow: 4px 4px 0px #B91C1C; }
.clay-btn.success { background: #10B981; border-color: #065F46; box-shadow: 4px 4px 0px #065F46; }

.clay-input {
  background: rgba(255,255,255,0.92);
  border: 2.5px solid #E0D7FF;
  border-radius: 16px;
  box-shadow: inset 3px 3px 6px rgba(0,0,0,0.05);
  padding: 12px 18px;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
  color: #2D1B69;
}
.clay-input:focus { border-color: var(--purple); }
.clay-input::placeholder { color: #A78BFA; font-weight: 600; }

.clay-badge {
  display: inline-flex; align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-family: var(--font);
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid;
}

.clay-progress-wrap {
  height: 14px; border-radius: 9999px;
  background: #EDE9FE; border: 2px solid #C4B5FD; overflow: hidden;
}
.clay-progress-fill {
  height: 100%; border-radius: 9999px;
  background: linear-gradient(90deg, #A7F3D0, #34D399);
  transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1);
}

/*Layout*/
.app { min-height: 100vh; background: var(--cream); position: relative; overflow: hidden; }

/* Blobs */
.blob {
  position: absolute; border-radius: 50%;
  filter: blur(60px); opacity: 0.35;
  animation: float-blob 8s ease-in-out infinite;
  pointer-events: none;
}
@keyframes float-blob {
  0%,100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-24px) scale(1.04); }
}

/*Navbar*/
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 32px;
  background: rgba(253,252,251,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid rgba(196,181,253,0.3);
  box-shadow: 0 2px 16px rgba(124,58,237,0.08);
}
.logo { font-size: 26px; font-weight: 900; color: var(--purple); cursor: pointer; user-select: none; }
.logo span { color: #F59E0B; }
.nav-links { display: flex; align-items: center; gap: 8px; }
.nav-link {
  padding: 8px 16px; border-radius: 9999px;
  font-weight: 700; font-size: 14px; color: #5B21B6;
  cursor: pointer; transition: background 0.15s;
  border: 2px solid transparent;
}
.nav-link:hover { background: #EDE9FE; border-color: #C4B5FD; }
.nav-link.active { background: #EDE9FE; border-color: #C4B5FD; }

/*Hero*/
.hero { padding: 80px 32px 60px; text-align: center; position: relative; }
.hero h1 {
  font-size: clamp(40px, 6vw, 68px); font-weight: 900;
  color: #2D1B69; line-height: 1.1; margin-bottom: 20px;
  animation: slide-up 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
}
.hero h1 span { color: var(--purple); }
.hero p {
  font-size: 18px; font-weight: 600; color: #6B7280; max-width: 520px;
  margin: 0 auto 36px; line-height: 1.6;
  animation: slide-up 0.7s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
}
.hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  animation: slide-up 0.7s 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }

@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/*Stats bar*/
.stats-bar {
  display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;
  padding: 0 32px 60px;
  animation: slide-up 0.7s 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
}
.stat-clay {
  padding: 18px 32px; text-align: center;
  animation: pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}
.stat-clay .num { font-size: 36px; font-weight: 900; color: var(--purple); }
.stat-clay .lbl { font-size: 13px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; }

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}

/*Section*/
.section { padding: 48px 32px; }
.section-title {
  font-size: 30px; font-weight: 900; color: #2D1B69;
  margin-bottom: 8px;
}
.section-sub { font-size: 15px; font-weight: 600; color: #9CA3AF; margin-bottom: 32px; }

/*Course Cards*/
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 24px; }
.course-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.course-card:hover { transform: translateY(-6px) rotate(-0.5deg); box-shadow: 10px 12px 0px rgba(0,0,0,0.15), var(--clay-inset); }
.course-cover {
  height: 160px; border-radius: 18px 18px 0 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 48px; margin: -1px -1px 0;
}
.course-body { padding: 16px 20px 20px; }
.course-title { font-size: 16px; font-weight: 800; color: #2D1B69; margin-bottom: 6px; line-height: 1.3; }
.course-instructor { font-size: 13px; font-weight: 600; color: #9CA3AF; margin-bottom: 10px; }
.course-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.course-price { font-size: 20px; font-weight: 900; color: var(--purple); }
.stars { color: #F59E0B; font-size: 14px; font-weight: 700; }

/*Topics*/
.topics-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.topic-pill {
  padding: 12px 22px; border-radius: 9999px;
  font-weight: 800; font-size: 14px; cursor: pointer;
  border: 2.5px solid; transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 3px 3px 0px rgba(0,0,0,0.1);
}
.topic-pill:hover { transform: scale(1.08) translateY(-2px); box-shadow: 5px 5px 0px rgba(0,0,0,0.15); }
.topic-pill.active { transform: scale(1.05); box-shadow: 5px 5px 0px rgba(0,0,0,0.18); }

/*How it Works*/
.steps-row { display: flex; gap: 0; align-items: flex-start; flex-wrap: wrap; }
.step-box { flex: 1; min-width: 200px; padding: 28px 24px; text-align: center; }
.step-num {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--purple); color: white;
  font-size: 22px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 4px 4px 0px var(--purple-dark);
}
.step-title { font-size: 18px; font-weight: 800; color: #2D1B69; margin-bottom: 8px; }
.step-desc { font-size: 14px; font-weight: 600; color: #9CA3AF; line-height: 1.5; }

/*Auth*/
.auth-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
.auth-card { width: 100%; max-width: 440px; padding: 40px; }
.auth-title { font-size: 28px; font-weight: 900; color: #2D1B69; margin-bottom: 6px; }
.auth-sub { font-size: 14px; font-weight: 600; color: #9CA3AF; margin-bottom: 28px; }
.form-group { margin-bottom: 18px; }
.form-label { font-size: 13px; font-weight: 800; color: #5B21B6; margin-bottom: 6px; display: block; }
.role-pills { display: flex; gap: 10px; }
.role-pill {
  flex: 1; padding: 10px; text-align: center; border-radius: 14px;
  border: 2.5px solid #E0D7FF; font-weight: 800; font-size: 14px;
  cursor: pointer; color: #9CA3AF; background: rgba(255,255,255,0.9);
  transition: all 0.15s;
}
.role-pill.active { border-color: var(--purple); background: #EDE9FE; color: var(--purple); }

/*Dashboard*/
.dash-wrap { padding: 32px; }
.dash-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 20px; margin-bottom: 36px; }
.stat-card { padding: 24px 28px; }
.stat-card .icon { font-size: 32px; margin-bottom: 10px; }
.stat-card .val { font-size: 36px; font-weight: 900; color: var(--purple); }
.stat-card .label { font-size: 13px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

.enrolled-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 20px; }
.enrolled-card { padding: 22px; }
.enrolled-title { font-size: 16px; font-weight: 800; color: #2D1B69; margin-bottom: 4px; }
.enrolled-meta { font-size: 13px; font-weight: 600; color: #9CA3AF; margin-bottom: 14px; }
.status-badge {
  display: inline-block; padding: 3px 10px; border-radius: 9999px;
  font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
}

/*Lesson Player*/
.player-wrap { display: flex; height: calc(100vh - 70px); overflow: hidden; }
.lesson-sidebar {
  width: 280px; flex-shrink: 0;
  overflow-y: auto; padding: 20px;
  border-right: 2px solid rgba(196,181,253,0.3);
  background: rgba(253,252,251,0.9);
}
.lesson-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 14px; cursor: pointer;
  margin-bottom: 6px; transition: all 0.15s;
  font-weight: 700; font-size: 13px; color: #5B21B6;
  border: 2px solid transparent;
  animation: slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}
.lesson-row:hover { background: #EDE9FE; border-color: #C4B5FD; }
.lesson-row.active { background: #EDE9FE; border-color: var(--purple); color: var(--purple); }
.lesson-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #C4B5FD; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
.lesson-check.done { background: var(--mint); border-color: #34D399; color: #065F46; }

.player-main { flex: 1; overflow-y: auto; padding: 32px; }
.video-container {
  border-radius: 20px; overflow: hidden;
  aspect-ratio: 16/9; max-width: 720px; width: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 64px; margin-bottom: 24px;
  box-shadow: var(--clay-shadow);
  border: var(--clay-border);
}

/*Admin*/
.admin-wrap { padding: 32px; }
.table-wrap { overflow-x: auto; }
.clay-table { width: 100%; border-collapse: collapse; }
.clay-table th {
  padding: 12px 16px; text-align: left;
  font-size: 12px; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(196,181,253,0.3);
}
.clay-table td {
  padding: 14px 16px; font-size: 14px; font-weight: 600; color: #2D1B69;
  border-bottom: 1px solid rgba(196,181,253,0.2);
}
.clay-table tr:hover td { background: rgba(237,233,254,0.3); }

/*Toast*/
.toast-wrap {
  position: fixed; top: 80px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px;
  pointer-events: none;
}
.toast {
  padding: 14px 22px; border-radius: 16px; font-weight: 700; font-size: 14px;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.12);
  animation: toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  pointer-events: all;
}
.toast.success { background: #D1FAE5; border: 2.5px solid #34D399; color: #065F46; }
.toast.error { background: #FEE2E2; border: 2.5px solid #F87171; color: #991B1B; }
.toast.info { background: #EDE9FE; border: 2.5px solid #C4B5FD; color: var(--purple); }
@keyframes toast-in { from { opacity:0; transform: translateX(80px); } to { opacity:1; transform: translateX(0); } }

/*Modal*/
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(45,27,105,0.35); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fade-in 0.2s ease both;
}
@keyframes fade-in { from { opacity:0; } to { opacity:1; } }
.modal-card {
  width: 100%; max-width: 520px; padding: 36px;
  animation: modal-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  max-height: 85vh; overflow-y: auto;
}
@keyframes modal-pop { from { opacity:0; transform: scale(0.8); } to { opacity:1; transform: scale(1); } }

/*Misc*/
.divider { height: 2px; background: linear-gradient(90deg, transparent, rgba(196,181,253,0.4), transparent); margin: 8px 0; }
.empty-state { text-align: center; padding: 48px 24px; color: #9CA3AF; }
.empty-state .emoji { font-size: 56px; margin-bottom: 16px; }
.empty-state p { font-weight: 700; font-size: 16px; }
.tab-bar { display: flex; gap: 6px; padding: 6px; border-radius: 18px; background: rgba(237,233,254,0.5); border: 2px solid rgba(196,181,253,0.3); margin-bottom: 24px; }
.tab { padding: 10px 20px; border-radius: 14px; font-weight: 800; font-size: 14px; color: #9CA3AF; cursor: pointer; transition: all 0.15s; }
.tab.active { background: white; color: var(--purple); box-shadow: 3px 3px 0px rgba(196,181,253,0.5); border: 2px solid rgba(196,181,253,0.4); }
.textarea-clay {
  background: rgba(255,255,255,0.92); border: 2.5px solid #E0D7FF;
  border-radius: 16px; box-shadow: inset 3px 3px 6px rgba(0,0,0,0.05);
  padding: 12px 18px; font-family: var(--font); font-weight: 600;
  font-size: 14px; width: 100%; outline: none; resize: vertical; min-height: 100px;
  transition: border-color 0.2s; color: #2D1B69;
}
.textarea-clay:focus { border-color: var(--purple); }
.select-clay {
  background: rgba(255,255,255,0.92); border: 2.5px solid #E0D7FF;
  border-radius: 16px; box-shadow: inset 3px 3px 6px rgba(0,0,0,0.05);
  padding: 12px 18px; font-family: var(--font); font-weight: 600;
  font-size: 14px; width: 100%; outline: none; color: #2D1B69;
  appearance: none; cursor: pointer;
}
.skeleton { background: linear-gradient(90deg,#EDE9FE 25%,#F5F3FF 50%,#EDE9FE 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
@keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

/* Exam/Quiz styles */
.quiz-option {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 14px;
  border: 2.5px solid #E0D7FF; background: rgba(255,255,255,0.9);
  cursor: pointer; transition: all 0.15s; margin-bottom: 8px;
  font-weight: 700; font-size: 14px; color: #2D1B69;
}
.quiz-option:hover { border-color: var(--purple); background: #EDE9FE; }
.quiz-option.selected { border-color: var(--purple); background: #EDE9FE; }
.quiz-option.correct { border-color: #10B981; background: #D1FAE5; color: #065F46; }
.quiz-option.wrong { border-color: #EF4444; background: #FEE2E2; color: #991B1B; }
.quiz-dot {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  border: 2.5px solid #A78BFA; display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800;
}
.quiz-result-card { padding: 28px; text-align: center; }
.exam-q-builder { background: #F9F7FF; border: 2px solid #EDE9FE; border-radius: 16px; padding: 16px; margin-bottom: 12px; }
`;


//API Wrapper ─
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("token");
    if (!window.location.hash.includes("login")) window.location.reload();
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

//Constants─
const TOPICS = [
  { name: "Programming", color: "#EDE9FE", border: "#A78BFA", text: "#5B21B6", emoji: "⚛️", gradient: "linear-gradient(135deg,#A78BFA,#7C3AED)" },
  { name: "Design", color: "#FEE2E2", border: "#FCA5A5", text: "#B91C1C", emoji: "🎨", gradient: "linear-gradient(135deg,#FCA5A5,#F43F5E)" },
  { name: "Business", color: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8", emoji: "💼", gradient: "linear-gradient(135deg,#93C5FD,#3B82F6)" },
  { name: "Data", color: "#D1FAE5", border: "#6EE7B7", text: "#065F46", emoji: "📊", gradient: "linear-gradient(135deg,#6EE7B7,#10B981)" },
  { name: "Music", color: "#FEF3C7", border: "#FDE68A", text: "#92400E", emoji: "🎸", gradient: "linear-gradient(135deg,#FDBA74,#EA580C)" },
  { name: "Photography", color: "#FCE7F3", border: "#F9A8D4", text: "#9D174D", emoji: "📸", gradient: "linear-gradient(135deg,#FDE68A,#F59E0B)" },
  { name: "Marketing", color: "#F0FDF4", border: "#86EFAC", text: "#166534", emoji: "📈", gradient: "linear-gradient(135deg,#86EFAC,#166534)" },
  { name: "Language", color: "#FFF7ED", border: "#FDBA74", text: "#92400E", emoji: "🌍", gradient: "linear-gradient(135deg,#FDBA74,#92400E)" },
];

//Helpers
function Stars({ n }) {
  return <span className="stars">{"★".repeat(Math.round(n))}{"☆".repeat(5 - Math.round(n))} {n.toFixed(1)}</span>;
}

function Badge({ topic }) {
  const t = TOPICS.find(x => x.name === topic) || TOPICS[0];
  return <span className="clay-badge" style={{ background: t.color, borderColor: t.border, color: t.text }}>{topic}</span>;
}

function DiffBadge({ level }) {
  const map = { Beginner: ["#D1FAE5", "#34D399", "#065F46"], Intermediate: ["#FEF3C7", "#F59E0B", "#92400E"], Advanced: ["#FEE2E2", "#F87171", "#991B1B"] };
  const [bg, bd, tx] = map[level] || map.Beginner;
  return <span className="clay-badge" style={{ background: bg, borderColor: bd, color: tx }}>{level}</span>;
}

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

function CountUp({ target, suffix = "" }) {
  const val = useCountUp(target);
  return <>{val.toLocaleString()}{suffix}</>;
}

//Toast System ─
function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

//Navbar──
function Navbar({ page, setPage, user, setUser, addToast }) {
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("landing");
    addToast("Signed out", "info");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setPage("landing")}>Learn<span>ify</span></div>
      <div className="nav-links">
        <span className={`nav-link${page === "catalog" ? " active" : ""}`} onClick={() => setPage("catalog")}>Courses</span>
        {user && user.role === "Learner" && <span className={`nav-link${page === "dashboard" ? " active" : ""}`} onClick={() => setPage("dashboard")}>Dashboard</span>}
        {user && user.role === "Instructor" && <span className={`nav-link${page === "instructor" ? " active" : ""}`} onClick={() => setPage("instructor")}>Instructor</span>}
        {user && user.role === "Administrator" && <span className={`nav-link${page === "admin" ? " active" : ""}`} onClick={() => setPage("admin")}>Admin</span>}
        {user
          ? <button className="clay-btn sm" onClick={logout}>Sign Out</button>
          : <><span className="nav-link" onClick={() => setPage("login")}>Sign In</span>
            <button className="clay-btn sm" onClick={() => setPage("register")}>Get Started</button></>
        }
      </div>
    </nav>
  );
}

//Course Card
function CourseCard({ course, onClick }) {
  return (
    <div className="clay-card course-card" onClick={() => onClick(course)} style={{ animation: `pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both` }}>
      <div className="course-cover" style={{ background: course.gradient }}>
        <span>{course.emoji}</span>
      </div>
      <div className="course-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <Badge topic={course.topic} />
          <DiffBadge level={course.difficulty} />
        </div>
        <div className="course-title">{course.title}</div>
        <div className="course-instructor">by {course.instructor}</div>
        <Stars n={course.rating} />
        <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>{course.reviews?.toLocaleString() || 0} reviews</div>
        <div className="course-meta">
          <span className="course-price">${course.price}</span>
          <button className="clay-btn sm">View →</button>
        </div>
      </div>
    </div>
  );
}

//Landing Page ─
function LandingPage({ setPage, courses, setSelectedCourse }) {
  const [filter, setFilter] = useState(null);
  const filtered = filter ? courses.filter(c => c.topic === filter) : courses;

  return (
    <div>
      {/* Blobs */}
      <div className="blob" style={{ width: 400, height: 400, background: "#C4B5FD", top: -80, left: -80, animationDelay: "0s" }} />
      <div className="blob" style={{ width: 300, height: 300, background: "#BAE6FD", top: 200, right: -60, animationDelay: "2s" }} />
      <div className="blob" style={{ width: 260, height: 260, background: "#A7F3D0", bottom: 200, left: "30%", animationDelay: "4s" }} />

      {/* Hero */}
      <div className="hero">
        <h1>Learn Anything.<br /><span>Beautifully.</span></h1>
        <p>Join 50,000+ learners on Learnify — your playful online university for the modern age.</p>
        <div className="hero-btns">
          <button className="clay-btn" onClick={() => setPage("register")}>🚀 Get Started Free</button>
          <button className="clay-btn outline" onClick={() => setPage("catalog")}>Browse Courses</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {[{ n: 1200, s: "+ Courses", d: "0s" }, { n: 50000, s: "+ Learners", d: "0.1s" }, { n: 320, s: "+ Instructors", d: "0.2s" }].map((item, i) => (
          <div key={i} className="clay-card stat-clay" style={{ animationDelay: item.d }}>
            <div className="num"><CountUp target={item.n} /></div>
            <div className="lbl">{item.s}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="section">
        <div className="section-title">Browse by Topic</div>
        <div className="section-sub">Pick your passion and dive right in</div>
        <div className="topics-grid">
          {TOPICS.map(t => (
            <div key={t.name} className={`topic-pill${filter === t.name ? " active" : ""}`}
              style={{ background: t.color, borderColor: t.border, color: t.text }}
              onClick={() => setFilter(filter === t.name ? null : t.name)}>
              {t.name}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="section">
        <div className="section-title">Featured Courses</div>
        <div className="section-sub">Handpicked by our expert team</div>
        <div className="courses-grid">
          {filtered.slice(0, 6).map(c => (
            <CourseCard key={c.id} course={c} onClick={() => { setSelectedCourse(c); setPage("detail"); }} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="emoji">🔍</div>
            <p>No courses in this topic yet!</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="section">
        <div className="section-title">How It Works</div>
        <div className="section-sub">Three simple steps to start learning</div>
        <div className="clay-card steps-row">
          {[{ n: "1", t: "Browse", d: "Explore 1,200+ courses across 8 topics" },
          { n: "2", t: "Enroll", d: "Join in one click, flexible pricing" },
          { n: "3", t: "Learn", d: "Watch, read, quiz — at your own pace" }].map((s, i) => (
            <div key={i} className="step-box">
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="section">
        <div className="section-title">What Learners Say</div>
        <div className="courses-grid">
          {[
            { name: "Aisha K.", init: "AK", text: "Learnify completely changed my career. The design courses are world-class!", rating: 5, color: "#EDE9FE", tc: "#5B21B6" },
            { name: "Marco R.", init: "MR", text: "I went from zero to full-stack dev in 6 months. The instructors are amazing.", rating: 5, color: "#D1FAE5", tc: "#065F46" },
            { name: "Priya S.", init: "PS", text: "Best learning platform out there. The interface makes studying actually fun.", rating: 5, color: "#FEE2E2", tc: "#991B1B" },
          ].map((r, i) => (
            <div key={i} className="clay-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: r.tc, fontSize: 15, border: `2.5px solid ${r.tc}33` }}>{r.init}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#2D1B69" }}>{r.name}</div>
                  <Stars n={r.rating} />
                </div>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", lineHeight: 1.6 }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "rgba(237,233,254,0.5)", borderTop: "2px solid rgba(196,181,253,0.3)", padding: "32px", textAlign: "center" }}>
        <div className="logo" style={{ fontSize: 22, marginBottom: 8 }}>Learn<span style={{ color: "#F59E0B" }}>ify</span></div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>© 2024 Learnify. Built with 💜 for curious minds.</div>
      </div>
    </div>
  );
}

//Catalog Page ─
function CatalogPage({ setPage, setSelectedCourse, courses, loading }) {
  const [q, setQ] = useState("");
  const [topicF, setTopicF] = useState(null);
  const [diffF, setDiffF] = useState(null);
  const [sort, setSort] = useState("popular");

  let results = courses.filter(c => {
    if (q && !c.title.toLowerCase().includes(q.toLowerCase()) && !c.instructor.toLowerCase().includes(q.toLowerCase())) return false;
    if (topicF && c.topic !== topicF) return false;
    if (diffF && c.difficulty !== diffF) return false;
    return true;
  });
  if (sort === "rating") results = [...results].sort((a, b) => b.rating - a.rating);
  if (sort === "price") results = [...results].sort((a, b) => a.price - b.price);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
      {/* Sidebar */}
      <div className="clay-card" style={{ width: 260, flexShrink: 0, margin: 20, padding: 24, alignSelf: "start", position: "sticky", top: 90, animation: "slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#2D1B69", marginBottom: 18 }}>🔍 Filter</div>
        <input className="clay-input" placeholder="Search courses..." value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 18 }} />
        <div className="form-label" style={{ marginBottom: 10 }}>Topic</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {TOPICS.map(t => (
            <div key={t.name} onClick={() => setTopicF(topicF === t.name ? null : t.name)}
              style={{
                padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 800, cursor: "pointer",
                background: topicF === t.name ? t.color : "white", borderColor: t.border, color: topicF === t.name ? t.text : "#9CA3AF",
                border: "2px solid", transition: "all 0.15s"
              }}>
              {t.name}
            </div>
          ))}
        </div>
        <div className="form-label" style={{ marginBottom: 10 }}>Difficulty</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {["Beginner", "Intermediate", "Advanced"].map(d => (
            <div key={d} onClick={() => setDiffF(diffF === d ? null : d)}
              style={{
                padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 800, cursor: "pointer",
                background: diffF === d ? "#EDE9FE" : "white", border: "2px solid", borderColor: diffF === d ? "#A78BFA" : "#E0D7FF",
                color: diffF === d ? "#5B21B6" : "#9CA3AF", transition: "all 0.15s"
              }}>
              {d}
            </div>
          ))}
        </div>
        <div className="form-label" style={{ marginBottom: 10 }}>Sort By</div>
        <select className="select-clay" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: "20px 20px 20px 0" }}>
        <div style={{ fontWeight: 800, color: "#9CA3AF", fontSize: 14, marginBottom: 16 }}>{results.length} courses found</div>
        {loading ? (
          <div className="courses-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="clay-card" style={{ overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 160, borderRadius: "18px 18px 0 0" }} />
                <div style={{ padding: 16 }}>
                  <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 12, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="courses-grid">
            {results.map(c => (
              <CourseCard key={c.id} course={c} onClick={(course) => { setSelectedCourse(course); setPage("detail"); }} />
            ))}
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="empty-state">
            <div className="emoji">🌵</div>
            <p>No courses match your filters. Try broadening your search!</p>
          </div>
        )}
      </div>
    </div>
  );
}

//Course Detail 
function CourseDetailPage({ course, user, setPage, addToast, enrolled, onEnroll, enrollmentInfo }) {
  const [tab, setTab] = useState("curriculum");
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [curLoading, setCurLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setCurLoading(true);
      apiFetch(`/api/curriculum/api/curriculum/course/${course.id}`)
        .then(setCurriculum)
        .catch(err => console.error("Curriculum load failed", err))
        .finally(() => setCurLoading(false));
      
      apiFetch(`/api/reviews/api/reviews/course/${course.id}`)
        .then(setReviews)
        .catch(err => console.error("Reviews load failed", err));
    }
  }, [course]);

  if (!course) return <div className="empty-state"><div className="emoji">📚</div><p>Select a course to view details.</p></div>;

  return (
    <div style={{ padding: 32, animation: "slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left */}
        <div style={{ flex: "2 1 400px" }}>
          <div className="clay-card" style={{ overflow: "hidden", marginBottom: 24 }}>
            <div style={{ height: 240, background: course.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>{course.emoji}</div>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <Badge topic={course.topic} />
                <DiffBadge level={course.difficulty} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#2D1B69", marginBottom: 8, lineHeight: 1.2 }}>{course.title}</h1>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>by {course.instructor}</div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontWeight: 900, color: "#2D1B69", fontSize: 20 }}>{course.rating}</div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>Rating</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontWeight: 900, color: "#2D1B69", fontSize: 20 }}>{course.reviews?.toLocaleString() || 0}</div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>Reviews</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontWeight: 900, color: "#2D1B69", fontSize: 20 }}>{curriculum.length || 0}</div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>Lessons</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontWeight: 900, color: "#2D1B69", fontSize: 20 }}>{course.totalRuntimeMinutes ? Math.round(course.totalRuntimeMinutes / 60) + "h" : "1.5h"}</div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>Runtime</div></div>
              </div>
              <p style={{ marginTop: 20, color: "#6B7280", fontWeight: 600, lineHeight: 1.6 }}>{course.synopsis}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar">
            {["curriculum", "reviews"].map(t => (
              <div key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</div>
            ))}
          </div>

          {tab === "curriculum" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {curLoading ? [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />) : curriculum.map((l, i) => (
                <div key={l.id} className="clay-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.15s", animation: `slide-up 0.4s ${i * 0.07}s cubic-bezier(0.34,1.56,0.64,1) both` }}
                  onClick={() => enrolled && setPage("player")}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    background: l.format === "quiz" ? "#FEF3C7" : l.format === "article" ? "#DBEAFE" : "#EDE9FE",
                    border: `2px solid ${l.format === "quiz" ? "#F59E0B" : l.format === "article" ? "#93C5FD" : "#A78BFA"}`
                  }}>
                    {l.format === "video" ? "▶" : l.format === "article" ? "📄" : "✏️"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "#2D1B69", fontSize: 14 }}>{l.title}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{l.durationMinutes}m · {l.format}</div>
                  </div>
                </div>
              ))}
              {curriculum.length === 0 && !curLoading && <div className="empty-state">No lessons added yet.</div>}
            </div>
          )}
          {tab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviews.map((r, i) => (
                <div key={i} className="clay-card" style={{ padding: 20 }}>
                  <Stars n={r.rating} /> 
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", marginBottom: 4 }}>by {r.userName || "Anonymous"}</div>
                  <p style={{ marginTop: 8, fontWeight: 600, color: "#6B7280", fontSize: 14 }}>{r.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <div className="empty-state">No reviews yet. Be the first to review!</div>}
            </div>
          )}
        </div>

        {/* Enroll Box */}
        <div style={{ flex: "1 1 260px" }}>
          <div className="clay-card" style={{ padding: 28, position: "sticky", top: 90 }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: enrolled ? "#10B981" : "" + (course.price === 0 ? "#10B981" : "var(--purple)"), marginBottom: 16 }}>
              {enrolled ? "Enrolled ✓" : "$" + course.price}
            </div>
            {enrolled ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 6 }}>Your Progress</div>
                  <div className="clay-progress-wrap">
                    <div className="clay-progress-fill" style={{ width: `${enrollmentInfo?.completionPercent || 0}%` }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", marginTop: 4, textAlign: "right" }}>{enrollmentInfo?.completionPercent || 0}%</div>
                </div>
                <button className="clay-btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPage("player")}>▶ Continue Learning</button>
              </>
            ) : (
              <button className="clay-btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onEnroll(course.id)}>Enroll Now</button>
            )}
            <div className="divider" style={{ margin: "20px 0" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>✓ Lifetime access<br />✓ Certificate included<br />✓ 30-day refund policy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Lesson Player 
function LessonPlayerPage({ course, addToast }) {
  const [curriculum, setCurriculum] = useState([]);
  const [activeLesson, setActiveLesson] = useState(0);
  const [done, setDone] = useState({});
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons"); // "lessons" | "quizzes"

  useEffect(() => {
    if (course) {
      setLoading(true);
      apiFetch(`/api/curriculum/api/curriculum/course/${course.id}`)
        .then(setCurriculum)
        .catch(console.error)
        .finally(() => setLoading(false));
      apiFetch(`/api/exams/api/exams/course/${course.id}`)
        .then(data => setExams(data.filter(e => e.isPublished)))
        .catch(console.error);
    }
  }, [course]);

  const lesson = curriculum[activeLesson];

  const markDone = async () => {
    try {
      await apiFetch("/api/tracking/api/tracking/progress", {
        method: "POST",
        body: JSON.stringify({ courseId: course.id, lessonId: lesson.id, status: 2 })
      });
      setDone(prev => ({ ...prev, [activeLesson]: true }));
      addToast("Lesson marked complete! 🎯", "success");
      if (activeLesson < curriculum.length - 1) setTimeout(() => setActiveLesson(activeLesson + 1), 600);
    } catch (err) {
      addToast("Failed to save progress", "error");
    }
  };

  if (loading) return <div className="empty-state">Loading course player...</div>;
  if (!lesson && curriculum.length === 0) return <div className="empty-state">No lessons found.</div>;

  return (
    <div className="player-wrap">
      <div className="lesson-sidebar">
        <div style={{ fontWeight: 900, fontSize: 16, color: "#2D1B69", marginBottom: 12 }}>📚 Curriculum</div>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {["lessons", "quizzes"].map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, textAlign: "center", padding: "6px 8px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12, background: activeTab === t ? "var(--purple)" : "rgba(255,255,255,0.7)", color: activeTab === t ? "white" : "#7C3AED", border: `2px solid ${activeTab === t ? "var(--purple-dark)" : "#E0D7FF"}`, transition: "all 0.15s" }}>
              {t === "lessons" ? "📖 Lessons" : `🧪 Quizzes${exams.length > 0 ? ` (${exams.length})` : ""}`}
            </div>
          ))}
        </div>

        {activeTab === "lessons" && curriculum.map((l, i) => (
          <div key={l.id} className={`lesson-row${activeLesson === i ? " active" : ""}`} onClick={() => { setActiveLesson(i); setActiveTab("lessons"); }} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`lesson-check${done[i] ? " done" : ""}`}>{done[i] ? "✓" : i + 1}</div>
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div>{l.title}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{l.durationMinutes}m · {l.format}</div>
            </div>
          </div>
        ))}

        {activeTab === "quizzes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exams.length === 0 ? (
              <div style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 600, padding: 8 }}>No quizzes available yet.</div>
            ) : exams.map(exam => (
              <div key={exam.id} className="clay-card" onClick={() => setActiveExam(exam)} style={{ padding: "10px 14px", cursor: "pointer", transition: "transform 0.15s", border: "2px solid #EDE9FE" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#2D1B69" }}>🧪 {exam.title}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>Pass: {exam.passThreshold}% · {exam.attemptsAllowed} attempts</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-main">
        {activeTab === "lessons" && lesson && (
          <>
            <div className="clay-card video-container" style={{ background: course?.gradient || "linear-gradient(135deg,#A78BFA,#7C3AED)" }}>
              <span style={{ fontSize: 80 }}>{lesson.format === "video" ? "▶" : lesson.format === "article" ? "📄" : "✏️"}</span>
            </div>
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                <Badge topic={course?.topic || "Programming"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Lesson {activeLesson + 1} of {curriculum.length}</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#2D1B69", marginBottom: 8 }}>{lesson.title}</h2>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#9CA3AF", marginBottom: 24, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{lesson.body || `This lesson covers ${lesson.title.toLowerCase()}. Follow along and take notes to get the most out of this ${lesson.durationMinutes}m ${lesson.format}.`}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {activeLesson > 0 && <button className="clay-btn outline" onClick={() => setActiveLesson(activeLesson - 1)}>← Previous</button>}
                {!done[activeLesson] && <button className="clay-btn success" onClick={markDone}>✓ Mark Complete</button>}
                {activeLesson < curriculum.length - 1 && <button className="clay-btn" onClick={() => setActiveLesson(activeLesson + 1)}>Next →</button>}
                {exams.length > 0 && <button className="clay-btn outline" style={{ borderColor: "#7C3AED", color: "#7C3AED" }} onClick={() => setActiveTab("quizzes")}>🧪 View Quizzes</button>}
              </div>
              {done[activeLesson] && (
                <div style={{ marginTop: 16, padding: "12px 20px", background: "#D1FAE5", border: "2.5px solid #34D399", borderRadius: 14, color: "#065F46", fontWeight: 700, fontSize: 14, display: "inline-block" }}>
                  ✅ Lesson completed!
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "quizzes" && (
          <div style={{ maxWidth: 700 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#2D1B69", marginBottom: 8 }}>🧪 Course Quizzes</h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 600, marginBottom: 24 }}>Test your knowledge with these assessments. Select a quiz to begin.</p>
            {exams.length === 0 ? (
              <div className="empty-state"><div className="emoji">📝</div><p>No quizzes available for this course yet.</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {exams.map(exam => (
                  <div key={exam.id} className="clay-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 900, color: "#2D1B69", fontSize: 18, marginBottom: 4 }}>🧪 {exam.title}</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Pass score: {exam.passThreshold}% · Max {exam.attemptsAllowed} attempts</div>
                    </div>
                    <button className="clay-btn" onClick={() => setActiveExam(exam)}>Start Quiz →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activeExam && (
        <ExamTakerModal exam={activeExam} onClose={() => setActiveExam(null)} addToast={addToast} />
      )}
    </div>
  );
}

//Login Page
function LoginPage({ setPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="auth-wrap">
      <div className="clay-card auth-card" style={{ animation: "modal-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="auth-title">Welcome back 👋</div>
        <div className="auth-sub">Sign in to continue learning</div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="clay-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="clay-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button className="clay-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 14 }} onClick={() => onLogin(email, pass)}>Sign In</button>
        <button className="clay-btn outline" style={{ width: "100%", justifyContent: "center", marginBottom: 20 }} onClick={() => window.location.href = `${API_BASE_URL}/api/identity/api/accounts/external-login`}>
          🔵 Continue with Google
        </button>
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>
          Don't have an account? <span style={{ color: "var(--purple)", cursor: "pointer" }} onClick={() => setPage("register")}>Sign up free</span>
        </div>
        <div style={{ marginTop: 14, padding: "12px 16px", background: "#EDE9FE", borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#5B21B6", lineHeight: 1.5 }}>
          💡 Tip: Use your registered credentials to access specialized dashboards.
        </div>
      </div>
    </div>
  );
}

//Register Page 
function RegisterPage({ setPage, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("Learner");

  return (
    <div className="auth-wrap">
      <div className="clay-card auth-card" style={{ animation: "modal-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="auth-title">Join Learnify 🚀</div>
        <div className="auth-sub">Create your free account today</div>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input className="clay-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="clay-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="clay-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <div className="role-pills">
            {["Learner", "Instructor"].map(r => (
              <div key={r} className={`role-pill${role === r ? " active" : ""}`} onClick={() => setRole(r)}>{r === "Learner" ? "🎓" : "🏫"} {r}</div>
            ))}
          </div>
        </div>
        <button className="clay-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 14 }} onClick={() => onRegister(name, email, pass, role)}>Create Account</button>
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>
          Already have an account? <span style={{ color: "var(--purple)", cursor: "pointer" }} onClick={() => setPage("login")}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

//Learner Dashboard
function LearnerDashboard({ user, setPage, setSelectedCourse, enrollments }) {
  return (
    <div className="dash-wrap">
      <div style={{ fontWeight: 900, fontSize: 26, color: "#2D1B69", marginBottom: 6 }}>
        Hey {user?.displayName} 👋
      </div>
      <div style={{ fontWeight: 600, color: "#9CA3AF", fontSize: 14, marginBottom: 28 }}>Here's your learning progress</div>

      <div className="dash-grid">
        {[{ icon: "📚", val: enrollments.length, label: "Enrolled Courses" }, { icon: "✅", val: enrollments.filter(e => e.status === 2).length, label: "Completed" }, { icon: "⏱️", val: 95, label: "Minutes Learned" }, { icon: "🏆", val: enrollments.filter(e => e.credentialIssued).length, label: "Achievements" }].map((s, i) => (
          <div key={i} className="clay-card stat-card" style={{ animationDelay: `${i * 0.08}s`, animation: "pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="icon">{s.icon}</div>
            <div className="val"><CountUp target={s.val} /></div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 20, color: "#2D1B69", marginBottom: 16 }}>My Courses</div>
      <div className="enrolled-grid">
        {enrollments.map((e, i) => (
          <div key={e.id} className="clay-card enrolled-card" onClick={() => { setSelectedCourse({ id: e.courseId, title: e.courseTitle }); setPage("detail") }} style={{ cursor: "pointer", transition: "transform 0.2s", animation: `pop-in 0.5s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both` }}>
            <div style={{ height: 8, borderRadius: "12px 12px 0 0", background: "linear-gradient(135deg,#A78BFA,#7C3AED)", margin: "-22px -22px 16px", borderRadius: 14 }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}><span className="status-badge" style={{ background: "#D1FAE5", color: "#065F46", border: "2px solid #34D399" }}>Active</span></div>
            <div className="enrolled-title">{e.courseTitle}</div>
            <div className="enrolled-meta">Started {new Date(e.registeredOn).toLocaleDateString()}</div>
            <div className="clay-progress-wrap" style={{ marginBottom: 6 }}>
              <div className="clay-progress-fill" style={{ width: `${e.completionPercent}%` }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", marginBottom: 14 }}>{e.completionPercent}% complete</div>
            <button className="clay-btn sm" onClick={e_stop => { e_stop.stopPropagation(); setSelectedCourse({ id: e.courseId, title: e.courseTitle }); setPage("player"); }}>▶ Continue</button>
          </div>
        ))}
        {enrollments.length === 0 && <div className="empty-state">No courses enrolled yet.</div>}
      </div>
    </div>
  );
}

// Exam Manager — Instructor creates/views exams for a course
function ExamManagerModal({ course, onClose, addToast }) {
  const [exams, setExams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [examForm, setExamForm] = useState({ title: "", passThreshold: 70, attemptsAllowed: 3 });
  const [questions, setQuestions] = useState([]);
  const [expandedExam, setExpandedExam] = useState(null);
  const [attempts, setAttempts] = useState({});

  const refreshExams = () =>
    apiFetch(`/api/exams/api/exams/course/${course.id}`)
      .then(setExams).catch(e => addToast(e.message, "error"));

  useEffect(() => { refreshExams(); }, []);

  const addQuestion = () =>
    setQuestions(p => [...p, { Id: p.length + 1, Text: "", Options: ["", "", "", ""], CorrectOption: 0 }]);

  const updateQ = (i, field, val) =>
    setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: val } : q));

  const updateOpt = (qi, oi, val) =>
    setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, Options: q.Options.map((o, j) => j === oi ? val : o) } : q));

  const createExam = async () => {
    if (!examForm.title) { addToast("Quiz title required", "error"); return; }
    if (questions.length === 0) { addToast("Add at least one question", "error"); return; }
    try {
      const exam = await apiFetch("/api/exams/api/exams", {
        method: "POST",
        body: JSON.stringify({ courseId: course.id, title: examForm.title, passThreshold: examForm.passThreshold, attemptsAllowed: examForm.attemptsAllowed, questionsJson: JSON.stringify(questions) })
      });
      await apiFetch(`/api/exams/api/exams/${exam.id}/publish`, { method: "POST" });
      addToast(`Quiz "${examForm.title}" published! 🎉`, "success");
      setShowCreate(false);
      setExamForm({ title: "", passThreshold: 70, attemptsAllowed: 3 });
      setQuestions([]);
      refreshExams();
    } catch (err) { addToast(err.message, "error"); }
  };

  const deleteExam = async (examId) => {
    if (!window.confirm("Delete this exam? All attempts will be lost.")) return;
    try {
      await apiFetch(`/api/exams/api/exams/${examId}`, { method: "DELETE" });
      addToast("Exam deleted", "success");
      refreshExams();
    } catch (err) { addToast(err.message, "error"); }
  };

  const loadAttempts = async (examId) => {
    if (expandedExam === examId) { setExpandedExam(null); return; }
    try {
      const data = await apiFetch(`/api/exams/api/exams/${examId}/all-attempts`);
      setAttempts(p => ({ ...p, [examId]: data }));
      setExpandedExam(examId);
    } catch (err) { addToast("Could not load attempts", "error"); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="clay-card modal-card" style={{ maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#2D1B69" }}>🧪 Exams — {course.title}</div>
          <button className="clay-btn sm outline" onClick={onClose}>✕ Close</button>
        </div>
        {!showCreate ? (
          <>
            <button className="clay-btn sm" style={{ marginBottom: 16 }} onClick={() => setShowCreate(true)}>+ Create Quiz</button>
            {exams.length === 0 ? (
              <div className="empty-state"><div className="emoji">📝</div><p>No quizzes yet. Create your first assessment!</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {exams.map(exam => (
                  <div key={exam.id} className="clay-card" style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: "#2D1B69" }}>{exam.title}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>
                          Pass: {exam.passThreshold}% · Max Attempts: {exam.attemptsAllowed} ·{" "}
                          <span style={{ color: exam.isPublished ? "#10B981" : "#F59E0B" }}>{exam.isPublished ? "✓ Published" : "Draft"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="clay-btn sm outline" onClick={() => loadAttempts(exam.id)}>{expandedExam === exam.id ? "Hide" : "👁 Attempts"}</button>
                        <button className="clay-btn sm danger" onClick={() => deleteExam(exam.id)}>Delete</button>
                      </div>
                    </div>
                    {expandedExam === exam.id && attempts[exam.id] && (
                      <div style={{ marginTop: 12, borderTop: "2px solid #EDE9FE", paddingTop: 12 }}>
                        {attempts[exam.id].length === 0 ? (
                          <div style={{ color: "#9CA3AF", fontSize: 13, fontWeight: 600 }}>No attempts yet.</div>
                        ) : (
                          <table className="clay-table" style={{ fontSize: 12 }}>
                            <thead><tr><th>Learner</th><th>Score</th><th>Passed</th><th>Date</th></tr></thead>
                            <tbody>
                              {attempts[exam.id].map(a => (
                                <tr key={a.id}>
                                  <td>#{a.learnerId}</td>
                                  <td style={{ fontWeight: 800, color: a.hasPassed ? "#10B981" : "#EF4444" }}>{a.score}%</td>
                                  <td>{a.hasPassed ? "✅" : "❌"}</td>
                                  <td>{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "In Progress"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <div style={{ fontWeight: 800, color: "#2D1B69", fontSize: 16, marginBottom: 16 }}>📝 New Quiz</div>
            <div className="form-group"><label className="form-label">Quiz Title</label><input className="clay-input" placeholder="e.g. Module 1 Assessment" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">Pass Score (%)</label><input className="clay-input" type="number" min="0" max="100" value={examForm.passThreshold} onChange={e => setExamForm({ ...examForm, passThreshold: parseInt(e.target.value) })} /></div>
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">Max Attempts</label><input className="clay-input" type="number" min="1" max="10" value={examForm.attemptsAllowed} onChange={e => setExamForm({ ...examForm, attemptsAllowed: parseInt(e.target.value) })} /></div>
            </div>
            <div style={{ fontWeight: 800, color: "#2D1B69", marginBottom: 8 }}>Questions</div>
            {questions.map((q, qi) => (
              <div key={qi} className="exam-q-builder">
                <div style={{ fontWeight: 700, color: "#7C3AED", marginBottom: 8, fontSize: 13 }}>Question {qi + 1}</div>
                <input className="clay-input" placeholder="Question text..." value={q.Text} onChange={e => updateQ(qi, "Text", e.target.value)} style={{ marginBottom: 10 }} />
                {q.Options.map((opt, oi) => (
                  <div key={oi} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <div onClick={() => updateQ(qi, "CorrectOption", oi)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2.5px solid ${q.CorrectOption === oi ? "#10B981" : "#D1D5DB"}`, background: q.CorrectOption === oi ? "#10B981" : "white", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 800 }}>
                      {q.CorrectOption === oi && "✓"}
                    </div>
                    <input className="clay-input" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} style={{ flex: 1 }} />
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>Click ○ to mark correct answer</div>
              </div>
            ))}
            <button className="clay-btn sm outline" onClick={addQuestion} style={{ marginBottom: 16 }}>+ Add Question</button>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="clay-btn outline" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="clay-btn success" onClick={createExam}>Publish Quiz 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exam Taker — Learner takes a quiz
function ExamTakerModal({ exam, onClose, addToast }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [pastAttempts, setPastAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try { setQuestions(JSON.parse(exam.questionsPayload || "[]")); } catch { setQuestions([]); }
    apiFetch(`/api/exams/api/exams/${exam.id}/my-attempts`)
      .then(setPastAttempts).catch(console.error);
  }, [exam]);

  const bestAttempt = pastAttempts.length > 0
    ? pastAttempts.reduce((best, a) => (a.score > best.score ? a : best), pastAttempts[0])
    : null;

  const startAttempt = async () => {
    setLoading(true);
    try {
      const a = await apiFetch(`/api/exams/api/exams/${exam.id}/attempts`, { method: "POST" });
      setAttempt(a); setAnswers({}); setResult(null);
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const submitAttempt = async () => {
    if (Object.keys(answers).length < questions.length) {
      addToast("Please answer all questions before submitting", "error"); return;
    }
    setLoading(true);
    try {
      const answersJson = JSON.stringify(Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, v])
      ));
      const res = await apiFetch(`/api/exams/api/exams/attempts/${attempt.id}/submit`, {
        method: "POST", body: JSON.stringify({ answersJson })
      });
      setResult(res);
      setAttempt(null);
      addToast(res.hasPassed ? "🎉 Passed! Great job!" : "Quiz submitted. Keep practicing!", res.hasPassed ? "success" : "info");
      
      // Trigger certificate issuance if passed and course is potentially complete
      if (res.hasPassed) {
        try {
          // Find the registration for this course
          const regs = await apiFetch("/api/registration/api/registrations/learner/me"); // Note: we'd need a helper or just check the list
          const reg = regs.find(r => r.courseId === exam.courseId);
          if (reg && reg.completionPercent >= 100 && !reg.credentialIssued) {
            await apiFetch(`/api/registration/api/registrations/${reg.id}/complete`, { method: "POST" });
            addToast("🎓 Certificate Issued! Check your profile.", "success");
          }
        } catch (e) { console.error("Auto-issue failed", e); }
      }

      apiFetch(`/api/exams/api/exams/${exam.id}/my-attempts`).then(setPastAttempts);
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="clay-card modal-card" style={{ maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: "#2D1B69" }}>🧪 {exam.title}</div>
          <button className="clay-btn sm outline" onClick={onClose}>✕ Close</button>
        </div>

        {/* Result screen */}
        {result && (
          <div className="quiz-result-card">
            <div style={{ fontSize: 64, marginBottom: 12 }}>{result.hasPassed ? "🏆" : "📚"}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: result.hasPassed ? "#10B981" : "#EF4444" }}>{result.score}%</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#2D1B69", marginBottom: 8 }}>{result.hasPassed ? "You Passed!" : "Not Passed"}</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, marginBottom: 20 }}>Pass threshold: {exam.passThreshold}% · Your score: {result.score}%</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {!result.hasPassed && pastAttempts.length < exam.attemptsAllowed && (
                <button className="clay-btn" onClick={startAttempt}>Retake Quiz ↺</button>
              )}
              <button className="clay-btn outline" onClick={onClose}>Close</button>
            </div>
          </div>
        )}

        {/* Pre-start screen */}
        {!attempt && !result && (
          <div>
            <div style={{ padding: "16px 20px", background: "#EDE9FE", borderRadius: 14, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#5B21B6", marginBottom: 4 }}>📋 Quiz Info</div>
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, lineHeight: 1.6 }}>
                • {questions.length} questions<br />
                • Pass score: {exam.passThreshold}%<br />
                • Attempts allowed: {exam.attemptsAllowed}<br />
                • Attempts used: {pastAttempts.length}
              </div>
            </div>
            {bestAttempt && (
              <div style={{ padding: "12px 16px", background: bestAttempt.hasPassed ? "#D1FAE5" : "#FEF3C7", border: `2px solid ${bestAttempt.hasPassed ? "#34D399" : "#F59E0B"}`, borderRadius: 12, marginBottom: 16, fontWeight: 700, fontSize: 13 }}>
                Best attempt: {bestAttempt.score}% {bestAttempt.hasPassed ? "✅ Passed" : "❌ Not passed"}
              </div>
            )}
            {pastAttempts.length >= exam.attemptsAllowed ? (
              <div style={{ padding: "16px", background: "#FEE2E2", border: "2px solid #FCA5A5", borderRadius: 14, color: "#991B1B", fontWeight: 700, textAlign: "center" }}>
                No attempts remaining. {bestAttempt?.hasPassed ? "You've passed this quiz! 🎉" : "Contact your instructor for more attempts."}
              </div>
            ) : (
              <button className="clay-btn" style={{ width: "100%", justifyContent: "center" }} onClick={startAttempt} disabled={loading}>
                {loading ? "Starting..." : "Start Quiz →"}
              </button>
            )}
          </div>
        )}

        {/* Active quiz */}
        {attempt && !result && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>Answer all {questions.length} questions</div>
            {questions.map((q, qi) => (
              <div key={q.Id} style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 800, color: "#2D1B69", marginBottom: 12, fontSize: 15 }}>{qi + 1}. {q.Text}</div>
                {(q.Options || []).map((opt, oi) => (
                  <div key={oi} className={`quiz-option${answers[q.Id.toString()] === oi ? " selected" : ""}`} onClick={() => setAnswers(p => ({ ...p, [q.Id.toString()]: oi }))}>
                    <div className="quiz-dot" style={{ borderColor: answers[q.Id.toString()] === oi ? "var(--purple)" : "#A78BFA", background: answers[q.Id.toString()] === oi ? "var(--purple)" : "transparent", color: answers[q.Id.toString()] === oi ? "white" : "transparent" }}>
                      {answers[q.Id.toString()] === oi ? "✓" : ""}
                    </div>
                    {opt}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="clay-btn outline" onClick={onClose}>Save & Exit</button>
              <button className="clay-btn success" onClick={submitAttempt} disabled={loading}>{loading ? "Submitting..." : "Submit Quiz ✓"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//Instructor Dashboard
function InstructorDashboard({ user, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [examCourse, setExamCourse] = useState(null);
  const [form, setForm] = useState({ title: "", synopsis: "", topic: "Programming", difficulty: 0, price: "" });
  const [editForm, setEditForm] = useState({ title: "", synopsis: "", topic: "Programming", difficulty: 0, price: "" });
  const [myCourses, setMyCourses] = useState([]);

  const refreshCourses = () =>
    apiFetch("/api/courses/api/courses/my-courses").then(setMyCourses).catch(console.error);

  useEffect(() => { refreshCourses(); }, []);

  const create = async () => {
    if (!form.title) { addToast("Title is required", "error"); return; }
    try {
      await apiFetch("/api/courses/api/courses", {
        method: "POST",
        body: JSON.stringify({ title: form.title, synopsis: form.synopsis, topic: form.topic, difficulty: parseInt(form.difficulty), listPrice: parseFloat(form.price) || 0 })
      });
      addToast(`Course "${form.title}" created!`, "success");
      setShowModal(false);
      setForm({ title: "", synopsis: "", topic: "Programming", difficulty: 0, price: "" });
      refreshCourses();
    } catch (err) { addToast(err.message, "error"); }
  };

  const openEdit = (c) => {
    setEditingCourse(c);
    setEditForm({ title: c.title, synopsis: c.synopsis || "", topic: c.topic, difficulty: typeof c.difficulty === "number" ? c.difficulty : 0, price: c.listPrice });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await apiFetch(`/api/courses/api/courses/${editingCourse.id}`, {
        method: "PUT",
        body: JSON.stringify({ title: editForm.title, synopsis: editForm.synopsis, topic: editForm.topic, difficulty: parseInt(editForm.difficulty), listPrice: parseFloat(editForm.price) || 0 })
      });
      addToast("Course updated! ✓", "success");
      setShowEditModal(false);
      refreshCourses();
    } catch (err) { addToast(err.message, "error"); }
  };

  const deleteCourse = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/api/courses/api/courses/${c.id}`, { method: "DELETE" });
      addToast(`"${c.title}" deleted.`, "success");
      refreshCourses();
    } catch (err) { addToast(err.message, "error"); }
  };

  return (
    <div className="admin-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 26, color: "#2D1B69" }}>Instructor Studio 🏫</div>
          <div style={{ fontWeight: 600, color: "#9CA3AF", fontSize: 14 }}>Manage your courses, assessments and students</div>
        </div>
        <button className="clay-btn" onClick={() => setShowModal(true)}>+ Create Course</button>
      </div>

      <div className="dash-grid" style={{ marginBottom: 32 }}>
        {[{ icon: "📚", val: myCourses.length, label: "My Courses" }, { icon: "👥", val: myCourses.reduce((acc, c) => acc + c.totalRegistrations, 0), label: "Total Students" }, { icon: "⭐", val: 4.7, label: "Avg Rating" }, { icon: "💰", val: myCourses.reduce((acc, c) => acc + (c.listPrice * c.totalRegistrations), 0), label: "Revenue ($)" }].map((s, i) => (
          <div key={i} className="clay-card stat-card"><div className="icon">{s.icon}</div><div className="val"><CountUp target={s.val} /></div><div className="label">{s.label}</div></div>
        ))}
      </div>

      <div style={{ fontWeight: 900, fontSize: 20, color: "#2D1B69", marginBottom: 16 }}>My Courses</div>
      <div className="clay-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table className="clay-table">
            <thead><tr><th>Course</th><th>Status</th><th>Students</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              {myCourses.map(c => (
                <tr key={c.id}>
                  <td><div style={{ fontWeight: 800 }}>{c.title}</div><div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.topic}</div></td>
                  <td><span className="status-badge" style={{ background: c.isPublished ? "#D1FAE5" : "#FEF3C7", color: c.isPublished ? "#065F46" : "#92400E", border: c.isPublished ? "2px solid #34D399" : "2px solid #F59E0B" }}>{c.isPublished ? "Published" : "Draft"}</span></td>
                  <td>{c.totalRegistrations}</td>
                  <td><Stars n={c.averageRating} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button className="clay-btn sm outline" onClick={() => openEdit(c)}>✏️ Edit</button>
                      <button className="clay-btn sm" style={{ background: "#7C3AED", borderColor: "#5B21B6", boxShadow: "3px 3px 0 #5B21B6" }} onClick={() => { setExamCourse(c); setShowExamModal(true); }}>🧪 Exams</button>
                      <button className="clay-btn sm danger" onClick={() => deleteCourse(c)}>🗑️ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {myCourses.length === 0 && <tr><td colSpan={5}><div className="empty-state">No courses yet. Create your first!</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="clay-card modal-card">
            <div style={{ fontWeight: 900, fontSize: 22, color: "#2D1B69", marginBottom: 20 }}>Create New Course ✨</div>
            <div className="form-group"><label className="form-label">Title</label><input className="clay-input" placeholder="Course title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Synopsis</label><textarea className="textarea-clay" placeholder="Course description..." value={form.synopsis} onChange={e => setForm({ ...form, synopsis: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">Topic</label>
                <select className="select-clay" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}>
                  {TOPICS.map(t => <option key={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">Difficulty</label>
                <div className="role-pills">
                  {["Beg.", "Int.", "Adv."].map((d, i) => (
                    <div key={i} className={`role-pill${form.difficulty === i ? " active" : ""}`} style={{ fontSize: 12, padding: "8px 6px" }} onClick={() => setForm({ ...form, difficulty: i })}>{d}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Price ($)</label><input className="clay-input" type="number" placeholder="29.99" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="clay-btn outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="clay-btn" onClick={create}>Create Course 🚀</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCourse && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="clay-card modal-card">
            <div style={{ fontWeight: 900, fontSize: 22, color: "#2D1B69", marginBottom: 20 }}>Edit Course ✏️</div>
            <div className="form-group"><label className="form-label">Title</label><input className="clay-input" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Synopsis</label><textarea className="textarea-clay" value={editForm.synopsis} onChange={e => setEditForm({ ...editForm, synopsis: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">Topic</label>
                <select className="select-clay" value={editForm.topic} onChange={e => setEditForm({ ...editForm, topic: e.target.value })}>
                  {TOPICS.map(t => <option key={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                <label className="form-label">Difficulty</label>
                <div className="role-pills">
                  {["Beg.", "Int.", "Adv."].map((d, i) => (
                    <div key={i} className={`role-pill${editForm.difficulty === i ? " active" : ""}`} style={{ fontSize: 12, padding: "8px 6px" }} onClick={() => setEditForm({ ...editForm, difficulty: i })}>{d}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Price ($)</label><input className="clay-input" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="clay-btn outline" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="clay-btn" onClick={saveEdit}>Save Changes ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Manager Modal */}
      {showExamModal && examCourse && (
        <ExamManagerModal course={examCourse} onClose={() => setShowExamModal(false)} addToast={addToast} />
      )}
    </div>
  );
}

//Admin Panel
function AdminPanel({ addToast }) {
  const [accounts, setAccounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    apiFetch("/api/identity/api/accounts/search?term=@").then(setAccounts).catch(console.error);
    apiFetch("/api/courses/api/courses/admin/all").then(setCourses).catch(console.error);
    apiFetch("/api/analytics/api/analytics/platform-stats").then(setStats).catch(console.error);
  }, []);

  const approve = async (id) => {
    try {
      await apiFetch(`/api/courses/api/courses/${id}/approve`, { method: "POST" });
      addToast("Course approved ✓", "success");
      apiFetch("/api/courses/api/courses/admin/all").then(setCourses);
    } catch (err) { addToast(err.message, "error"); }
  };
  const reject = async (id) => {
    try {
      await apiFetch(`/api/courses/api/courses/${id}/reject`, { method: "POST" });
      addToast("Course rejected", "error");
      apiFetch("/api/courses/api/courses/admin/all").then(setCourses);
    } catch (err) { addToast(err.message, "error"); }
  };

  const toggleUserStatus = async (user) => {
    const action = user.isActive ? "suspend" : "reactivate";
    try {
      await apiFetch(`/api/identity/api/accounts/${user.id}/${action}`, { method: "POST" });
      addToast(`User ${user.displayName} ${user.isActive ? "suspended" : "reactivated"}`, "success");
      apiFetch("/api/identity/api/accounts/search?term=@").then(setAccounts);
    } catch (err) { addToast(err.message, "error"); }
  };

  const deleteCourseAdmin = async (course) => {
    if (!window.confirm(`Permanently delete "${course.title}"?`)) return;
    try {
      await apiFetch(`/api/courses/api/courses/${course.id}`, { method: "DELETE" });
      addToast("Course deleted", "success");
      apiFetch("/api/courses/api/courses/admin/all").then(setCourses);
    } catch (err) { addToast(err.message, "error"); }
  };

  const pending = courses.filter(c => !c.isApproved);

  return (
    <div className="admin-wrap">
      <div style={{ fontWeight: 900, fontSize: 26, color: "#2D1B69", marginBottom: 6 }}>Admin Panel 🛡️</div>
      <div style={{ fontWeight: 600, color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>Platform management & oversight</div>

      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {[["pending", "⏳ Pending"], ["users", "👥 Users"], ["courses", "📚 All Courses"], ["analytics", "📊 Analytics"]].map(([k, l]) => (
          <div key={k} className={`tab${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {tab === "pending" && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#2D1B69", marginBottom: 14 }}>Courses Awaiting Approval ({pending.length})</div>
          {pending.length === 0 ? (
            <div className="empty-state"><div className="emoji">🎉</div><p>All caught up! No pending courses.</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pending.map(c => (
                <div key={c.id} className="clay-card" style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "#2D1B69", fontSize: 15 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>by {c.authorName} · <Badge topic={c.topic} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="clay-btn sm success" onClick={() => approve(c.id)}>✓ Approve</button>
                    <button className="clay-btn sm danger" onClick={() => reject(c.id)}>✗ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="clay-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap">
            <table className="clay-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 800 }}>{a.displayName}</td>
                    <td>{a.email}</td>
                    <td>{a.role}</td>
                    <td><span className="status-badge" style={{ background: a.isActive ? "#D1FAE5" : "#FEE2E2", color: a.isActive ? "#065F46" : "#991B1B" }}>{a.isActive ? "Active" : "Suspended"}</span></td>
                    <td><button className={`clay-btn sm ${a.isActive ? "danger" : "success"}`} onClick={() => toggleUserStatus(a)}>{a.isActive ? "Suspend" : "Reactivate"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="clay-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap">
            <table className="clay-table">
              <thead><tr><th>Course</th><th>Instructor</th><th>Topic</th><th>Price</th><th>Students</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 800 }}>{c.title}</td>
                    <td>{c.authorName}</td>
                    <td><Badge topic={c.topic} /></td>
                    <td>${c.listPrice}</td>
                    <td>{c.totalRegistrations}</td>
                    <td><Stars n={c.averageRating} /></td>
                    <td><button className="clay-btn sm danger" onClick={() => deleteCourseAdmin(c)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div>
          <div className="dash-grid" style={{ marginBottom: 24 }}>
            {[{ icon: "👥", val: stats?.totalUsers || accounts.length, label: "Total Users" }, { icon: "📚", val: stats?.totalCourses || courses.length, label: "Total Courses" }, { icon: "📝", val: stats?.totalEnrollments || courses.reduce((a, b) => a + b.totalRegistrations, 0), label: "Enrollments" }, { icon: "💰", val: stats?.totalRevenue || 0, label: "Revenue ($)" }].map((s, i) => (
              <div key={i} className="clay-card stat-card"><div className="icon">{s.icon}</div><div className="val"><CountUp target={s.val} /></div><div className="label">{s.label}</div></div>
            ))}
          </div>
          <div className="clay-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 800, color: "#2D1B69", marginBottom: 16 }}>Enrollments by Topic</div>
            {TOPICS.slice(0, 5).map((t, i) => {
              const pct = [85, 72, 61, 48, 38][i];
              return (
                <div key={t.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#2D1B69" }}>{t.name}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#9CA3AF" }}>{pct}%</span>
                  </div>
                  <div className="clay-progress-wrap">
                    <div className="clay-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

//App Root
export default function Learnify() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  // Initial loads
  useEffect(() => {
    // Check for token in URL hash (Google OAuth callback)
    const hash = window.location.hash;
    if (hash && hash.includes("login-success")) {
      const params = new URLSearchParams(hash.split("?")[1]);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("token", token);
        addToast("Logged in with Google!", "success");
        // Clear the hash without reloading
        window.history.replaceState(null, null, " ");
      }
    }

    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/api/identity/api/accounts/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("token"));
    }

    setLoading(true);
    apiFetch("/api/courses/api/courses")
      .then(data => {
        setCourses(data.map(c => {
          const topicInfo = TOPICS.find(t => t.name === c.topic) || TOPICS[0];
          return {
            ...c,
            instructor: c.authorName,
            price: c.listPrice,
            rating: c.averageRating,
            reviews: c.approvedReviewCount,
            emoji: topicInfo.emoji,
            gradient: topicInfo.gradient,
            difficulty: ["Beginner", "Intermediate", "Advanced"][c.difficulty] || "Beginner"
          };
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && user.role === "Learner") {
      apiFetch(`/api/registration/api/registrations/learner/${user.id}`)
        .then(setEnrollments)
        .catch(console.error);
    }
  }, [user]);

  const handleLogin = async (email, password) => {
    try {
      const data = await apiFetch("/api/identity/api/accounts/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("token", data.accessToken);
      const profile = await apiFetch("/api/identity/api/accounts/me");
      setUser(profile);
      setPage(profile.role === "Administrator" ? "admin" : profile.role === "Instructor" ? "instructor" : "dashboard");
      addToast(`Welcome back, ${profile.displayName}!`, "success");
    } catch (err) { addToast(err.message, "error"); }
  };

  const handleRegister = async (displayName, email, password, role) => {
    try {
      await apiFetch("/api/identity/api/accounts/register", {
        method: "POST",
        body: JSON.stringify({ displayName, email, password, role })
      });
      addToast("Account created! Please sign in.", "success");
      setPage("login");
    } catch (err) { addToast(err.message, "error"); }
  };

  const handleEnroll = async (courseId) => {
    if (!user) { addToast("Please sign in to enroll", "info"); setPage("login"); return; }
    try {
      await apiFetch("/api/registration/api/registrations", {
        method: "POST",
        body: JSON.stringify({ courseId })
      });
      addToast("Enrolled successfully!", "success");
      apiFetch(`/api/registration/api/registrations/learner/${user.id}`).then(setEnrollments);
    } catch (err) { addToast(err.message, "error"); }
  };

  const navigate = (p) => {
    if ((p === "dashboard" || p === "player") && !user) { addToast("Please sign in first", "info"); setPage("login"); return; }
    setPage(p);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <Navbar page={page} setPage={navigate} user={user} setUser={setUser} addToast={addToast} />
        {page === "landing" && <LandingPage setPage={navigate} courses={courses} setSelectedCourse={setSelectedCourse} />}
        {page === "catalog" && <CatalogPage setPage={navigate} setSelectedCourse={setSelectedCourse} courses={courses} loading={loading} />}
        {page === "detail" && <CourseDetailPage course={selectedCourse} user={user} setPage={navigate} addToast={addToast} enrolled={enrollments.some(e => e.courseId === selectedCourse?.id)} onEnroll={handleEnroll} enrollmentInfo={enrollments.find(e => e.courseId === selectedCourse?.id)} />}
        {page === "player" && <LessonPlayerPage course={selectedCourse} addToast={addToast} />}
        {page === "login" && <LoginPage setPage={setPage} onLogin={handleLogin} />}
        {page === "register" && <RegisterPage setPage={setPage} onRegister={handleRegister} />}
        {page === "dashboard" && <LearnerDashboard user={user} setPage={navigate} setSelectedCourse={setSelectedCourse} enrollments={enrollments} />}
        {page === "instructor" && <InstructorDashboard user={user} addToast={addToast} />}
        {page === "admin" && <AdminPanel addToast={addToast} />}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}
