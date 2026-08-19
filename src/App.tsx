import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react"

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const AR = "'Cairo', sans-serif"
const LAT = "'Plus Jakarta Sans', sans-serif"

const T = {
  brand:      "#4558F4",
  brandDim:   "#3546D4",
  brandLight: "#EEF1FF",
  brandXLight:"#F7F8FF",
  ai:         "#7C3AED",
  aiLight:    "#F3EDFF",
  aiXLight:   "#FAF8FF",
  teal:       "#0891B2",
  emerald:    "#059669",
  emeraldLt:  "#ECFDF5",
  amber:      "#D97706",
  amberLt:    "#FFFBEB",
  rose:       "#E11D48",
  roseLt:     "#FFF1F2",
  bg:         "#F4F6FF",
  card:       "#FFFFFF",
  text:       "#1A1F36",
  sub:        "#3F4663",
  muted:      "#6B7280",
  border:     "#E4E8FA",
  gray:       "#F1F3FA",
  gradBrand:  "linear-gradient(135deg, #4558F4 0%, #7C3AED 100%)",
  gradTeacher:"linear-gradient(135deg, #059669 0%, #0D9488 100%)",
  gradAI:     "linear-gradient(135deg, #4558F4 0%, #7C3AED 100%)",
  gradCard:   "linear-gradient(160deg, #EEF1FF 0%, #F3EDFF 100%)",
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────────
const S = {
  card:  "0 2px 16px rgba(69,88,244,0.07), 0 1px 4px rgba(0,0,0,0.04)",
  cardHover: "0 6px 28px rgba(69,88,244,0.13), 0 2px 8px rgba(0,0,0,0.06)",
  btn:   "0 4px 20px rgba(69,88,244,0.35)",
  btnEm: "0 4px 20px rgba(5,150,105,0.35)",
  float: "0 8px 40px rgba(0,0,0,0.18)",
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Ic = {
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 2L13.8 8.6 20 10l-6.2 2L12 18l-2-6.2L4 10l6-1.8L12 2z"/>
      <path d="M19 14l1 3.2 3.2 1-3.2 1L19 22l-1-3.2-3.2-1 3.2-1L19 14z" opacity=".55"/>
    </svg>
  ),
  home:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  book:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z"/></svg>,
  robot:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM9 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5.5 3.5h-5v-2h5v2zm.5-3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  bell:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
  send:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  mic:      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>,
  attach:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>,
  image:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  arrowL:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  arrowR:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 13h12.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H4v2z"/></svg>,
  task:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
  user:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  classes:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>,
  plus:     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  students: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  chevron:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>,
  wallet:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"/><circle cx="16" cy="12" r="1.5"/></svg>,
  family:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-.76c-.8 0-1.54.5-1.85 1.26L14.5 13H13v9h7zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5C9 8.12 7.88 7 6.5 7h-2C3.12 7 2 8.12 2 9.5V15h1.5v7h4z"/></svg>,
  more:      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>,
  lock:      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>,
  google: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function LogoMark({ size = 48, light = false }: { size?: number; light?: boolean }) {
  const id = `lg${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={light ? "rgba(255,255,255,0.25)" : "#4558F4"}/>
          <stop offset="100%" stopColor={light ? "rgba(255,255,255,0.1)" : "#7C3AED"}/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx={size * 0.25} fill={light ? "rgba(255,255,255,0.18)" : `url(#${id})`} stroke={light ? "rgba(255,255,255,0.3)" : "none"} strokeWidth={light ? 1 : 0}/>
      {/* T crossbar */}
      <rect x="9" y="13" width="30" height="5.5" rx="2.75" fill="white"/>
      {/* T stem */}
      <rect x="21.25" y="13" width="5.5" height="22" rx="2.75" fill="white"/>
      {/* AI sparkle */}
      <path d="M37 8 l1.2 4 4 1.2 -4 1.2 -1.2 4 -1.2-4 -4-1.2 4-1.2 Z" fill="white" opacity={light ? 0.9 : 0.85}/>
    </svg>
  )
}

function Wordmark({ size = 32, light = false }: { size?: number; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} light={light}/>
      <div style={{ fontFamily: LAT, lineHeight: 1 }}>
        <span style={{ fontSize: size * 0.6, fontWeight: 900, color: light ? "white" : T.brand, letterSpacing: -0.5 }}>TEAC</span>
        <span style={{ fontSize: size * 0.5, fontWeight: 400, color: light ? "rgba(255,255,255,0.65)" : T.muted, letterSpacing: 0.5 }}> Teacher</span>
      </div>
    </div>
  )
}

// ─── Design System Primitives ─────────────────────────────────────────────────

function Avatar({
  name, size = 40, bg = T.brand, text, img,
}: { name: string; size?: number; bg?: string; text?: string; img?: string }) {
  const initials = name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2)
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: img ? "#f3f4f8" : bg + "22",
      border: `1.5px solid ${bg}33`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      {img ? <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> :
        <span style={{ fontSize: size * 0.37, fontWeight: 700, color: text ?? bg, fontFamily: "'Cairo', sans-serif" }}>
          {initials}
        </span>
      }
    </div>
  )
}

function ProgressBar({ pct, color = T.brand, h = 6 }: { pct: number; color?: string; h?: number }) {
  return (
    <div style={{ background: color + "18", borderRadius: h, height: h, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: h, transition: "width .8s ease" }}/>
    </div>
  )
}

function ProgressRing({ pct, size = 72, color = T.brand, label }: { pct: number; size?: number; color?: string; label?: string }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color + "18"} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s ease" }}/>
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: size * 0.24, fontWeight: 900, color, lineHeight: 1, fontFamily: LAT }}>{pct}%</div>
        {label && <div style={{ fontSize: size * 0.14, color: T.muted, marginTop: 2, fontFamily: "'Cairo', sans-serif" }}>{label}</div>}
      </div>
    </div>
  )
}

function Btn({
  children, onClick, variant = "primary", color, style: sx = {},
}: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; color?: string; style?: CSSProperties }) {
  const c = color ?? T.brand
  const styles: Record<string, CSSProperties> = {
    primary: { background: T.gradBrand, color: "white", border: "none", boxShadow: S.btn },
    secondary: { background: T.card, color: c, border: `1.5px solid ${T.border}` },
    ghost: { background: "transparent", color: c, border: "none", boxShadow: "none", minHeight: 44, padding: "8px 12px" },
  }
  return (
    <button onClick={onClick} style={{
      width: "100%", minHeight: 56, padding: "16px 24px", borderRadius: 18,
      fontSize: 17, fontWeight: 800, cursor: "pointer",
      fontFamily: AR, letterSpacing: 0,
      transition: "opacity .15s, transform .1s",
      ...styles[variant], ...sx,
    }}>
      {children}
    </button>
  )
}

function Input({ placeholder, type = "text", value, onChange }: { placeholder: string; type?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} dir="rtl"
      style={{
        width: "100%", padding: "15px 18px", borderRadius: 14,
        border: `1.5px solid ${T.border}`, background: T.card,
        fontSize: 15, color: T.text, fontFamily: AR,
        outline: "none", boxSizing: "border-box", transition: "border-color .2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = T.brand + "66")}
      onBlur={(e) => (e.target.style.borderColor = T.border)}
    />
  )
}

function Card({ children, style: sx = {}, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: 18, padding: "16px 18px",
      boxShadow: S.card, cursor: onClick ? "pointer" : undefined, ...sx,
    }}>
      {children}
    </div>
  )
}

function Chip({ children, color = T.brand, filled }: { children: ReactNode; color?: string; filled?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px",
      borderRadius: 100, background: filled ? color : color + "12",
      color: filled ? "white" : color, fontSize: 12, fontWeight: 700,
      whiteSpace: "nowrap", fontFamily: AR,
      border: filled ? "none" : `1px solid ${color}22`,
    }}>
      {children}
    </div>
  )
}

function AiTag() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, background: T.ai + "14", border: `1px solid ${T.ai}22` }}>
      <span style={{ color: T.ai, width: 12, height: 12, display: "flex" }}>{Ic.sparkle}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: T.ai, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: 0.3 }}>AI</span>
    </div>
  )
}

function TopBar({ title, onBack, right }: { title?: ReactNode; onBack?: () => void; right?: ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 16px 10px", background: T.card,
      borderBottom: `0.5px solid ${T.border}`, flexShrink: 0, gap: 8, minHeight: 44,
    }}>
      <div style={{ minWidth: 72, flex: "0 0 auto" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "transparent", border: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.brand, padding: 0 }}>
            <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.chevron}</span>
          </button>
        )}
      </div>
      <div style={{ flex: 1, textAlign: "center", fontSize: 17, fontWeight: 800, color: T.text, fontFamily: AR }}>
        {title}
      </div>
      <div style={{ minWidth: 72, flex: "0 0 auto", display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  )
}

function NavBar({
  items, active, onSelect, highlight,
}: { items: { key: string; label: string; icon: ReactNode }[]; active: string; onSelect: (k: string) => void; highlight?: string }) {
  return (
    <div style={{
      display: "flex", background: "rgba(255,255,255,0.94)",
      borderTop: `0.5px solid ${T.border}`,
      flexShrink: 0, paddingBottom: 18, backdropFilter: "blur(20px)",
    }}>
      {items.map((item) => {
        const on = item.key === active
        const hi = item.key === highlight
        return (
          <button key={item.key} onClick={() => onSelect(item.key)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "8px 4px 0", border: "none", background: "transparent", cursor: "pointer",
            color: on || hi ? T.brand : "#8E8E93", transition: "color .15s",
          }}>
            <div style={{
              width: hi ? 44 : 24, height: hi ? 44 : 24, marginTop: hi ? -10 : 0,
              borderRadius: hi ? 14 : 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: hi ? T.gradBrand : "transparent", color: hi ? "white" : "inherit",
              boxShadow: hi ? S.btn : "none",
            }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: on || hi ? 700 : 500, fontFamily: AR, letterSpacing: 0.1 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: T.border }}/>
      {label && <span style={{ fontSize: 12, color: T.muted, fontFamily: "'Cairo', sans-serif" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: T.border }}/>
    </div>
  )
}

// ─── StatusBar overlay ────────────────────────────────────────────────────────
function StatusBar({ light }: { light?: boolean }) {
  const col = light ? "white" : T.text
  const opa = light ? 0.8 : 1
  return (
    <div dir="ltr" style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 54,
      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      padding: "0 22px 8px", zIndex: 50, pointerEvents: "none",
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: col, fontFamily: LAT, opacity: opa, letterSpacing: -0.2 }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center", opacity: opa }}>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={col}><path d="M8 2.4C5.33 2.4 2.93 3.47 1.17 5.23l1.41 1.41C3.95 5.28 5.88 4.4 8 4.4s4.05.88 5.42 2.24l1.41-1.41C13.07 3.47 10.67 2.4 8 2.4zm0 4c-1.49 0-2.84.6-3.82 1.57l1.42 1.41C6.23 8.77 7.08 8.4 8 8.4s1.77.37 2.4 1l1.42-1.42C10.84 6.99 9.49 6.4 8 6.4zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
        {/* signal */}
        <svg width="13" height="11" viewBox="0 0 13 11" fill={col}><rect x="0" y="6" width="2.5" height="5" rx="1"/><rect x="3.5" y="4" width="2.5" height="7" rx="1"/><rect x="7" y="2" width="2.5" height="9" rx="1"/><rect x="10.5" y="0" width="2.5" height="11" rx="1"/></svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x=".5" y=".5" width="20" height="10" rx="3" stroke={col} strokeOpacity=".4"/><rect x="1.5" y="1.5" width="15" height="8" rx="2" fill={col}/><path d="M22 3.5v4a2 2 0 0 0 0-4z" fill={col} opacity=".4"/></svg>
      </div>
    </div>
  )
}

// ─── Type defs ────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "onboard" | "login" | "forgot" | "role"
  | "s-setup" | "t-setup"
  | "s-home" | "s-start" | "t-home"
  | "join" | "join-ok" | "find" | "t-view" | "book" | "book-ok"
  | "learn" | "subject" | "lesson" | "quiz" | "quiz-ok"
  | "ai-chat" | "t-ai"
  | "tasks" | "hw" | "hw-ok"
  | "s-account" | "t-account" | "notifs"
  | "create-class" | "class-code" | "class" | "class-students" | "s-360"
  | "t-id" | "t-review" | "t-pending" | "t-verified" | "t-failed"
  | "s-wallet" | "t-wallet" | "add-money" | "pay-ok" | "pay-fail" | "tx" | "tx-detail"
  | "withdraw" | "payout-add" | "withdraw-status" | "reports"
  | "s-plans" | "t-plans" | "plan-compare" | "checkout" | "sub-ok" | "sub-manage" | "sub-fail"
  | "ai-usage" | "ai-limit" | "ai-addon"
  | "pkg-create" | "pkg-list" | "pkg-detail"
  | "coupon" | "referral" | "refund" | "cancel-session"
  | "bookings" | "session" | "review" | "invoices"
  | "pay-methods" | "pricing" | "availability" | "calendar"
  | "security" | "privacy" | "logout" | "delete-acc" | "support" | "report-user"
  | "guardian" | "book-pay" | "edit-profile" | "ents"
  | "chats" | "chat" | "chat-image" | "chat-menu"
  | "call-in" | "call-audio" | "vid-in" | "vid-call" | "vid-files"
  | "t-create" | "live-create" | "live-price" | "live-detail" | "live-wait" | "live" | "live-end" | "lives"
  | "t-finance" | "t-tx" | "t-tx-filter" | "t-analytics" | "withdraw-confirm"
  | "s-pay" | "s-pkgs" | "s-pkg" | "pkg-pay" | "pkg-active" | "pkg-use" | "pkg-info" | "pkg-price" | "pkg-sales"
  | "sub-usage" | "teac-ai"
  | "p-setup" | "p-add-child" | "p-link" | "p-link-sent" | "p-create-child" | "p-child-ok"
  | "p-home" | "p-kids" | "p-child" | "p-hw" | "p-report" | "p-report-full" | "p-insight" | "p-perms"
  | "p-pay" | "p-wallet" | "p-wallet-add" | "p-transfer" | "p-spend" | "p-tx" | "p-tx-detail"
  | "p-subs" | "p-sub-manage" | "p-pkgs" | "p-bookings" | "p-teachers" | "p-chat"
  | "p-approve" | "p-approve-pkg" | "p-approve-book" | "p-approve-ai" | "p-approve-ok"
  | "p-notifs" | "p-more" | "devices" | "help-center" | "policies" | "account-settings" | "s-approve-sent"

type Go = (s: Screen) => void
type Role = "s" | "t" | "p"

type Kid = {
  id: string
  name: string
  grade: string
  pct: number
  note: string
  link: "connected" | "pending" | "rejected" | "removed"
  plan: string
  ai: string
}

const DEMO_KIDS: Kid[] = [
  { id: "ahmed", name: "أحمد", grade: "أولى ثانوي", pct: 78, note: "مستواه مستقر هذا الأسبوع", link: "connected", plan: "Student Plus", ai: "AI Plus" },
  { id: "sara", name: "سارة", grade: "ثانية إعدادي", pct: 64, note: "محتاجة متابعة في العلوم", link: "connected", plan: "Free Plan", ai: "AI Free" },
]

type DueOrder = {
  id: string
  time: string
  value: string
  fee: string
  vat: string
  due: string
  sub: string
}

type Settlement = {
  id: string
  status: "pending" | "done"
  sentAt: string
  doneAt?: string
  orders: DueOrder[]
}

function SettleOrderCard({
  o, badge, badgeColor, reqId, sentAt,
}: {
  o: DueOrder
  badge: string
  badgeColor: string
  reqId?: string
  sentAt?: string
}) {
  return (
    <Card style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: T.brandLight, color: T.brand, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900,
          }}>▣</span>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>رقم الطلب: {o.id}</div>
        </div>
        <Chip color={badgeColor}>{badge}</Chip>
      </div>
      {reqId && (
        <div style={{ fontFamily: AR, fontSize: 12, color: T.muted, marginBottom: 8 }}>
          طلب تسوية {reqId} · أُرسل للإدارة{sentAt ? ` · ${sentAt}` : ""}
        </div>
      )}
      {o.sub && <div style={{ fontFamily: AR, fontSize: 13, color: T.muted, marginBottom: 8 }}>{o.sub}</div>}
      {[
        ["وقت الطلب", o.time],
        ["قيمة الطلب", `${o.value} ج.م`],
        ["العمولة", o.fee],
        ["القيمة المضافة", o.vat],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: T.muted }}>{k}</span><span>{v}</span>
        </div>
      ))}
      <div style={{ height: 1, background: T.border, margin: "10px 0" }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: AR, fontWeight: 800 }}>إجمالي المستحق</span>
        <span style={{ fontFamily: LAT, fontWeight: 900, fontSize: 22, color: T.brand }}>{o.due} ج.م</span>
      </div>
    </Card>
  )
}

function MoneyAmt({ v, kind = "neutral" }: { v: string; kind?: "in" | "out" | "pend" | "neutral" }) {
  const color = kind === "in" ? T.emerald : kind === "out" ? T.rose : kind === "pend" ? T.amber : T.text
  const sign = kind === "in" ? "+ " : kind === "out" ? "− " : ""
  return <span style={{ fontFamily: LAT, fontWeight: 900, color, fontSize: 18 }}>{sign}{v}</span>
}

function FinStatus({ s }: { s: string }) {
  const map: Record<string, string> = {
    "متاح للسحب": T.emerald, "تم التحويل": T.emerald, "تم الدفع": T.emerald, "تم الاسترداد": T.teal, "نشط": T.emerald,
    "قيد التسوية": T.amber, "قيد المراجعة": T.amber, "جاري التحويل": T.amber, "قيد المعالجة": T.amber,
    "فشلت العملية": T.rose, "تعذر التجديد": T.rose,
  }
  return <Chip color={map[s] || T.brand}>{s}</Chip>
}

function FinTimeline({ steps }: { steps: { l: string; d: string; on: boolean }[] }) {
  return (
    <div style={{ marginTop: 8 }}>
      {steps.map((st, i) => (
        <div key={st.l} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: st.on ? T.emerald : T.gray, border: `2px solid ${st.on ? T.emerald : T.border}`,
            }}/>
            {i < steps.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: st.on ? T.emerald + "55" : T.border }}/>}
          </div>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 14 }}>{st.l}</div>
            <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{st.d}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Page({ title, onBack, children, footer, right, pad = true }: {
  title?: ReactNode; onBack?: () => void; children: ReactNode; footer?: ReactNode; right?: ReactNode; pad?: boolean
}) {
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <StatusBar/>
      <div style={{ paddingTop: 44, flexShrink: 0 }}>
        {title != null && <TopBar title={title} onBack={onBack} right={right}/>}
      </div>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: pad ? "16px 24px 20px" : 0, minHeight: 0 }}>
        {children}
      </div>
      {footer && <div style={{ padding: "12px 24px 28px", flexShrink: 0, background: T.card, borderTop: `0.5px solid ${T.border}` }}>{footer}</div>}
    </div>
  )
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "right", padding: "16px 18px", borderRadius: 16, cursor: "pointer",
      border: `1.5px solid ${on ? T.brand : T.border}`, background: on ? T.brandLight : T.card,
      fontFamily: AR, fontSize: 15, fontWeight: on ? 800 : 600, color: on ? T.brand : T.text,
    }}>{children}</button>
  )
}

function SuccessBlock({ title, sub, cta, onCta }: { title: string; sub?: string; cta: string; onCta: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: T.emeraldLt, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: T.emerald }}>
        <span style={{ width: 40, height: 40, display: "flex" }}>{Ic.check}</span>
      </div>
      <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, fontFamily: AR, color: T.text }}>{title}</h1>
      {sub && <p style={{ margin: "0 0 28px", fontSize: 15, color: T.sub, fontFamily: AR, lineHeight: 1.7 }}>{sub}</p>}
      <Btn onClick={onCta}>{cta}</Btn>
    </div>
  )
}

function EmptyBlock({ title, sub, actions }: { title: string; sub?: string; actions: { label: string; onClick: () => void; primary?: boolean }[] }) {
  return (
    <div style={{ padding: "8px 0 16px" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, fontFamily: AR, color: T.text }}>{title}</h1>
      {sub && <p style={{ margin: "0 0 20px", fontSize: 15, color: T.sub, fontFamily: AR, lineHeight: 1.7 }}>{sub}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {actions.map((a) => (
          <Btn key={a.label} variant={a.primary === false ? "secondary" : "primary"} onClick={a.onClick}>{a.label}</Btn>
        ))}
      </div>
    </div>
  )
}
function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span title="تم التحقق من هوية هذا المدرس بواسطة Teac Teacher" style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: small ? "2px 7px" : "4px 10px",
      borderRadius: 100, background: T.emeraldLt, color: T.emerald, fontSize: small ? 10 : 12, fontWeight: 800, fontFamily: AR,
    }}>✓ موثّق</span>
  )
}

function BalanceCard({ label, amount, onClick, tone = "brand" }: { label: string; amount: string; onClick?: () => void; tone?: "brand" | "teach" }) {
  return (
    <div onClick={onClick} style={{
      borderRadius: 20, padding: 20, marginBottom: 14, cursor: onClick ? "pointer" : undefined,
      background: tone === "teach" ? T.gradTeacher : T.gradBrand, color: "white",
    }}>
      <div style={{ fontSize: 13, opacity: 0.85, fontFamily: AR }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, fontFamily: LAT, marginTop: 6 }}>{amount}</div>
      <div style={{ fontSize: 13, opacity: 0.8, fontFamily: AR }}>ج.م</div>
    </div>
  )
}

function TxRow({ name, amount, date, status, onClick }: { name: string; amount: string; date: string; status: string; onClick?: () => void }) {
  const col = status === "ناجحة" || status === "مستردة" ? T.emerald : status === "فشلت" ? T.rose : T.amber
  return (
    <Card style={{ marginBottom: 8 }} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>{name}</div>
          <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{date} · {status}</div>
        </div>
        <div style={{ fontFamily: LAT, fontWeight: 800, color: amount.startsWith("+") ? T.emerald : T.text }}>{amount}</div>
      </div>
      <div style={{ marginTop: 6 }}><Chip color={col}>{status}</Chip></div>
    </Card>
  )
}

function PriceSummary({ rows, total }: { rows: { k: string; v: string }[]; total: string }) {
  return (
    <Card>
      {rows.map((r) => (
        <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, marginBottom: 8, color: T.sub }}>
          <span>{r.k}</span><span>{r.v}</span>
        </div>
      ))}
      <div style={{ height: 1, background: T.border, margin: "8px 0" }}/>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontWeight: 800 }}>
        <span>الإجمالي</span><span>{total}</span>
      </div>
    </Card>
  )
}

type Msg = { role: "ai" | "user"; text: string; time?: string }

function HomeSlider({ go, teacher }: { go: Go; teacher?: boolean }) {
  const slides: { t: string; d: string; s: Screen; img: string }[] = teacher
    ? [
        {
          t: "وثّق حسابك وابدأ التدريس بأمان",
          d: "ارفع إثبات الهوية مرة واحدة. بعد الموافقة هتظهر شارة مدرس موثّق، وتقدر تستقبل حجوزات مدفوعة وتطلب تسوية الأرباح.",
          s: "t-id",
          img: "https://images.unsplash.com/photo-1577896852618-857cb63e4b0b?auto=format&fit=crop&w=900&q=80",
        },
        {
          t: "أرباحك واضحة… من الحصة للتسوية",
          d: "تابع المستحق والجاري والمنتهي. كل طلب تسوية بيتبعت للإدارة بنفس تفاصيل الحصة والعمولة والإجمالي.",
          s: "ents",
          img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        },
        {
          t: "حضّر الدرس بالمعلم الذكي",
          d: "اكتب موضوع الحصة، والمساعد يجهّزلك أهداف وأمثلة وواجب جاهز تتبعت للطلاب في دقايق.",
          s: "t-ai",
          img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
        },
      ]
    : [
        {
          t: "المعلم الذكي يشرحلك خطوة بخطوة",
          d: "اسأل سؤال، ارفع واجب، أو اختبر نفسك. الشرح بيتظبط على مستواك، وتقدر ترجع للحصة وتكمّل من غير ما تتوه.",
          s: "ai-chat",
          img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        {
          t: "Student Plus لتحليل أعمق",
          d: "خطة مذاكرة أوضح، رصيد أعلى للمعلم الذكي، وتقارير تقدّم تخلّيك تعرف فين ضعفك قبل الامتحان.",
          s: "s-plans",
          img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
        },
        {
          t: "مدرسين موثّقين… احجز وأنت مطمّن",
          d: "اختار مدرس موثّق، شوف المواعيد والسعر، وادفع من المحفظة. الحصة والتذكير والواجب بيوصلوا في مكان واحد.",
          s: "find",
          img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80",
        },
      ]
  const [i, setI] = useState(0)
  const startX = useRef(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5200)
    return () => clearInterval(t)
  }, [slides.length])
  const s = slides[i]
  const goSlide = (n: number) => setI((n + slides.length) % slides.length)
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        onClick={() => go(s.s)}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current
          if (Math.abs(dx) < 40) return
          e.stopPropagation()
          goSlide(i + (dx > 0 ? -1 : 1))
        }}
        style={{
          position: "relative", borderRadius: 22, overflow: "hidden", cursor: "pointer",
          height: 168, boxShadow: S.card, background: T.brand,
        }}
      >
        <img
          src={s.img}
          alt={s.t}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(17,22,48,0.15) 0%, rgba(17,22,48,0.55) 48%, rgba(17,22,48,0.92) 100%)",
        }}/>
        <div style={{
          position: "relative", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "16px 16px 14px", color: "white",
        }}>
          <div style={{
            alignSelf: "flex-start", marginBottom: 8, padding: "4px 10px", borderRadius: 100,
            background: "rgba(255,255,255,0.16)", fontFamily: AR, fontSize: 11, fontWeight: 700,
          }}>اضغط للتفاصيل</div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: AR, lineHeight: 1.35 }}>{s.t}</div>
          <div style={{ fontSize: 12.5, opacity: 0.92, fontFamily: AR, marginTop: 6, lineHeight: 1.7 }}>{s.d}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {slides.map((sl, n) => (
          <button key={sl.t} onClick={() => setI(n)} style={{
            width: n === i ? 18 : 7, height: 7, borderRadius: 4, border: "none", padding: 0,
            background: n === i ? T.brand : T.border, cursor: "pointer",
          }}/>
        ))}
      </div>
    </div>
  )
}

function HomeSection({ title, action, onAction, children }: {
  title: string; action?: string; onAction?: () => void; children: ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
        <div style={{ fontSize: 15, fontWeight: 800, fontFamily: AR, color: T.text }}>{title}</div>
        {action && (
          <button onClick={onAction} style={{ background: "none", border: "none", color: T.brand, fontFamily: AR, fontWeight: 700, fontSize: 12, cursor: "pointer", padding: 0 }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function QuickTile({ label, sub, onClick, color = T.brand }: {
  label: string; sub?: string; onClick: () => void; color?: string
}) {
  return (
    <button onClick={onClick} style={{
      textAlign: "right", border: `1px solid ${T.border}`, background: T.card, borderRadius: 16,
      padding: "12px 12px", cursor: "pointer", boxShadow: S.card,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: color, marginBottom: 8 }}/>
      <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 13, color: T.text }}>{label}</div>
      {sub && <div style={{ fontFamily: AR, fontSize: 11, color: T.muted, marginTop: 3 }}>{sub}</div>}
    </button>
  )
}

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} style={{
      width: 50, height: 30, borderRadius: 16, border: "none", padding: 3, cursor: "pointer",
      background: on ? T.brand : "#D1D5DB", display: "flex", alignItems: "center",
      justifyContent: on ? "flex-start" : "flex-end",
    }}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "white", display: "block", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }}/>
    </button>
  )
}

// ─── SCREEN 1 · Splash ────────────────────────────────────────────────────────
function Splash({ go }: { go: () => void }) {
  useEffect(() => { const t = setTimeout(go, 2400); return () => clearTimeout(t) }, [go])
  return (
    <div onClick={go} style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(145deg,#2D3AC8 0%,#4558F4 45%,#7C3AED 100%)",
      position: "relative", overflow: "hidden", cursor: "pointer",
    }}>
      <StatusBar light/>
      {/* Decorative rings */}
      {[160,250,340].map((r,i) => (
        <div key={r} style={{ position: "absolute", width: r, height: r, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.06 - i*0.015})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}/>
      ))}
      {/* Floating particles */}
      {[
        {top:"12%",right:"14%",s:20,op:.35},
        {top:"20%",left:"10%",s:13,op:.22},
        {bottom:"22%",left:"16%",s:17,op:.28},
        {bottom:"14%",right:"12%",s:11,op:.2},
      ].map((p,i) => (
        <div key={i} style={{ position:"absolute", color:"white", width:p.s, height:p.s, opacity:p.op, top:p.top,right:(p as any).right,left:(p as any).left,bottom:(p as any).bottom }}>
          {Ic.sparkle}
        </div>
      ))}
      {/* Logo block */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 20 }}>
        <div style={{ padding: 20, borderRadius: 32, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <LogoMark size={80} light/>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 44, fontWeight: 900, color: "white", letterSpacing: -1.5, lineHeight: 1 }}>TEAC</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.6)", letterSpacing: 4, marginTop: 2 }}>TEACHER</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 4, padding: "10px 24px", borderRadius: 100, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ margin: 0, fontFamily: "'Cairo', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
            معلمك الذكي في كل خطوة
          </p>
        </div>
      </div>
      {/* Loading bar */}
      <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", width: 64, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.9)", animation: "splashLoad 2.2s ease forwards" }}/>
      </div>
      <style>{`@keyframes splashLoad{from{width:0}to{width:100%}}`}</style>
    </div>
  )
}

function OnboardArt({ slide }: { slide: number }) {
  if (slide === 1) {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="oa1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#4558F4"/></linearGradient>
          <filter id="os1"><feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#4558F4" floodOpacity=".22"/></filter>
        </defs>
        <circle cx="196" cy="168" r="118" fill="#7C3AED" opacity=".08"/>
        <circle cx="196" cy="168" r="78" fill="#7C3AED" opacity=".10"/>
        <rect x="86" y="92" width="168" height="196" rx="28" fill="white" filter="url(#os1)"/>
        <rect x="102" y="112" width="136" height="18" rx="9" fill="#F3EDFF"/>
        <rect x="102" y="142" width="108" height="10" rx="5" fill="#EDE9FE"/>
        <rect x="102" y="160" width="124" height="10" rx="5" fill="#EDE9FE"/>
        <rect x="102" y="178" width="88" height="10" rx="5" fill="#EDE9FE"/>
        <rect x="102" y="214" width="136" height="48" rx="16" fill="url(#oa1)"/>
        <circle cx="278" cy="118" r="36" fill="url(#oa1)"/>
        <path d="M278 102l3.2 10.4 10.4 3.2-10.4 3.2L278 129l-3.2-10.2-10.4-3.2 10.4-3.2Z" fill="white"/>
        <circle cx="92" cy="236" r="22" fill="#EEF1FF"/>
        <circle cx="92" cy="228" r="9" fill="#4558F4"/>
        <ellipse cx="92" cy="248" rx="12" ry="8" fill="#4558F4" opacity=".35"/>
      </svg>
    )
  }
  if (slide === 2) {
    return (
      <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="oa2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#0891B2"/><stop offset="100%" stopColor="#4558F4"/></linearGradient>
          <filter id="os2"><feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#0891B2" floodOpacity=".2"/></filter>
        </defs>
        <circle cx="196" cy="168" r="118" fill="#0891B2" opacity=".08"/>
        <rect x="78" y="108" width="234" height="168" rx="28" fill="white" filter="url(#os2)"/>
        <circle cx="196" cy="168" r="54" fill="none" stroke="#EEF1FF" strokeWidth="14"/>
        <circle cx="196" cy="168" r="54" fill="none" stroke="url(#oa2)" strokeWidth="14" strokeLinecap="round" strokeDasharray="250" strokeDashoffset="70" transform="rotate(-90 196 168)"/>
        <text x="196" y="176" textAnchor="middle" fontSize="22" fontWeight="800" fill="#4558F4" fontFamily="Plus Jakarta Sans,sans-serif">72%</text>
        <rect x="108" y="248" width="18" height="36" rx="6" fill="#C7D2FE"/>
        <rect x="136" y="232" width="18" height="52" rx="6" fill="#A5B4FC"/>
        <rect x="164" y="218" width="18" height="66" rx="6" fill="#818CF8"/>
        <rect x="192" y="208" width="18" height="76" rx="6" fill="#4558F4"/>
        <rect x="220" y="224" width="18" height="60" rx="6" fill="#7C3AED"/>
        <rect x="248" y="240" width="18" height="44" rx="6" fill="#C4B5FD"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 390 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="oa0" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4558F4"/><stop offset="100%" stopColor="#7C3AED"/></linearGradient>
        <filter id="os0"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#4558F4" floodOpacity=".24"/></filter>
      </defs>
      <circle cx="196" cy="170" r="126" fill="#4558F4" opacity=".07"/>
      <circle cx="196" cy="170" r="86" fill="#7C3AED" opacity=".08"/>
      <g filter="url(#os0)">
        <rect x="118" y="86" width="92" height="118" rx="14" fill="#EEF1FF" transform="rotate(-8 164 145)"/>
        <rect x="176" y="80" width="96" height="124" rx="14" fill="white" transform="rotate(7 224 142)"/>
        <rect x="186" y="96" width="64" height="8" rx="4" fill="#C7D2FE" transform="rotate(7 218 100)"/>
        <rect x="186" y="114" width="52" height="8" rx="4" fill="#DDD6FE" transform="rotate(7 212 118)"/>
        <rect x="186" y="132" width="58" height="8" rx="4" fill="#C7D2FE" transform="rotate(7 215 136)"/>
      </g>
      <g transform="translate(154 168)">
        <path d="M40 8 L72 20 L40 8 L8 20 Z" fill="#1A1F36"/>
        <rect x="36" y="20" width="8" height="28" rx="2" fill="#F59E0B"/>
        <circle cx="40" cy="18" r="16" fill="url(#oa0)"/>
        <path d="M28 18 h24" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <path d="M40 18 v16" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      </g>
      <circle cx="86" cy="228" r="28" fill="url(#oa0)"/>
      <circle cx="86" cy="220" r="11" fill="white" opacity=".9"/>
      <ellipse cx="86" cy="242" rx="16" ry="10" fill="white" opacity=".55"/>
      <circle cx="304" cy="236" r="28" fill="#7C3AED"/>
      <path d="M304 222 l4 12 12 4 -12 4 -4 12 -4-12 -12-4 12-4 Z" fill="white"/>
    </svg>
  )
}

function Onboard({ go, goLogin }: { go: () => void; goLogin: () => void }) {
  const [slide, setSlide] = useState(0)
  const slides = [
    {
      headline: "تعلم بطريقة أذكى",
      body: "مدرسك الحقيقي والمعلم الذكي يساعدوك تفهم، تتطور، وتوصل لهدفك.",
      accent: T.brand,
      tags: ["مدرس حقيقي", "معلم AI", "تتبع التقدم"],
    },
    {
      headline: "مساعد AI دائماً معاك",
      body: "اسأل، ارفع صورة، واطلب شرح أي جزء في أي وقت — من غير انتظار.",
      accent: T.ai,
      tags: ["شرح فوري", "صور الأسئلة", "بدون انتظار"],
    },
    {
      headline: "تابع تقدمك كل يوم",
      body: "تقارير واضحة تبين قوتك ونقاط التطوير في كل مادة.",
      accent: T.teal,
      tags: ["نسب الإنجاز", "نقاط القوة", "خطة تحسين"],
    },
  ]
  const s = slides[slide]
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.card, position: "relative", overflow: "hidden" }}>
      <StatusBar/>
      <div style={{
        flex: 1, minHeight: 0, position: "relative",
        background: "radial-gradient(ellipse at 50% 40%, #E8EBFF 0%, #F4F0FF 55%, #FFFFFF 100%)",
      }}>
        <button onClick={goLogin} style={{
          position: "absolute", top: 54, left: 8, zIndex: 5,
          background: "none", border: "none", color: T.brand, fontSize: 15, fontWeight: 700,
          fontFamily: AR, cursor: "pointer", padding: "10px 16px",
        }}>تخطي</button>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 8px 24px" }}>
          <OnboardArt slide={slide}/>
        </div>
      </div>

      <div style={{
        flexShrink: 0, background: T.card, borderRadius: "28px 28px 0 0",
        boxShadow: "0 -12px 40px rgba(69,88,244,0.08)",
        padding: "20px 24px 34px",
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 22 : 8, height: 8, borderRadius: 4, border: "none", padding: 0,
              background: i === slide ? s.accent : "#E4E8FA", cursor: "pointer",
            }}/>
          ))}
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: T.text, lineHeight: 1.25, fontFamily: AR, textAlign: "center" }}>
          {s.headline}
        </h1>
        <p style={{ margin: "0 0 16px", fontSize: 15, color: T.sub, lineHeight: 1.75, fontFamily: AR, textAlign: "center" }}>
          {s.body}
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {s.tags.map((tag) => (
            <Chip key={tag} color={s.accent}>{tag}</Chip>
          ))}
        </div>
        <Btn onClick={slide < slides.length - 1 ? () => setSlide(slide + 1) : go}>
          {slide < slides.length - 1 ? "التالي" : "ابدأ الآن"}
        </Btn>
        <button onClick={goLogin} style={{
          marginTop: 8, background: "none", border: "none", color: T.brand,
          fontSize: 15, fontWeight: 700, fontFamily: AR, cursor: "pointer", padding: 10,
        }}>لدي حساب</button>
      </div>
    </div>
  )
}

// ─── SCREEN 3 · Login / Signup ────────────────────────────────────────────────
function Login({ go, onForgot }: { go: () => void; onForgot: () => void }) {
  const [mode, setMode] = useState<"in"|"up">("in")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [pass2, setPass2] = useState("")
  return (
    <div dir="rtl" className="scrollbar-hide" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflowY: "auto", minHeight: 0 }}>
      <StatusBar/>
      <div style={{ background: "white", paddingTop: 56, paddingBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Wordmark size={36}/>
        <p style={{ margin: 0, fontSize: 13, color: T.muted, fontFamily: AR }}>
          {mode === "in" ? "سجّل دخولك للمتابعة" : "أنشئ حسابك مجاناً"}
        </p>
      </div>
      <div style={{ margin: "16px 24px 0", background: T.gray, borderRadius: 14, padding: 4, display: "flex" }}>
        {[{k:"in",l:"تسجيل الدخول"},{k:"up",l:"إنشاء حساب جديد"}].map(({k,l}) => (
          <button key={k} onClick={() => setMode(k as "in"|"up")} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: AR,
            background: mode === k ? "white" : "transparent",
            color: mode === k ? T.brand : T.muted,
            boxShadow: mode === k ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "up" && <Input placeholder="الاسم" value={name} onChange={setName}/>}
        {mode === "up" && <Input placeholder="رقم الهاتف" value={phone} onChange={setPhone}/>}
        <Input placeholder={mode === "up" ? "البريد الإلكتروني" : "رقم الهاتف أو البريد الإلكتروني"} type="email" value={email} onChange={setEmail}/>
        <Input placeholder="كلمة المرور" type="password" value={pass} onChange={setPass}/>
        {mode === "up" && <Input placeholder="تأكيد كلمة المرور" type="password" value={pass2} onChange={setPass2}/>}
        {mode === "in" && (
          <button onClick={onForgot} style={{ background: "none", border: "none", textAlign: "left", fontSize: 13, color: T.brand, fontWeight: 700, fontFamily: AR, cursor: "pointer", padding: 0 }}>
            نسيت كلمة المرور؟
          </button>
        )}
        <Btn onClick={go}>{mode === "in" ? "تسجيل الدخول" : "إنشاء حساب"}</Btn>
        <Divider label="أو تابع بـ"/>
        <button onClick={go} style={{
          width: "100%", padding: "14px", borderRadius: 14,
          border: `1.5px solid ${T.border}`, background: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          cursor: "pointer", fontSize: 15, fontWeight: 600, color: T.text, fontFamily: AR,
        }}>
          {Ic.google}
          <span>متابعة بحساب Google</span>
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 4 · Role Select ───────────────────────────────────────────────────
function RoleSelect({ goStudent, goTeacher, goParent }: { goStudent: () => void; goTeacher: () => void; goParent: () => void }) {
  const [sel, setSel] = useState<Role | null>(null)
  const roles = [
    { id: "s" as const, icon: Ic.book, title: "طالب", desc: "اتعلم، تابع تقدمك، احجز مع مدرس واستخدم المعلم الذكي.", color: T.brand, grad: T.gradBrand },
    { id: "t" as const, icon: Ic.classes, title: "مدرس", desc: "أدر طلبتك، دروسك، حجوزاتك وأرباحك باستخدام أدوات ذكية.", color: T.emerald, grad: T.gradTeacher },
    { id: "p" as const, icon: Ic.family, title: "ولي أمر", desc: "تابع أولادك، مستواهم الدراسي، حجوزاتهم ومدفوعاتهم من مكان واحد.", color: T.teal, grad: "linear-gradient(135deg, #0891B2 0%, #4558F4 100%)" },
  ]
  const goSel = () => { if (sel === "t") goTeacher(); else if (sel === "p") goParent(); else if (sel === "s") goStudent() }
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <StatusBar/>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "60px 20px 12px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 22 }}>
          <Wordmark size={30}/>
          <h1 style={{ margin: "12px 0 4px", fontSize: 20, fontWeight: 900, color: T.text, fontFamily: AR, textAlign: "center", lineHeight: 1.45 }}>
            هتستخدم Teac Teacher كـ إيه؟
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: T.muted, fontFamily: AR }}>اختر دورك لنخصص تجربتك</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {roles.map((role) => {
            const on = sel === role.id
            return (
              <div key={role.id} onClick={() => setSel(role.id)} style={{
                borderRadius: 22, border: `2px solid ${on ? role.color : T.border}`,
                background: on ? role.color + "0a" : "white",
                padding: "18px 16px", cursor: "pointer", minHeight: 108,
                boxShadow: on ? `0 4px 24px ${role.color}20` : S.card,
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: role.grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                    <span style={{ width: 26, height: 26, display: "flex" }}>{role.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: T.text, fontFamily: AR }}>{role.title}</span>
                      {on && <span style={{ color: role.color, width: 18, height: 18, display: "flex" }}>{Ic.check}</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.7, fontFamily: AR }}>{role.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ padding: "12px 20px 28px", flexShrink: 0 }}>
        <Btn onClick={goSel} style={sel === "t" ? { background: T.gradTeacher, boxShadow: S.btnEm } : sel === "p" ? { background: "linear-gradient(135deg,#0891B2,#4558F4)", boxShadow: "0 4px 20px rgba(8,145,178,.35)" } : undefined}>
          {sel ? "متابعة" : "اختر دورك للمتابعة"}
        </Btn>
      </div>
    </div>
  )
}

// ─── SCREEN 5 · Student Home ──────────────────────────────────────────────────
function StudentHome({ go, hasTeacher }: { go: Go; hasTeacher: boolean }) {
  const navItems = [
    { key: "home", label: "الرئيسية", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.home}</span> },
    { key: "learn", label: "التعلم", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.book}</span> },
    { key: "ai", label: "المعلم الذكي", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.robot}</span> },
    { key: "tasks", label: "المهام", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.task}</span> },
    { key: "profile", label: "المزيد", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.more}</span> },
  ]
  const onNav = (k: string) => {
    if (k === "home") go("s-home")
    if (k === "learn") go("learn")
    if (k === "ai") go("ai-chat")
    if (k === "tasks") go("tasks")
    if (k === "profile") go("s-account")
  }
  const subjects = [
    { name: "الرياضيات", sub: "المعادلات الخطية", pct: 65, color: T.brand },
    { name: "الفيزياء", sub: "قوانين نيوتن", pct: 48, color: T.ai },
    { name: "الإنجليزي", sub: "Present Perfect", pct: 82, color: T.teal },
  ]
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: T.gradBrand, padding: "44px 20px 20px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <StatusBar light/>
        <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
        <div style={{ position: "absolute", bottom: -50, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "'Cairo', sans-serif" }}>الاثنين، ١٨ أغسطس ٢٠٢٦</p>
            <h1 style={{ margin: "0 0 3px", fontSize: 22, fontWeight: 900, color: "white", fontFamily: "'Cairo', sans-serif" }}>أهلاً يا أحمد 👋</h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'Cairo', sans-serif" }}>جاهز تكمل تقدمك النهاردة؟</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => go("notifs")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", backdropFilter: "blur(8px)" }}>
              <span style={{ width: 20, height: 20, display: "flex" }}>{Ic.bell}</span>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "white", fontFamily: "'Cairo', sans-serif" }}>أح</span>
            </div>
          </div>
        </div>
        {/* Weekly progress */}
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "12px 14px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "'Cairo', sans-serif" }}>تقدمك هذا الأسبوع</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>72%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: "72%", height: "100%", background: "white", borderRadius: 4 }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'Cairo', sans-serif" }}>الهدف: ٥ ساعات / أسبوع</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "'Cairo', sans-serif", display: "flex", alignItems: "center", gap: 3 }}>
              <span>📈</span> +12% من الأسبوع اللي فات
            </span>
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 18px", minHeight: 0 }}>
        <HomeSlider go={go}/>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <QuickTile label="محفظتي" sub="450 ج.م" onClick={() => go("s-wallet")} color={T.emerald}/>
          <QuickTile label="المعلم الذكي" sub="اسأل وتدرّب" onClick={() => go("ai-chat")} color={T.ai}/>
          <QuickTile label={hasTeacher ? "مدرسي" : "ابحث عن مدرس"} sub={hasTeacher ? "أ/ محمد حسن" : "مدرسين موثّقين"} onClick={() => go(hasTeacher ? "t-view" : "find")} color={T.teal}/>
          <QuickTile label="المهام" sub="واجب + حصة" onClick={() => go("tasks")} color={T.amber}/>
        </div>

        <HomeSection title="كمّل تعلمك">
          <Card style={{ background: "linear-gradient(145deg,#EEF0FE 0%,white 80%)", border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: AR, marginBottom: 3 }}>آخر درس</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: T.text, fontFamily: AR }}>الرياضيات</div>
                <div style={{ fontSize: 13, color: T.muted, fontFamily: AR, marginTop: 1 }}>المعادلات الخطية</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.gradBrand, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                <span style={{ width: 24, height: 24, display: "flex" }}>{Ic.book}</span>
              </div>
            </div>
            <ProgressBar pct={65}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: T.muted, fontFamily: AR }}>٦٥٪ · ١٣ / ٢٠ درس</span>
              <button onClick={() => go("lesson")} style={{ padding: "8px 16px", borderRadius: 10, background: T.brand, color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: AR }}>
                كمل التعلم
              </button>
            </div>
          </Card>
        </HomeSection>

        {!hasTeacher ? (
          <HomeSection title="ابدأ مع مدرس">
            <Card>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: T.sub, fontFamily: AR, lineHeight: 1.7 }}>انضم ب<b>كود الفصل</b> أو ابحث عن مدرس موثّق واحجز حصة.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Btn onClick={() => go("join")}>انضم بكود</Btn>
                <Btn variant="secondary" onClick={() => go("find")}>ابحث عن مدرس</Btn>
              </div>
            </Card>
          </HomeSection>
        ) : (
          <HomeSection title="مدرسي" action="عرض" onAction={() => go("t-view")}>
            <Card onClick={() => go("t-view")}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar name="محمد حسن" size={44} bg={T.emerald}/>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, fontFamily: AR, display: "flex", gap: 6, alignItems: "center" }}>أ/ محمد حسن <VerifiedBadge small/></div>
                    <div style={{ fontSize: 12, color: T.muted, fontFamily: AR }}>الرياضيات · حصة السبت ٦ م</div>
                  </div>
                </div>
                <span style={{ color: T.muted, width: 18, height: 18, display: "flex", transform: "scaleX(-1)" }}>{Ic.chevron}</span>
              </div>
            </Card>
          </HomeSection>
        )}

        <HomeSection title="اليوم" action="المهام" onAction={() => go("tasks")}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Card style={{ padding: "14px" }} onClick={() => go("hw")}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.amber }}/>
                <span style={{ fontSize: 10, color: T.muted, fontFamily: AR }}>التسليم غداً</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: AR, marginBottom: 3, lineHeight: 1.3 }}>واجب الرياضيات</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: AR, marginBottom: 10 }}>١٠ أسئلة · أُنجز ٤</div>
              <ProgressBar pct={40} color={T.amber} h={5}/>
            </Card>
            <Card style={{ padding: "14px" }} onClick={() => go("bookings")}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.brand }}/>
                <span style={{ fontSize: 10, color: T.muted, fontFamily: AR }}>السبت ٦:٠٠ م</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: AR, marginBottom: 8, lineHeight: 1.3 }}>حصة مع أ/ محمد</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Avatar name="محمد" size={24} bg={T.emerald}/>
                <span style={{ fontSize: 11, color: T.muted, fontFamily: AR }}>رياضيات</span>
              </div>
            </Card>
          </div>
        </HomeSection>

        <HomeSection title="موادي" action="الكل" onAction={() => go("learn")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {subjects.map((s) => (
              <Card key={s.name} style={{ padding: "12px 14px" }} onClick={() => go("subject")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: AR }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: T.muted, fontFamily: AR, marginTop: 1 }}>{s.sub}</div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 900, color: s.color, fontFamily: LAT }}>{s.pct}%</span>
                </div>
                <ProgressBar pct={s.pct} color={s.color} h={5}/>
              </Card>
            ))}
          </div>
        </HomeSection>
      </div>
      <NavBar items={navItems} active="home" highlight="ai" onSelect={onNav}/>
    </div>
  )
}

// ─── SCREEN 6 · Teacher Home ──────────────────────────────────────────────────
function TeacherHome({ go, empty, verified }: { go: Go; empty?: boolean; verified?: boolean }) {
  const navItems = [
    { key: "home",     label: "الرئيسية", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.home}</span> },
    { key: "classes",  label: "الفصول",   icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.classes}</span> },
    { key: "create",   label: "إنشاء",    icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.plus}</span> },
    { key: "students", label: "الطلاب",   icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.students}</span> },
    { key: "profile",  label: "المزيد",    icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.more}</span> },
  ]
  const onNav = (k: string) => {
    if (k === "home") go("t-home")
    if (k === "classes") go("class")
    if (k === "create") go("t-create")
    if (k === "students") go("class-students")
    if (k === "profile") go("t-account")
  }
  const stats = [
    { label: "الطلاب", val: "48", emoji: "👤", color: T.brand },
    { label: "الفصول", val: "3",  emoji: "📚", color: T.ai },
    { label: "الواجبات", val: "12", emoji: "📝", color: T.amber },
    { label: "الحصص",  val: "5",  emoji: "📅", color: T.teal },
  ]
  const classes = [
    { name: "رياضيات — الصف الأول الثانوي", students: 24, color: T.brand, next: "اليوم ٤:٠٠ م" },
    { name: "رياضيات — الصف الثاني الثانوي", students: 18, color: T.ai, next: "الأربعاء ٥:٠٠ م" },
    { name: "رياضيات — الصف الثالث الثانوي", students: 6,  color: T.teal, next: "الخميس ٦:٠٠ م" },
  ]
  const attention = [
    { name: "أحمد علي", note: "يحتاج مراجعة في المعادلات.", pct: 42, color: T.amber },
    { name: "سارة محمود", note: "انخفض مستواها في آخر اختبار.", pct: 35, color: T.rose },
  ]
  if (empty) {
    return (
      <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
        <StatusBar/>
        <div className="scrollbar-hide" style={{ flex: 1, padding: "60px 24px 20px" }}>
          <Wordmark size={32}/>
          {!verified && (
            <Card style={{ margin: "16px 0" }} onClick={() => go("t-id")}>
              <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 6 }}>وثّق حسابك لاستقبال حجوزات مدفوعة</div>
              <p style={{ margin: "0 0 10px", fontFamily: AR, color: T.sub, fontSize: 13 }}>تقدر تستخدم المساعد الذكي الآن. السوق والسحب بعد التوثيق.</p>
              <Btn onClick={() => go("t-id")}>ابدأ التوثيق</Btn>
            </Card>
          )}
          <EmptyBlock
            title="ابدأ مع Teac Teacher"
            sub="أنشئ فصلك الأول أو حضّر محتوى بالذكاء الاصطناعي قبل ما ينضم الطلاب."
            actions={[
              { label: "أنشئ أول فصل", onClick: () => go("create-class") },
              { label: "حضّر درس بالذكاء الاصطناعي", onClick: () => go("t-ai"), primary: false },
              { label: "أنشئ امتحان", onClick: () => go("t-ai"), primary: false },
              { label: "ادعُ طلبتك", onClick: () => go("create-class"), primary: false },
            ]}
          />
        </div>
        <NavBar items={navItems} active="home" onSelect={onNav}/>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <div style={{ background: T.gradTeacher, padding: "44px 20px 20px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <StatusBar light/>
        <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "'Cairo', sans-serif" }}>الاثنين، ١٨ أغسطس ٢٠٢٦</p>
            <h1 style={{ margin: "0 0 3px", fontSize: 22, fontWeight: 900, color: "white", fontFamily: "'Cairo', sans-serif" }}>أهلاً أ/ محمد 👋</h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'Cairo', sans-serif" }}>إليك ملخص طلبتك اليوم</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => go("notifs")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
              <span style={{ width: 20, height: 20, display: "flex" }}>{Ic.bell}</span>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "white", fontFamily: "'Cairo', sans-serif" }}>مح</span>
            </div>
          </div>
        </div>
        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.13)", borderRadius: 12, padding: "10px 6px", textAlign: "center", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: 18 }}>{s.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", fontFamily: "'Cairo', sans-serif", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 18px", minHeight: 0 }}>
        <HomeSlider go={go} teacher/>

        {!verified && (
          <Card style={{ marginBottom: 16, background: T.amberLt, boxShadow: "none", border: `1px solid ${T.amber}22` }} onClick={() => go("t-pending")}>
            <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 4 }}>حسابك يحتاج توثيق</div>
            <div style={{ fontFamily: AR, fontSize: 12, color: T.sub }}>السوق والسحب بعد الموافقة · المساعد الذكي متاح الآن</div>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <QuickTile label="الأرباح" sub="5,200 متاح" onClick={() => go("t-finance")} color={T.emerald}/>
          <QuickTile label="المستحقات" sub="طلب تسوية" onClick={() => go("ents")} color={T.brand}/>
          <QuickTile label="تحضير درس" sub="المعلم الذكي" onClick={() => go("t-ai")} color={T.ai}/>
          <QuickTile label="إنشاء فصل" sub="كود للطلاب" onClick={() => go("create-class")} color={T.teal}/>
        </div>

        <HomeSection title="فصولي" action="الكل" onAction={() => go("class")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {classes.map((cls) => (
              <Card key={cls.name} style={{ padding: "13px 14px" }} onClick={() => go("class")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: cls.color + "15", display: "flex", alignItems: "center", justifyContent: "center", color: cls.color, flexShrink: 0 }}>
                      <span style={{ width: 20, height: 20, display: "flex" }}>{Ic.book}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: AR, lineHeight: 1.35 }}>{cls.name}</div>
                      <div style={{ fontSize: 11, color: T.muted, fontFamily: AR, marginTop: 2 }}>{cls.students} طالب · {cls.next}</div>
                    </div>
                  </div>
                  <span style={{ color: T.muted, width: 18, height: 18, display: "flex", transform: "scaleX(-1)" }}>{Ic.chevron}</span>
                </div>
              </Card>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="طلاب يحتاجون متابعة" action="عرض" onAction={() => go("s-360")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {attention.map((st) => (
              <Card key={st.name} style={{ padding: "14px" }} onClick={() => go("s-360")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar name={st.name} size={38} bg={st.color}/>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: AR }}>{st.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, fontFamily: AR, marginTop: 2 }}>{st.note}</div>
                    </div>
                  </div>
                  <Chip color={st.color}>{st.pct}%</Chip>
                </div>
                <div style={{ marginTop: 10 }}>
                  <ProgressBar pct={st.pct} color={st.color} h={5}/>
                </div>
              </Card>
            ))}
          </div>
        </HomeSection>
      </div>
      <NavBar items={navItems} active="home" onSelect={onNav}/>
    </div>
  )
}

// ─── SCREEN 7 · Student Profile (Teacher view) ────────────────────────────────
function StudentProfile({ onBack }: { onBack: () => void }) {
  const perf = [78, 60, 84, 55, 70, 68]
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <div style={{ paddingTop: 44 }}>
        <TopBar title="ملف الطالب" onBack={onBack}
          right={
            <div style={{ background: T.brand + "12", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: T.brand, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>
              إجراء
            </div>
          }
        />
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Student hero */}
        <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.gradBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Cairo', sans-serif" }}>أع</span>
              </div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 20, height: 20, borderRadius: "50%", background: T.amber, border: "2.5px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>
                ⚠️
              </div>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T.text, fontFamily: "'Cairo', sans-serif" }}>أحمد علي</div>
          <div style={{ fontSize: 13, color: T.muted, fontFamily: "'Cairo', sans-serif", marginTop: 3 }}>الصف الأول الثانوي · رياضيات</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
            <Chip color={T.amber}>يحتاج متابعة</Chip>
            <Chip color={T.brand}>طالب نشط</Chip>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "الحضور", val: "85%", color: T.emerald },
            { label: "الواجبات", val: "72%", color: T.brand },
            { label: "الاختبارات", val: "68%", color: T.amber },
            { label: "المستوى", val: "جيد", color: T.ai },
          ].map((s) => (
            <Card key={s.label} style={{ padding: "11px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: s.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Cairo', sans-serif", marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Performance chart */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: "'Cairo', sans-serif", marginBottom: 14 }}>الأداء الأخير</div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <ProgressRing pct={68} size={76} color={T.amber} label="المتوسط"/>
            {/* Bar chart */}
            <div>
              <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 56, marginBottom: 6 }}>
                {perf.map((v, i) => (
                  <div key={i} style={{ width: 14, borderRadius: "4px 4px 2px 2px", height: `${(v/100)*56}px`, background: i === perf.length - 1 ? T.brand : T.border, transition: "background .2s" }}/>
                ))}
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["أغ","سب","أك","نو","دي","يا"].map((m,i) => (
                  <div key={i} style={{ width: 14, fontSize: 8, color: T.muted, textAlign: "center", fontFamily: "'Cairo', sans-serif" }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14, textAlign: "center" }}>
            {[
              { label: "آخر اختبار", val: "55%", color: T.rose },
              { label: "أعلى نتيجة", val: "84%", color: T.emerald },
              { label: "الاتجاه", val: "↘ هابط", color: T.amber },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 14, fontWeight: 900, color: s.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Cairo', sans-serif", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths / weaknesses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Card style={{ padding: "14px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.emerald, fontFamily: "'Cairo', sans-serif", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
              <span>💪</span> نقاط القوة
            </div>
            {["الجبر الأساسي","المتتاليات","التفاضل"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                <span style={{ color: T.emerald, width: 13, height: 13, display: "flex", flexShrink: 0 }}>{Ic.check}</span>
                <span style={{ fontSize: 12, color: T.text, fontFamily: "'Cairo', sans-serif" }}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{ padding: "14px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.rose, fontFamily: "'Cairo', sans-serif", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
              <span>📌</span> نقاط الضعف
            </div>
            {["توحيد المقامات","المعادلات التربيعية"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: T.rose + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.rose }}/>
                </div>
                <span style={{ fontSize: 12, color: T.text, fontFamily: "'Cairo', sans-serif" }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* AI insight */}
        <div style={{ borderRadius: 18, padding: "16px 16px", marginBottom: 14, background: "linear-gradient(135deg,#EEF0FE 0%,#F5F0FF 100%)", border: `1.5px solid ${T.ai}20` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ color: T.ai, width: 15, height: 15, display: "flex" }}>{Ic.sparkle}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.ai, fontFamily: "'Cairo', sans-serif" }}>تحليل المعلم الذكي</span>
            <AiTag/>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: T.sub, lineHeight: 1.85, fontFamily: "'Cairo', sans-serif" }}>
            أحمد يفهم أساسيات الجبر جيداً، لكنه يواجه صعوبة متكررة في توحيد المقامات. يُفضَّل مراجعة هذا المفهوم قبل الدرس القادم مع تمارين تطبيقية تدريجية الصعوبة.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: "'Cairo', sans-serif", marginBottom: 10 }}>الإجراءات</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "إنشاء واجب", color: T.brand, emoji: "📝" },
            { label: "إنشاء اختبار", color: T.ai, emoji: "📋" },
            { label: "إرسال رسالة", color: T.teal, emoji: "💬" },
            { label: "خطة تعلم", color: T.emerald, emoji: "🗺️" },
          ].map((a) => (
            <button key={a.label} style={{ padding: "14px 10px", borderRadius: 14, background: a.color + "0f", color: a.color, border: `1.5px solid ${a.color}22`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Cairo', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22 }}>{a.emoji}</span>{a.label}
            </button>
          ))}
        </div>
        <div style={{ height: 16 }}/>
      </div>
    </div>
  )
}

// ─── SCREEN 8 · AI Chat ───────────────────────────────────────────────────────
function AIChat({ onBack, onLimit }: { onBack: () => void; onLimit?: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "أهلاً أحمد 👋، هنذاكر إيه النهاردة؟", time: "٩:٤١" },
  ])
  const [input, setInput] = useState("")
  const [learningMode, setLearningMode] = useState(false)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollDown = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80)
  }, [])

  const send = useCallback((text?: string) => {
    const msg = text ?? input.trim()
    if (!msg) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`
    setMsgs((p) => [...p, { role: "user", text: msg, time }])
    setInput("")
    setTyping(true)
    scrollDown()
    setTimeout(() => {
      const reply = learningMode
        ? "ممتاز! هنحل الموضوع خطوة بخطوة. الخطوة الأولى: حدد معاملات المعادلة (a, b, c). ما رأيك؟"
        : "سؤال رائع! المعادلة التربيعية: ax² + bx + c = 0\n\nالحل بالقانون: x = (−b ± √(b²−4ac)) / 2a\n\nهل تريد مثال تطبيقي؟"
      setTyping(false)
      setMsgs((p) => [...p, { role: "ai", text: reply, time }])
      scrollDown()
    }, 1200)
  }, [input, learningMode, scrollDown])

  const quick = ["اشرحلي درس","حل سؤال معايا","اختبرني","راجع معايا","اعمللي خطة مذاكرة","ارفع صورة سؤال"]

  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: T.gradBrand, paddingTop: 44, paddingBottom: 12, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <StatusBar light/>
        <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 0", position: "relative" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 11, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", transform: "scaleX(-1)" }}>
            <span style={{ width: 18, height: 18, display: "flex" }}>{Ic.arrowL}</span>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", width: 14, height: 14, display: "flex" }}>{Ic.sparkle}</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "white", fontFamily: AR, cursor: "pointer" }} onClick={onLimit}>المعلم الذكي</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }}/>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "'Cairo', sans-serif" }}>متاح الآن</span>
            </div>
          </div>
          <button onClick={() => setLearningMode((m) => !m)} style={{
            padding: "6px 10px", borderRadius: 10, cursor: "pointer", border: "none",
            background: learningMode ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1, transition: "all .2s",
          }}>
            <span style={{ fontSize: 16 }}>🧠</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: learningMode ? T.brand : "rgba(255,255,255,0.8)", fontFamily: AR, lineHeight: 1.2 }}>
              وضع التعلّم
            </span>
          </button>
        </div>
        {learningMode && (
          <div style={{ margin: "10px 16px 0", padding: "7px 12px", background: "rgba(255,255,255,0.13)", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>🧠</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontFamily: "'Cairo', sans-serif" }}>وضع التعلّم مفعّل — المعلم يرشدك خطوة بخطوة</span>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ padding: "10px 12px 8px", background: "white", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="scrollbar-hide">
          {quick.map((q) => (
            <button key={q} onClick={() => send(q)} style={{ padding: "6px 14px", borderRadius: 100, background: T.brandLight, color: T.brand, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Cairo', sans-serif", flexShrink: 0 }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end", gap: 8, alignItems: "flex-end" }}>
            {m.role === "ai" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.gradBrand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", width: 15, height: 15, display: "flex" }}>{Ic.sparkle}</span>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "ai" ? "flex-end" : "flex-start", gap: 3, maxWidth: "76%" }}>
              <div style={{
                padding: "11px 14px", borderRadius: m.role === "ai" ? "18px 18px 18px 5px" : "18px 18px 5px 18px",
                background: m.role === "ai" ? "white" : T.gradBrand,
                color: m.role === "ai" ? T.text : "white",
                fontSize: 14, lineHeight: 1.75, fontFamily: "'Cairo', sans-serif",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)", whiteSpace: "pre-line",
              }}>
                {m.text}
              </div>
              {m.time && <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{m.time}</div>}
            </div>
            {m.role === "user" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.brand + "18", border: `1.5px solid ${T.brand}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.brand, fontFamily: "'Cairo', sans-serif" }}>أح</span>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.gradBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", width: 15, height: 15, display: "flex" }}>{Ic.sparkle}</span>
            </div>
            <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 5px", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", gap: 4 }}>
              {[0,1,2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.brand + "60", animation: `typingBounce 1s ${i*0.15}s ease-in-out infinite` }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
        <style>{`@keyframes typingBounce{0%,80%,100%{transform:scale(1)}40%{transform:scale(1.4)}}`}</style>
      </div>

        {learningMode && (
          <div style={{ display: "flex", gap: 6, padding: "0 12px 8px", flexWrap: "wrap" }}>
            {["تلميح","تلميح أقوى","اشرحلي","وريني الحل"].map((h) => (
              <button key={h} onClick={() => send(h)} style={{ padding: "6px 12px", borderRadius: 100, border: `1px solid ${T.border}`, background: T.card, fontFamily: AR, fontSize: 12, fontWeight: 700, color: T.brand, cursor: "pointer" }}>{h}</button>
            ))}
          </div>
        )}
      {/* Input */}
      <div style={{ padding: "8px 12px 12px", background: "white", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: T.bg, borderRadius: 18, padding: "7px 7px 7px 14px", border: `1.5px solid ${T.border}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="اكتب سؤالك هنا..."
            dir="rtl"
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: T.text, fontFamily: "'Cairo', sans-serif", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[
              { icon: Ic.attach, title: "ملف" },
              { icon: Ic.image, title: "صورة" },
              { icon: Ic.mic, title: "صوت" },
            ].map(({ icon, title }) => (
              <button key={title} title={title} style={{ width: 32, height: 32, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.muted }}>
                <span style={{ width: 17, height: 17, display: "flex" }}>{icon}</span>
              </button>
            ))}
            <button onClick={() => send()} style={{ width: 38, height: 38, borderRadius: 13, background: T.gradBrand, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: `0 2px 10px ${T.brand}44` }}>
              <span style={{ width: 17, height: 17, display: "flex" }}>{Ic.send}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Forgot({ go }: { go: Go }) {
  const [id, setId] = useState("")
  return (
    <Page title="نسيت كلمة المرور" onBack={() => go("login")} footer={<Btn onClick={() => go("login")}>إرسال رابط الاستعادة</Btn>}>
      <p style={{ margin: "0 0 16px", fontFamily: AR, color: T.sub, fontSize: 15, lineHeight: 1.7 }}>أدخل رقم الهاتف أو البريد الإلكتروني ونبعتلك رابط إعادة التعيين.</p>
      <Input placeholder="رقم الهاتف أو البريد الإلكتروني" value={id} onChange={setId}/>
    </Page>
  )
}

function StudentSetup({ go }: { go: Go }) {
  const [step, setStep] = useState(0)
  const [stage, setStage] = useState("ثانوي")
  const [grade, setGrade] = useState("أولى ثانوي")
  const [subs, setSubs] = useState<string[]>(["الرياضيات"])
  const [goal, setGoal] = useState("تحسين مستوايا")
  const grades: Record<string, string[]> = {
    ابتدائي: ["أول","ثاني","ثالث","رابع","خامس","سادس"],
    إعدادي: ["أولى إعدادي","تانية إعدادي","تالتة إعدادي"],
    ثانوي: ["أولى ثانوي","تانية ثانوي","تالتة ثانوي"],
    جامعة: ["سنة أولى","سنة تانية","سنة تالتة","سنة رابعة"],
    أخرى: ["أخرى"],
  }
  const toggle = (x: string) => setSubs((p) => p.includes(x) ? p.filter(i => i !== x) : [...p, x])
  const next = () => step < 4 ? setStep(step + 1) : go("s-start")
  return (
    <Page title="إعداد الملف" onBack={() => step ? setStep(step - 1) : go("role")} footer={<Btn onClick={next}>{step === 4 ? "ابدأ رحلتك" : "التالي"}</Btn>}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[0,1,2,3,4].map((i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.brand : T.border }}/>)}
      </div>
      {step === 0 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, fontFamily: AR }}>إيه مرحلتك الدراسية؟</h1>
        {["ابتدائي","إعدادي","ثانوي","جامعة","أخرى"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={stage===x} onClick={() => setStage(x)}>{x}</Choice></div>)}
      </>}
      {step === 1 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, fontFamily: AR }}>اختار الصف الدراسي</h1>
        {(grades[stage] || []).map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={grade===x} onClick={() => setGrade(x)}>{x}</Choice></div>)}
      </>}
      {step === 2 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, fontFamily: AR }}>إيه المواد اللي مهتم بيها؟</h1>
        {["الرياضيات","الفيزياء","الكيمياء","اللغة الإنجليزية","اللغة العربية"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={subs.includes(x)} onClick={() => toggle(x)}>{x}</Choice></div>)}
      </>}
      {step === 3 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, fontFamily: AR }}>هدفك إيه؟</h1>
        {["تحسين مستوايا","الاستعداد للامتحانات","حل الواجبات","تأسيس من البداية","متابعة مع مدرس"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={goal===x} onClick={() => setGoal(x)}>{x}</Choice></div>)}
      </>}
      {step === 4 && <>
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, fontFamily: AR }}>ملفك جاهز</h1>
        <p style={{ margin: "0 0 16px", color: T.sub, fontFamily: AR }}>{stage} · {grade} · {subs.join("، ")}</p>
        <Card><div style={{ fontFamily: AR, fontWeight: 700 }}>{goal}</div></Card>
      </>}
    </Page>
  )
}

function TeacherSetup({ go }: { go: Go }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("محمد حسن")
  const [bio, setBio] = useState("")
  const [mode, setMode] = useState("Both")
  return (
    <Page title="بيانات المدرس" onBack={() => step ? setStep(step-1) : go("role")} footer={<Btn onClick={() => step < 1 ? setStep(step+1) : go("t-id")}>التالي</Btn>}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[0,1].map((i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.emerald : T.border }}/>)}
      </div>
      {step===0 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, fontFamily: AR }}>بيانات المدرس</h1>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Avatar name={name} size={72} bg={T.emerald}/></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Input placeholder="الاسم بالكامل" value={name} onChange={setName}/>
          <Input placeholder="رقم الهاتف" value="01012345678"/>
          <Input placeholder="البريد الإلكتروني" value="mohamed@teac.app"/>
          <Input placeholder="تاريخ الميلاد" value="12 / 3 / 1992"/>
          <Input placeholder="المحافظة" value="القاهرة"/>
          <Input placeholder="المدينة" value="مدينة نصر"/>
        </div>
      </>}
      {step===1 && <>
        <h1 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, fontFamily: AR }}>بيانات التدريس</h1>
        <p style={{ fontFamily: AR, color: T.muted, margin: "0 0 8px" }}>المواد</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>{["رياضيات","فيزياء"].map(x => <Chip key={x} filled color={T.emerald}>{x}</Chip>)}</div>
        <p style={{ fontFamily: AR, color: T.muted, margin: "0 0 8px" }}>المرحلة والصفوف</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>{["ثانوي","أولى","تانية"].map(x => <Chip key={x} color={T.emerald}>{x}</Chip>)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          <Input placeholder="سنوات الخبرة" value="8"/>
          <Input placeholder="المؤهل الدراسي" value="بكالوريوس تربية"/>
          <Input placeholder="الجامعة" value="جامعة عين شمس"/>
          <Input placeholder="التخصص" value="رياضيات"/>
          <Input placeholder="نبذة عن المدرس" value={bio} onChange={setBio}/>
        </div>
        <p style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>رفع شهادة المؤهل (اختياري)</p>
        <Card style={{ marginBottom: 12 }}><div style={{ fontFamily: AR }}>📷 اختيار من المعرض أو الكاميرا</div></Card>
        <p style={{ fontFamily: AR, color: T.muted, margin: "0 0 8px" }}>طريقة التدريس</p>
        {["أونلاين","حضوري","الاثنين"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={mode===x} onClick={() => setMode(x)}>{x}</Choice></div>)}
      </>}
    </Page>
  )
}

function StudentStart({ go }: { go: Go }) {
  return (
    <Page title="ابدأ رحلتك" onBack={() => go("s-setup")}>
      <EmptyBlock title="ابدأ رحلتك" sub="تقدر تستخدم التطبيق لوحدك أو تنضم لمدرس." actions={[
        { label: "انضم لمدرسك", onClick: () => go("join") },
        { label: "ابحث عن مدرس", onClick: () => go("find"), primary: false },
        { label: "ابدأ مع المعلم الذكي", onClick: () => go("ai-chat"), primary: false },
      ]}/>
    </Page>
  )
}

function JoinClass({ go, onJoin }: { go: Go; onJoin: () => void }) {
  const [code, setCode] = useState("TEAC-8246")
  const [phase, setPhase] = useState<"in"|"load"|"found"|"err">("in")
  const [err, setErr] = useState("")
  const submit = () => {
    const c = code.trim().toUpperCase()
    if (c === "TEAC-0000") { setErr("انتهت صلاحية الكود"); setPhase("err"); return }
    if (c === "TEAC-1111") { setErr("الطالب منضم بالفعل"); setPhase("err"); return }
    if (c !== "TEAC-8246") { setErr("الكود غير صحيح"); setPhase("err"); return }
    setPhase("load")
    setTimeout(() => setPhase("found"), 900)
  }
  if (phase === "found") return (
    <Page title="انضم لمدرسك" onBack={() => go("s-home")} footer={<Btn onClick={() => { onJoin(); go("join-ok") }}>تأكيد الانضمام</Btn>}>
      <Card>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Avatar name="محمد حسن" size={52} bg={T.emerald}/>
          <div>
            <div style={{ fontWeight: 800, fontFamily: AR, fontSize: 16 }}>أ/ محمد حسن</div>
            <div style={{ fontFamily: AR, color: T.muted, fontSize: 13 }}>رياضيات — أولى ثانوي</div>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: AR, color: T.sub }}>24 طالب · الكود TEAC-8246</p>
      </Card>
    </Page>
  )
  return (
    <Page title="انضم لمدرسك" onBack={() => go("s-home")} footer={<Btn onClick={submit}>{phase==="load" ? "جاري التحقق..." : "انضمام"}</Btn>}>
      <p style={{ fontFamily: AR, color: T.sub, margin: "0 0 12px" }}>أدخل كود الفصل</p>
      <Input placeholder="TEAC-8246" value={code} onChange={setCode}/>
      {phase==="err" && <p style={{ color: T.rose, fontFamily: AR, fontWeight: 700 }}>{err}</p>}
    </Page>
  )
}

function FindTeacher({ go }: { go: Go }) {
  const [q, setQ] = useState("")
  const filters = ["المادة","المرحلة","السعر","التقييم","Online / Offline","المواعيد"]
  const teachers = [
    { name: "أ/ محمد حسن", sub: "رياضيات", rate: "4.9", exp: "8 سنوات", price: "180 ج", mode: "Both" },
    { name: "أ/ سارة علي", sub: "فيزياء", rate: "4.8", exp: "6 سنوات", price: "160 ج", mode: "Online" },
    { name: "أ/ كريم فؤاد", sub: "إنجليزي", rate: "4.7", exp: "5 سنوات", price: "150 ج", mode: "Offline" },
  ]
  return (
    <Page title="اختار مدرسك" onBack={() => go("s-home")}>
      <Input placeholder="ابحث عن مدرس أو مادة" value={q} onChange={setQ}/>
      <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "12px 0 16px" }}>
        {filters.map((f) => <Chip key={f}>{f}</Chip>)}
      </div>
      {teachers.map((t) => (
        <Card key={t.name} style={{ marginBottom: 10 }} onClick={() => go("t-view")}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Avatar name={t.name} size={48} bg={T.brand}/>
              <div>
            <div style={{ fontWeight: 800, fontFamily: AR }}>{t.name} <VerifiedBadge small/></div>
                <div style={{ fontSize: 12, color: T.muted, fontFamily: AR }}>{t.sub} · ⭐ {t.rate} · {t.exp}</div>
                <div style={{ fontSize: 12, color: T.brand, fontFamily: AR, marginTop: 4 }}>{t.price} / حصة · {t.mode}</div>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.brand, fontFamily: AR, alignSelf: "center" }}>عرض الملف</span>
          </div>
        </Card>
      ))}
    </Page>
  )
}

function TeacherView({ go }: { go: Go }) {
  return (
    <Page title="ملف المدرس" onBack={() => go("find")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("book")}>احجز حصة</Btn>
        <Btn variant="secondary" onClick={() => go("chat")}>مراسلة المدرس</Btn>
        <Btn variant="ghost" onClick={() => go("s-pkg")}>باقات أ/ محمد</Btn>
      </div>
    }>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Avatar name="محمد حسن" size={76} bg={T.emerald}/></div>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: AR, marginTop: 8, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>أ/ محمد حسن <VerifiedBadge/></div>
        <div style={{ fontFamily: AR, color: T.muted, fontSize: 13 }}>⭐ 4.9 · 120 طالب · 8 سنوات خبرة</div>
      </div>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR, lineHeight: 1.8, color: T.sub }}>مدرس رياضيات للمرحلة الثانوية، بشرح المفهوم من الأساس وأركز على حل الامتحانات.</div></Card>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontFamily: AR, marginBottom: 8 }}>اختبار تحديد مستوى قبل الحصة</div>
        <p style={{ margin: 0, fontFamily: AR, color: T.sub, fontSize: 14 }}>اختبار قصير يساعد المدرس يفهم مستواك قبل أول حصة.</p>
        <Btn variant="ghost" onClick={() => go("quiz")} style={{ marginTop: 8 }}>ابدأ الاختبار</Btn>
      </Card>
      <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>180 جنيه · 60 دقيقة · سبت–خميس 4–9 م</div>
    </Page>
  )
}

function Booking({ go }: { go: Go }) {
  const [step, setStep] = useState(0)
  const [sub, setSub] = useState("الرياضيات")
  const [day, setDay] = useState("السبت 22 أغسطس")
  const [time, setTime] = useState("6:00 م")
  return (
    <Page title="حجز حصة" onBack={() => step ? setStep(step-1) : go("t-view")} footer={
      <Btn onClick={() => step < 3 ? setStep(step+1) : go("book-pay")}>{step===3 ? "متابعة للدفع" : "التالي"}</Btn>
    }>
      {step===0 && ["الرياضيات","الفيزياء"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={sub===x} onClick={() => setSub(x)}>{x}</Choice></div>)}
      {step===1 && ["السبت 22 أغسطس","الأحد 23 أغسطس"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={day===x} onClick={() => setDay(x)}>{x}</Choice></div>)}
      {step===2 && ["4:00 م","6:00 م","8:00 م"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={time===x} onClick={() => setTime(x)}>{x}</Choice></div>)}
      {step===3 && (
        <Card>
          <div style={{ fontFamily: AR, lineHeight: 2 }}>
            <div>المدرس: أ/ محمد حسن</div>
            <div>المادة: {sub}</div>
            <div>التاريخ: {day}</div>
            <div>الوقت: {time}</div>
            <div>المدة: 60 دقيقة</div>
            <div style={{ fontWeight: 800 }}>السعر: 180 ج.م</div>
            <div style={{ fontSize: 13, color: T.muted }}>رسوم المنصة تظهر قبل التأكيد حسب سياسة Teac Teacher</div>
          </div>
        </Card>
      )}
    </Page>
  )
}

function Learn({ go }: { go: Go }) {
  const items = [
    { name: "الرياضيات", pct: 65, lesson: "المعادلات الخطية", done: "13 / 20" },
    { name: "الفيزياء", pct: 48, lesson: "قوانين نيوتن", done: "8 / 16" },
    { name: "الكيمياء", pct: 30, lesson: "التفاعلات", done: "4 / 14" },
    { name: "اللغة الإنجليزية", pct: 82, lesson: "Present Perfect", done: "18 / 22" },
  ]
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <StatusBar/>
      <div style={{ paddingTop: 44 }}><TopBar title="التعلم" onBack={() => go("s-home")}/></div>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {items.map((s) => (
          <Card key={s.name} style={{ marginBottom: 10 }} onClick={() => go("subject")}>
            <div style={{ fontWeight: 800, fontFamily: AR }}>{s.name}</div>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: AR, margin: "4px 0 8px" }}>{s.lesson} · {s.done} درس</div>
            <ProgressBar pct={s.pct}/>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Subject({ go }: { go: Go }) {
  const lessons = [
    { t: "مقدمة المعادلات", st: "مكتمل" },
    { t: "المعادلات الخطية", st: "الحالي" },
    { t: "تمارين تطبيقية", st: "اختبار" },
    { t: "المعادلات المركبة", st: "مقفل" },
  ]
  return (
    <Page title="الرياضيات" onBack={() => go("learn")}>
      <Card style={{ marginBottom: 12 }}><div style={{ fontFamily: AR }}>الوحدة الحالية: المعادلات · 65%</div><div style={{ marginTop: 8 }}><ProgressBar pct={65}/></div></Card>
      {lessons.map((l) => (
        <Card key={l.t} style={{ marginBottom: 8 }} onClick={() => l.st !== "مقفل" && go(l.st === "اختبار" ? "quiz" : "lesson")}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: AR }}>
            <span style={{ fontWeight: 700 }}>{l.t}</span>
            <Chip color={l.st==="مقفل" ? T.muted : l.st==="مكتمل" ? T.emerald : T.brand}>{l.st}</Chip>
          </div>
        </Card>
      ))}
    </Page>
  )
}

function Lesson({ go }: { go: Go }) {
  return (
    <Page title="المعادلات الخطية" onBack={() => go("subject")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("ai-chat")}>اسأل المعلم الذكي</Btn>
        <Btn variant="secondary" onClick={() => go("quiz")}>ابدأ الاختبار</Btn>
        <Btn variant="ghost" onClick={() => go("subject")}>أكملت الدرس</Btn>
      </div>
    }>
      <div style={{ height: 160, borderRadius: 16, background: T.brandLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: T.brand, fontFamily: AR, fontWeight: 700 }}>فيديو الشرح</div>
      <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.85 }}>المعادلة الخطية هي معادلة من الدرجة الأولى. صيغتها العامة: ax + b = 0</p>
      <h3 style={{ fontFamily: AR }}>مثال</h3>
      <Card>2x + 4 = 10 → x = 3</Card>
    </Page>
  )
}

function Quiz({ go }: { go: Go }) {
  const [i, setI] = useState(0)
  const [ans, setAns] = useState<string | null>(null)
  const qs = [
    { q: "حل 2x + 4 = 10", opts: ["x = 3","x = 2","x = 6"], type: "mc" },
    { q: "هل 5x - 5 = 0 معادلة خطية؟", opts: ["صح","خطأ"], type: "tf" },
    { q: "اكتب قانون الحل في سطر.", opts: [], type: "write" },
  ]
  const cur = qs[i]
  return (
    <Page title="اختبار قصير" onBack={() => go("lesson")} footer={
      <Btn onClick={() => i < qs.length-1 ? setI(i+1) : go("quiz-ok")}>{i < qs.length-1 ? "التالي" : "إنهاء الاختبار"}</Btn>
    }>
      <div style={{ fontFamily: AR, color: T.muted, marginBottom: 8 }}>{i+1} / {qs.length}</div>
      <h2 style={{ fontFamily: AR, fontSize: 20 }}>{cur.q}</h2>
      {cur.opts.map((o) => <div key={o} style={{ marginBottom: 8 }}><Choice on={ans===o} onClick={() => setAns(o)}>{o}</Choice></div>)}
      {cur.type==="write" && <Input placeholder="اكتب إجابتك"/>}
    </Page>
  )
}

function QuizOk({ go }: { go: Go }) {
  return (
    <Page title="النتيجة" onBack={() => go("s-home")} footer={<Btn onClick={() => go("lesson")}>راجع أخطائي</Btn>}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 40, fontWeight: 900, fontFamily: LAT, color: T.brand }}>8 / 10</div>
        <div style={{ fontFamily: AR, fontSize: 20, fontWeight: 800 }}>أداء ممتاز 👏</div>
      </div>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: AR, lineHeight: 2 }}>صح: 8 · غلط: 2 · الوقت: 4 دقائق</div>
        <div style={{ fontFamily: AR }}>قوة: الجبر · يحتاج تحسين: توحيد المقامات</div>
      </Card>
      <Card>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}><span style={{ color: T.ai, width: 14, height: 14, display: "flex" }}>{Ic.sparkle}</span><b style={{ fontFamily: AR }}>تحليل المعلم الذكي</b></div>
        <p style={{ margin: 0, fontFamily: AR, color: T.sub }}>المعلم الذكي لاحظ إنك محتاج تراجع توحيد المقامات.</p>
      </Card>
    </Page>
  )
}

function Tasks({ go }: { go: Go }) {
  const [tab, setTab] = useState("الكل")
  return (
    <Page title="المهام" onBack={() => go("s-home")}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["الكل","واجبات","اختبارات","مكتمل"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 12px", borderRadius: 100, border: "none", background: tab===t ? T.brand : T.gray, color: tab===t ? "white" : T.sub, fontFamily: AR, fontWeight: 700, cursor: "pointer" }}>{t}</button>
        ))}
      </div>
      <Card onClick={() => go("hw")}>
        <div style={{ fontWeight: 800, fontFamily: AR }}>واجب المعادلات</div>
        <div style={{ fontSize: 13, color: T.muted, fontFamily: AR, margin: "4px 0 10px" }}>أ/ محمد · التسليم غداً</div>
        <Btn onClick={() => go("hw")}>ابدأ الواجب</Btn>
      </Card>
    </Page>
  )
}

function Homework({ go }: { go: Go }) {
  const [step, setStep] = useState<"q"|"ask"|"done">("q")
  if (step==="ask") return (
    <Page title="تسليم الواجب" onBack={() => setStep("q")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => setStep("done")}>تأكيد التسليم</Btn>
        <Btn variant="secondary" onClick={() => setStep("q")}>رجوع</Btn>
      </div>
    }>
      <h2 style={{ fontFamily: AR }}>هل أنت متأكد من تسليم الواجب؟</h2>
    </Page>
  )
  if (step==="done") return (
    <Page title="تم التسليم" onBack={() => go("tasks")} footer={<Btn onClick={() => go("quiz-ok")}>عرض النتيجة</Btn>}>
      <SuccessBlock title="تم تسليم الواجب بنجاح" cta="عرض النتيجة" onCta={() => go("quiz-ok")}/>
    </Page>
  )
  return (
    <Page title="واجب المعادلات" onBack={() => go("tasks")} footer={<Btn onClick={() => setStep("ask")}>تسليم الواجب</Btn>}>
      <p style={{ fontFamily: AR, color: T.muted }}>أ/ محمد · 10 أسئلة</p>
      <h3 style={{ fontFamily: AR }}>1. حل 3x = 12</h3>
      {["x = 4","x = 3","x = 6"].map((o) => <div key={o} style={{ marginBottom: 8 }}><Choice on={o==="x = 4"} onClick={() => {}}>{o}</Choice></div>)}
    </Page>
  )
}

function parentNavItems() {
  return [
    { key: "home", label: "الرئيسية", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.home}</span> },
    { key: "kids", label: "أولادي", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.family}</span> },
    { key: "pay", label: "المدفوعات", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.wallet}</span> },
    { key: "notifs", label: "التنبيهات", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.bell}</span> },
    { key: "more", label: "المزيد", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.more}</span> },
  ]
}
function parentOnNav(go: Go, k: string) {
  if (k === "home") go("p-home")
  if (k === "kids") go("p-kids")
  if (k === "pay") go("p-pay")
  if (k === "notifs") go("p-notifs")
  if (k === "more") go("p-more")
}
function ParentShell({ go, active, children }: { go: Go; active: string; children: ReactNode }) {
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      {children}
      <NavBar items={parentNavItems()} active={active} onSelect={(k) => parentOnNav(go, k)}/>
    </div>
  )
}
function ChildSwitcher({ kids, id, onPick, onAdd }: { kids: Kid[]; id: string; onPick: (id: string) => void; onAdd: () => void }) {
  const [open, setOpen] = useState(false)
  const cur = kids.find((k) => k.id === id) ?? kids[0]
  if (!cur) return null
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
        borderRadius: 16, border: `1.5px solid ${T.border}`, background: "rgba(255,255,255,0.18)", cursor: "pointer",
      }}>
        <Avatar name={cur.name} size={36}/>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontFamily: AR, fontWeight: 800, color: "white", fontSize: 15 }}>{cur.name}</div>
          <div style={{ fontFamily: AR, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{cur.grade}</div>
        </div>
        <span style={{ color: "white", transform: open ? "rotate(90deg)" : "rotate(-90deg)", width: 18, height: 18, display: "flex" }}>{Ic.chevron}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: 58, left: 0, right: 0, zIndex: 8, background: T.card, borderRadius: 16, boxShadow: S.float, padding: 8 }}>
          {kids.map((k) => (
            <button key={k.id} onClick={() => { onPick(k.id); setOpen(false) }} style={{
              width: "100%", display: "flex", gap: 10, padding: 10, border: "none", background: k.id === id ? T.brandLight : "transparent",
              borderRadius: 12, cursor: "pointer", textAlign: "right",
            }}>
              <Avatar name={k.name} size={32}/>
              <div>
                <div style={{ fontFamily: AR, fontWeight: 800, color: T.text }}>{k.name}</div>
                <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{k.grade}</div>
              </div>
            </button>
          ))}
          <button onClick={() => { setOpen(false); onAdd() }} style={{
            width: "100%", padding: 12, border: "none", background: "transparent", color: T.brand, fontFamily: AR, fontWeight: 800, cursor: "pointer",
          }}>+ إضافة طالب</button>
        </div>
      )}
    </div>
  )
}

function MoreRow({ icon, title, sub, value, badge, onClick, danger }: {
  icon: ReactNode; title: string; sub?: string; value?: string; badge?: string; onClick?: () => void; danger?: boolean
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%", minHeight: 52, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      border: "none", background: "transparent", cursor: "pointer", textAlign: "right",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: danger ? T.roseLt : T.brandLight, color: danger ? T.rose : T.brand,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ width: 20, height: 20, display: "flex" }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 15, color: danger ? T.rose : T.text }}>{title}</div>
        {sub && <div style={{ fontFamily: AR, fontSize: 12, color: T.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {badge && <Chip color={T.brand}>{badge}</Chip>}
      {value && <span style={{ fontFamily: LAT, fontSize: 13, fontWeight: 800, color: T.sub }}>{value}</span>}
      <span style={{ width: 18, height: 18, display: "flex", color: T.muted, transform: "scaleX(-1)" }}>{Ic.chevron}</span>
    </button>
  )
}

function MoreGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: AR, fontSize: 13, fontWeight: 800, color: T.muted, margin: "0 4px 10px" }}>{title}</div>
      <div style={{ background: T.card, borderRadius: 18, boxShadow: S.card, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  )
}

function Account({ go, role, verified }: { go: Go; role: Role; verified?: boolean }) {
  const studentNav = [
    { key: "home", label: "الرئيسية", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.home}</span> },
    { key: "learn", label: "التعلم", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.book}</span> },
    { key: "ai", label: "المعلم الذكي", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.robot}</span> },
    { key: "tasks", label: "المهام", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.task}</span> },
    { key: "profile", label: "المزيد", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.more}</span> },
  ]
  const teacherNav = [
    { key: "home",     label: "الرئيسية", icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.home}</span> },
    { key: "classes",  label: "الفصول",   icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.classes}</span> },
    { key: "create",   label: "إنشاء",    icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.plus}</span> },
    { key: "students", label: "الطلاب",   icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.students}</span> },
    { key: "profile",  label: "المزيد",    icon: <span style={{ width: 22, height: 22, display: "flex" }}>{Ic.more}</span> },
  ]
  const onNav = (k: string) => {
    if (role === "s") {
      if (k === "home") go("s-home")
      if (k === "learn") go("learn")
      if (k === "ai") go("ai-chat")
      if (k === "tasks") go("tasks")
      if (k === "profile") go("s-account")
    } else if (role === "t") {
      if (k === "home") go("t-home")
      if (k === "classes") go("class")
      if (k === "create") go("t-create")
      if (k === "students") go("class-students")
      if (k === "profile") go("t-account")
    } else parentOnNav(go, k)
  }
  const name = role === "t" ? "أ/ محمد أحمد" : "أحمد محمد"
  const sub = role === "t" ? "Teacher Pro · رياضيات" : role === "p" ? "ولي أمر" : "أولى ثانوي · Student Plus"
  const nav = role === "t" ? teacherNav : role === "p" ? parentNavItems() : studentNav
  const quick = role === "t" ? [
    { l: "الأرباح", s: "3,850", go: "t-finance" as Screen },
    { l: "اشتراكي", s: "Pro", go: "t-plans" as Screen },
    { l: "الباقات", s: "3", go: "pkg-sales" as Screen },
    { l: "الحجوزات", s: "5", go: "bookings" as Screen },
  ] : role === "p" ? [
    { l: "المحفظة", s: "2,400", go: "p-wallet" as Screen },
    { l: "الاشتراكات", s: "2 نشطة", go: "p-subs" as Screen },
    { l: "أولادي", s: "2", go: "p-kids" as Screen },
    { l: "الدعم", s: "—", go: "support" as Screen },
  ] : [
    { l: "المحفظة", s: "180", go: "s-wallet" as Screen },
    { l: "اشتراكي", s: "Plus", go: "s-plans" as Screen },
    { l: "باقاتي", s: "1", go: "s-pkgs" as Screen },
    { l: "حجوزاتي", s: "2", go: "bookings" as Screen },
  ]
  return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg, overflow: "hidden" }}>
      <StatusBar/>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 20px 28px", minHeight: 0 }}>
        <Card style={{ marginBottom: 16, padding: 16 }} onClick={() => go("edit-profile")}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={name} size={56} bg={role === "t" ? T.emerald : T.brand}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 18, display: "flex", gap: 6, alignItems: "center" }}>
                {name} {role === "t" && verified && <VerifiedBadge small/>}
              </div>
              <div style={{ fontFamily: AR, fontSize: 13, color: T.muted, marginTop: 2 }}>{sub}</div>
              <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>01012345678</div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); go("edit-profile") }} style={{
            marginTop: 12, width: "100%", minHeight: 40, borderRadius: 12, border: "none",
            background: T.brandLight, color: T.brand, fontFamily: AR, fontWeight: 800, cursor: "pointer",
          }}>عرض الملف الشخصي</button>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
          {quick.map((q) => (
            <button key={q.l} onClick={() => go(q.go)} style={{
              textAlign: "right", border: `1px solid ${T.border}`, background: T.card, borderRadius: 16,
              padding: "12px 12px", cursor: "pointer", boxShadow: S.card, minHeight: 72,
            }}>
              <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{q.l}</div>
              <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 16, color: T.text, marginTop: 4 }}>{q.s}</div>
            </button>
          ))}
        </div>
        {role === "p" && <>
          <MoreGroup title="الأسرة والتعليم">
            <MoreRow icon={Ic.family} title="أولادي" sub="إدارة الحسابات المرتبطة" onClick={() => go("p-kids")}/>
            <MoreRow icon={Ic.book} title="التقارير الدراسية" sub="التقدم والتقرير الأسبوعي" onClick={() => go("p-report")}/>
            <MoreRow icon={Ic.students} title="المدرسون" sub="المدرسون المرتبطون بأولادك" onClick={() => go("p-teachers")}/>
            <MoreRow icon={Ic.task} title="الحجوزات" sub="القادمة والسابقة" onClick={() => go("p-bookings")}/>
            <MoreRow icon={Ic.classes} title="الباقات" sub="باقات أولادي النشطة" onClick={() => go("p-pkgs")}/>
          </MoreGroup>
          <MoreGroup title="المالية والاشتراكات">
            <MoreRow icon={Ic.wallet} title="المحفظة العائلية" sub="إدارة الرصيد والمدفوعات" value="2,400 ج.م" onClick={() => go("p-wallet")}/>
            <MoreRow icon={Ic.task} title="المعاملات" sub="سجل المدفوعات والاسترداد" onClick={() => go("p-tx")}/>
            <MoreRow icon={Ic.sparkle} title="الاشتراكات" sub="خطط أولادك وAI" badge="2 نشطة" onClick={() => go("p-subs")}/>
            <MoreRow icon={Ic.wallet} title="طرق الدفع" onClick={() => go("pay-methods")}/>
            <MoreRow icon={Ic.book} title="الفواتير" onClick={() => go("invoices")}/>
            <MoreRow icon={Ic.lock} title="حدود الإنفاق" sub="مصروف كل طالب" onClick={() => go("p-spend")}/>
          </MoreGroup>
          <MoreGroup title="الحساب والأمان">
            <MoreRow icon={Ic.user} title="البيانات الشخصية" onClick={() => go("edit-profile")}/>
            <MoreRow icon={Ic.lock} title="الأمان" onClick={() => go("security")}/>
            <MoreRow icon={Ic.lock} title="الخصوصية" onClick={() => go("privacy")}/>
            <MoreRow icon={Ic.classes} title="الأجهزة المسجل عليها الحساب" onClick={() => go("devices")}/>
            <MoreRow icon={Ic.bell} title="الإشعارات" onClick={() => go("p-notifs")}/>
          </MoreGroup>
          <MoreGroup title="المساعدة">
            <MoreRow icon={Ic.sparkle} title="مركز المساعدة" onClick={() => go("help-center")}/>
            <MoreRow icon={Ic.send} title="تواصل مع الدعم" onClick={() => go("support")}/>
            <MoreRow icon={Ic.task} title="الإبلاغ عن مشكلة" onClick={() => go("report-user")}/>
            <MoreRow icon={Ic.book} title="الشروط والسياسات" onClick={() => go("policies")}/>
          </MoreGroup>
        </>}
        {role === "t" && <>
          <MoreGroup title="إدارة عملي">
            <MoreRow icon={Ic.wallet} title="المالية" sub="الأرصدة والمستحقات" onClick={() => go("t-finance")}/>
            <MoreRow icon={Ic.wallet} title="أرباحي" onClick={() => go("t-finance")}/>
            <MoreRow icon={Ic.task} title="المعاملات" onClick={() => go("t-tx")}/>
            <MoreRow icon={Ic.classes} title="الباقات" onClick={() => go("pkg-sales")}/>
            <MoreRow icon={Ic.book} title="الأسعار والخدمات" onClick={() => go("pricing")}/>
            <MoreRow icon={Ic.task} title="المواعيد" onClick={() => go("availability")}/>
            <MoreRow icon={Ic.sparkle} title="البثوث" onClick={() => go("lives")}/>
            <MoreRow icon={Ic.bell} title="الحجوزات" onClick={() => go("bookings")}/>
          </MoreGroup>
          <MoreGroup title="Teac Teacher">
            <MoreRow icon={Ic.sparkle} title="اشتراكي" badge="Pro" onClick={() => go("t-plans")}/>
            <MoreRow icon={Ic.robot} title="استخدام AI" onClick={() => go("teac-ai")}/>
            <MoreRow icon={Ic.book} title="الفواتير" onClick={() => go("invoices")}/>
          </MoreGroup>
          <MoreGroup title="الحساب">
            <MoreRow icon={Ic.user} title="الملف الشخصي" onClick={() => go("edit-profile")}/>
            <MoreRow icon={Ic.check} title="توثيق الهوية" onClick={() => go(verified ? "t-verified" : "t-pending")}/>
            <MoreRow icon={Ic.wallet} title="طرق السحب" onClick={() => go("payout-add")}/>
            <MoreRow icon={Ic.lock} title="الأمان" onClick={() => go("security")}/>
            <MoreRow icon={Ic.lock} title="الخصوصية" onClick={() => go("privacy")}/>
            <MoreRow icon={Ic.bell} title="الإشعارات" onClick={() => go("notifs")}/>
          </MoreGroup>
          <MoreGroup title="الدعم">
            <MoreRow icon={Ic.sparkle} title="المساعدة" onClick={() => go("help-center")}/>
            <MoreRow icon={Ic.send} title="تواصل معنا" onClick={() => go("support")}/>
            <MoreRow icon={Ic.task} title="الإبلاغ عن مشكلة" onClick={() => go("report-user")}/>
          </MoreGroup>
        </>}
        {role === "s" && <>
          <MoreGroup title="التعلم">
            <MoreRow icon={Ic.students} title="مدرسيني" onClick={() => go("find")}/>
            <MoreRow icon={Ic.task} title="حجوزاتي" onClick={() => go("bookings")}/>
            <MoreRow icon={Ic.classes} title="باقاتي" onClick={() => go("s-pkgs")}/>
            <MoreRow icon={Ic.book} title="تقدمي" onClick={() => go("learn")}/>
            <MoreRow icon={Ic.attach} title="الملفات المحفوظة" onClick={() => go("learn")}/>
          </MoreGroup>
          <MoreGroup title="المدفوعات">
            <MoreRow icon={Ic.wallet} title="المحفظة" value="180 ج.م" onClick={() => go("s-wallet")}/>
            <MoreRow icon={Ic.task} title="المعاملات" onClick={() => go("tx")}/>
            <MoreRow icon={Ic.sparkle} title="اشتراكي" badge="Plus" onClick={() => go("s-plans")}/>
            <MoreRow icon={Ic.robot} title="اشتراك AI" onClick={() => go("teac-ai")}/>
            <MoreRow icon={Ic.wallet} title="طرق الدفع" onClick={() => go("pay-methods")}/>
            <MoreRow icon={Ic.book} title="الفواتير" onClick={() => go("invoices")}/>
          </MoreGroup>
          <MoreGroup title="الحساب">
            <MoreRow icon={Ic.user} title="الملف الشخصي" onClick={() => go("edit-profile")}/>
            <MoreRow icon={Ic.family} title="ولي الأمر" sub="مرتبط بالحساب ✓" onClick={() => go("guardian")}/>
            <MoreRow icon={Ic.bell} title="الإشعارات" onClick={() => go("notifs")}/>
            <MoreRow icon={Ic.lock} title="الأمان" onClick={() => go("security")}/>
            <MoreRow icon={Ic.lock} title="الخصوصية" onClick={() => go("privacy")}/>
          </MoreGroup>
          <MoreGroup title="الدعم">
            <MoreRow icon={Ic.sparkle} title="المساعدة" onClick={() => go("help-center")}/>
            <MoreRow icon={Ic.send} title="تواصل معنا" onClick={() => go("support")}/>
            <MoreRow icon={Ic.task} title="الإبلاغ عن مشكلة" onClick={() => go("report-user")}/>
          </MoreGroup>
        </>}
        <button onClick={() => go("logout")} style={{
          width: "100%", minHeight: 52, marginTop: 8, borderRadius: 16,
          border: `1.5px solid ${T.border}`, background: "transparent",
          color: T.muted, fontFamily: AR, fontWeight: 800, fontSize: 15, cursor: "pointer",
        }}>تسجيل الخروج</button>
      </div>
      <NavBar items={nav} active={role === "p" ? "more" : "profile"} onSelect={onNav}/>
    </div>
  )
}

function Notifs({ go, back }: { go: Go; back: Screen }) {
  const teacher = back === "t-home" || back === "t-account"
  const [items, setItems] = useState(teacher ? [
    { id: 1, title: "واجب تم تسليمه", body: "أحمد علي سلّم واجب المعادلات", time: "٨:٠٠ ص · ١٩ أغسطس ٢٠٢٦", icon: "📘", color: T.brand },
    { id: 2, title: "حجز جديد", body: "سارة محمود حجزت حصة رياضيات الساعة ٦ م", time: "٧:٣٠ ص · ١٩ أغسطس ٢٠٢٦", icon: "📅", color: T.teal },
    { id: 3, title: "500 ج.م أصبحت متاحة للسحب", body: "بعد اكتمال دورة التسوية", time: "أمس · ٦:١٢ م", icon: "👛", color: T.emerald },
    { id: 5, title: "تم بيع باقة جديدة 🎉", body: "باقة تأسيس الرياضيات · أحمد علي", time: "١٨ أغسطس", icon: "🎁", color: T.brand },
    { id: 6, title: "تم تحويل 2,000 ج.م إلى حسابك", body: "مرجع WD-204", time: "١٢ أغسطس", icon: "🏦", color: T.teal },
    { id: 4, title: "تحضير درس جاهز", body: "المعلم الذكي جهز أهداف الدرس القادم", time: "أمس · ١١:٠٠ ص", icon: "✨", color: T.ai },
  ] : [
    { id: 1, title: "واجب جديد", body: "أ/ محمد أرسل واجب المعادلات", time: "٨:٠٠ ص · ١٩ أغسطس ٢٠٢٦", icon: "📘", color: T.brand },
    { id: 2, title: "تذكير بالحصة", body: "حصتك هتبدأ بعد ساعة", time: "٧:٣٠ ص · ١٩ أغسطس ٢٠٢٦", icon: "⏰", color: T.teal },
    { id: 3, title: "تم تأكيد الدفع", body: "تم خصم 180 ج.م لحصة الرياضيات", time: "أمس · ٦:١٢ م", icon: "💳", color: T.emerald },
    { id: 4, title: "رصيد المعلم الذكي", body: "متبقي 20% من استخدام AI", time: "أمس · ١١:٠٠ ص", icon: "✨", color: T.ai },
  ])
  return (
    <Page title="الإشعارات" onBack={() => go(back)} right={
      <button onClick={() => setItems([])} style={{ background: "none", border: "none", color: T.muted, fontFamily: AR, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>حذف الكل</button>
    }>
      {items.length === 0 && <p style={{ fontFamily: AR, color: T.muted, textAlign: "center" }}>مفيش إشعارات حالياً</p>}
      {items.map((n) => (
        <div key={n.id} style={{
          display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12,
          padding: 14, borderRadius: 16, border: `1px solid ${T.border}`, background: T.card,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <span style={{
                width: 34, height: 34, borderRadius: "50%", background: n.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>{n.icon}</span>
              <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 15 }}>{n.title}</div>
            </div>
            <div style={{ fontFamily: AR, fontSize: 13, color: T.sub, lineHeight: 1.6 }}>{n.body}</div>
            <div style={{ fontFamily: AR, fontSize: 11, color: T.muted, marginTop: 8 }}>{n.time}</div>
          </div>
          <button onClick={() => setItems((p) => p.filter((x) => x.id !== n.id))} style={{
            background: "none", border: "none", color: T.rose, cursor: "pointer", fontSize: 16, padding: 4, flexShrink: 0,
          }}>🗑</button>
        </div>
      ))}
    </Page>
  )
}

function CreateClass({ go, onCreated }: { go: Go; onCreated: () => void }) {
  return (
    <Page title="إنشاء فصل" onBack={() => go("t-home")} footer={<Btn onClick={() => { onCreated(); go("class-code") }}>إنشاء الفصل</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="اسم الفصل" value="رياضيات — أولى ثانوي"/>
        <Input placeholder="المادة" value="رياضيات"/>
        <Input placeholder="الصف الدراسي" value="أولى ثانوي"/>
        <Input placeholder="وصف اختياري"/>
      </div>
    </Page>
  )
}

function ClassCode({ go }: { go: Go }) {
  return (
    <Page title="كود الفصل" onBack={() => go("class")} footer={<Btn onClick={() => go("class")}>اذهب للفصل</Btn>}>
      <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
        <div style={{ fontSize: 28, fontWeight: 900, fontFamily: LAT, color: T.brand, letterSpacing: 2 }}>TEAC-8246</div>
        <p style={{ fontFamily: AR, color: T.sub }}>شارك الكود مع طلبتك علشان ينضموا للفصل.</p>
      </div>
      <Btn variant="secondary">نسخ الكود</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="ghost">مشاركة</Btn>
      <Btn variant="ghost">دعوة طالب</Btn>
    </Page>
  )
}

function ClassDetails({ go }: { go: Go }) {
  const [tab, setTab] = useState("الطلاب")
  return (
    <Page title="رياضيات — أولى ثانوي" onBack={() => go("t-home")}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Card><div style={{ fontFamily: AR }}>24 طالب</div></Card>
        <Card><div style={{ fontFamily: AR }}>متوسط 74%</div></Card>
      </div>
      <div className="scrollbar-hide" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 12 }}>
        {["الطلاب","المحتوى","الواجبات","الاختبارات","التحليلات"].map((t) => (
          <button key={t} onClick={() => { setTab(t); if (t==="الطلاب") go("class-students") }} style={{ padding: "8px 12px", borderRadius: 100, border: "none", whiteSpace: "nowrap", background: tab===t ? T.brand : T.gray, color: tab===t ? "white" : T.sub, fontFamily: AR, fontWeight: 700 }}>{t}</button>
        ))}
      </div>
      <Card onClick={() => go("class-students")}><div style={{ fontFamily: AR, fontWeight: 700 }}>عرض قائمة الطلاب</div></Card>
    </Page>
  )
}

function ClassStudents({ go }: { go: Go }) {
  const [q, setQ] = useState("")
  const sts = [
    { name: "أحمد علي", lvl: "يحتاج متابعة", pct: 42, last: "أمس" },
    { name: "سارة محمود", lvl: "جيد", pct: 71, last: "اليوم" },
    { name: "يوسف نبيل", lvl: "ممتاز", pct: 91, last: "منذ ساعتين" },
  ]
  const col = (l: string) => l==="ممتاز"?T.emerald:l==="جيد"?T.brand:T.amber
  return (
    <Page title="طلاب الفصل" onBack={() => go("class")}>
      <Input placeholder="ابحث عن طالب" value={q} onChange={setQ}/>
      <div style={{ height: 12 }}/>
      {sts.map((s) => (
        <Card key={s.name} style={{ marginBottom: 8 }} onClick={() => go("s-360")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar name={s.name} size={40} bg={col(s.lvl)}/>
              <div>
                <div style={{ fontFamily: AR, fontWeight: 800 }}>{s.name}</div>
                <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{s.pct}% · آخر نشاط {s.last}</div>
              </div>
            </div>
            <Chip color={col(s.lvl)}>{s.lvl}</Chip>
          </div>
        </Card>
      ))}
    </Page>
  )
}

function TeacherAI({ go }: { go: Go }) {
  const [mode, setMode] = useState<"home"|"lesson"|"quiz"|"hw"|"analyze">("home")
  if (mode==="analyze") return (
    <Page title="تحليل الفصل" onBack={() => setMode("home")}>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR }}>متوسط الأداء 74%</div></Card>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR }}>ضعف: توحيد المقامات · قوة: الجبر</div></Card>
      <Card><div style={{ fontFamily: AR }}>طلاب يحتاجون متابعة: أحمد علي، سارة محمود</div></Card>
      <div style={{ height: 12 }}/>
      <Btn onClick={() => go("s-360")}>عرض التحليل</Btn>
    </Page>
  )
  if (mode!=="home") return (
    <Page title={mode==="lesson"?"حضّر درس":mode==="quiz"?"إنشاء اختبار":"إنشاء واجب"} onBack={() => setMode("home")} footer={<Btn onClick={() => go("t-home")}>{mode==="quiz"?"نشر الاختبار":"حفظ"}</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        <Input placeholder="المادة" value="رياضيات"/>
        <Input placeholder="الصف" value="أولى ثانوي"/>
        <Input placeholder="الموضوع" value="المعادلات الخطية"/>
      </div>
      <Card>
        <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>ناتج الذكاء الاصطناعي</div>
        <p style={{ margin: 0, fontFamily: AR, color: T.sub, lineHeight: 1.8 }}>أهداف الدرس، شرح، أمثلة، نشاط، وواجب مقترح. تقدر تعدّل أو تعيد التوليد.</p>
      </Card>
    </Page>
  )
  return (
    <Page title="مساعد المدرس الذكي" onBack={() => go("t-home")}>
      {[{k:"lesson" as const,l:"حضّر درس"},{k:"quiz" as const,l:"أنشئ امتحان"},{k:"hw" as const,l:"أنشئ واجب"},{k:"analyze" as const,l:"حلل أداء الطلاب"}].map((a) => (
        <Card key={a.k} style={{ marginBottom: 10 }} onClick={() => setMode(a.k)}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>{a.l}</div>
        </Card>
      ))}
    </Page>
  )
}

function Chats({ go, role }: { go: Go; role: Role | null }) {
  const items = role === "t" ? [
    { n: "أحمد علي", last: "تمام يا أستاذ، هسلّم الواجب.", t: "10:42 م", unread: 2, on: true },
    { n: "سارة محمود", last: "تم تفعيل باقة 8 حصص 🎉", t: "أمس", unread: 0, on: false },
  ] : role === "p" ? [
    { n: "أ/ محمد أحمد", last: "بخصوص أحمد: الحصة مؤكدة السبت.", t: "10:42 م", unread: 1, on: true },
  ] : [
    { n: "أ/ محمد أحمد", last: "تمام يا أحمد، هنراجع الجزء ده في الحصة.", t: "10:42 م", unread: 2, on: true, v: true },
    { n: "أ/ نورا علي", last: "تم حجز حصة يوم السبت الساعة 6:00 م", t: "أمس", unread: 0, on: false, v: true },
  ]
  return (
    <Page title="المحادثات" onBack={() => go(role==="t"?"t-account":role==="p"?"p-more":"s-account")}>
      {items.map((c) => (
        <Card key={c.n} style={{ marginBottom: 10 }} onClick={() => go("chat")}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Avatar name={c.n} size={48} bg={T.brand}/>
              {c.on && <span style={{ position: "absolute", bottom: 0, left: 0, width: 10, height: 10, borderRadius: "50%", background: T.emerald, border: "2px solid white" }}/>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontFamily: AR, fontWeight: 800, display: "flex", gap: 6, alignItems: "center" }}>{c.n} {"v" in c && c.v && <VerifiedBadge small/>}</div>
                <div style={{ fontFamily: AR, fontSize: 11, color: T.muted }}>{c.t}</div>
              </div>
              <div style={{ fontFamily: AR, fontSize: 13, color: T.sub, marginTop: 4 }}>{c.last}</div>
            </div>
            {c.unread > 0 && (
              <div style={{ minWidth: 22, height: 22, borderRadius: 11, background: T.brand, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unread}</div>
            )}
          </div>
        </Card>
      ))}
    </Page>
  )
}

function ChatThread({ go, role }: { go: Go; role: Role | null }) {
  const [rec, setRec] = useState(false)
  const [speed, setSpeed] = useState("1x")
  const mine = role !== "t"
  return (
    <Page title="أ/ محمد أحمد" onBack={() => go("chats")} pad={false} right={
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => go("call-in")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>📞</button>
        <button onClick={() => go("vid-in")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>📹</button>
        <button onClick={() => go("chat-menu")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>⋯</button>
      </div>
    }>
      <div style={{ padding: "8px 16px 12px", background: T.card, borderBottom: `0.5px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
        <Avatar name="محمد أحمد" size={40} bg={T.emerald}/>
        <div>
          <div style={{ fontFamily: AR, fontWeight: 800, display: "flex", gap: 6, alignItems: "center" }}>أ/ محمد أحمد <VerifiedBadge small/></div>
          <div style={{ fontFamily: AR, fontSize: 12, color: T.emerald }}>متصل الآن</div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <Card style={{ background: T.brandXLight, marginBottom: 10, boxShadow: "none" }}>
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 13 }}>تم حجز حصة يوم السبت الساعة 6:00 م</div>
          <Btn variant="ghost" onClick={() => go("bookings")}>عرض الحجز</Btn>
        </Card>
        <div style={{ display: "flex", justifyContent: mine ? "flex-start" : "flex-end", marginBottom: 8 }}>
          <div style={{ maxWidth: "78%", background: T.gray, borderRadius: 16, padding: "10px 12px" }}>
            <div style={{ fontFamily: AR, fontSize: 14 }}>أقدر أراجع المعادلات قبل الحصة؟</div>
            <div style={{ fontFamily: AR, fontSize: 10, color: T.muted, marginTop: 4 }}>10:21 م · ✓✓</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
          <div style={{ maxWidth: "78%", background: T.brand, color: "white", borderRadius: 16, padding: "10px 12px" }}>
            <div style={{ fontFamily: AR, fontSize: 14 }}>تمام يا أحمد، هنراجع الجزء ده في الحصة.</div>
            <div style={{ fontFamily: AR, fontSize: 10, opacity: 0.8, marginTop: 4 }}>10:42 م · مقروءة</div>
          </div>
        </div>
        <Card style={{ marginBottom: 8 }} onClick={() => go("chat-image")}>
          <div style={{ height: 120, borderRadius: 12, background: `linear-gradient(135deg, ${T.brandLight}, ${T.aiLight})`, marginBottom: 6 }}/>
          <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>صورة السبورة · 10:44 م</div>
        </Card>
        <Card style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>📄 شرح المعادلات.pdf</div>
          <div style={{ fontFamily: AR, fontSize: 12, color: T.muted, margin: "4px 0 8px" }}>2.4 MB</div>
          <Btn variant="secondary">فتح الملف</Btn>
        </Card>
        <Card style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ width: 36, height: 36, borderRadius: 18, border: "none", background: T.brand, color: "white" }}>▶</button>
            <div style={{ flex: 1, height: 28, borderRadius: 8, background: `repeating-linear-gradient(90deg, ${T.brand} 0 3px, transparent 3px 7px)` }}/>
            <button onClick={() => setSpeed(speed==="1x"?"1.5x":speed==="1.5x"?"2x":"1x")} style={{ border: "none", background: T.gray, borderRadius: 8, padding: "4px 8px", fontFamily: AR, fontWeight: 800 }}>{speed}</button>
            <span style={{ fontFamily: LAT, fontSize: 12, color: T.muted }}>0:12</span>
          </div>
        </Card>
        <Card style={{ background: T.roseLt, boxShadow: "none" }}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>مكالمة صوتية فائتة</div>
          <Btn variant="ghost" onClick={() => go("call-audio")}>اتصال</Btn>
        </Card>
      </div>
      <div style={{ padding: "10px 16px 20px", background: T.card, borderTop: `0.5px solid ${T.border}` }}>
        {rec ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: AR, color: T.rose, fontWeight: 800 }}>جاري التسجيل... 0:08</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => setRec(false)}>إلغاء</Btn>
              <Btn onClick={() => setRec(false)}>إرسال</Btn>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => go("vid-files")} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>📎</button>
            <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>📷</button>
            <div style={{ flex: 1 }}><Input placeholder="اكتب رسالة..."/></div>
            <button onClick={() => setRec(true)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>🎤</button>
            <button style={{ width: 40, height: 40, borderRadius: 14, border: "none", background: T.brand, color: "white", fontWeight: 800 }}>↑</button>
          </div>
        )}
      </div>
    </Page>
  )
}

function TeacherFinance({ go }: { go: Go }) {
  return (
    <Page title="المالية" onBack={() => go("t-account")}>
      <Card style={{ marginBottom: 12, background: T.gradTeacher, color: "white" }}>
        <div style={{ fontFamily: AR, opacity: 0.9, fontSize: 13 }}>إجمالي الرصيد</div>
        <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 32, margin: "4px 0 12px" }}>8,450 ج.م</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            ["متاح للسحب", "5,200"],
            ["قيد التسوية", "2,150"],
            ["حجوزات لم تتم", "1,100"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: 8 }}>
              <div style={{ fontFamily: AR, fontSize: 10, opacity: 0.9 }}>{k}</div>
              <div style={{ fontFamily: LAT, fontWeight: 800 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Btn onClick={() => go("withdraw")}>سحب الأرباح</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("t-tx")}>عرض كل المعاملات</Btn>
      <div style={{ height: 14 }}/>
      <Card style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أرباح هذا الشهر</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <MoneyAmt v="7,820 ج.م" kind="in"/>
          <Chip color={T.emerald}>+18% عن الشهر الماضي</Chip>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[["الحصص المدفوعة","26"],["الباقات المباعة","9"],["اشتراكات المحتوى","14"],["البثوث المدفوعة","3"]].map(([k,v]) => (
          <Card key={k}><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{k}</div><div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 20 }}>{v}</div></Card>
        ))}
      </div>
      <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>مصادر الأرباح</div>
      {[
        ["حصص فردية", "45%", T.brand],
        ["باقات", "30%", T.ai],
        ["بث مباشر", "15%", T.teal],
        ["محتوى", "10%", T.amber],
      ].map(([k, p, c]) => (
        <div key={k} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontSize: 13, marginBottom: 4 }}><span>{k}</span><span>{p}</span></div>
          <ProgressBar pct={parseInt(p)} color={c as string} h={6}/>
        </div>
      ))}
      <div style={{ height: 10 }}/>
      <Card>
        <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>تمييز الأرقام</div>
        {[
          ["إجمالي المبيعات", "10,000 ج.م"],
          ["رسوم وعمولات", "1,200 ج.م"],
          ["صافي الأرباح", "8,800 ج.م"],
          ["تم سحب", "4,000 ج.م"],
          ["متاح حالياً", "5,200 ج.م"],
          ["قيد التسوية", "2,150 ج.م"],
        ].map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: T.muted }}>{k}</span><span style={{ fontFamily: LAT, fontWeight: 800 }}>{v}</span>
          </div>
        ))}
      </Card>
      <div style={{ height: 8 }}/>
      <Btn variant="ghost" onClick={() => go("t-analytics")}>تحليلات الأرباح</Btn>
    </Page>
  )
}

function ParentSetup({ go }: { go: Go }) {
  return (
    <Page title="بيانات ولي الأمر" onBack={() => go("role")} footer={<Btn onClick={() => go("p-add-child")}>التالي</Btn>}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Avatar name="أحمد محمد" size={72}/></div>
      <p style={{ fontFamily: AR, fontSize: 12, color: T.muted, textAlign: "center", marginTop: 0 }}>صورة شخصية اختيارية</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="الاسم بالكامل" value="أحمد محمد"/>
        <Input placeholder="رقم الهاتف" value="01098765432"/>
        <Input placeholder="البريد الإلكتروني" value="parent@teac.app"/>
        <Input placeholder="كلمة المرور" type="password" value="••••••••"/>
        <Input placeholder="تأكيد كلمة المرور" type="password" value="••••••••"/>
      </div>
    </Page>
  )
}

function ParentAddChild({ go }: { go: Go }) {
  return (
    <Page title="أضف ابنك / ابنتك" onBack={() => go("p-setup")}>
      <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.7 }}>اختار طريقة الربط المناسبة.</p>
      <Card style={{ marginBottom: 12 }} onClick={() => go("p-link")}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 16 }}>ربط حساب موجود</div>
        <p style={{ fontFamily: AR, color: T.muted, margin: "6px 0 12px", fontSize: 13 }}>لو الطالب عنده حساب Teac Teacher بالفعل.</p>
        <Chip color={T.brand}>ربط حساب</Chip>
      </Card>
      <Card onClick={() => go("p-create-child")}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 16 }}>إنشاء حساب طالب جديد</div>
        <p style={{ fontFamily: AR, color: T.muted, margin: "6px 0 12px", fontSize: 13 }}>أنشئ حساب جديد للطالب وأديره من حسابك.</p>
        <Chip color={T.teal}>إنشاء حساب طالب</Chip>
      </Card>
    </Page>
  )
}

function ParentLink({ go }: { go: Go }) {
  const [mode, setMode] = useState("كود الطالب")
  return (
    <Page title="ربط حساب الطالب" onBack={() => go("p-add-child")} footer={<Btn onClick={() => go("p-link-sent")}>إرسال طلب الربط</Btn>}>
      {["كود الطالب","رقم الهاتف","QR Code"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={mode===x} onClick={() => setMode(x)}>{x}</Choice></div>)}
      {mode === "كود الطالب" && <Input placeholder="مثال TEAC-STU-4821" value="TEAC-STU-4821"/>}
      {mode === "رقم الهاتف" && <Input placeholder="رقم هاتف الطالب"/>}
      {mode === "QR Code" && <Card style={{ textAlign: "center", padding: 28 }}><div style={{ fontFamily: AR, color: T.muted }}>وجّه الكاميرا لكود الطالب</div></Card>}
    </Page>
  )
}

function ParentCreateChild({ go, onCreated }: { go: Go; onCreated: () => void }) {
  const [stage, setStage] = useState("ثانوي")
  const [grade, setGrade] = useState("أولى ثانوي")
  return (
    <Page title="إنشاء حساب طالب" onBack={() => go("p-add-child")} footer={<Btn onClick={() => { onCreated(); go("p-child-ok") }}>إنشاء الحساب</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="اسم الطالب" value="أحمد"/>
        <Input placeholder="تاريخ الميلاد" value="12 / 3 / 2010"/>
        <Input placeholder="المرحلة الدراسية" value={stage} onChange={setStage}/>
        <Input placeholder="الصف الدراسي" value={grade} onChange={setGrade}/>
        <Input placeholder="المواد" value="رياضيات، فيزياء"/>
        <Input placeholder="المدرسة (اختياري)"/>
      </div>
    </Page>
  )
}

function ParentHome({ go, kids, kidId, setKidId, hasKids }: {
  go: Go; kids: Kid[]; kidId: string; setKidId: (id: string) => void; hasKids: boolean
}) {
  const kid = kids.find((k) => k.id === kidId) ?? kids[0]
  return (
    <ParentShell go={go} active="home">
      <div style={{ background: T.gradBrand, padding: "44px 20px 18px", flexShrink: 0 }}>
        <StatusBar light/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "white", fontFamily: AR }}>أهلاً يا أحمد 👋</h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: AR }}>ده ملخص متابعة أولادك النهاردة</p>
          </div>
          <button onClick={() => go("p-notifs")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 12, width: 38, height: 38, color: "white", cursor: "pointer" }}>
            <span style={{ width: 20, height: 20, display: "flex" }}>{Ic.bell}</span>
          </button>
        </div>
        {hasKids && <div style={{ marginTop: 14 }}><ChildSwitcher kids={kids} id={kidId} onPick={setKidId} onAdd={() => go("p-add-child")}/></div>}
      </div>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
        {!hasKids ? (
          <EmptyBlock
            title="أضف أول طالب"
            sub="اربط حساب ابنك أو أنشئ له حساب جديد علشان تبدأ المتابعة."
            actions={[
              { label: "ربط حساب موجود", onClick: () => go("p-link") },
              { label: "إنشاء حساب طالب", onClick: () => go("p-create-child"), primary: false },
            ]}
          />
        ) : kid && (
          <>
            <Card style={{ marginBottom: 12 }} onClick={() => go("p-child")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 17 }}>{kid.name} محمد</div>
                  <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>{kid.grade}</div>
                  <div style={{ fontFamily: AR, fontSize: 13, color: T.sub, marginTop: 8 }}>{kid.note}</div>
                </div>
                <ProgressRing pct={kid.pct} size={68}/>
              </div>
              <Btn variant="ghost" onClick={() => go("p-child")}>عرض التفاصيل</Btn>
            </Card>
            <HomeSection title="اليوم">
              <Card style={{ marginBottom: 8 }} onClick={() => go("p-bookings")}>
                <div style={{ fontFamily: AR, fontWeight: 800 }}>حصة اليوم · رياضيات</div>
                <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>أ/ محمد · 6:00 مساءً</div>
                <Chip color={T.emerald}>مؤكدة</Chip>
              </Card>
              <Card onClick={() => go("p-hw")}>
                <div style={{ fontFamily: AR, fontWeight: 800 }}>واجب مستحق · فيزياء</div>
                <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>التسليم غداً · مشاهدة الحالة فقط</div>
                <Btn variant="ghost" onClick={() => go("p-hw")}>عرض الواجب</Btn>
              </Card>
            </HomeSection>
            <HomeSection title="الأداء الدراسي">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[["الحضور","90%"],["متوسط الاختبارات","82%"],["واجبات مكتملة","4/5"],["التطور الأسبوعي","+6%"]].map(([a,b]) => (
                  <Card key={a}><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{a}</div><div style={{ fontFamily: LAT, fontWeight: 900 }}>{b}</div></Card>
                ))}
              </div>
              <Btn variant="secondary" onClick={() => go("p-report")}>التقرير الكامل</Btn>
            </HomeSection>
            <Card style={{ background: T.aiXLight, border: `1px solid ${T.ai}22` }} onClick={() => go("p-insight")}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                <AiTag/>
                <div style={{ fontFamily: AR, fontWeight: 900 }}>ملخص ذكي لولي الأمر ✨</div>
              </div>
              <p style={{ fontFamily: AR, fontSize: 13, color: T.sub, lineHeight: 1.75, margin: 0 }}>
                {kid.id === "sara"
                  ? "سارة محتاجة دعم في العلوم هذا الأسبوع، والحضور منتظم. يفضل مراجعة الفصل قبل الاختبار."
                  : "أحمد متقدم في الجبر، لكن مستواه انخفض في الفيزياء خلال الأسبوعين الماضيين. يفضل مراجعة الفصل الثاني قبل الاختبار القادم."}
              </p>
              <p style={{ fontFamily: AR, fontSize: 11, color: T.muted, margin: "8px 0 0" }}>لا يشمل محادثات المعلم الذكي الخاصة بالطالب.</p>
              <Btn variant="ghost" onClick={() => go("p-insight")}>عرض التفاصيل</Btn>
            </Card>
            <Card style={{ marginTop: 12, background: T.amberLt }} onClick={() => go("p-approve")}>
              <div style={{ fontFamily: AR, fontWeight: 800 }}>طلبات تحتاج موافقة</div>
              <div style={{ fontFamily: AR, fontSize: 13, color: T.sub }}>أحمد طلب شراء باقة · 2,650 ج.م</div>
            </Card>
          </>
        )}
      </div>
    </ParentShell>
  )
}

function ParentKids({ go, kids }: { go: Go; kids: Kid[] }) {
  const label: Record<Kid["link"], string> = { connected: "تم الربط", pending: "في انتظار الموافقة", rejected: "تم رفض طلب الربط", removed: "تم إلغاء الربط" }
  const color: Record<Kid["link"], string> = { connected: T.emerald, pending: T.amber, rejected: T.rose, removed: T.muted }
  return (
    <ParentShell go={go} active="kids">
      <StatusBar/>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 20px 20px" }}>
        <h1 style={{ fontFamily: AR, fontSize: 22, fontWeight: 900, margin: "0 0 14px" }}>أولادي</h1>
        {kids.map((k) => (
          <Card key={k.id} style={{ marginBottom: 10 }} onClick={() => go("p-child")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: AR, fontWeight: 900 }}>{k.name}</div>
                <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>{k.grade}</div>
              </div>
              <Chip color={color[k.link]}>{label[k.link]}</Chip>
            </div>
            <ProgressBar pct={k.pct}/>
          </Card>
        ))}
        <Btn onClick={() => go("p-add-child")}>+ إضافة طالب</Btn>
      </div>
    </ParentShell>
  )
}

function ParentPay({ go, kidId, kids, setKidId }: { go: Go; kidId: string; kids: Kid[]; setKidId: (id: string) => void }) {
  const [filter, setFilter] = useState(kidId === "all" ? "كل الأبناء" : (kids.find(k => k.id===kidId)?.name ?? "كل الأبناء"))
  return (
    <ParentShell go={go} active="pay">
      <StatusBar/>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 20px 20px" }}>
        <h1 style={{ fontFamily: AR, fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>المدفوعات العائلية</h1>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {["كل الأبناء", ...kids.map(k => k.name)].map((x) => (
            <button key={x} onClick={() => { setFilter(x); if (x==="كل الأبناء") setKidId(kids[0]?.id ?? "ahmed") }} style={{
              padding: "8px 12px", borderRadius: 100, border: `1px solid ${T.border}`,
              background: filter===x ? T.brand : T.card, color: filter===x ? "white" : T.text, fontFamily: AR, fontWeight: 800, cursor: "pointer",
            }}>{x}</button>
          ))}
        </div>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: AR, color: T.muted }}>إجمالي الإنفاق هذا الشهر</div>
          <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 28, color: T.brand }}>3,850 ج.م</div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[["حصص","1,750"],["باقات","1,500"],["اشتراكات","600"]].map(([a,b]) => (
            <Card key={a}><div style={{ fontFamily: AR, fontSize: 11, color: T.muted }}>{a}</div><div style={{ fontFamily: LAT, fontWeight: 800 }}>{b}</div></Card>
          ))}
        </div>
        <Card style={{ marginBottom: 8 }} onClick={() => go("p-wallet")}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>المحفظة العائلية</div>
          <div style={{ fontFamily: LAT, fontWeight: 900, color: T.emerald }}>2,400 ج.م</div>
        </Card>
        <Btn onClick={() => go("p-tx")}>المعاملات</Btn>
        <div style={{ height: 8 }}/>
        <Btn variant="secondary" onClick={() => go("p-spend")}>حدود الإنفاق</Btn>
      </div>
    </ParentShell>
  )
}

function ParentNotifs({ go }: { go: Go }) {
  const items = [
    { t: "الدراسة", title: "أحمد حصل على 8/10 في اختبار الرياضيات", s: "p-report" as Screen },
    { t: "الحضور", title: "سارة لم تحضر حصة اليوم", s: "p-child" as Screen },
    { t: "الحجز", title: "تم تأكيد حصة أحمد مع أ/ محمد", s: "p-bookings" as Screen },
    { t: "الدفع", title: "تم خصم 350 ج.م مقابل حصة أحمد", s: "p-tx-detail" as Screen },
    { t: "الموافقات", title: "أحمد طلب شراء باقة جديدة", s: "p-approve-pkg" as Screen },
    { t: "الاشتراكات", title: "اشتراك Student Plus سيتم تجديده خلال 3 أيام", s: "p-subs" as Screen },
    { t: "التقارير", title: "التقرير الأسبوعي لأحمد جاهز", s: "p-report" as Screen },
  ]
  return (
    <ParentShell go={go} active="notifs">
      <StatusBar/>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "56px 20px 20px" }}>
        <h1 style={{ fontFamily: AR, fontSize: 22, fontWeight: 900 }}>التنبيهات</h1>
        {items.map((n) => (
          <Card key={n.title} style={{ marginBottom: 8 }} onClick={() => go(n.s)}>
            <Chip color={T.brand}>{n.t}</Chip>
            <div style={{ fontFamily: AR, fontWeight: 800, marginTop: 8 }}>{n.title}</div>
          </Card>
        ))}
      </div>
    </ParentShell>
  )
}

function ParentFlow({ screen, go, ctx }: {
  screen: Screen
  go: Go
  ctx: {
    kids: Kid[]
    kidId: string
    setKidId: (id: string) => void
    hasKids: boolean
    setHasKids: (v: boolean) => void
    role: Role | null
    verified?: boolean
  }
}) {
  const kid = ctx.kids.find((k) => k.id === ctx.kidId) ?? ctx.kids[0]
  const acc: Screen = ctx.role === "p" ? "p-more" : ctx.role === "t" ? "t-account" : "s-account"

  if (screen === "p-setup") return <ParentSetup go={go}/>
  if (screen === "p-add-child") return <ParentAddChild go={go}/>
  if (screen === "p-link") return <ParentLink go={go}/>
  if (screen === "p-link-sent") return (
    <Page title="طلب الربط" onBack={() => go("p-add-child")} footer={<Btn onClick={() => { ctx.setHasKids(true); go("p-home") }}>متابعة للرئيسية</Btn>}>
      <SuccessBlock title="تم إرسال طلب الربط للطالب" sub="هتوصلك إشعار بعد الموافقة. لو الطالب قاصر وتم التحقق، الربط يكتمل حسب سياسة المنصة." cta="متابعة للرئيسية" onCta={() => { ctx.setHasKids(true); go("p-home") }}/>
    </Page>
  )
  if (screen === "p-create-child") return <ParentCreateChild go={go} onCreated={() => ctx.setHasKids(true)}/>
  if (screen === "p-child-ok") return (
    <Page title="تم" onBack={() => go("p-home")} footer={<Btn onClick={() => go("p-home")}>الذهاب للرئيسية</Btn>}>
      <SuccessBlock title="تم إضافة أحمد لحسابك بنجاح 🎉" cta="الذهاب للرئيسية" onCta={() => go("p-home")}/>
    </Page>
  )
  if (screen === "p-home") return <ParentHome go={go} kids={ctx.kids} kidId={ctx.kidId} setKidId={ctx.setKidId} hasKids={ctx.hasKids}/>
  if (screen === "p-kids") return <ParentKids go={go} kids={ctx.kids}/>
  if (screen === "p-pay") return <ParentPay go={go} kidId={ctx.kidId} kids={ctx.kids} setKidId={ctx.setKidId}/>
  if (screen === "p-notifs") return <ParentNotifs go={go}/>
  if (screen === "p-more") return <Account go={go} role="p" verified={ctx.verified}/>
  if (screen === "p-child") return (
    <Page title={kid?.name ?? "الطالب"} onBack={() => go("p-home")}>
      <ProgressRing pct={kid?.pct ?? 0} size={88}/>
      <p style={{ fontFamily: AR, textAlign: "center" }}>{kid?.note}</p>
      <Btn onClick={() => go("p-report")}>التقرير الأسبوعي</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("p-perms")}>صلاحياتي كولي أمر</Btn>
    </Page>
  )
  if (screen === "p-hw") return (
    <Page title="واجب الفيزياء" onBack={() => go("p-home")}>
      <p style={{ fontFamily: AR, color: T.sub }}>التسليم غداً · الحالة: لم يُسلَّم بعد</p>
      <Card><div style={{ fontFamily: AR }}>ولي الأمر يشوف الحالة فقط — الحل للطالب.</div></Card>
    </Page>
  )
  if (screen === "p-insight") return (
    <Page title="ملخص ذكي" onBack={() => go("p-home")}>
      <AiTag/>
      <p style={{ fontFamily: AR, lineHeight: 1.8 }}>أحمد متقدم في الجبر، لكن مستواه انخفض في الفيزياء خلال الأسبوعين الماضيين. يفضل مراجعة الفصل الثاني قبل الاختبار القادم.</p>
      <Card style={{ background: T.brandXLight }}><div style={{ fontFamily: AR, fontSize: 13 }}>محادثات المعلم الذكي الخاصة بالطالب غير ظاهرة لولي الأمر.</div></Card>
    </Page>
  )
  if (screen === "p-report") return (
    <Page title="التقرير الأسبوعي" onBack={() => go("p-home")} footer={<Btn onClick={() => go("p-report-full")}>عرض التقرير التفصيلي</Btn>}>
      <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>{kid?.name} · {kid?.grade}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[["الحضور","90%"],["الواجبات","4 / 5"],["متوسط الاختبارات","82%"],["نشاط المذاكرة","6 ساعات"]].map(([a,b]) => (
          <Card key={a}><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{a}</div><div style={{ fontFamily: LAT, fontWeight: 900 }}>{b}</div></Card>
        ))}
      </div>
      <Card style={{ marginTop: 10 }}><div style={{ fontFamily: AR }}>أقوى مادة: الرياضيات</div><div style={{ fontFamily: AR, color: T.amber }}>يحتاج متابعة: الفيزياء</div></Card>
      <Card style={{ marginTop: 10, background: T.aiXLight }}><div style={{ fontFamily: AR }}>أحمد حافظ على أداء جيد في الرياضيات، لكنه محتاج يراجع الفيزياء قبل الاختبار القادم.</div></Card>
    </Page>
  )
  if (screen === "p-report-full") return (
    <Page title="التقرير التفصيلي" onBack={() => go("p-report")}>
      {["الرياضيات 88%","الفيزياء 61%","الإنجليزي 79%"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
    </Page>
  )
  if (screen === "p-perms") return (
    <Page title="صلاحياتي كولي أمر" onBack={() => go("p-more")}>
      {([
        ["أكاديمي", ["مشاهدة مستوى الطالب","مشاهدة الحضور","مشاهدة نتائج الاختبارات","مشاهدة حالة الواجبات","مشاهدة المدرسين","مشاهدة جدول الحصص","مشاهدة التقارير"]],
        ["مالي", ["دفع تكلفة الحصص","شحن محفظة الطالب","شراء الباقات","إدارة الاشتراكات","إدارة اشتراك AI","مشاهدة المعاملات","طلب استرداد حسب السياسة","مشاهدة الفواتير"]],
        ["الحجز", ["الموافقة على الحجوزات","حجز حصة للطالب","إعادة جدولة","إلغاء حجز حسب السياسة"]],
        ["التواصل", ["التواصل مع مدرس الطالب","استقبال رسائل إدارية من المدرس","استقبال تنبيهات الحصص"]],
      ] as [string, string[]][]).map(([g, rows]) => (
        <div key={g} style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: AR, fontWeight: 900, marginBottom: 6 }}>{g}</div>
          {rows.map((r) => <div key={r} style={{ fontFamily: AR, fontSize: 13, color: T.sub, marginBottom: 4 }}>• {r}</div>)}
        </div>
      ))}
      <Card style={{ background: T.brandXLight }}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>الخصوصية</div>
        <p style={{ fontFamily: AR, fontSize: 13, color: T.sub, lineHeight: 1.7 }}>ولي الأمر لا يرى محادثات الطالب الخاصة مع المعلم الذكي، ولا سجل الشات الخاص بين الطالب والمدرس — إلا لو السياسة سمحت أو لأمان الطفل.</p>
      </Card>
    </Page>
  )
  if (screen === "p-wallet") return (
    <Page title="المحفظة العائلية" onBack={() => go("p-pay")}>
      <Card style={{ marginBottom: 12 }}><div style={{ fontFamily: AR, color: T.muted }}>الرصيد</div><div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 28 }}>2,400 ج.م</div></Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn onClick={() => go("p-wallet-add")}>إضافة رصيد</Btn>
        <Btn variant="secondary" onClick={() => go("p-transfer")}>تحويل للطالب</Btn>
      </div>
      <div style={{ height: 10 }}/>
      <Btn variant="ghost" onClick={() => go("p-tx")}>المعاملات</Btn>
      <Btn variant="ghost" onClick={() => go("p-spend")}>إدارة المصروف</Btn>
    </Page>
  )
  if (screen === "p-wallet-add") return (
    <Page title="إضافة رصيد" onBack={() => go("p-wallet")} footer={<Btn onClick={() => go("pay-ok")}>شحن 500 ج.م</Btn>}>
      <Input placeholder="المبلغ" value="500"/>
    </Page>
  )
  if (screen === "p-transfer") return (
    <Page title="تحويل للطالب" onBack={() => go("p-wallet")} footer={<Btn onClick={() => go("p-wallet")}>تحويل 200 ج.م لأحمد</Btn>}>
      <p style={{ fontFamily: AR }}>من المحفظة العائلية إلى محفظة الطالب.</p>
      <Input placeholder="المبلغ" value="200"/>
    </Page>
  )
  if (screen === "p-spend") return (
    <Page title="حدود الإنفاق" onBack={() => go("p-pay")}>
      {ctx.kids.map((k) => (
        <Card key={k.id} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>{k.name}</div>
          <div style={{ fontFamily: AR, fontSize: 13, color: T.muted, marginBottom: 8 }}>حد شهري 1,500 ج.م</div>
          {["طلب موافقة على كل دفعة","موافقة فوق مبلغ معيّن","السماح بالدفع التلقائي","منع مشتريات السوق","السماح بتجديد الاشتراك"].map((x) => (
            <div key={x} style={{ fontFamily: AR, fontSize: 13, marginBottom: 6 }}>• {x}</div>
          ))}
        </Card>
      ))}
    </Page>
  )
  if (screen === "p-tx") return (
    <Page title="المعاملات" onBack={() => go("p-pay")}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {["كل الأبناء","أحمد","سارة","حصص","باقات","اشتراكات","AI","شحن","استرداد"].map((x) => <Chip key={x}>{x}</Chip>)}
      </div>
      {[
        { t: "حصة رياضيات — أحمد", s: "أ/ محمد أحمد", a: "-350 ج.م", st: "تم الدفع", c: T.rose },
        { t: "اشتراك AI — سارة", s: "تجديد شهري", a: "-149 ج.م", st: "تم التجديد", c: T.rose },
        { t: "استرداد حصة — أحمد", s: "إلغاء حسب السياسة", a: "+350 ج.م", st: "تم الاسترداد", c: T.emerald },
      ].map((x) => (
        <Card key={x.t} style={{ marginBottom: 8 }} onClick={() => go("p-tx-detail")}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: AR, fontWeight: 800 }}>{x.t}</div>
              <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{x.s}</div>
              <Chip color={T.emerald}>{x.st}</Chip>
            </div>
            <div style={{ fontFamily: LAT, fontWeight: 900, color: x.c }}>{x.a}</div>
          </div>
        </Card>
      ))}
    </Page>
  )
  if (screen === "p-tx-detail") return (
    <Page title="تفاصيل المعاملة" onBack={() => go("p-tx")} footer={<Btn onClick={() => go("invoices")}>تحميل الفاتورة</Btn>}>
      {[["الطالب","أحمد"],["المدرس","أ/ محمد أحمد"],["الخدمة","حصة رياضيات"],["المبلغ","350 ج.م"],["الخصم","0"],["الرسوم","حسب السياسة"],["الإجمالي","350 ج.م"],["طريقة الدفع","المحفظة العائلية"],["التاريخ","19 أغسطس 2026"],["الحالة","تم الدفع"]].map(([k,v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, marginBottom: 8 }}><span style={{ color: T.muted }}>{k}</span><span style={{ fontWeight: 800 }}>{v}</span></div>
      ))}
    </Page>
  )
  if (screen === "p-subs") return (
    <Page title="اشتراكات الأسرة" onBack={() => go("p-more")}>
      {ctx.kids.map((k) => (
        <Card key={k.id} style={{ marginBottom: 10 }} onClick={() => go("p-sub-manage")}>
          <div style={{ fontFamily: AR, fontWeight: 900 }}>{k.name}</div>
          <div style={{ fontFamily: AR, fontSize: 13 }}>{k.plan} · نشط</div>
          <div style={{ fontFamily: AR, fontSize: 13 }}>{k.ai} · {k.ai.includes("Plus") ? "نشط" : "مجاني"}</div>
          {k.id === "ahmed" && <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>التجديد: 1 سبتمبر</div>}
          <Btn variant="ghost">إدارة الاشتراك</Btn>
        </Card>
      ))}
      <Card style={{ background: T.gray, boxShadow: "none" }}>
        <div style={{ fontFamily: AR, fontWeight: 900 }}>Teac Family</div>
        <p style={{ fontFamily: AR, fontSize: 13, color: T.muted, margin: "6px 0 0" }}>اشتراك واحد لإدارة مزايا أكتر من طالب. قريباً — مش مفعّل حالياً.</p>
      </Card>
    </Page>
  )
  if (screen === "p-sub-manage") return (
    <Page title="إدارة الاشتراك" onBack={() => go("p-subs")}>
      {["ترقية","تخفيض","إدارة التجديد","تغيير طريقة الدفع","عرض الفواتير"].map((x) => (
        <Card key={x} style={{ marginBottom: 8 }} onClick={() => go(x === "عرض الفواتير" ? "invoices" : "checkout")}><div style={{ fontFamily: AR, fontWeight: 700 }}>{x}</div></Card>
      ))}
    </Page>
  )
  if (screen === "p-pkgs") return (
    <Page title="باقات أولادي" onBack={() => go("p-more")}>
      <Card>
        <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>أحمد</div>
        <div style={{ fontFamily: AR, fontWeight: 900 }}>8 حصص رياضيات</div>
        <div style={{ fontFamily: AR, fontSize: 13 }}>أ/ محمد · متبقي 5 / 8 · ينتهي 30 سبتمبر</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <Btn onClick={() => go("p-bookings")}>احجز حصة</Btn>
          <Btn variant="secondary" onClick={() => go("p-chat")}>تواصل مع المدرس</Btn>
        </div>
        <Btn variant="ghost" onClick={() => go("pkg-active")}>التفاصيل والاستخدام</Btn>
      </Card>
    </Page>
  )
  if (screen === "p-bookings") return (
    <Page title="الحجوزات" onBack={() => go("p-home")}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
        {["القادمة","تحتاج موافقة","مكتملة","ملغاة"].map((x,i) => <Chip key={x} filled={i===0}>{x}</Chip>)}
      </div>
      <Card onClick={() => go("p-approve-book")}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد · رياضيات</div>
        <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>أ/ محمد · السبت 6:00 م · 350 ج.م · مدفوع</div>
      </Card>
    </Page>
  )
  if (screen === "p-teachers") return (
    <Page title="المدرسون" onBack={() => go("p-more")}>
      <Card onClick={() => go("p-chat")}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أ/ محمد أحمد</div>
        <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>بخصوص: أحمد محمد · رياضيات</div>
        <Btn variant="ghost">تواصل مع المدرس</Btn>
      </Card>
    </Page>
  )
  if (screen === "p-chat") return (
    <Page title="أ/ محمد أحمد" onBack={() => go("p-teachers")} pad={false}>
      <div style={{ padding: "8px 16px", background: T.card, borderBottom: `0.5px solid ${T.border}` }}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أ/ محمد أحمد</div>
        <div style={{ fontFamily: AR, fontSize: 12, color: T.brand }}>بخصوص: أحمد محمد · محادثة ولي أمر منفصلة عن شات الطالب</div>
      </div>
      <div style={{ padding: 16 }}>
        <Card><div style={{ fontFamily: AR, fontSize: 14 }}>ممكن نأكد حصة السبت لأحمد؟</div></Card>
        <p style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>نص · صور · PDF · صوت — المكالمات حسب سياسة المنصة.</p>
      </div>
    </Page>
  )
  if (screen === "p-approve") return (
    <Page title="الموافقات" onBack={() => go("p-home")}>
      <Card style={{ marginBottom: 8 }} onClick={() => go("p-approve-pkg")}><div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد طلب شراء باقة</div></Card>
      <Card style={{ marginBottom: 8 }} onClick={() => go("p-approve-book")}><div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد يريد حجز حصة</div></Card>
      <Card onClick={() => go("p-approve-ai")}><div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد طلب ترقية المعلم الذكي</div></Card>
    </Page>
  )
  if (screen === "p-approve-pkg") return (
    <Page title="موافقة شراء" onBack={() => go("p-approve")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("p-approve-ok")}>الموافقة والدفع</Btn>
        <Btn variant="secondary" onClick={() => go("p-home")}>رفض</Btn>
      </div>
    }>
      <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>أحمد طلب شراء باقة</div>
      {[["المدرس","أ/ محمد أحمد"],["الباقة","8 حصص رياضيات"],["السعر","2,650 ج.م"]].map(([k,v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, marginBottom: 8 }}><span>{k}</span><b>{v}</b></div>
      ))}
    </Page>
  )
  if (screen === "p-approve-book") return (
    <Page title="موافقة حجز" onBack={() => go("p-approve")} footer={
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" onClick={() => go("p-home")}>رفض</Btn>
        <Btn onClick={() => go("book-pay")}>الموافقة</Btn>
      </div>
    }>
      <div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد يريد حجز حصة</div>
      <p style={{ fontFamily: AR }}>أ/ محمد · Saturday · 6:00 PM · 350 ج.م</p>
    </Page>
  )
  if (screen === "p-approve-ai") return (
    <Page title="ترقية AI" onBack={() => go("p-approve")} footer={<Btn onClick={() => go("p-approve-ok")}>الموافقة والاشتراك</Btn>}>
      <div style={{ fontFamily: AR, fontWeight: 800 }}>أحمد طلب ترقية المعلم الذكي</div>
      <p style={{ fontFamily: AR }}>الحالي: Free · المطلوب: AI Plus · 149 ج.م / شهر</p>
    </Page>
  )
  if (screen === "p-approve-ok") return (
    <Page title="تم" onBack={() => go("p-home")} footer={<Btn onClick={() => go("p-home")}>العودة</Btn>}>
      <SuccessBlock title="تمت الموافقة والدفع" cta="العودة" onCta={() => go("p-home")}/>
    </Page>
  )
  if (screen === "devices") return (
    <Page title="الأجهزة" onBack={() => go(acc)}>
      {["iPhone 15 · القاهرة · الآن","Chrome · ويندوز · أمس"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
    </Page>
  )
  if (screen === "help-center") return (
    <Page title="مركز المساعدة" onBack={() => go(acc)}>
      {["الحساب","الدفع","أولادي","الحجوزات"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
    </Page>
  )
  if (screen === "policies") return (
    <Page title="الشروط والسياسات" onBack={() => go(acc)}>
      {["شروط الاستخدام","سياسة الخصوصية","سياسة الاسترداد"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
    </Page>
  )
  if (screen === "account-settings") return (
    <Page title="الحساب" onBack={() => go("security")}>
      <MoreRow icon={Ic.lock} title="حذف الحساب" sub="من الإعدادات — غير ظاهر في المزيد" danger onClick={() => go("delete-acc")}/>
    </Page>
  )
  return null
}

function ExtraFlow({ screen, go, ctx }: {
  screen: Screen
  go: Go
  ctx: {
    verified: boolean
    setVerified: (v: boolean) => void
    role: Role | null
    dueOrders: DueOrder[]
    settlements: Settlement[]
    requestSettlement: () => void
    approvePending: () => void
    kids: Kid[]
    kidId: string
    setKidId: (id: string) => void
    hasKids: boolean
    setHasKids: (v: boolean) => void
  }
}) {
  if (screen === "s-approve-sent") return (
    <Page title="طلب الموافقة" onBack={() => go("s-home")} footer={<Btn onClick={() => go("s-home")}>العودة</Btn>}>
      <SuccessBlock title="تم إرسال طلب موافقة لولي الأمر" sub="باقة رياضيات — 2,650 ج.م · هتوصلك نتيجة الموافقة." cta="العودة" onCta={() => go("s-home")}/>
    </Page>
  )
  const parentUi = ParentFlow({ screen, go, ctx })
  if (parentUi) return parentUi
  const backAcc: Screen = ctx.role === "t" ? "t-account" : ctx.role === "p" ? "p-more" : "s-account"

  if (screen === "chats") return <Chats go={go} role={ctx.role}/>
  if (screen === "chat") return <ChatThread go={go} role={ctx.role}/>
  if (screen === "t-finance") return <TeacherFinance go={go}/>
  if (screen === "chat-image") return (
    <Page title="الصورة" onBack={() => go("chat")} footer={
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary">تحميل</Btn>
        <Btn variant="ghost">مشاركة</Btn>
      </div>
    }>
      <div style={{ height: 420, borderRadius: 20, background: `linear-gradient(145deg, ${T.brandLight}, ${T.aiLight})` }}/>
      <p style={{ fontFamily: AR, color: T.muted, marginTop: 10 }}>شرح المعادلات على السبورة · 10:44 م</p>
    </Page>
  )
  if (screen === "chat-menu") return (
    <Page title="خيارات المحادثة" onBack={() => go("chat")}>
      {[["كتم الإشعارات","chats"],["الإبلاغ عن مستخدم","report-user"],["حظر","chats"]].map(([l,s]) => (
        <Card key={l} style={{ marginBottom: 8 }} onClick={() => go(s as Screen)}><div style={{ fontFamily: AR, fontWeight: 700, color: l.includes("حظر")?T.rose:T.text }}>{l}</div></Card>
      ))}
    </Page>
  )
  if (screen === "call-in") return (
    <Page title="مكالمة واردة" onBack={() => go("chat")}>
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Avatar name="محمد أحمد" size={96} bg={T.emerald}/></div>
        <h1 style={{ fontFamily: AR }}>أ/ محمد أحمد</h1>
        <p style={{ fontFamily: AR, color: T.muted }}>مكالمة صوتية واردة</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
          <button onClick={() => go("chat")} style={{ minHeight: 56, borderRadius: 18, border: "none", background: T.roseLt, color: T.rose, fontFamily: AR, fontWeight: 800 }}>رفض</button>
          <button onClick={() => go("call-audio")} style={{ minHeight: 56, borderRadius: 18, border: "none", background: T.emeraldLt, color: T.emerald, fontFamily: AR, fontWeight: 800 }}>قبول</button>
        </div>
      </div>
    </Page>
  )
  if (screen === "call-audio") return (
    <Page title="مكالمة صوتية" onBack={() => go("chat")}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Avatar name="محمد أحمد" size={88} bg={T.emerald}/></div>
        <h2 style={{ fontFamily: AR }}>أ/ محمد أحمد</h2>
        <p style={{ fontFamily: LAT, color: T.muted }}>12:08</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 20 }}>
        {["كتم","سماعة","بلوتوث"].map((x) => <Card key={x}><div style={{ fontFamily: AR, textAlign: "center", fontWeight: 700 }}>{x}</div></Card>)}
      </div>
      <div style={{ height: 10 }}/>
      <Btn variant="secondary" onClick={() => go("chat")}>فتح المحادثة</Btn>
      <div style={{ height: 8 }}/>
      <button onClick={() => go("chat")} style={{ width: "100%", minHeight: 56, borderRadius: 18, border: "none", background: T.rose, color: "white", fontFamily: AR, fontWeight: 800 }}>إنهاء المكالمة</button>
    </Page>
  )
  if (screen === "vid-in") return (
    <Page title="مكالمة فيديو" onBack={() => go("chat")}>
      <div style={{ textAlign: "center", paddingTop: 32 }}>
        <h1 style={{ fontFamily: AR }}>مكالمة فيديو من أ/ محمد</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
          <Btn variant="secondary" onClick={() => go("chat")}>رفض</Btn>
          <Btn onClick={() => go("vid-call")}>قبول</Btn>
        </div>
      </div>
    </Page>
  )
  if (screen === "vid-call") return (
    <Page title="حصة فيديو" onBack={() => go("chat")} pad={false}>
      <div style={{ height: 360, background: T.gradBrand, position: "relative", color: "white", display: "flex", alignItems: "flex-end", padding: 16 }}>
        <div style={{ position: "absolute", top: 16, left: 16, width: 90, height: 120, borderRadius: 12, background: "rgba(255,255,255,0.25)" }}/>
        <div style={{ fontFamily: AR }}>أ/ محمد أحمد · الاتصال ضعيف</div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {["مايك","كاميرا","قلب","سماعة"].map((x) => <Card key={x}><div style={{ fontFamily: AR, fontSize: 12, textAlign: "center" }}>{x}</div></Card>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Btn variant="secondary" onClick={() => go("chat")}>محادثة</Btn>
          <Btn variant="ghost" onClick={() => go("vid-files")}>محتوى الحصة</Btn>
        </div>
        <div style={{ height: 8 }}/>
        <Btn variant="secondary">رفع اليد ✋</Btn>
        <div style={{ height: 8 }}/>
        <button onClick={() => go("chat")} style={{ width: "100%", minHeight: 52, borderRadius: 16, border: "none", background: T.rose, color: "white", fontFamily: AR, fontWeight: 800 }}>إنهاء</button>
      </div>
    </Page>
  )
  if (screen === "vid-files") return (
    <Page title="محتوى الحصة" onBack={() => go("vid-call")}>
      {["شرح المعادلات.pdf","صورة السبورة","واجب الحصة","رابط الدرس","السبورة"].map((x) => (
        <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR, fontWeight: 700 }}>{x}</div></Card>
      ))}
    </Page>
  )
  if (screen === "t-create") return (
    <Page title="إنشاء" onBack={() => go("t-home")}>
      <Card style={{ marginBottom: 10 }} onClick={() => go("create-class")}><div style={{ fontFamily: AR, fontWeight: 800 }}>إنشاء فصل</div></Card>
      <Card style={{ marginBottom: 10 }} onClick={() => go("live-create")}><div style={{ fontFamily: AR, fontWeight: 800 }}>بث مباشر</div></Card>
      <Card style={{ marginBottom: 10 }} onClick={() => go("pkg-info")}><div style={{ fontFamily: AR, fontWeight: 800 }}>باقة جديدة</div></Card>
      <Card onClick={() => go("t-ai")}><div style={{ fontFamily: AR, fontWeight: 800 }}>تحضير بالذكاء الاصطناعي</div></Card>
    </Page>
  )

  if (screen === "live-create") return (
    <Page title="إنشاء بث مباشر" onBack={() => go("t-create")} footer={<Btn onClick={() => go("live-price")}>إنشاء البث</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="عنوان البث" value="مراجعة ليلة الامتحان — الرياضيات"/>
        <Input placeholder="المادة" value="رياضيات"/>
        <Input placeholder="الصف الدراسي" value="أولى ثانوي"/>
        <Input placeholder="وصف البث" value="مراجعة مركزة على أهم أفكار الامتحان"/>
        <Input placeholder="تاريخ البث" value="22 أغسطس 2026"/>
        <Input placeholder="وقت البداية" value="8:00 م"/>
        <Input placeholder="مدة متوقعة" value="90 دقيقة"/>
      </div>
      <div style={{ height: 10 }}/>
      {["مجاني","ضمن باقة","مدفوع"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="مدفوع"} onClick={() => {}}>{x}</Choice></div>)}
      <p style={{ fontFamily: AR, fontWeight: 700 }}>الجمهور</p>
      {["فصل معين","طلاب محددين","جميع متابعي المدرس","عام"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="فصل معين"} onClick={() => {}}>{x}</Choice></div>)}
    </Page>
  )
  if (screen === "live-price") return (
    <Page title="بث مدفوع" onBack={() => go("live-create")} footer={<Btn onClick={() => go("lives")}>نشر البث</Btn>}>
      <Input placeholder="سعر الحضور" value="75"/>
      <div style={{ height: 12 }}/>
      <PriceSummary rows={[
        { k: "سعر الطالب", v: "75 ج.م" },
        { k: "رسوم المنصة", v: "حسب السياسة" },
        { k: "صافي أرباحك المتوقع", v: "يظهر قبل النشر" },
      ]} total="صافي بعد الرسوم"/>
    </Page>
  )
  if (screen === "lives") return (
    <Page title="البثوث" onBack={() => go("t-account")}>
      <Card style={{ marginBottom: 10 }} onClick={() => go("live-detail")}>
        <Chip filled>LIVE قريباً</Chip>
        <div style={{ fontFamily: AR, fontWeight: 800, marginTop: 8 }}>مراجعة ليلة الامتحان</div>
        <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>22 أغسطس · 8 م · 75 ج.م · 50 مسجّل</div>
      </Card>
      <Btn onClick={() => go("live-create")}>إنشاء بث جديد</Btn>
    </Page>
  )
  if (screen === "live-detail") return (
    <Page title="تفاصيل البث" onBack={() => go(ctx.role==="t"?"lives":"t-view")} footer={<Btn onClick={() => go("live-wait")}>احجز مكانك</Btn>}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <Avatar name="محمد حسن" size={44} bg={T.emerald}/>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أ/ محمد حسن <VerifiedBadge small/></div>
      </div>
      <h2 style={{ fontFamily: AR }}>مراجعة ليلة الامتحان — الرياضيات</h2>
      <Card>
        <div style={{ fontFamily: AR, lineHeight: 2 }}>المادة: رياضيات · الصف: أولى ثانوي · 22 أغسطس 8:00 م · 90 دقيقة · المسجّلون: 50</div>
      </Card>
      <Chip color={T.emerald}>مشمول في باقتك ✓</Chip>
      <div style={{ fontFamily: LAT, fontWeight: 800, marginTop: 8 }}>75 ج.م إن لم تكن الباقة سارية</div>
    </Page>
  )
  if (screen === "live-wait") return (
    <Page title="غرفة الانتظار" onBack={() => go("live-detail")} footer={<Btn onClick={() => go("live")}>دخول البث</Btn>}>
      <h2 style={{ fontFamily: AR }}>البث هيبدأ بعد 08:32</h2>
      <p style={{ fontFamily: AR, color: T.sub }}>أ/ محمد · مراجعة ليلة الامتحان · 23 في الانتظار</p>
      <Btn variant="secondary">اختبر الصوت</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary">اختبر الكاميرا</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="ghost" onClick={() => go("chat")}>فتح المحادثة</Btn>
    </Page>
  )
  if (screen === "live") return (
    <Page title="البث المباشر" onBack={() => go("live-end")} pad={false}>
      <div style={{ height: 220, background: T.gradBrand, color: "white", padding: 16, display: "flex", justifyContent: "space-between" }}>
        <Chip filled>LIVE</Chip>
        <span style={{ fontFamily: AR }}>43 مشاهد · مراجعة ليلة الامتحان</span>
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontFamily: AR, color: T.amber, fontWeight: 800 }}>يتم تسجيل البث</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[["محادثة","live"],["الأسئلة","live"],["رفع اليد","live"]].map(([l]) => (
            <Chip key={l}>{l}</Chip>
          ))}
        </div>
        <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>أحمد: الجزئية دي هتيجي في الامتحان؟</div></Card>
        <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR, fontWeight: 800 }}>✋ أحمد يريد المشاركة</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <Chip>السماح بالصوت</Chip>
            <Chip>صوت وكاميرا</Chip>
          </div>
        </Card>
        <Card><div style={{ fontFamily: AR }}>الحضور: مسجّل 50 · انضم 43 · غاب 7</div></Card>
        <div style={{ height: 8 }}/>
        <Btn onClick={() => go("live-end")}>إنهاء البث</Btn>
      </div>
    </Page>
  )
  if (screen === "live-end") return (
    <Page title={ctx.role==="t"?"ملخص البث":"انتهى البث"} onBack={() => go(ctx.role==="t"?"t-finance":"s-home")}>
      {ctx.role==="t" ? (
        <>
          <Card style={{ marginBottom: 10, background: T.emeraldLt }}>
            <div style={{ fontFamily: AR, color: T.muted }}>صافي الأرباح</div>
            <MoneyAmt v="2,430 ج.م" kind="in"/>
            <div style={{ fontFamily: AR, fontSize: 12, color: T.muted, marginTop: 4 }}>إجمالي 2,850 − رسوم المنصة حسب السياسة</div>
          </Card>
          {["مسجّل 50","حضر 43","متوسط المشاهدة 41 د","أسئلة 18"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: AR }}>انتهى البث</h2>
          <Btn onClick={() => go("review")}>تقييم الحصة</Btn>
          <div style={{ height: 8 }}/>
          <Btn variant="secondary">مشاهدة التسجيل</Btn>
          <div style={{ height: 8 }}/>
          <Btn variant="ghost" onClick={() => go("ai-chat")}>اسأل المعلم الذكي عن الدرس</Btn>
        </>
      )}
    </Page>
  )
  if (screen === "t-tx") return (
    <Page title="المعاملات" onBack={() => go("t-finance")} right={<button onClick={() => go("t-tx-filter")} style={{ background: "none", border: "none", color: T.brand, fontFamily: AR, fontWeight: 800 }}>فلتر</button>}>
      <Input placeholder="ابحث في المعاملات"/>
      <div style={{ height: 10 }}/>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }} className="scrollbar-hide">
        {["الكل","أرباح","سحب","استرداد","رسوم"].map((t) => <Chip key={t} filled={t==="الكل"}>{t}</Chip>)}
      </div>
      {[
        { n: "حصة رياضيات — أحمد علي", a: "450 ج.م", k: "in" as const, s: "قيد التسوية", d: "18 أغسطس، 6:00 م" },
        { n: "سحب أرباح", a: "2,000 ج.م", k: "out" as const, s: "تم التحويل", d: "12 أغسطس" },
        { n: "رسوم منصة — باقة 8 حصص", a: "حسب السياسة", k: "out" as const, s: "تم الدفع", d: "10 أغسطس" },
        { n: "استرداد حصة", a: "180 ج.م", k: "in" as const, s: "تم الاسترداد", d: "8 أغسطس" },
      ].map((r) => (
        <Card key={r.n} style={{ marginBottom: 8 }} onClick={() => go("tx-detail")}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: AR, fontWeight: 800 }}>{r.n}</div>
              <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{r.d}</div>
            </div>
            <div style={{ textAlign: "left" }}><MoneyAmt v={r.a} kind={r.k}/><div style={{ marginTop: 4 }}><FinStatus s={r.s}/></div></div>
          </div>
        </Card>
      ))}
    </Page>
  )
  if (screen === "t-tx-filter") return (
    <Page title="فلترة المعاملات" onBack={() => go("t-tx")} footer={<Btn onClick={() => go("t-tx")}>تطبيق</Btn>}>
      {["النوع","التاريخ","نطاق المبلغ","الحالة","الطالب","المادة"].map((x) => (
        <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR, fontWeight: 700 }}>{x}</div></Card>
      ))}
    </Page>
  )
  if (screen === "t-analytics") return (
    <Page title="تحليلات الأرباح" onBack={() => go("t-finance")}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{["7 أيام","30 يوم","3 شهور","سنة"].map((x) => <Chip key={x} filled={x==="30 يوم"}>{x}</Chip>)}</div>
      {[["الإيرادات","9,400 ج.م"],["صافي الأرباح","7,820 ج.م"],["رسوم المنصة","حسب السياسة"],["استردادات","180 ج.م"],["مسحوبات","2,000 ج.م"]].map(([k,v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, marginBottom: 8 }}><span>{k}</span><span style={{ fontFamily: LAT, fontWeight: 800 }}>{v}</span></div>
      ))}
      <Btn variant="secondary" onClick={() => go("reports")}>تقرير أغسطس</Btn>
    </Page>
  )
  if (screen === "withdraw-confirm") return (
    <Page title="تأكيد السحب" onBack={() => go("withdraw")} footer={<Btn onClick={() => go("withdraw-status")}>تأكيد</Btn>}>
      <h2 style={{ fontFamily: AR }}>تأكيد سحب 3,000 ج.م؟</h2>
      <p style={{ fontFamily: AR, color: T.sub }}>الوسيلة: بنك مصر ****1234 · رسوم التحويل تظهر قبل التأكيد · المدة المتوقعة حسب البنك</p>
    </Page>
  )
  if (screen === "s-pay") return (
    <Page title="المدفوعات" onBack={() => go("s-account")}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Card onClick={() => go("s-wallet")}><div style={{ fontFamily: AR, color: T.muted, fontSize: 12 }}>المحفظة</div><div style={{ fontFamily: LAT, fontWeight: 800 }}>450 ج.م</div></Card>
        <Card onClick={() => go("s-plans")}><div style={{ fontFamily: AR, color: T.muted, fontSize: 12 }}>الاشتراك</div><div style={{ fontFamily: AR, fontWeight: 800 }}>Student Plus</div></Card>
        <Card onClick={() => go("teac-ai")}><div style={{ fontFamily: AR, color: T.muted, fontSize: 12 }}>AI</div><div style={{ fontFamily: AR, fontWeight: 800 }}>65% مستخدم</div></Card>
        <Card onClick={() => go("s-pkgs")}><div style={{ fontFamily: AR, color: T.muted, fontSize: 12 }}>الباقات</div><div style={{ fontFamily: AR, fontWeight: 800 }}>2 نشطة</div></Card>
      </div>
      <Btn onClick={() => go("add-money")}>شحن المحفظة</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("tx")}>المعاملات</Btn>
    </Page>
  )
  if (screen === "s-pkgs") return (
    <Page title="باقاتي" onBack={() => go("s-account")}>
      <Card onClick={() => go("pkg-active")}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>أ/ محمد أحمد · رياضيات</div>
        <div style={{ fontFamily: AR, margin: "8px 0" }}>5 من 8 حصص متبقية</div>
        <ProgressBar pct={38}/>
        <div style={{ fontFamily: AR, fontSize: 12, color: T.muted, marginTop: 6 }}>تنتهي 30 سبتمبر</div>
      </Card>
    </Page>
  )
  if (screen === "pkg-active") return (
    <Page title="باقة الثانوية" onBack={() => go("s-pkgs")}>
      <Btn onClick={() => go("book")}>احجز حصة</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("pkg-use")}>تفاصيل الاستخدام</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="ghost" onClick={() => go("chat")}>تواصل مع المدرس</Btn>
    </Page>
  )
  if (screen === "pkg-use") return (
    <Page title="استخدام الباقة" onBack={() => go("pkg-active")}>
      {[["الحصة 1","مكتملة"],["الحصة 2","مكتملة"],["الحصة 3","ملغاة — رُجع الرصيد"],["الحصة 4","قادمة"]].map(([a,b]) => (
        <Card key={a} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR, fontWeight: 800 }}>{a}</div><div style={{ fontFamily: AR, color: T.muted }}>{b}</div></Card>
      ))}
    </Page>
  )
  if (screen === "s-pkg") return (
    <Page title="باقة الثانوية" onBack={() => go("t-view")} footer={<Btn onClick={() => go("pkg-pay")}>اشترك في الباقة</Btn>}>
      <Chip filled>الأكثر اختياراً</Chip>
      <h2 style={{ fontFamily: AR }}>8 حصص · 60 دقيقة</h2>
      <p style={{ fontFamily: AR, color: T.muted, textDecoration: "line-through" }}>بدلاً من 3,200 ج.م</p>
      <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 28, color: T.brand }}>2,650 ج.م</div>
      <Chip color={T.emerald}>وفّر 550 ج.م</Chip>
    </Page>
  )
  if (screen === "pkg-pay") return (
    <Page title="شراء الباقة" onBack={() => go("s-pkg")} footer={<Btn onClick={() => go(ctx.role==="s"?"s-approve-sent":"pkg-active")}>{ctx.role==="s"?"إرسال طلب موافقة لولي الأمر":"دفع وتفعيل الباقة"}</Btn>}>
      <PriceSummary rows={[
        { k: "سعر الباقة", v: "2,650 ج.م" },
        { k: "خصم", v: "550 ج.م" },
        { k: "كوبون", v: "—" },
        { k: "رصيد محفظة", v: "0" },
      ]} total="2,650 ج.م"/>
      {ctx.role==="s" && <p style={{ fontFamily: AR, color: T.sub, marginTop: 12 }}>هيتبعت طلب موافقة لولي الأمر قبل الدفع.</p>}
    </Page>
  )
  if (screen === "pkg-info") return (
    <Page title="بيانات الباقة" onBack={() => go("t-create")} footer={<Btn onClick={() => go("pkg-price")}>التالي · الحصص</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="اسم الباقة" value="باقة تأسيس الرياضيات"/>
        <Input placeholder="الوصف" value="تأسيس قوي قبل الامتحان"/>
        <Input placeholder="المادة" value="رياضيات"/>
        <Input placeholder="الصف" value="أولى ثانوي"/>
      </div>
    </Page>
  )
  if (screen === "pkg-price") return (
    <Page title="تسعير الباقة" onBack={() => go("pkg-info")} footer={<Btn onClick={() => go("pkg-sales")}>نشر الباقة</Btn>}>
      <p style={{ fontFamily: AR }}>400 ج.م × 8 = قيمة عادية 3,200 ج.م</p>
      <Input placeholder="سعر الباقة" value="2650"/>
      <Chip color={T.emerald}>وفّر 17% · 550 ج.م</Chip>
      <div style={{ height: 10 }}/>
      <PriceSummary rows={[
        { k: "سعر البيع", v: "2,650 ج.م" },
        { k: "عمولة المنصة", v: "حسب السياسة" },
        { k: "رسوم الدفع", v: "تظهر قبل النشر" },
      ]} total="صافي أرباحك المتوقع"/>
    </Page>
  )
  if (screen === "pkg-sales") return (
    <Page title="باقة تأسيس الرياضيات" onBack={() => go("t-account")}>
      <FinStatus s="نشط"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0" }}>
        {[["المبيعات","28,800"],["المشتركون","12"],["حصص مستخدمة","54"],["صافي الأرباح","حسب السياسة"]].map(([k,v]) => (
          <Card key={k}><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{k}</div><div style={{ fontFamily: LAT, fontWeight: 800 }}>{v}</div></Card>
        ))}
      </div>
      <Btn variant="secondary">تعديل</Btn>
    </Page>
  )
  if (screen === "plan-compare") return (
    <Page title="مقارنة الخطط" onBack={() => go(ctx.role==="t"?"t-plans":"s-plans")}>
      {["الفصول","الطلاب","إنشاء الباقات","البث المباشر","تسجيل البث","AI","تحليل الطلاب","التقارير المالية"].map((r) => (
        <Card key={r} style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: AR, fontWeight: 800 }}>{r}</div>
          <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>مجاني محدود · Pro متاح · Business أوسع</div>
        </Card>
      ))}
    </Page>
  )
  if (screen === "sub-usage") return (
    <Page title="استخدام الاشتراك" onBack={() => go("sub-manage")}>
      {[["الفصول","4 / الحد"],["الطلاب","82 / الحد"],["AI","65%"],["بثوث","2 هذا الشهر"]].map(([k,v]) => (
        <Card key={k} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: AR }}><span>{k}</span><span>{v}</span></div>
          <div style={{ marginTop: 8 }}><ProgressBar pct={k==="AI"?65:40}/></div>
        </Card>
      ))}
    </Page>
  )
  if (screen === "teac-ai") return (
    <Page title={ctx.role==="t"?"مساعد المدرس الذكي":"المعلم الذكي"} onBack={() => go(ctx.role==="t"?"t-account":"s-account")} footer={<Btn onClick={() => go("ai-addon")}>ترقية AI</Btn>}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>رصيد استخدام AI</div>
        <div style={{ fontFamily: AR, margin: "8px 0" }}>65% مستخدم</div>
        <ProgressBar pct={65} color={T.ai}/>
      </Card>
      {["محادثة AI","تحليل صورة السؤال","تحليل PDF","إنشاء اختبار","تحضير درس","تحليل الأداء"].map((x) => (
        <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>
      ))}
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>لو عندك اشتراك Teac، جزء من AI ممكن يكون مشمول. الترقية تزود الرصيد حسب السياسة.</p>
    </Page>
  )

  if (screen === "t-id") return <TeacherId go={go}/>
  if (screen === "t-review") return (
    <Page title="مراجعة البيانات" onBack={() => go("t-id")} footer={<Btn onClick={() => go("t-pending")}>إرسال للمراجعة</Btn>}>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR }}>أ/ محمد حسن · رياضيات · ثانوي</div></Card>
      <Card><div style={{ fontFamily: AR }}>بطاقة الرقم القومي مرفوعة · لن تظهر للطلاب</div></Card>
    </Page>
  )
  if (screen === "t-pending") return (
    <Page title="حالة التوثيق" onBack={() => go("t-home")} footer={<Btn onClick={() => go("t-home")}>استخدام المساعد الذكي</Btn>}>
      <div style={{ textAlign: "center", padding: 12 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>⏳</div>
        <h1 style={{ fontFamily: AR, fontSize: 22 }}>حسابك قيد المراجعة</h1>
        <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.7 }}>بنراجع بياناتك ومستنداتك، وهيوصلك إشعار أول ما يتم التحقق.</p>
      </div>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>متاح الآن: تحضير دروس واختبارات بالذكاء الاصطناعي</div></Card>
      <Card><div style={{ fontFamily: AR }}>غير متاح: الظهور في السوق، الحجوزات المدفوعة، والسحب</div></Card>
      <Btn variant="ghost" onClick={() => { ctx.setVerified(true); go("t-verified") }}>محاكاة الموافقة</Btn>
      <Btn variant="ghost" onClick={() => go("t-failed")}>محاكاة الرفض</Btn>
    </Page>
  )
  if (screen === "t-verified") return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <StatusBar/>
      <SuccessBlock title="تم توثيق حسابك بنجاح 🎉" sub="ظهر شارة مدرس موثّق على ملفك." cta="الذهاب للرئيسية" onCta={() => { ctx.setVerified(true); go("t-home") }}/>
    </div>
  )
  if (screen === "t-failed") return (
    <Page title="التوثيق" onBack={() => go("t-id")} footer={<Btn onClick={() => go("t-id")}>إعادة رفع المستندات</Btn>}>
      <h1 style={{ fontFamily: AR }}>تعذر توثيق الحساب</h1>
      <p style={{ fontFamily: AR, color: T.sub }}>الصورة غير واضحة. ارفع صورة أوضح لوجه البطاقة الأمامي والخلفي.</p>
    </Page>
  )
  if (screen === "s-wallet") return <StudentWallet go={go}/>
  if (screen === "add-money") return <AddMoney go={go}/>
  if (screen === "pay-ok") return (
    <Page title="تمت العملية" onBack={() => go("s-wallet")} footer={<Btn onClick={() => go("s-wallet")}>العودة للمحفظة</Btn>}>
      <SuccessBlock title="تمت العملية بنجاح" sub="250 ج.م · رقم TX-88421 · بطاقة بنكية" cta="عرض الإيصال" onCta={() => go("tx-detail")}/>
    </Page>
  )
  if (screen === "pay-fail") return (
    <Page title="فشل الدفع" onBack={() => go("add-money")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("add-money")}>حاول مرة أخرى</Btn>
        <Btn variant="secondary" onClick={() => go("pay-methods")}>استخدم طريقة دفع أخرى</Btn>
      </div>
    }>
      <h1 style={{ fontFamily: AR }}>تعذر إتمام الدفع</h1>
      <p style={{ fontFamily: AR, color: T.sub }}>البطاقة مرفوضة أو الرصيد غير كافٍ أو في مشكلة اتصال.</p>
    </Page>
  )
  if (screen === "tx") return <Transactions go={go}/>
  if (screen === "ents") return (
    <Entitlements
      go={go}
      dueOrders={ctx.dueOrders}
      settlements={ctx.settlements}
      onRequest={ctx.requestSettlement}
      onApprove={ctx.approvePending}
    />
  )
  if (screen === "edit-profile") return <EditProfile go={go} role={ctx.role}/>
  if (screen === "logout") return (
    <Page title="تسجيل الخروج" onBack={() => go(backAcc)} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("login")}>تأكيد تسجيل الخروج</Btn>
        <Btn variant="secondary" onClick={() => go(backAcc)}>البقاء في الحساب</Btn>
      </div>
    }>
      <Card style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🚪</div>
        <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 18 }}>هتسجّل خروج من الجهاز ده؟</div>
        <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.7, margin: "10px 0 0" }}>
          الحساب هيفضل موجود، وتقدر تدخل تاني بنفس الرقم. الحجوزات والرصيد مش هيتشالوا.
        </p>
      </Card>
    </Page>
  )
  if (screen === "tx-detail") return (
    <Page title="تفاصيل المعاملة" onBack={() => go(ctx.role==="t"?"t-tx":"tx")} footer={<Btn variant="secondary">تحميل الإيصال</Btn>}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: AR, fontWeight: 800 }}>صافي أرباح المدرس</span>
        <MoneyAmt v="408 ج.م" kind="in"/>
      </div>
      <FinStatus s="قيد التسوية"/>
      <div style={{ height: 10 }}/>
      <PriceSummary rows={[
        { k: "النوع", v: "حصة مدفوعة" },
        { k: "الطالب", v: "أحمد علي" },
        { k: "المدرس", v: "أ/ محمد أحمد" },
        { k: "المادة", v: "رياضيات" },
        { k: "موعد الحصة", v: "18 أغسطس 2026 — 6:00 م" },
        { k: "سعر الحصة", v: "500 ج.م" },
        { k: "خصم الطالب", v: "−20 ج.م" },
        { k: "المبلغ المدفوع", v: "480 ج.م" },
        { k: "رسوم الدفع", v: "تظهر في الفاتورة" },
        { k: "عمولة Teac Teacher", v: "حسب السياسة" },
      ]} total="صافي المدرس بعد التسوية"/>
      <div style={{ fontFamily: AR, fontWeight: 800, margin: "14px 0 6px" }}>مسار الفلوس</div>
      <FinTimeline steps={[
        { l: "تم الدفع", d: "18 أغسطس — 5:42 م", on: true },
        { l: "تمت الحصة", d: "18 أغسطس — 7:00 م", on: true },
        { l: "قيد التسوية", d: "حتى اكتمال دورة التسوية", on: true },
        { l: "متاح للسحب", d: "المتوقع حسب سياسة المنصة", on: false },
      ]}/>
    </Page>
  )
  if (screen === "t-wallet") return <TeacherFinance go={go}/>
  if (screen === "withdraw") return <Withdraw go={go} verified={ctx.verified}/>
  if (screen === "payout-add") return (
    <Page title="إضافة وسيلة سحب" onBack={() => go("withdraw")} footer={<Btn onClick={() => go("withdraw")}>حفظ</Btn>}>
      {["حساب بنكي","محفظة إلكترونية"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="حساب بنكي"} onClick={() => {}}>{x}</Choice></div>)}
      <Input placeholder="اسم البنك" value="بنك مصر"/>
      <div style={{ height: 8 }}/>
      <Input placeholder="اسم صاحب الحساب" value="محمد أحمد حسن"/>
      <div style={{ height: 8 }}/>
      <Input placeholder="رقم الحساب / IBAN"/>
    </Page>
  )
  if (screen === "withdraw-status") return (
    <Page title="طلب السحب" onBack={() => go("t-finance")}>
      <FinTimeline steps={[
        { l: "تم إرسال الطلب", d: "مرجع WD-318", on: true },
        { l: "قيد المراجعة", d: "المنصة تراجع الطلب", on: true },
        { l: "جاري التحويل", d: "البنك يعالج العملية", on: false },
        { l: "تم الاستلام", d: "هتوصلك إشعار عند التحويل", on: false },
      ]}/>
    </Page>
  )
  if (screen === "reports") return (
    <Page title="تقرير أغسطس" onBack={() => go("t-finance")} footer={<Btn variant="secondary">تحميل التقرير</Btn>}>
      {[
        ["إجمالي المبيعات","9,400 ج.م"],
        ["خصومات","220 ج.م"],
        ["استردادات","180 ج.م"],
        ["رسوم المنصة","حسب السياسة"],
        ["صافي الأرباح","7,820 ج.م"],
        ["المبالغ المسحوبة","2,000 ج.م"],
        ["الرصيد الحالي","8,450 ج.م"],
      ].map(([k,v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, marginBottom: 8 }}><span>{k}</span><span style={{ fontFamily: LAT, fontWeight: 800 }}>{v}</span></div>
      ))}
    </Page>
  )
  if (screen === "s-plans" || screen === "t-plans") return <Plans go={go} teacher={screen==="t-plans"}/>
  if (screen === "checkout") return <Checkout go={go}/>
  if (screen === "sub-ok") return (
    <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <StatusBar/>
      <SuccessBlock title="تم تفعيل اشتراكك 🎉" sub="Student Plus · التجديد 19 سبتمبر 2026" cta="ابدأ الاستخدام" onCta={() => go("s-home")}/>
      <div style={{ padding: 24 }}><Btn variant="ghost" onClick={() => go("sub-manage")}>إدارة الاشتراك</Btn></div>
    </div>
  )
  if (screen === "sub-manage") return (
    <Page title="إدارة الاشتراك" onBack={() => go(backAcc)}>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR, lineHeight: 2 }}>الخطة: Teacher Pro · نشطة · التجديد 19 سبتمبر · 149 ج.م / شهر</div></Card>
      <Btn onClick={() => go("t-plans")}>ترقية الخطة</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("sub-usage")}>استخدام الاشتراك</Btn>
      <Btn variant="ghost">إيقاف التجديد التلقائي</Btn>
    </Page>
  )
  if (screen === "sub-fail") return (
    <Page title="التجديد" onBack={() => go("sub-manage")} footer={<Btn onClick={() => go("pay-methods")}>تحديث طريقة الدفع</Btn>}>
      <h1 style={{ fontFamily: AR }}>تعذر تجديد اشتراكك</h1>
      <p style={{ fontFamily: AR, color: T.sub }}>تقدمك محفوظ. حدّث الدفع خلال فترة السماح.</p>
    </Page>
  )
  if (screen === "ai-usage") return (
    <Page title="استخدام الذكاء الاصطناعي" onBack={() => go(backAcc)} footer={<Btn variant="secondary" onClick={() => go("ai-addon")}>إضافة رصيد AI</Btn>}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>استخدمت 65% من رصيد AI</div>
        <ProgressBar pct={65} color={T.ai}/>
      </Card>
      {["محادثات 40%","تحليل ملفات 10%","إنشاء اختبارات 8%","خطط 7%"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
      <p style={{ fontFamily: AR, fontSize: 13, color: T.amber }}>متبقي 35% من استخدام المعلم الذكي</p>
    </Page>
  )
  if (screen === "ai-limit") return (
    <Page title="المعلم الذكي" onBack={() => go("ai-chat")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("s-plans")}>عرض الخطط</Btn>
        <Btn variant="ghost" onClick={() => go("ai-chat")}>لاحقاً</Btn>
      </div>
    }>
      <h1 style={{ fontFamily: AR }}>وصلت للحد المتاح من المعلم الذكي</h1>
      <p style={{ fontFamily: AR, color: T.sub }}>تقدر تنتظر تجديد الرصيد أو ترقي خطتك أو تشتري رصيد استخدام إضافي.</p>
    </Page>
  )
  if (screen === "ai-addon") return (
    <Page title="إضافة رصيد AI" onBack={() => go("ai-usage")} footer={<Btn onClick={() => go("checkout")}>شراء رصيد استخدام إضافي</Btn>}>
      {["حزمة خفيفة","حزمة متوسطة","حزمة مكثفة"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="حزمة متوسطة"} onClick={() => {}}>{x}</Choice></div>)}
    </Page>
  )
  if (screen === "pkg-create") return (
    <Page title="إنشاء باقة" onBack={() => go("t-account")} footer={<Btn onClick={() => go("pkg-list")}>إنشاء الباقة</Btn>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="اسم الباقة" value="باقة 8 حصص رياضيات"/>
        <Input placeholder="عدد الحصص" value="8"/>
        <Input placeholder="مدة الحصة" value="60 دقيقة"/>
        <Input placeholder="سعر الباقة" value="1,200 ج.م"/>
        <Input placeholder="صلاحية الباقة" value="60 يوم"/>
      </div>
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted, marginTop: 12 }}>سعر الطالب والصافي يظهران حسب رسوم المنصة قبل النشر.</p>
    </Page>
  )
  if (screen === "pkg-list" || screen === "pkg-detail") return (
    <Page title="باقة الثانوية العامة" onBack={() => go("t-view")} footer={<Btn onClick={() => go("book-pay")}>اشترك في الباقة</Btn>}>
      <Card>
        <div style={{ fontFamily: AR, lineHeight: 2 }}>أ/ محمد حسن · 8 حصص · 60 دقيقة · المتبقي بعد الشراء: 8 · أوفر من الحصة المفردة</div>
      </Card>
    </Page>
  )
  if (screen === "referral") return (
    <Page title="ادعُ أصحابك" onBack={() => go("s-account")}>
      <div style={{ textAlign: "center", fontFamily: LAT, fontSize: 22, fontWeight: 900, color: T.brand, margin: "12px 0" }}>TEAC-AHMED</div>
      <p style={{ fontFamily: AR, color: T.sub }}>اكسب مكافآت داخل Teac Teacher لما صديقك يسجل ويحقق شروط العرض.</p>
      <Btn>نسخ الكود</Btn>
      <div style={{ height: 8 }}/>
      <Card><div style={{ fontFamily: AR }}>دعوات: 4 · ناجحة: 2 · مكافآت: 80 ج.م رصيد مكافآت</div></Card>
    </Page>
  )
  if (screen === "refund") return (
    <Page title="طلب استرداد" onBack={() => go("tx-detail")} footer={<Btn onClick={() => go("tx")}>طلب استرداد</Btn>}>
      <p style={{ fontFamily: AR }}>الحالة: مؤهل حسب سياسة الإلغاء.</p>
      {["المدرس ألغى الحصة","مشكلة تقنية","لم تتم الحصة","سبب آخر"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="مشكلة تقنية"} onClick={() => {}}>{x}</Choice></div>)}
    </Page>
  )
  if (screen === "cancel-session") return (
    <Page title="إلغاء الحصة" onBack={() => go("session")} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={() => go("bookings")}>تأكيد الإلغاء</Btn>
        <Btn variant="secondary" onClick={() => go("session")}>رجوع</Btn>
      </div>
    }>
      <p style={{ fontFamily: AR, color: T.sub }}>حسب سياسة الإلغاء: قد يُعاد المبلغ للمحفظة أو لوسيلة الدفع، وقد تُطبق رسوم إلغاء إن وُجدت.</p>
      <PriceSummary rows={[{k:"سعر الحصة",v:"180 ج.م"},{k:"رسوم إلغاء إن وُجدت",v:"حسب السياسة"}]} total="يُحسب عند التأكيد"/>
    </Page>
  )
  if (screen === "bookings") return <Bookings go={go} teacher={ctx.role==="t"}/>
  if (screen === "session") return (
    <Page title="تفاصيل الحصة" onBack={() => go("bookings")} footer={<Btn>دخول الحصة</Btn>}>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR, lineHeight: 2 }}>أ/ محمد حسن · أحمد علي · رياضيات · السبت 6:00 م · 60 د · مدفوعة</div></Card>
      <Btn variant="secondary" onClick={() => go("ai-chat")}>رسالة</Btn>
      <Btn variant="ghost" onClick={() => go("cancel-session")}>إلغاء الحصة</Btn>
    </Page>
  )
  if (screen === "review") return (
    <Page title="قيّم المدرس" onBack={() => go("session")} footer={<Btn onClick={() => go("s-home")}>إرسال التقييم</Btn>}>
      <p style={{ fontFamily: AR }}>للتقييم بعد حصة مكتملة فقط.</p>
      {["الشرح","الالتزام","التواصل"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x} ★★★★★</div></Card>)}
    </Page>
  )
  if (screen === "invoices") return (
    <Page title="الفواتير والإيصالات" onBack={() => go(backAcc)}>
      {["فاتورة حصة رياضيات","فاتورة Student Plus","رصيد AI إضافي"].map((x) => (
        <Card key={x} style={{ marginBottom: 8 }} onClick={() => go("tx-detail")}><div style={{ fontFamily: AR, fontWeight: 700 }}>{x}</div></Card>
      ))}
    </Page>
  )
  if (screen === "pay-methods") return (
    <Page title="وسائل الدفع" onBack={() => go(backAcc)}>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>بطاقة · **** 4242 · افتراضي</div></Card>
      <Btn variant="secondary">إضافة وسيلة دفع</Btn>
    </Page>
  )
  if (screen === "pricing") return (
    <Page title="الأسعار والخدمات" onBack={() => go("t-account")} footer={<Btn onClick={() => go("pkg-create")}>إنشاء باقة</Btn>}>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR }}>حصة رياضيات 60 د · أونلاين 180 ج.م · حضوري 220 ج.م</div></Card>
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>قبل النشر تشوف سعر الطالب ورسوم المنصة والصافي المتوقع.</p>
    </Page>
  )
  if (screen === "availability") return (
    <Page title="مواعيدي" onBack={() => go("t-account")}>
      {["سبت 4–9 م","أحد 4–9 م","ثلاثاء إجازة"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>مدة الحصة 60 د · فاصل 10 د · تكرار أسبوعي</p>
    </Page>
  )
  if (screen === "calendar") return (
    <Page title="التقويم" onBack={() => go(ctx.role==="t"?"t-home":"s-home")}>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>🔵 حصة رياضيات · السبت 6 م</div></Card>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>🟠 تسليم واجب المعادلات</div></Card>
      <Card><div style={{ fontFamily: AR }}>🟣 اختبار قصير</div></Card>
    </Page>
  )
  if (screen === "security") return (
    <Page title="الأمان" onBack={() => go(backAcc)}>
      <Card style={{ marginBottom: 8 }} onClick={() => go("devices")}><div style={{ fontFamily: AR }}>الأجهزة المسجّلة</div></Card>
      {["تغيير كلمة المرور","التحقق بخطوتين","تسجيل الخروج من كل الأجهزة"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
      {ctx.role==="t" && <Card onClick={() => go(ctx.verified?"t-verified":"t-pending")}><div style={{ fontFamily: AR }}>حالة توثيق الهوية</div></Card>}
      <Card style={{ marginTop: 8 }} onClick={() => go("account-settings")}><div style={{ fontFamily: AR, color: T.muted }}>إعدادات الحساب</div></Card>
    </Page>
  )
  if (screen === "privacy") return (
    <Page title="الخصوصية" onBack={() => go(backAcc)}>
      {["ظهور الملف","الظهور في السوق","إشعارات تسويقية","صلاحيات البيانات"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
    </Page>
  )
  if (screen === "delete-acc") return (
    <Page title="حذف الحساب" onBack={() => go(backAcc)} footer={
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => go("login")} style={{
          width: "100%", minHeight: 56, borderRadius: 18, border: "none",
          background: T.rose, color: "white", fontFamily: AR, fontWeight: 800, fontSize: 16, cursor: "pointer",
        }}>تأكيد حذف الحساب</button>
        <Btn variant="secondary" onClick={() => go(backAcc)}>إلغاء</Btn>
      </div>
    }>
      <Card style={{ background: T.roseLt, boxShadow: "none", border: `1px solid ${T.rose}22`, marginBottom: 12 }}>
        <div style={{ fontFamily: AR, fontWeight: 800, color: T.rose }}>الحذف نهائي</div>
        <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.7, margin: "8px 0 0" }}>
          مختلف عن تسجيل الخروج. هتفقد الوصول للفصول والحجوزات والاشتراك حسب سياسة المنصة، ومش هتقدر تسترجع نفس الحساب.
        </p>
      </Card>
      <Card>
        <div style={{ fontFamily: AR, fontWeight: 800, marginBottom: 8 }}>هيتشال من حسابك</div>
        {["بيانات الملف الشخصي","سجل الحصص داخل التطبيق","رصيد المحفظة غير المسحوب حسب السياسة"].map((x) => (
          <div key={x} style={{ fontFamily: AR, fontSize: 13, color: T.sub, marginBottom: 6 }}>• {x}</div>
        ))}
      </Card>
    </Page>
  )
  if (screen === "support") return (
    <Page title="المساعدة والدعم" onBack={() => go(backAcc)}>
      {["الحجوزات","الدفع","الاشتراكات","المحفظة","المدرسين","المعلم الذكي","الحساب"].map((x) => <Card key={x} style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>{x}</div></Card>)}
      <Btn variant="secondary" onClick={() => go("report-user")}>الإبلاغ عن مستخدم</Btn>
    </Page>
  )
  if (screen === "report-user") return (
    <Page title="الإبلاغ عن مستخدم" onBack={() => go("support")} footer={<Btn onClick={() => go("support")}>إرسال البلاغ</Btn>}>
      {["سلوك غير مناسب","محتوى غير مناسب","مشكلة في الحصة","احتيال","سبب آخر"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={false} onClick={() => {}}>{x}</Choice></div>)}
    </Page>
  )
  if (screen === "guardian") return (
    <Page title="ولي الأمر" onBack={() => go("s-account")}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar name="أحمد محمد" size={48}/>
          <div>
            <div style={{ fontFamily: AR, fontWeight: 900 }}>أحمد محمد</div>
            <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>صلة القرابة: والد</div>
            <Chip color={T.emerald}>مرتبط بالحساب ✓</Chip>
          </div>
        </div>
      </Card>
      <Card style={{ background: T.brandXLight }}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>الصلاحيات</div>
        <p style={{ fontFamily: AR, fontSize: 13, color: T.sub, lineHeight: 1.7 }}>ولي الأمر يشوف التقدم والحضور والمدفوعات. محادثات المعلم الذكي وسجل الشات الخاص مع المدرس مش ظاهرة له بشكل افتراضي.</p>
      </Card>
    </Page>
  )
  if (screen === "book-pay") return <BookPay go={go}/>
  return null
}

function TeacherId({ go }: { go: Go }) {
  const [ok, setOk] = useState(false)
  const [id, setId] = useState("بطاقة الرقم القومي")
  return (
    <Page title="توثيق حساب المدرس" onBack={() => go("t-setup")} footer={<Btn onClick={() => go("t-review")}>إرسال للمراجعة</Btn>}>
      <p style={{ fontFamily: AR, color: T.sub, lineHeight: 1.75 }}>علشان نحافظ على أمان الطلبة وجودة المدرسين على Teac Teacher، محتاجين نتأكد من هويتك.</p>
      {["بطاقة الرقم القومي","جواز سفر"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={id===x} onClick={() => setId(x)}>{x}</Choice></div>)}
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>صورة الوجه الأمامي · كاميرا أو معرض</div></Card>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>صورة الوجه الخلفي · كاميرا أو معرض</div></Card>
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>بيانات التحقق محمية ولا تظهر للطلاب أو أي مستخدم آخر.</p>
      <label style={{ display: "flex", gap: 8, fontFamily: AR, fontSize: 14 }}>
        <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)}/>
        أوافق على استخدام المستندات للتحقق من هويتي.
      </label>
    </Page>
  )
}

function StudentWallet({ go }: { go: Go }) {
  return (
    <Page title="محفظتي" onBack={() => go("s-account")}>
      <BalanceCard label="الرصيد المتاح" amount="450" onClick={() => go("add-money")}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Card onClick={() => go("add-money")}><div style={{ fontFamily: AR, fontWeight: 700 }}>إضافة رصيد</div></Card>
        <Card onClick={() => go("tx")}><div style={{ fontFamily: AR, fontWeight: 700 }}>المعاملات</div></Card>
      </div>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>رصيد نقدي 370 ج.م</div></Card>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>رصيد مكافآت 80 ج.م · داخل Teac Teacher فقط</div></Card>
      <Btn variant="ghost" onClick={() => go("s-plans")}>الكوبونات والخطط</Btn>
    </Page>
  )
}

function AddMoney({ go }: { go: Go }) {
  const [amt, setAmt] = useState("250")
  return (
    <Page title="إضافة رصيد" onBack={() => go("s-wallet")} footer={<Btn onClick={() => go("pay-ok")}>تأكيد الدفع</Btn>}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>{["100","250","500"].map((x) => (
        <button key={x} onClick={() => setAmt(x)} style={{ flex: 1, padding: 12, borderRadius: 14, border: `1.5px solid ${amt===x?T.brand:T.border}`, background: amt===x?T.brandLight:T.card, fontFamily: AR, fontWeight: 800 }}>{x}</button>
      ))}</div>
      <Input placeholder="مبلغ آخر" value={amt} onChange={setAmt}/>
      <div style={{ height: 12 }}/>
      {["بطاقة بنكية","محفظة إلكترونية","طرق دفع محلية"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={x==="بطاقة بنكية"} onClick={() => {}}>{x}</Choice></div>)}
      <PriceSummary rows={[{k:"المبلغ",v:`${amt} ج.م`},{k:"رسوم الدفع إن وُجدت",v:"تظهر قبل التأكيد"}]} total={`${amt} ج.م`}/>
      <Btn variant="ghost" onClick={() => go("pay-fail")}>محاكاة فشل الدفع</Btn>
    </Page>
  )
}

function Transactions({ go }: { go: Go }) {
  const [tab, setTab] = useState("الكل")
  const rows = [
    { name: "حصة رياضيات مع أ/ محمد", amount: "-180 ج.م", date: "اليوم · 6:00 م", status: "ناجحة", extra: "رقم العملية TX-88421", kind: "مدفوعات", time: "18:00", value: "180", fee: "حسب السياسة", vat: "—" },
    { name: "شحن المحفظة", amount: "+250 ج.م", date: "أمس · 2:14 م", status: "ناجحة", extra: "بطاقة **** 4242", kind: "شحن", time: "14:14", value: "250", fee: "—", vat: "—" },
    { name: "استرداد حجز", amount: "+150 ج.م", date: "18 أغسطس", status: "مستردة", extra: "إلى المحفظة", kind: "استرداد", time: "11:20", value: "150", fee: "—", vat: "—" },
    { name: "اشتراك Student Plus", amount: "-89 ج.م", date: "1 أغسطس", status: "ناجحة", extra: "تجديد شهري", kind: "اشتراكات", time: "09:00", value: "89", fee: "—", vat: "—" },
    { name: "دفع حصة فيزياء", amount: "-160 ج.م", date: "28 يوليو", status: "معلقة", extra: "بانتظار تأكيد الحصة", kind: "مدفوعات", time: "17:30", value: "160", fee: "حسب السياسة", vat: "—" },
  ]
  const shown = rows.filter((r) => tab === "الكل" || r.kind === tab)
  return (
    <Page title="المعاملات المالية" onBack={() => go("s-wallet")}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14 }} className="scrollbar-hide">
        {["الكل","مدفوعات","شحن","استرداد","اشتراكات"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 14px", borderRadius: 12, border: "none",
            background: tab===t ? T.brandLight : T.gray, color: tab===t ? T.brand : T.sub,
            fontFamily: AR, fontWeight: 800, whiteSpace: "nowrap",
          }}>{t}</button>
        ))}
      </div>
      {shown.map((r) => (
        <Card key={r.name} style={{ marginBottom: 10 }} onClick={() => go("tx-detail")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontFamily: AR, fontWeight: 800 }}>{r.name}</div>
            <Chip color={r.status==="معلقة"?T.amber:r.status==="مستردة"?T.teal:T.emerald}>{r.status}</Chip>
          </div>
          {[
            ["التاريخ", r.date],
            ["الوقت", r.time],
            ["قيمة العملية", `${r.value} ج.م`],
            ["رسوم المنصة", r.fee],
            ["ضريبة إن وُجدت", r.vat],
            ["المرجع", r.extra],
          ].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: AR, fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: T.muted }}>{k}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: T.border, margin: "10px 0" }}/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: AR, fontWeight: 800 }}>الإجمالي</span>
            <span style={{ fontFamily: LAT, fontWeight: 900, fontSize: 20, color: r.amount.startsWith("+") ? T.emerald : T.brand }}>{r.amount}</span>
          </div>
        </Card>
      ))}
    </Page>
  )
}

function Entitlements({
  go, dueOrders, settlements, onRequest, onApprove,
}: {
  go: Go
  dueOrders: DueOrder[]
  settlements: Settlement[]
  onRequest: () => void
  onApprove: () => void
}) {
  const [tab, setTab] = useState<"due"|"wait"|"done">("due")
  const tabs = [
    { k: "due" as const, l: "المستحقة" },
    { k: "wait" as const, l: "الجاري" },
    { k: "done" as const, l: "المنتهي" },
  ]
  const pending = settlements.filter((s) => s.status === "pending")
  const done = settlements.filter((s) => s.status === "done")
  const dueTotal = dueOrders.reduce((n, o) => n + Number(o.due.replace(/,/g, "")), 0)
  const waitOrders = pending.flatMap((s) => s.orders.map((o) => ({ ...o, reqId: s.id, sentAt: s.sentAt })))
  const doneOrders = done.flatMap((s) => s.orders.map((o) => ({ ...o, reqId: s.id, sentAt: s.doneAt || s.sentAt })))
  const dueFmt = dueTotal.toLocaleString("en-US")
  const sums = [
    { l: "إجمالي العمولة", v: dueOrders.length ? "حسب السياسة" : "0", ic: "٪" },
    { l: "إجمالي الحصص", v: String(dueOrders.length), ic: "📚" },
    { l: "إجمالي المستحق", v: dueFmt, ic: "👛" },
    { l: "الجاري لدى الإدارة", v: String(pending.length), ic: "⏳" },
  ]

  return (
    <Page title="المستحقات المالية" onBack={() => go("t-finance")} footer={
      tab==="due" && dueOrders.length > 0 ? (
        <Btn onClick={() => { onRequest(); setTab("wait") }}>طلب تسوية ({dueFmt} ج.م)</Btn>
      ) : undefined
    }>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 12, border: "none",
            background: tab===t.k ? T.brandLight : T.gray, color: tab===t.k ? T.brand : T.sub,
            fontFamily: AR, fontWeight: 800, fontSize: 12,
          }}>{t.l}{t.k==="wait" && pending.length ? ` (${pending.length})` : ""}{t.k==="done" && done.length ? ` (${done.length})` : ""}</button>
        ))}
      </div>
      {tab==="due" && sums.map((s) => (
        <div key={s.l} style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
          padding: "12px 14px", borderRadius: 16, background: T.brandXLight,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.brandLight, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.ic}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>{s.l}</div>
            <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 16 }}>{s.v}</div>
          </div>
        </div>
      ))}
      <div style={{ height: 8 }}/>
      {tab==="due" && dueOrders.length === 0 && (
        <p style={{ fontFamily: AR, color: T.muted, textAlign: "center" }}>مفيش مستحقات حالياً. الطلبات اتبعت للإدارة من تبويب الجاري.</p>
      )}
      {tab==="due" && dueOrders.map((o) => (
        <SettleOrderCard key={o.id} o={o} badge="مستحقة" badgeColor={T.brand}/>
      ))}
      {tab==="wait" && (
        <>
          <p style={{ fontFamily: AR, color: T.sub, fontSize: 13, lineHeight: 1.7, marginTop: 0 }}>
            كل طلبات التسوية اللي اتبعت للإدارة، بنفس تفاصيل الحصص المرسلة.
          </p>
          {waitOrders.length === 0 && <p style={{ fontFamily: AR, color: T.muted, textAlign: "center" }}>مفيش طلبات جارية. اعمل طلب تسوية من تبويب المستحقة.</p>}
          {waitOrders.map((o) => (
            <SettleOrderCard key={`${o.reqId}-${o.id}`} o={o} badge="قيد المراجعة" badgeColor={T.amber} reqId={o.reqId} sentAt={o.sentAt}/>
          ))}
          {pending.length > 0 && <Btn variant="ghost" onClick={onApprove}>محاكاة موافقة الإدارة</Btn>}
        </>
      )}
      {tab==="done" && (
        <>
          <p style={{ fontFamily: AR, color: T.sub, fontSize: 13, lineHeight: 1.7, marginTop: 0 }}>
            كل التسويات المنتهية بعد موافقة الإدارة والتحويل.
          </p>
          {doneOrders.length === 0 && <p style={{ fontFamily: AR, color: T.muted, textAlign: "center" }}>لسه مفيش تسويات منتهية.</p>}
          {doneOrders.map((o) => (
            <SettleOrderCard key={`${o.reqId}-${o.id}`} o={o} badge="مكتملة" badgeColor={T.emerald} reqId={o.reqId} sentAt={o.sentAt}/>
          ))}
        </>
      )}
    </Page>
  )
}

function EditProfile({ go, role }: { go: Go; role: Role | null }) {
  const [name, setName] = useState(role==="t"?"محمد أحمد حسن":"أحمد محمد")
  const back: Screen = role==="t"?"t-account":role==="p"?"p-more":"s-account"
  return (
    <Page title="تعديل بيانات الحساب" onBack={() => go(back)} footer={<Btn onClick={() => go(back)}>حفظ التعديلات</Btn>}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Avatar name={name} size={80}/></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input placeholder="الاسم" value={name} onChange={setName}/>
        <Input placeholder="رقم الهاتف" value="01012345678"/>
        <Input placeholder="البريد الإلكتروني" value={role==="t"?"mohamed@teac.app":"ahmed@teac.app"}/>
        {role==="s" && <Input placeholder="الصف الدراسي" value="أولى ثانوي"/>}
        {role==="t" && <Input placeholder="نبذة قصيرة" value="مدرس رياضيات للثانوية العامة"/>}
        {role==="p" && <Input placeholder="صلة القرابة" value="والد"/>}
      </div>
    </Page>
  )
}

function TeacherWallet({ go, verified }: { go: Go; verified: boolean }) {
  return (
    <Page title="أرباحي" onBack={() => go("t-account")}>
      <BalanceCard label="الرصيد المتاح للسحب" amount="3,850" tone="teach" onClick={() => go("withdraw")}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Card><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>قيد التسوية</div><div style={{ fontFamily: LAT, fontWeight: 800 }}>620</div></Card>
        <Card><div style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>إجمالي الأرباح</div><div style={{ fontFamily: LAT, fontWeight: 800 }}>12,400</div></Card>
      </div>
      <Card style={{ marginBottom: 8 }}><div style={{ fontFamily: AR }}>في انتظار الحصة 180 · قيد التسوية 620 · متاح للسحب 3,850</div></Card>
      {!verified && <Card style={{ marginBottom: 8 }} onClick={() => go("t-id")}><div style={{ fontFamily: AR }}>السحب متاح بعد توثيق الحساب</div></Card>}
      <Btn onClick={() => go("ents")}>المستحقات والمعاملات</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="secondary" onClick={() => go("withdraw")}>سحب الأرباح</Btn>
      <div style={{ height: 8 }}/>
      <Btn variant="ghost" onClick={() => go("reports")}>تقارير الأرباح</Btn>
    </Page>
  )
}

function Withdraw({ go, verified }: { go: Go; verified: boolean }) {
  const [amt, setAmt] = useState("3000")
  if (!verified) return (
    <Page title="سحب الأرباح" onBack={() => go("t-finance")} footer={<Btn onClick={() => go("t-id")}>ابدأ التوثيق</Btn>}>
      <p style={{ fontFamily: AR }}>وثّق حسابك لاستقبال حجوزات مدفوعة وسحب الأرباح.</p>
    </Page>
  )
  return (
    <Page title="سحب الأرباح" onBack={() => go("t-finance")} footer={<Btn onClick={() => go("withdraw-confirm")}>تأكيد طلب السحب</Btn>}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: AR, color: T.muted }}>متاح للسحب</div>
        <div style={{ fontFamily: LAT, fontWeight: 900, fontSize: 28, color: T.emerald }}>5,200 ج.م</div>
      </Card>
      <Input placeholder="المبلغ" value={amt} onChange={setAmt}/>
      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        {[["25%","1300"],["50%","2600"],["75%","3900"],["الكل","5200"]].map(([l,v]) => (
          <button key={l} onClick={() => setAmt(v)} style={{ flex: 1, padding: 10, borderRadius: 12, border: `1px solid ${T.border}`, background: amt===v?T.brandLight:T.card, fontFamily: AR, fontWeight: 800 }}>{l}</button>
        ))}
      </div>
      <Card style={{ marginBottom: 10 }}><div style={{ fontFamily: AR }}>بنك مصر ****1234</div></Card>
      <PriceSummary rows={[
        { k: "المطلوب", v: `${Number(amt).toLocaleString()} ج.م` },
        { k: "رسوم التحويل", v: "تظهر قبل التأكيد" },
        { k: "المدة المتوقعة", v: "1–3 أيام عمل" },
      ]} total="المبلغ المتوقع استلامه"/>
      <Btn variant="ghost" onClick={() => go("payout-add")}>إضافة وسيلة سحب</Btn>
    </Page>
  )
}

function Plans({ go, teacher }: { go: Go; teacher: boolean }) {
  const [yr, setYr] = useState(false)
  const plans = teacher ? [
    { n: "Teacher Free", f: "فصول محدودة · طلاب محدودون · رصيد AI أساسي", cta: "خطتك الحالية" },
    { n: "Teacher Pro", f: "مساعد متقدم · تحليلات · تقارير", cta: "اشترك الآن", best: true },
    { n: "Teacher Business", f: "سعة أكبر · دعم مميز · إدارة أوسع", cta: "اشترك الآن" },
  ] : [
    { n: "مجانية", f: "انضم لفصول · واجبات · استخدام AI محدود", cta: "خطتك الحالية" },
    { n: "Student Plus", f: "تحليلات أعمق · رصيد AI أعلى · خطط مذاكرة", cta: "اشترك الآن", best: true },
    { n: "Student Premium", f: "رصيد AI أعلى وفق سياسة الاستخدام العادل", cta: "اشترك الآن" },
  ]
  return (
    <Page title={teacher?"خطط المدرسين":"خطط الطالب"} onBack={() => go(teacher?"t-account":"s-account")}>
      <div style={{ display: "flex", background: T.gray, borderRadius: 12, padding: 4, marginBottom: 16 }}>
        <button onClick={() => setYr(false)} style={{ flex: 1, padding: 10, border: "none", borderRadius: 10, background: !yr?"white":"transparent", fontFamily: AR, fontWeight: 800 }}>شهري</button>
        <button onClick={() => setYr(true)} style={{ flex: 1, padding: 10, border: "none", borderRadius: 10, background: yr?"white":"transparent", fontFamily: AR, fontWeight: 800 }}>سنوي · وفّر</button>
      </div>
      {plans.map((p) => (
        <Card key={p.n} style={{ marginBottom: 10, border: p.best ? `1.5px solid ${T.brand}` : undefined }} onClick={() => p.cta!=="خطتك الحالية" && go("checkout")}>
          {p.best && <Chip filled>الأكثر اختياراً</Chip>}
          <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 16, margin: "8px 0 4px" }}>{p.n}</div>
          <div style={{ fontFamily: AR, color: T.sub, fontSize: 13 }}>{p.f}</div>
          <div style={{ fontFamily: AR, fontWeight: 700, color: T.brand, marginTop: 8 }}>{p.cta}</div>
        </Card>
      ))}
      <Btn variant="ghost" onClick={() => go("plan-compare")}>مقارنة الخطط</Btn>
    </Page>
  )
}

function Checkout({ go }: { go: Go }) {
  const [code, setCode] = useState("")
  const [st, setSt] = useState("")
  return (
    <Page title="ملخص الاشتراك" onBack={() => go("s-plans")} footer={<Btn onClick={() => go("sub-ok")}>تأكيد الاشتراك</Btn>}>
      <PriceSummary rows={[
        { k: "الخطة", v: "Student Plus" },
        { k: "الفترة", v: "شهري" },
        { k: "السعر", v: "89 ج.م" },
        { k: "الخصم", v: st==="ok" ? "-15 ج.م" : "—" },
        { k: "الضريبة إن وُجدت", v: "حسب الفاتورة" },
      ]} total={st==="ok"?"74 ج.م":"89 ج.م"}/>
      <div style={{ height: 12 }}/>
      <p style={{ fontFamily: AR, fontWeight: 700 }}>هل لديك كود خصم؟</p>
      <Input placeholder="أدخل كود الخصم" value={code} onChange={setCode}/>
      <Btn variant="ghost" onClick={() => setSt(code.toUpperCase()==="TEAC15"?"ok":"bad")}>تطبيق</Btn>
      {st==="ok" && <p style={{ fontFamily: AR, color: T.emerald }}>تم تطبيق الكوبون</p>}
      <p style={{ fontFamily: AR, fontSize: 13, color: T.muted, marginTop: 12 }}>سيتم تجديد الاشتراك تلقائياً في 19 سبتمبر 2026 ما لم يتم إلغاء التجديد.</p>
    </Page>
  )
}

function BookPay({ go }: { go: Go }) {
  const [pay, setPay] = useState("محفظتي")
  return (
    <Page title="إتمام الحجز" onBack={() => go("book")} footer={<Btn onClick={() => go("book-ok")}>تأكيد الدفع والحجز</Btn>}>
      <PriceSummary rows={[
        { k: "سعر الحصة", v: "180 ج.م" },
        { k: "رسوم المنصة", v: "تُحسب حسب سياسة Teac Teacher" },
        { k: "صافي المدرس (تقديري)", v: "يظهر للمدرس بعد اكتمال الحصة" },
      ]} total="180 ج.م"/>
      <div style={{ height: 12 }}/>
      {["محفظتي","استخدام حصة من الباقة","بطاقة بنكية"].map((x) => <div key={x} style={{ marginBottom: 8 }}><Choice on={pay===x} onClick={() => setPay(x)}>{x}</Choice></div>)}
      <p style={{ fontFamily: AR, fontSize: 12, color: T.muted }}>المبلغ يُحتجز حتى اكتمال الحصة ثم يُسوّى لأرباح المدرس. ولي الأمر قد يُطلب منه الموافقة إن كان الحساب لقاصر.</p>
    </Page>
  )
}

function Bookings({ go, teacher }: { go: Go; teacher: boolean }) {
  const tabs = teacher ? ["اليوم","القادمة","المكتملة","الملغاة"] : ["القادمة","المكتملة","الملغاة"]
  const [tab, setTab] = useState(tabs[0])
  return (
    <Page title={teacher?"حصصي":"حجوزاتي"} onBack={() => go(teacher?"t-home":"s-home")}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{tabs.map((t) => (
        <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 10px", borderRadius: 100, border: "none", background: tab===t?T.brand:T.gray, color: tab===t?"white":T.sub, fontFamily: AR, fontWeight: 700, fontSize: 12 }}>{t}</button>
      ))}</div>
      <Card onClick={() => go("session")}>
        <div style={{ fontFamily: AR, fontWeight: 800 }}>رياضيات مع أ/ محمد حسن <VerifiedBadge small/></div>
        <div style={{ fontFamily: AR, fontSize: 13, color: T.muted }}>السبت 6:00 م · مدفوعة</div>
      </Card>
    </Page>
  )
}

// ─── iPhone 14 frame ──────────────────────────────────────────────────────────
function IPhoneFrame({ children }: { children: ReactNode }) {
  const metal = "#1C1C1E"
  const metalHi = "#3A3A3C"
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.58)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => {
      const r = el.getBoundingClientRect()
      const next = Math.min(r.width / 414, r.height / 868, 0.62)
      setScale(Math.max(0.4, next))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={stageRef} style={{
      width: "100%", height: "100%", minHeight: "100dvh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(165deg, #D5D9F6 0%, #E8E6F8 48%, #CDD3F5 100%)",
      padding: 20, overflow: "hidden", boxSizing: "border-box",
    }}>
      <div style={{ width: 414 * scale, height: 868 * scale, position: "relative", flexShrink: 0 }}>
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 414, height: 868,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}>
          <div style={{
            position: "relative",
            width: 414,
            height: 868,
            background: `linear-gradient(180deg, ${metalHi} 0%, ${metal} 12%, #111113 100%)`,
            borderRadius: 62,
            padding: 12,
            boxShadow: [
              "0 24px 48px rgba(40,48,90,0.22)",
              "0 6px 16px rgba(0,0,0,0.16)",
              "inset 0 1px 0 rgba(255,255,255,0.22)",
            ].join(","),
          }}>
            <div style={{ position: "absolute", inset: 5, borderRadius: 57, border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none" }}/>
            <div style={{ position: "absolute", left: -3, top: 124, width: 4, height: 26, background: metalHi, borderRadius: "3px 0 0 3px" }}/>
            <div style={{ position: "absolute", left: -3, top: 172, width: 4, height: 54, background: metalHi, borderRadius: "3px 0 0 3px" }}/>
            <div style={{ position: "absolute", left: -3, top: 234, width: 4, height: 54, background: metalHi, borderRadius: "3px 0 0 3px" }}/>
            <div style={{ position: "absolute", right: -3, top: 198, width: 4, height: 88, background: metalHi, borderRadius: "0 3px 3px 0" }}/>

            <div style={{
              width: 390,
              height: 844,
              borderRadius: 50,
              overflow: "hidden",
              background: T.card,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
            }}>
              {children}
              <div style={{
                position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
                width: 126, height: 36, background: "#010101", borderRadius: 20, zIndex: 90, pointerEvents: "none",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A2230" }}/>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#12151C" }}/>
              </div>
              <div style={{
                position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)",
                width: 128, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.28)", zIndex: 90, pointerEvents: "none",
              }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [hasTeacher, setHasTeacher] = useState(false)
  const [teacherEmpty, setTeacherEmpty] = useState(true)
  const [role, setRole] = useState<Role | null>(null)
  const [hasKids, setHasKids] = useState(false)
  const [kids] = useState<Kid[]>(DEMO_KIDS)
  const [kidId, setKidId] = useState("ahmed")
  const [verified, setVerified] = useState(false)
  const [dueOrders, setDueOrders] = useState<DueOrder[]>([
    { id: "#8246", time: "18:00", value: "180", fee: "حسب السياسة", vat: "—", due: "153", sub: "رياضيات · أحمد علي" },
    { id: "#8241", time: "16:30", value: "180", fee: "حسب السياسة", vat: "—", due: "153", sub: "رياضيات · سارة محمود" },
    { id: "#8238", time: "20:00", value: "180", fee: "حسب السياسة", vat: "—", due: "153", sub: "رياضيات · يوسف كمال" },
  ])
  const [settlements, setSettlements] = useState<Settlement[]>([
    {
      id: "ST-188",
      status: "done",
      sentAt: "12 أغسطس · 11:20",
      doneAt: "تم التحويل 12 أغسطس",
      orders: [
        { id: "#8210", time: "17:00", value: "180", fee: "حسب السياسة", vat: "—", due: "153", sub: "رياضيات · ليلى حسن" },
        { id: "#8204", time: "15:30", value: "160", fee: "حسب السياسة", vat: "—", due: "136", sub: "فيزياء · سارة محمود" },
      ],
    },
  ])
  const go: Go = (s) => setScreen(s)
  const requestSettlement = () => {
    if (!dueOrders.length) return
    const n = 200 + settlements.length
    setSettlements((prev) => [{
      id: `ST-${n}`,
      status: "pending",
      sentAt: "الآن · أُرسل للإدارة",
      orders: dueOrders,
    }, ...prev])
    setDueOrders([])
  }
  const approvePending = () => {
    setSettlements((prev) => prev.map((s) => s.status === "pending"
      ? { ...s, status: "done" as const, doneAt: "تم التحويل اليوم" }
      : s))
  }

  return (
    <IPhoneFrame>
      <div style={{
        flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
        overflow: "hidden", fontFamily: AR, background: T.card,
      }}>
        {screen === "splash" && <Splash go={() => go("onboard")}/>}
        {screen === "onboard" && <Onboard go={() => go("login")} goLogin={() => go("login")}/>}
        {screen === "login" && <Login go={() => go("role")} onForgot={() => go("forgot")}/>}
        {screen === "forgot" && <Forgot go={go}/>}
        {screen === "role" && <RoleSelect goStudent={() => { setRole("s"); go("s-setup") }} goTeacher={() => { setRole("t"); go("t-setup") }} goParent={() => { setRole("p"); go("p-setup") }}/>}
        {screen === "s-setup" && <StudentSetup go={go}/>}
        {screen === "t-setup" && <TeacherSetup go={go}/>}
        {screen === "s-start" && <StudentStart go={go}/>}
        {screen === "s-home" && <StudentHome go={go} hasTeacher={hasTeacher}/>}
        {screen === "t-home" && <TeacherHome go={go} empty={teacherEmpty} verified={verified}/>}
        {screen === "create-class" && <CreateClass go={go} onCreated={() => setTeacherEmpty(false)}/>}
        {screen === "join" && <JoinClass go={go} onJoin={() => setHasTeacher(true)}/>}
        {screen === "join-ok" && (
          <div dir="rtl" style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
            <StatusBar/>
            <SuccessBlock title="تم انضمامك للفصل بنجاح 🎉" cta="اذهب للفصل" onCta={() => { setHasTeacher(true); go("s-home") }}/>
          </div>
        )}
        {screen === "find" && <FindTeacher go={go}/>}
        {screen === "t-view" && <TeacherView go={go}/>}
        {screen === "book" && <Booking go={go}/>}
        {screen === "book-ok" && (
          <Page title="تم الحجز" onBack={() => go("s-home")} footer={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn onClick={() => go("chat")}>مراسلة المدرس</Btn>
              <Btn variant="secondary" onClick={() => go("s-home")}>العودة للرئيسية</Btn>
            </div>
          }>
            <SuccessBlock title="تم حجز الحصة بنجاح 🎉" sub="السبت 6:00 م · أ/ محمد أحمد" cta="مراسلة المدرس" onCta={() => go("chat")}/>
          </Page>
        )}
        {screen === "learn" && <Learn go={go}/>}
        {screen === "subject" && <Subject go={go}/>}
        {screen === "lesson" && <Lesson go={go}/>}
        {screen === "quiz" && <Quiz go={go}/>}
        {screen === "quiz-ok" && <QuizOk go={go}/>}
        {screen === "ai-chat" && <AIChat onBack={() => go("s-home")} onLimit={() => go("ai-limit")}/>}
        {screen === "t-ai" && <TeacherAI go={go}/>}
        {screen === "tasks" && <Tasks go={go}/>}
        {screen === "hw" && <Homework go={go}/>}
        {screen === "s-account" && <Account go={go} role="s"/>}
        {screen === "t-account" && <Account go={go} role="t" verified={verified}/>}
        {screen === "notifs" && <Notifs go={go} back={role === "t" ? "t-home" : role === "p" ? "p-home" : "s-home"}/>}
        {screen === "class-code" && <ClassCode go={go}/>}
        {screen === "class" && <ClassDetails go={go}/>}
        {screen === "class-students" && <ClassStudents go={go}/>}
        {screen === "s-360" && <StudentProfile onBack={() => go("t-home")}/>}
        <ExtraFlow screen={screen} go={go} ctx={{
          verified, setVerified, role, dueOrders, settlements, requestSettlement, approvePending,
          kids, kidId, setKidId, hasKids, setHasKids,
        }}/>
      </div>
    </IPhoneFrame>
  )
}
  