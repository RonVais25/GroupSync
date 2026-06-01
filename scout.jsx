// scout.jsx — Scout AI agent UI patterns + shared UI primitives
// Loaded as global helpers

function Icon({ name, size = 18, color, style = {}, strokeWidth = 1.8 }) {
  // wraps lucide-icons via data attribute + dynamic creation
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ icons: window.lucide.icons, attrs: { width: size, height: size, 'stroke-width': strokeWidth } });
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{ display: 'inline-flex', color: color || 'currentColor', ...style }} />;
}

// Animated counter that ticks down "time left" in minutes
function CountdownChip({ minutes, color = 'red' }) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const txt = h > 0 ? `${h}ש ${m}ד` : `${m}ד`;
  return (
    <span className={`chip dot ${color}`}>
      <Icon name="clock" size={11} />
      {txt}
    </span>
  );
}

// Scout inline card — the canonical "Scout suggests…" surface
function ScoutCard({ title, suggestion, why, actions, children, anatomyRefs }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  return (
    <div className="scout-card" data-anatomy={anatomyRefs ? 'card' : undefined}>
      <div className="scout-header">
        <span className="scout-badge">
          <Icon name="sparkles" size={11} />
          Scout
        </span>
        {title && <span style={{ fontSize: 13, color: 'var(--scout-ink)', fontWeight: 600 }}>{title}</span>}
      </div>
      <div data-anatomy={anatomyRefs ? 'suggestion' : undefined} style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>
        {suggestion}
      </div>
      {children}
      {why && (
        <>
          <span
            className="scout-why"
            data-anatomy={anatomyRefs ? 'why' : undefined}
            onClick={() => setWhyOpen(o => !o)}
          >
            <Icon name={whyOpen ? 'chevron-up' : 'chevron-down'} size={14} />
            למה?
          </span>
          {whyOpen && <div className="scout-why-body">{why}</div>}
        </>
      )}
      {actions && (
        <div data-anatomy={anatomyRefs ? 'actions' : undefined} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// Scout notification banner at top of screen
function ScoutBanner({ title, body, onDismiss, onAction, actionLabel = 'פתח' }) {
  return (
    <div className="notif-banner">
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'var(--scout)', color: 'white',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Icon name="sparkles" size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--scout-ink)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-soft)', marginTop: 2, lineHeight: 1.45 }}>{body}</div>
      </div>
      {onAction && (
        <button className="btn sm scout" onClick={onAction}>{actionLabel}</button>
      )}
      {onDismiss && (
        <span onClick={onDismiss} style={{ cursor: 'pointer', color: 'var(--text-mute)', padding: 2 }}>
          <Icon name="x" size={16} />
        </span>
      )}
    </div>
  );
}

// Bottom sheet
function Sheet({ open, onClose, title, subtitle, children, footer, height }) {
  const [render, setRender] = React.useState(open);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setRender(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else if (render) {
      setVisible(false);
      const t = setTimeout(() => setRender(false), 360);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!render) return null;
  return (
    <>
      <div className={`sheet-backdrop ${visible ? 'open' : ''}`} onClick={onClose} />
      <div className={`sheet ${visible ? 'open' : ''}`} style={height ? { maxHeight: height } : {}}>
        <div className="sheet-grab" />
        {(title || subtitle) && (
          <div className="sheet-head">
            {title && <div className="sheet-title">{title}</div>}
            {subtitle && <div className="sheet-sub">{subtitle}</div>}
          </div>
        )}
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-cta">{footer}</div>}
      </div>
    </>
  );
}

// App bar
function AppBar({ title, subtitle, leading, trailing, compact }) {
  return (
    <div className={`appbar ${compact ? 'compact' : ''}`}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {leading}
        <div>
          <div className="appbar-title">{title}</div>
          {subtitle && <div className="appbar-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="appbar-actions">{trailing}</div>
    </div>
  );
}

// Avatar with initials, status dot
function Avatar({ name, color, size = 'md', status }) {
  const initial = name ? name.charAt(0) : '?';
  const bg = color || 'var(--chip)';
  return (
    <span className={`avatar ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''}`}
      style={{ background: bg, color: color ? 'white' : 'var(--text)' }}>
      {initial}
      {status && (
        <span style={{
          position: 'absolute', bottom: -1, left: -1,
          width: 10, height: 10, borderRadius: '50%',
          background: status === 'away' ? 'var(--yellow)' : status === 'online' ? 'var(--green)' : 'var(--text-mute)',
          border: '2px solid var(--bg)',
        }} />
      )}
    </span>
  );
}

// Bottom navigation tabs
function BottomNav({ items, current, onChange }) {
  return (
    <div className="bottom-nav">
      {items.map(it => (
        <div
          key={it.key}
          className={`nav-item ${current === it.key ? 'active' : ''}`}
          onClick={() => onChange(it.key)}
        >
          <Icon name={it.icon} size={22} strokeWidth={current === it.key ? 2.2 : 1.7} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ───────── Shared tab bar ─────────
// One identical bar for both roles — the "continuity" of the app.
const APP_TABS = [
  { key: 'home', icon: 'home', label: 'בית' },
  { key: 'tasks', icon: 'list-checks', label: 'משימות' },
  { key: 'diary', icon: 'calendar', label: 'יומן' },
  { key: 'profile', icon: 'user', label: 'פרופיל' },
];

// Maps any screen (deep or root, either role) to the tab that should stay lit.
function screenToTab(screen) {
  switch (screen) {
    case 'tasks':
    case 'taskDetail': return 'tasks';
    case 'diary':
    case 'calendar':
    case 'confirmation': return 'diary';
    case 'profile': return 'profile';
    default: return 'home'; // dashboard, case, tracking, lockscreen
  }
}

// Role-aware shared bottom bar: reads the current screen, dispatches NAV_TAB.
function AppTabBar({ state, dispatch }) {
  const current = state.role === 'leader' ? state.leaderScreen : state.studentScreen;
  return (
    <BottomNav
      items={APP_TABS}
      current={screenToTab(current)}
      onChange={tab => dispatch({ type: 'NAV_TAB', tab })}
    />
  );
}

// Toast
function Toast({ msg, icon = 'check' }) {
  if (!msg) return null;
  return (
    <div className="toast">
      <Icon name={icon} size={16} />
      <span>{msg}</span>
    </div>
  );
}

// Tone-suggestion message preview, used in leader L5/L7 to allow rewriting
const TONES = [
  { id: 'friendly', label: 'חברי' },
  { id: 'neutral', label: 'נייטרלי' },
  { id: 'formal', label: 'פורמלי' },
  { id: 'urgent', label: 'דחוף' },
];

function ToneSeg({ value, onChange }) {
  return (
    <div className="seg">
      {TONES.map(t => (
        <div
          key={t.id}
          className={`seg-opt ${value === t.id ? 'on' : ''}`}
          onClick={() => onChange(t.id)}
        >{t.label}</div>
      ))}
    </div>
  );
}

// Number stepper
function Stepper({ value, onChange, min = 1, max = 20, suffix }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 0.5))} aria-label="פחות">−</button>
      <span className="stepper-val">{value}{suffix && ` ${suffix}`}</span>
      <button onClick={() => onChange(Math.min(max, value + 0.5))} aria-label="יותר">+</button>
    </div>
  );
}

Object.assign(window, {
  Icon, ScoutCard, ScoutBanner, Sheet, AppBar, Avatar, BottomNav, Toast,
  CountdownChip, ToneSeg, Stepper, TONES,
  APP_TABS, screenToTab, AppTabBar,
});
