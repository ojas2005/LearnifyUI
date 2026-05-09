import { useState, useEffect, useRef, useCallback } from "react";

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
`;

//API Wrapper ─
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };
  const res = await fetch(path, { ...options, headers });
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
  const [curLoading, setCurLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setCurLoading(true);
      apiFetch(`/api/curriculum/api/curriculum/course/${course.id}`)
        .then(setCurriculum)
        .catch(err => console.error("Curriculum load failed", err))
        .finally(() => setCurLoading(false));
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
              {["Great content!", "Really well structured.", "Best course I've taken!"].map((r, i) => (
                <div key={i} className="clay-card" style={{ padding: 20 }}>
                  <Stars n={5} /> <p style={{ marginTop: 8, fontWeight: 600, color: "#6B7280", fontSize: 14 }}>{r}</p>
                </div>
              ))}
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

  useEffect(() => {
    if (course) {
      setLoading(true);
      apiFetch(`/api/curriculum/api/curriculum/course/${course.id}`)
        .then(setCurriculum)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [course]);

  const lesson = curriculum[activeLesson];

  const markDone = () => {
    setDone(prev => ({ ...prev, [activeLesson]: true }));
    addToast("Lesson marked complete! 🎯", "success");
    if (activeLesson < curriculum.length - 1) setTimeout(() => setActiveLesson(activeLesson + 1), 600);
  };

  if (loading) return <div className="empty-state">Loading course player...</div>;
  if (!lesson) return <div className="empty-state">No lessons found.</div>;

  return (
    <div className="player-wrap">
      <div className="lesson-sidebar">
        <div style={{ fontWeight: 900, fontSize: 16, color: "#2D1B69", marginBottom: 16 }}>📚 Curriculum</div>
        {curriculum.map((l, i) => (
          <div key={l.id} className={`lesson-row${activeLesson === i ? " active" : ""}`} onClick={() => setActiveLesson(i)} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`lesson-check${done[i] ? " done" : ""}`}>{done[i] ? "✓" : i + 1}</div>
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div>{l.title}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{l.durationMinutes}m</div>
            </div>
          </div>
        ))}
      </div>
      <div className="player-main">
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
          <div style={{ display: "flex", gap: 12 }}>
            {activeLesson > 0 && <button className="clay-btn outline" onClick={() => setActiveLesson(activeLesson - 1)}>← Previous</button>}
            {!done[activeLesson] && <button className="clay-btn success" onClick={markDone}>✓ Mark Complete</button>}
            {activeLesson < curriculum.length - 1 && <button className="clay-btn" onClick={() => setActiveLesson(activeLesson + 1)}>Next →</button>}
          </div>
          {done[activeLesson] && (
            <div style={{ marginTop: 16, padding: "12px 20px", background: "#D1FAE5", border: "2.5px solid #34D399", borderRadius: 14, color: "#065F46", fontWeight: 700, fontSize: 14, display: "inline-block" }}>
              ✅ Lesson completed!
            </div>
          )}
        </div>
      </div>
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
        <button className="clay-btn outline" style={{ width: "100%", justifyContent: "center", marginBottom: 20 }} onClick={() => window.location.href = "/api/identity/api/accounts/external-login"}>
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

//Instructor Dashboard
function InstructorDashboard({ user, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", synopsis: "", topic: "Programming", difficulty: 0, price: "" });
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    apiFetch("/api/courses/api/courses/my-courses")
      .then(setMyCourses)
      .catch(console.error);
  }, []);

  const create = async () => {
    if (!form.title) { addToast("Title is required", "error"); return; }
    try {
      await apiFetch("/api/courses/api/courses", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          synopsis: form.synopsis,
          topic: form.topic,
          difficulty: parseInt(form.difficulty),
          listPrice: parseFloat(form.price) || 0
        })
      });
      addToast(`Course "${form.title}" created!`, "success");
      setShowModal(false);
      setForm({ title: "", synopsis: "", topic: "Programming", difficulty: 0, price: "" });
      // Refresh
      apiFetch("/api/courses/api/courses/my-courses").then(setMyCourses);
    } catch (err) { addToast(err.message, "error"); }
  };

  return (
    <div className="admin-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 26, color: "#2D1B69" }}>Instructor Studio 🏫</div>
          <div style={{ fontWeight: 600, color: "#9CA3AF", fontSize: 14 }}>Manage your courses and students</div>
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
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="clay-btn sm outline" onClick={() => addToast("Edit logic connected to backend soon!", "info")}>Edit</button>
                      <button className="clay-btn sm danger" onClick={() => addToast("Delete logic connected to backend soon!", "error")}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}

//Admin Panel
function AdminPanel({ addToast }) {
  const [accounts, setAccounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    apiFetch("/api/identity/api/accounts/search?term=@").then(setAccounts).catch(console.error);
    apiFetch("/api/courses/api/courses/admin/all").then(setCourses).catch(console.error);
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
                    <td><button className="clay-btn sm danger" onClick={() => addToast("Suspend logic soon", "error")}>Suspend</button></td>
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
                    <td><button className="clay-btn sm danger" onClick={() => addToast("Delete logic soon", "error")}>Delete</button></td>
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
            {[{ icon: "👥", val: accounts.length, label: "Total Users" }, { icon: "📚", val: courses.length, label: "Total Courses" }, { icon: "📝", val: courses.reduce((a, b) => a + b.totalRegistrations, 0), label: "Enrollments" }, { icon: "⭐", val: 4.8, label: "Platform Rating" }].map((s, i) => (
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
