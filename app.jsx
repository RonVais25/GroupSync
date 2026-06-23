// app.jsx — main GroupSync state machine + root component

// ───────── seed data ─────────
const SEED_PROJECT = {
  title: 'אפליקציית הזמנת אוכל לאוניברסיטה',
  deadline: '4.6',
  progress: 64,
  members: [
    { name: 'נועה', color: 'oklch(0.62 0.10 235)' },
    { name: 'דניאל', color: 'oklch(0.60 0.13 30)' },
    { name: 'שירה', color: 'oklch(0.62 0.12 160)' },
    { name: 'יואב', color: 'oklch(0.60 0.12 100)' },
    { name: 'תום', color: 'oklch(0.62 0.10 305)' },
  ],
};

const SEED_TASKS = [
  { id: 't1', title: 'עיצוב מסך הלוגין', assignee: 'דניאל', color: 'oklch(0.60 0.13 30)', due: 'עוד 48 שעות', flag: 'red', flagLabel: 'באיחור' },
  { id: 't2', title: 'סכמת DB — הזמנות', assignee: 'שירה', color: 'oklch(0.62 0.12 160)', due: 'עוד 4 ימים', flag: 'yellow', flagLabel: 'בעבודה' },
  { id: 't3', title: 'דף הבית + רכיב Hero', assignee: 'תום', color: 'oklch(0.62 0.10 305)', due: 'הושלם', flag: 'green', flagLabel: 'הושלם' },
  { id: 't4', title: 'מסך תפריט והוספה לסל', assignee: 'יואב', color: 'oklch(0.60 0.12 100)', due: 'עוד 6 ימים', flag: 'green', flagLabel: 'בזמן' },
];

const SEED_ACTIVITY = [
  { who: 'שירה', what: 'עדכנה את "סכמת DB" ל-60%', when: 'לפני 2 שעות', color: 'oklch(0.62 0.12 160)' },
  { who: 'תום', what: 'סיים את "Hero" וצירף תמונה', when: 'אתמול, 22:14', color: 'oklch(0.62 0.10 305)' },
  { who: 'יואב', what: 'הוסיף הערה על "מסך תפריט"', when: 'אתמול, 19:02', color: 'oklch(0.60 0.12 100)' },
];

const SEED_STUDENT_TASKS = [
  { id: 'st0', title: 'אינטגרציית API לתשלום', meta: 'מ-נועה · דדליין 1.6', icon: 'credit-card', iconBg: 'var(--scout-soft)', iconColor: 'var(--scout-ink)', isNew: true },
  { id: 'st1', title: 'מסך תפריט והוספה לסל', meta: 'בתהליך · 40%', icon: 'shopping-cart', iconBg: 'oklch(0.94 0.04 100)', iconColor: 'oklch(0.50 0.12 100)', progress: 40 },
  { id: 'st2', title: 'בדיקות מסך לוגין (peer review)', meta: 'מחכה לדניאל', icon: 'eye', iconBg: 'var(--chip)', iconColor: 'var(--text-soft)' },
  { id: 'st3', title: 'תיעוד API קיים', meta: 'הושלם · אתמול', icon: 'check', iconBg: 'var(--green-soft)', iconColor: 'var(--green)' },
];

// ───────── reducer ─────────
const initialState = {
  role: 'leader',
  theme: 'light',
  // leader nav
  leaderScreen: 'dashboard',
  leaderTab: 'home',
  sheet: null,
  intervention: 'reminder',
  // leader interaction state
  project: SEED_PROJECT,
  tasks: SEED_TASKS,
  activity: SEED_ACTIVITY,
  danielStatus: 'pending', // pending | sent | read | responded
  events: {},

  // student nav
  studentScreen: 'dashboard',
  studentTab: 'home',
  sheetS: null,
  // student data
  studentTasks: SEED_STUDENT_TASKS,
  estimate: { lo: 4, hi: 6 },
  calendarBlocks: [
    { id: 'b1', day: 1, hour: 9, len: 2, confirmed: false },
    { id: 'b2', day: 3, hour: 10, len: 2, confirmed: false },
    { id: 'b3', day: 4, hour: 9, len: 2, confirmed: false },
  ],

  // shared
  toast: '',
  autoReply: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE': return { ...state, role: action.role };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME': return { ...state, theme: action.theme };

    case 'GO': return { ...state, leaderScreen: action.target };
    case 'SET_TAB':
      return action.role === 'leader'
        ? { ...state, leaderTab: action.tab }
        : { ...state, studentTab: action.tab };
    case 'NAV_TAB': {
      // Shared tab bar → route to the tab's root screen for the active role.
      const screen = action.tab === 'home' ? 'dashboard' : action.tab;
      return state.role === 'leader'
        ? { ...state, leaderScreen: screen, leaderTab: action.tab }
        : { ...state, studentScreen: screen, studentTab: action.tab };
    }
    case 'OPEN_SHEET': return { ...state, sheet: action.sheet };
    case 'CLOSE_SHEET': return { ...state, sheet: null };
    case 'SET_INTERVENTION': return { ...state, intervention: action.intervention };

    case 'SEND_MESSAGE':
      return {
        ...state,
        danielStatus: 'sent',
        events: { ...state.events, sent: '14:25', body: action.body, tone: action.tone },
      };
    case 'DANIEL_READ':
      return state.danielStatus === 'sent'
        ? { ...state, danielStatus: 'read', events: { ...state.events, read: '14:26' } }
        : state;
    case 'DANIEL_REPLIED':
      return state.danielStatus === 'read'
        ? {
          ...state,
          danielStatus: 'responded',
          events: { ...state.events, responded: '14:33', responseTime: '8 דקות' },
          tasks: state.tasks.map(t => t.assignee === 'דניאל'
            ? { ...t, flag: 'green', flagLabel: 'עודכן · 65%' }
            : t),
          toast: 'דניאל ענה ועדכן את המשימה',
        }
        : state;
    case 'SET_AUTO_REPLY': return { ...state, autoReply: action.autoReply };
    case 'RESET_DANIEL':
      return { ...state, danielStatus: 'pending', events: {}, tasks: SEED_TASKS };
    case 'ESCALATE':
      return {
        ...state,
        events: { ...state.events, escalation: { kind: action.kind, label: action.label, at: '14:48' } },
        // Marking "at risk" is the one group-visible step — reflect it on Daniel's task flag.
        tasks: action.kind === 'risk'
          ? state.tasks.map(t => t.assignee === 'דניאל' ? { ...t, flag: 'red', flagLabel: 'בסיכון · גלוי' } : t)
          : state.tasks,
        toast: 'האסקלציה בוצעה · Scout עדכן את המעקב',
      };

    case 'GO_S': return { ...state, studentScreen: action.target };
    case 'REJECT_TASK':
      // Decline the newly received task: mark it rejected, notify the leader (demo),
      // close the sheet and return to the dashboard.
      return {
        ...state,
        studentTasks: state.studentTasks.map(t => t.isNew
          ? { ...t, isNew: false, meta: 'נדחתה · נשלחה הודעה לנועה', icon: 'x', iconBg: 'var(--red-soft)', iconColor: 'var(--red)' }
          : t),
        sheetS: null,
        studentScreen: 'dashboard',
        studentTab: 'home',
        toast: 'נשלחה הודעה לנועה · המשימה נדחתה',
      };
    case 'OPEN_SHEET_S': return { ...state, sheetS: action.sheet };
    case 'CLOSE_SHEET_S': return { ...state, sheetS: null };
    case 'SET_ESTIMATE': return { ...state, estimate: { lo: action.lo, hi: action.hi, note: action.note } };
    case 'SET_CALENDAR_BLOCKS': return { ...state, calendarBlocks: action.blocks };

    case 'TOAST': return { ...state, toast: action.msg };
    case 'CLEAR_TOAST': return { ...state, toast: '' };

    case 'JUMP':
      return { ...state, role: action.role, ...(action.role === 'leader'
        ? { leaderScreen: action.target, sheet: action.sheet || null }
        : { studentScreen: action.target, sheetS: action.sheet || null }) };

    default: return state;
  }
}

// ───────── Root App ─────────
function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Theme attribute on body
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Daniel auto-reply timer
  React.useEffect(() => {
    if (!state.autoReply) return;
    let t1, t2;
    if (state.danielStatus === 'sent') {
      t1 = setTimeout(() => dispatch({ type: 'DANIEL_READ' }), 2800);
    }
    if (state.danielStatus === 'read') {
      t2 = setTimeout(() => dispatch({ type: 'DANIEL_REPLIED' }), 3500);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [state.danielStatus, state.autoReply]);

  // Toast auto-dismiss
  React.useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2400);
    return () => clearTimeout(t);
  }, [state.toast]);

  // Tweaks panel host
  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const standalone = typeof window !== 'undefined' && window.parent === window;
  const [tweaksOpen, setTweaksOpen] = React.useState(standalone);

  // Determine which leader screen to render
  const renderLeader = () => {
    switch (state.leaderScreen) {
      case 'lockscreen':
        return <LeaderLockScreen onOpen={() => dispatch({ type: 'JUMP', role: 'leader', target: 'case' })} dark />;
      case 'dashboard':
        return <LeaderDashboard state={state} dispatch={dispatch} />;
      case 'case':
        return <LeaderCaseView state={state} dispatch={dispatch} />;
      case 'tracking':
        return <LeaderTracking state={state} dispatch={dispatch} />;
      case 'tasks':
        return <TasksScreen state={state} dispatch={dispatch} role="leader" />;
      case 'diary':
        return <DiaryScreen state={state} dispatch={dispatch} role="leader" />;
      case 'profile':
        return <ProfileScreen state={state} dispatch={dispatch} role="leader" />;
      default:
        return <LeaderDashboard state={state} dispatch={dispatch} />;
    }
  };

  const renderStudent = () => {
    switch (state.studentScreen) {
      case 'dashboard':
        return <StudentDashboard state={state} dispatch={dispatch} />;
      case 'taskDetail':
        return <StudentTaskDetail state={state} dispatch={dispatch} />;
      case 'calendar':
        return <StudentCalendar state={state} dispatch={dispatch} />;
      case 'confirmation':
        return <StudentConfirmation state={state} dispatch={dispatch} />;
      case 'tasks':
        return <TasksScreen state={state} dispatch={dispatch} role="student" />;
      case 'diary':
        return <DiaryScreen state={state} dispatch={dispatch} role="student" />;
      case 'profile':
        return <ProfileScreen state={state} dispatch={dispatch} role="student" />;
      default:
        return <StudentDashboard state={state} dispatch={dispatch} />;
    }
  };

  // Screen transition wrapper
  const screenKey = state.role === 'leader' ? state.leaderScreen : state.studentScreen;

  return (
    <div className="stage">
      <IOSDevice
        width={402}
        height={874}
        dark={state.theme === 'dark' || state.leaderScreen === 'lockscreen' && state.role === 'leader'}
      >
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <ScreenWrap key={state.role + '/' + screenKey}>
            {state.role === 'leader' ? renderLeader() : renderStudent()}
          </ScreenWrap>

          {/* Persistent app tab bar — lives in the shell (outside ScreenWrap) so it
              stays fixed while the screen content transitions. Visible on every screen
              except the iOS lock screen (which is pre-app). */}
          {screenKey !== 'lockscreen' && <AppTabBar state={state} dispatch={dispatch} />}

          {/* Leader sheets */}
          {state.role === 'leader' && (
            <>
              <InterventionSheet state={state} dispatch={dispatch} />
              <ComposeSheet state={state} dispatch={dispatch} />
              <EscalationSheet state={state} dispatch={dispatch} />
            </>
          )}

          {/* Student sheets */}
          {state.role === 'student' && (
            <>
              <EffortSheet state={state} dispatch={dispatch} />
              <AskScoutSheet state={state} dispatch={dispatch} />
              <RemindersSheet state={state} dispatch={dispatch} />
              <RejectTaskSheet state={state} dispatch={dispatch} />
            </>
          )}

          {/* Toast */}
          {state.toast && <Toast msg={state.toast} />}
        </div>
      </IOSDevice>

      {/* Tweaks panel */}
      {tweaksOpen && <GroupSyncTweaks state={state} dispatch={dispatch} onClose={() => {
        setTweaksOpen(false);
        window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
      }} />}

      {/* Reopen button (standalone only — Claude's design site controls the panel via postMessage when embedded) */}
      {!tweaksOpen && standalone && (
        <button
          onClick={() => setTweaksOpen(true)}
          style={{
            position: 'fixed', bottom: 70, right: 16, zIndex: 100,
            padding: '8px 14px', borderRadius: 999,
            background: 'var(--card)', border: '1px solid var(--hair)',
            boxShadow: 'var(--shadow-3)', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, color: 'var(--ink)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Icon name="layout-panel-left" size={14} />
          מסכים · Demo
        </button>
      )}
    </div>
  );
}

// ───────── Smooth screen transition wrapper ─────────
function ScreenWrap({ children }) {
  const [phase, setPhase] = React.useState('enter');
  React.useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')));
  }, []);
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        transform: phase === 'enter' ? 'translateX(-24px)' : 'translateX(0)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'transform .32s cubic-bezier(.2,.7,.2,1), opacity .25s',
      }}
    >
      {children}
    </div>
  );
}

// ───────── Demo / Tweaks side panel ─────────
// Consolidates the role switch, the screen-flow navigator, and dev toggles into one
// side panel so the phone itself stays clean. Real users switch role via the in-app
// Profile tab; this panel is a convenience for the team while presenting/testing.
function GroupSyncTweaks({ state, dispatch, onClose }) {
  const ROLES = [
    { id: 'leader', label: 'נועה', icon: 'crown' },
    { id: 'student', label: 'יואב', icon: 'user' },
  ];
  const FLOWS = {
    leader: [
      { id: 'lockscreen', label: 'L1 · Push' },
      { id: 'dashboard', label: 'L2 · דאשבורד' },
      { id: 'case', label: 'L3 · Case' },
      { id: 'tracking', label: 'L6 · מעקב' },
      { id: 'tasks', label: 'משימות' },
      { id: 'diary', label: 'יומן' },
      { id: 'profile', label: 'פרופיל' },
    ],
    student: [
      { id: 'dashboard', label: 'S1 · דאשבורד' },
      { id: 'taskDetail', label: 'S2 · משימה' },
      { id: 'calendar', label: 'S4 · תכנון' },
      { id: 'confirmation', label: 'S6 · אישור' },
      { id: 'tasks', label: 'משימות' },
      { id: 'diary', label: 'יומן' },
      { id: 'profile', label: 'פרופיל' },
    ],
  };

  const flowBtn = (role, s) => {
    const cur = role === 'leader' ? state.leaderScreen : state.studentScreen;
    const active = state.role === role && cur === s.id;
    return (
      <button key={role + s.id}
        onClick={() => dispatch({ type: 'JUMP', role, target: s.id })}
        style={{
          padding: '5px 9px', borderRadius: 8, border: 'none',
          background: active ? 'var(--primary)' : 'var(--chip)',
          color: active ? 'white' : 'var(--text-soft)',
          fontWeight: 600, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
        }}>{s.label}</button>
    );
  };

  return (
    <div style={{
      position: 'fixed', bottom: 70, right: 16, width: 300, maxHeight: '82vh',
      display: 'flex', flexDirection: 'column',
      background: 'var(--card)', borderRadius: 16, boxShadow: 'var(--shadow-3)',
      border: '1px solid var(--hair)', zIndex: 100,
    }}>
      <div className="space-between" style={{ padding: '12px 14px 8px' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>מסכים · Demo</div>
        <span className="icon-btn ghost" onClick={onClose}><Icon name="x" size={16} /></span>
      </div>

      <div className="col" style={{ gap: 14, padding: '0 14px 14px', overflowY: 'auto' }}>
        {/* Role switch */}
        <div>
          <div className="tiny muted" style={{ fontWeight: 600, marginBottom: 6 }}>תצוגה</div>
          <div className="row" style={{ gap: 6 }}>
            {ROLES.map(r => (
              <button key={r.id} className="row"
                onClick={() => dispatch({ type: 'JUMP', role: r.id, target: 'dashboard' })}
                style={{
                  flex: 1, justifyContent: 'center', padding: '8px 10px', borderRadius: 10,
                  border: '1px solid ' + (state.role === r.id ? 'transparent' : 'var(--hair)'),
                  background: state.role === r.id ? 'var(--primary)' : 'transparent',
                  color: state.role === r.id ? 'white' : 'var(--text-soft)',
                  fontWeight: 600, fontSize: 12.5, gap: 6, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <Icon name={r.icon} size={14} />{r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Screen-flow navigator */}
        <div>
          <div className="tiny muted" style={{ fontWeight: 600, marginBottom: 6 }}>מסכים · Flows</div>
          <div className="tiny muted" style={{ marginBottom: 4 }}>ראש קבוצה (נועה)</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 5 }}>
            {FLOWS.leader.map(s => flowBtn('leader', s))}
          </div>
          <div className="tiny muted" style={{ margin: '8px 0 4px' }}>סטודנט (יואב)</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 5 }}>
            {FLOWS.student.map(s => flowBtn('student', s))}
          </div>
        </div>

        <div className="divider" style={{ margin: 0 }} />

        {/* Dev toggles */}
        <div className="space-between">
          <div className="small">מצב כהה</div>
          <div className={`switch ${state.theme === 'dark' ? 'on' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })} />
        </div>
        <div className="space-between">
          <div>
            <div className="small">דניאל מגיב אוטומטית</div>
            <div className="tiny muted">כבה כדי לבחון אסקלציה</div>
          </div>
          <div className={`switch ${state.autoReply ? 'on' : ''}`}
            onClick={() => dispatch({ type: 'SET_AUTO_REPLY', autoReply: !state.autoReply })} />
        </div>
        <div className="divider" style={{ margin: 0 }} />
        <div className="small" style={{ fontWeight: 600 }}>פעולות בדיקה</div>

        <button className="btn sm subtle" onClick={() => dispatch({ type: 'RESET_DANIEL' })}>
          <Icon name="rotate-ccw" size={13} />
          איפוס סטטוס דניאל
        </button>

        <button className="btn sm subtle" onClick={() => {
          dispatch({ type: 'JUMP', role: 'leader', target: 'tracking', sheet: 'escalation' });
          dispatch({ type: 'SET_AUTO_REPLY', autoReply: false });
          dispatch({ type: 'SEND_MESSAGE', body: '', tone: 'friendly' });
          setTimeout(() => dispatch({ type: 'DANIEL_READ' }), 50);
        }}>
          <Icon name="alert-triangle" size={13} />
          הצג מצב אסקלציה (L7)
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { App, reducer, initialState });
