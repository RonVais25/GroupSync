// screens.jsx — shared tab destinations (Tasks · Diary · Profile)
// Each screen is role-aware via a `role` prop. Same shell for Noa & Yoav,
// role-specific content inside. Reuses primitives from scout.jsx.

const WEEK_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const WEEK_DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

// ───────── Shared weekly grid ─────────
// events: [{ day:0-6, hour, len, label, kind:'existing'|'scout'|'deadline' }]
function WeekGrid({ events = [] }) {
  return (
    <div className="cal-grid">
      <div className="cal-cell header"> </div>
      {WEEK_DAYS.map((d, i) => (
        <div key={d} className="cal-cell header">
          {d}<br />
          <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-mute)' }}>
            {26 + i > 31 ? (26 + i - 31) : 26 + i}
          </span>
        </div>
      ))}
      {WEEK_HOURS.map(h => (
        <React.Fragment key={h}>
          <div className="cal-cell hour" style={{ minHeight: 38 }}>{h}:00</div>
          {WEEK_DAYS.map((d, di) => {
            const ev = events.find(e => e.day === di && e.hour === h);
            return (
              <div key={di} className="cal-cell" style={{ minHeight: 38 }}>
                {ev && (
                  <div
                    className={`cal-block ${ev.kind === 'scout' ? 'scout confirmed' : ev.kind === 'deadline' ? 'conflict' : 'existing'}`}
                    style={{ height: 38 * ev.len - 4, cursor: 'default' }}
                  >
                    {ev.kind === 'deadline' ? '⚑ ' : ''}{ev.label}
                  </div>
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

// ───────── Tasks tab ─────────
function TasksScreen({ state, dispatch, role }) {
  return role === 'leader'
    ? <LeaderTasks state={state} dispatch={dispatch} />
    : <StudentTasks state={state} dispatch={dispatch} />;
}

function LeaderTasks({ state, dispatch }) {
  // Daniel's flag is dynamic (mirrors the dashboard logic)
  const ds = state.danielStatus;
  const danielFlag = ds === 'pending' ? 'red' : (ds === 'sent' || ds === 'read') ? 'yellow' : 'green';
  const danielLabel = ds === 'pending' ? 'באיחור' : ds === 'sent' ? 'תזכורת נשלחה' : ds === 'read' ? 'נקראה' : 'עודכן';

  const tasks = state.tasks.map(t => {
    const isDaniel = t.assignee === 'דניאל';
    return { ...t, isDaniel, flag: isDaniel ? danielFlag : t.flag, flagLabel: isDaniel ? danielLabel : t.flagLabel };
  });

  const groups = [
    { flag: 'red', title: 'דורש פעולה', chip: 'red' },
    { flag: 'yellow', title: 'בעבודה', chip: 'yellow' },
    { flag: 'green', title: 'בזמן / הושלם', chip: 'green' },
  ];

  return (
    <div className="screen">
      <AppBar
        title="משימות הצוות"
        subtitle={`${state.tasks.length} משימות · ${tasks.filter(t => t.flag === 'red').length} דורשות פעולה`}
        trailing={<Avatar name="נ" color="oklch(0.65 0.10 235)" />}
      />
      <div className="screen-scroll">
        {groups.map(g => {
          const rows = tasks.filter(t => t.flag === g.flag);
          if (!rows.length) return null;
          return (
            <React.Fragment key={g.flag}>
              <div className="section-h">
                <span>{g.title}</span>
                <span className={`chip ${g.chip} dot`}>{rows.length}</span>
              </div>
              <div className="stack">
                {rows.map(t => (
                  <div
                    key={t.id}
                    className={`task-row ${t.flag === 'red' ? 'flagged' : ''}`}
                    onClick={() => t.isDaniel && dispatch({ type: 'GO', target: 'case' })}
                  >
                    <Avatar name={t.assignee} color={t.color} size="sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="task-title">{t.title}</div>
                      <div className="task-meta">{t.assignee} · {t.due}</div>
                    </div>
                    <span className={`chip ${t.flag} dot`}>{t.flagLabel}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <AppTabBar state={state} dispatch={dispatch} />
    </div>
  );
}

function StudentTasks({ state, dispatch }) {
  return (
    <div className="screen">
      <AppBar
        title="המשימות שלי"
        subtitle={`${state.studentTasks.length} פעילות · ${state.studentTasks.filter(t => t.isNew).length} חדשה`}
        trailing={<Avatar name="י" color="oklch(0.60 0.12 160)" />}
      />
      <div className="screen-scroll">
        <div className="stack" style={{ paddingTop: 6 }}>
          {state.studentTasks.map(t => (
            <div
              key={t.id}
              className={`task-row ${t.isNew ? 'new' : ''}`}
              onClick={() => t.isNew && dispatch({ type: 'GO_S', target: 'taskDetail' })}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: t.iconBg, color: t.iconColor,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name={t.icon} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ gap: 6 }}>
                  <div className="task-title">{t.title}</div>
                  {t.isNew && <span className="new-badge">חדש</span>}
                </div>
                <div className="task-meta">{t.meta}</div>
                {t.progress != null && (
                  <div className="bar" style={{ marginTop: 6 }}>
                    <div className="bar-fill" style={{ width: t.progress + '%' }} />
                  </div>
                )}
              </div>
              <Icon name="chevron-left" size={18} color="var(--text-mute)" />
            </div>
          ))}
        </div>
      </div>
      <AppTabBar state={state} dispatch={dispatch} />
    </div>
  );
}

// ───────── Diary tab ─────────
function DiaryScreen({ state, dispatch, role }) {
  const isLeader = role === 'leader';

  // Personal/team events on the week grid
  const events = isLeader
    ? [
      { day: 1, hour: 10, len: 1, label: 'סטנדאפ', kind: 'existing' },
      { day: 2, hour: 14, len: 1.5, label: 'סקירת עיצוב', kind: 'existing' },
      { day: 4, hour: 16, len: 2, label: 'פגישת קבוצה', kind: 'existing' },
      { day: 0, hour: 9, len: 2, label: 'דדליין: לוגין', kind: 'deadline' },
    ]
    : [
      { day: 0, hour: 11, len: 2, label: 'מערכות מידע', kind: 'existing' },
      { day: 1, hour: 15, len: 1.5, label: 'אימון', kind: 'existing' },
      { day: 3, hour: 9, len: 2, label: 'הרצאה', kind: 'existing' },
      { day: 4, hour: 16, len: 2, label: 'פגישת קבוצה', kind: 'existing' },
      ...state.calendarBlocks.map(b => ({ day: b.day, hour: b.hour, len: b.len, label: 'תשלום', kind: 'scout' })),
    ];

  // Agenda list of upcoming deadlines
  const agenda = isLeader
    ? state.tasks.map(t => ({ title: t.title, who: t.assignee, when: t.due, color: t.color }))
    : state.studentTasks
      .filter(t => t.meta)
      .map(t => ({ title: t.title, who: 'אתה', when: t.meta, color: 'oklch(0.60 0.12 160)' }));

  return (
    <div className="screen">
      <AppBar
        title="היומן שלי"
        subtitle={isLeader ? 'אירועי הצוות והדדליינים' : 'השבוע שלך · בלוקים ופגישות'}
        trailing={<Avatar name={isLeader ? 'נ' : 'י'} color={isLeader ? 'oklch(0.65 0.10 235)' : 'oklch(0.60 0.12 160)'} />}
      />
      <div className="screen-scroll">
        <div style={{ padding: '0 14px' }}>
          <div className="space-between" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>26 — 1 ביוני</div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip" style={{ background: 'color-mix(in oklch, var(--text) 30%, transparent)', color: 'white' }}>קבוע</span>
              {!isLeader && <span className="chip scout">Scout</span>}
              <span className="chip red">דדליין</span>
            </div>
          </div>
          <WeekGrid events={events} />
        </div>

        <div className="section-h" style={{ marginTop: 16 }}>
          <span>{isLeader ? 'דדליינים קרובים' : 'המשימות שלי השבוע'}</span>
        </div>
        <div className="stack" style={{ gap: 6 }}>
          {agenda.map((a, i) => (
            <div key={i} className="card flat" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={a.who} color={a.color} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title">{a.title}</div>
                <div className="task-meta">{a.who} · {a.when}</div>
              </div>
              <Icon name="calendar-clock" size={16} color="var(--text-mute)" />
            </div>
          ))}
        </div>
      </div>
      <AppTabBar state={state} dispatch={dispatch} />
    </div>
  );
}

// ───────── Profile tab ─────────
function ProfileScreen({ state, dispatch, role }) {
  const [notif, setNotif] = React.useState(true);
  const isLeader = role === 'leader';

  const data = isLeader
    ? { name: 'נועה כהן', roleLabel: 'ראש קבוצה', color: 'oklch(0.62 0.10 235)', email: 'noa@campus.ac.il',
        stats: [{ n: '3', l: 'פרויקטים' }, { n: '5', l: 'חברי צוות' }, { n: '12', l: 'משימות' }] }
    : { name: 'יואב לוי', roleLabel: 'סטודנט', color: 'oklch(0.60 0.12 160)', email: 'yoav@campus.ac.il',
        stats: [{ n: '4', l: 'משימות' }, { n: '18ש', l: 'השבוע' }, { n: '92%', l: 'בזמן' }] };

  const otherRole = isLeader ? 'student' : 'leader';
  const switchUser = () => dispatch({
    type: 'JUMP', role: otherRole,
    target: otherRole === 'leader' ? 'lockscreen' : 'dashboard',
  });

  return (
    <div className="screen">
      <AppBar title="פרופיל" />
      <div className="screen-scroll">
        {/* Identity card */}
        <div style={{ padding: '0 14px 12px' }}>
          <div className="card elev" style={{ padding: 18, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <Avatar name={data.name} color={data.color} size="lg" status="online" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{data.name}</div>
            <div className="row" style={{ justifyContent: 'center', gap: 6, marginTop: 4 }}>
              <span className="chip"><Icon name={isLeader ? 'crown' : 'user'} size={11} /> {data.roleLabel}</span>
            </div>
            <div className="small muted" style={{ marginTop: 6 }}>{data.email}</div>

            <div className="row" style={{ justifyContent: 'space-around', marginTop: 16 }}>
              {data.stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div className="big-num" style={{ fontSize: 22 }}>{s.n}</div>
                  <div className="tiny muted">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="section-h"><span>הגדרות</span></div>
        <div style={{ padding: '0 14px' }}>
          <div className="card" style={{ padding: 0 }}>
            <div className="space-between" style={{ padding: '14px 16px' }}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="moon" size={18} color="var(--text-soft)" />
                <div className="small" style={{ fontWeight: 500 }}>מצב כהה</div>
              </div>
              <div className={`switch ${state.theme === 'dark' ? 'on' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })} />
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div className="space-between" style={{ padding: '14px 16px' }}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="bell" size={18} color="var(--text-soft)" />
                <div className="small" style={{ fontWeight: 500 }}>התראות Scout</div>
              </div>
              <div className={`switch ${notif ? 'on' : ''}`} onClick={() => setNotif(n => !n)} />
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div className="space-between" style={{ padding: '14px 16px' }}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="globe" size={18} color="var(--text-soft)" />
                <div className="small" style={{ fontWeight: 500 }}>שפה</div>
              </div>
              <span className="small muted">עברית</span>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="section-h" style={{ marginTop: 16 }}><span>חשבון</span></div>
        <div style={{ padding: '0 14px' }}>
          <div className="card" style={{ padding: 0 }}>
            <div className="space-between" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={switchUser}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="repeat" size={18} color="var(--primary)" />
                <div className="small" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  החלף ל{isLeader ? 'תצוגת סטודנט (יואב)' : 'תצוגת ראש קבוצה (נועה)'}
                </div>
              </div>
              <Icon name="chevron-left" size={16} color="var(--text-mute)" />
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div className="space-between" style={{ padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'TOAST', msg: 'התנתקת (הדגמה)' })}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="log-out" size={18} color="var(--text-soft)" />
                <div className="small" style={{ fontWeight: 500 }}>התנתקות</div>
              </div>
              <Icon name="chevron-left" size={16} color="var(--text-mute)" />
            </div>
          </div>
        </div>

        <div className="tiny muted" style={{ textAlign: 'center', marginTop: 16 }}>
          GroupSync · גרסת הדגמה
        </div>
      </div>
      <AppTabBar state={state} dispatch={dispatch} />
    </div>
  );
}

Object.assign(window, {
  WeekGrid, TasksScreen, LeaderTasks, StudentTasks, DiaryScreen, ProfileScreen,
});
