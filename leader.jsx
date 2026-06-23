// leader.jsx — Leader (Noa) screens L1–L7

// ───────── L1 Lockscreen with Push ─────────
function LeaderLockScreen({ onOpen, dark }) {
  return (
    <div className="lockscreen">
      <div style={{ paddingTop: 48 }}>
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, opacity: 0.85 }}>
          <Icon name="lock" size={13} />
          <span>נעול</span>
        </div>
      </div>
      <div className="lockscreen-time">14:23</div>
      <div className="lockscreen-date">יום שלישי, 26 במאי</div>

      <div className="push-banner" onClick={onOpen}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'var(--scout)', color: 'white',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="sparkles" size={12} />
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1f33' }}>GroupSync · Scout</div>
          <div style={{ marginRight: 'auto', fontSize: 11, color: '#5a6478' }}>עכשיו</div>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1a1f33', lineHeight: 1.4 }}>
          דניאל לא עדכן את "עיצוב מסך הלוגין"
        </div>
        <div style={{ fontSize: 13, color: '#3a4258', marginTop: 2, lineHeight: 1.4 }}>
          נותרו ‎48 שעות לדדליין · אני יכול להציע דרך פעולה
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
        החלק את ההתראה לפתיחה
      </div>

      <div style={{ position: 'absolute', bottom: 50, left: 28, right: 28, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', color: 'white' }}>
          <Icon name="flashlight" size={20} />
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', color: 'white' }}>
          <Icon name="camera" size={20} />
        </div>
      </div>
    </div>
  );
}

// ───────── L2 Leader Dashboard ─────────
function LeaderDashboard({ state, dispatch }) {
  const proj = state.project;
  const memberStatus = state.danielStatus;
  const flagColor = memberStatus === 'pending' ? 'red' : memberStatus === 'sent' || memberStatus === 'read' ? 'yellow' : 'green';
  const flagLabel = memberStatus === 'pending' ? 'באיחור' : memberStatus === 'sent' ? 'תזכורת נשלחה' : memberStatus === 'read' ? 'נקראה' : 'עודכן';

  return (
    <div className="screen">
      <AppBar
        title="שלום נועה"
        subtitle="3 פרויקטים · 1 דורש תשומת לב"
        trailing={
          <>
            <span className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
              <Icon name="sun" size={18} />
            </span>
            <Avatar name="נ" color="oklch(0.65 0.10 235)" />
          </>
        }
      />
      <div className="screen-scroll">
        {/* Scout alert banner — prominent + the whole card opens the case */}
        <ScoutBanner
          prominent
          count={1}
          title="התראה חדשה מ-Scout"
          body="דניאל לא עדכן את 'עיצוב מסך הלוגין'. נותרו 48 שעות."
          onAction={() => dispatch({ type: 'GO', target: 'case' })}
          actionLabel="פתח"
        />

        {/* Active project — large card */}
        <div style={{ padding: '0 14px 12px' }}>
          <div className="card elev" style={{ padding: 16 }}>
            <div className="space-between" style={{ marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-mute)', letterSpacing: '0.05em' }}>פרויקט פעיל</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{proj.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-mute)', marginTop: 2 }}>הגשה {proj.deadline}</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div className="big-num">{proj.progress}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>הושלם</div>
              </div>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: proj.progress + '%' }} />
            </div>
            <div style={{ display: 'flex', marginTop: 14, gap: -8 }}>
              {proj.members.map((m, i) => (
                <div key={m.name} style={{ marginLeft: i ? -10 : 0, position: 'relative' }}>
                  <span className="avatar sm" style={{ background: m.color, color: 'white', border: '2px solid var(--card)' }}>
                    {m.name.charAt(0)}
                  </span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-mute)', alignSelf: 'center' }}>
                {proj.members.length} חברים
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions — only tiles that lead to a real flow are kept */}
        <OptionsGrid items={[
          { icon: 'list-checks', label: 'משימות הצוות', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'tasks' }) },
          { icon: 'bell-ring', label: 'טיפול בהתראות', tint: { bg: 'var(--scout-soft)', fg: 'var(--scout-ink)' }, onPress: () => dispatch({ type: 'GO', target: 'case' }) },
          { icon: 'calendar', label: 'יומן ודדליינים', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'diary' }) },
          { icon: 'settings', label: 'הגדרות', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'profile' }) },
        ]} />

        {/* Tasks board */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>משימות פעילות</span>
          <span style={{ display: 'flex', gap: 8 }}>
            <span className="chip red dot">{state.tasks.filter(t => t.flag === 'red').length}</span>
            <span className="chip yellow dot">{state.tasks.filter(t => t.flag === 'yellow').length}</span>
            <span className="chip green dot">{state.tasks.filter(t => t.flag === 'green').length}</span>
          </span>
        </div>
        <div className="stack">
          {state.tasks.map(t => {
            const isDaniel = t.assignee === 'דניאל';
            const flag = isDaniel ? flagColor : t.flag;
            const label = isDaniel ? flagLabel : t.flagLabel;
            return (
              <div
                key={t.id}
                className={`task-row ${flag === 'red' ? 'flagged' : ''}`}
                onClick={() => isDaniel && dispatch({ type: 'GO', target: 'case' })}
              >
                <Avatar name={t.assignee} color={t.color} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="task-title">{t.title}</div>
                  <div className="task-meta">{t.assignee} · {t.due}</div>
                </div>
                {flag === 'red' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className="chip red dot">{label}</span>
                    {isDaniel && <span className="tiny muted">48ש לדדליין</span>}
                  </div>
                )}
                {flag === 'yellow' && <span className="chip yellow dot">{label}</span>}
                {flag === 'green' && <span className="chip green dot">{label}</span>}
              </div>
            );
          })}
        </div>

        {/* Projects */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>פרויקטים</span>
          <span className="tiny muted">3 פעילים</span>
        </div>
        <div className="stack">
          {[
            { title: proj.title, deadline: proj.deadline, progress: proj.progress, active: true },
            { title: 'מערכת ניהול ספרייה', deadline: '12.6', progress: 38 },
            { title: 'בוט תמיכה לקורס', deadline: '20.6', progress: 15 },
          ].map((p, i) => (
            <div key={i} className="card flat" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: p.active ? 'var(--primary-soft)' : 'var(--chip)',
                color: p.active ? 'var(--primary)' : 'var(--text-soft)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name="folder-kanban" size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title">{p.title}</div>
                <div className="bar" style={{ marginTop: 6 }}>
                  <div className="bar-fill" style={{ width: p.progress + '%' }} />
                </div>
              </div>
              <div style={{ textAlign: 'left', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.progress}%</div>
                <div className="tiny muted">הגשה {p.deadline}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>צוות</span>
          <span className="tiny muted">{proj.members.length} חברים</span>
        </div>
        <div className="stack" style={{ gap: 6 }}>
          {proj.members.map((m, i) => {
            const isDaniel = m.name === 'דניאל';
            const flag = isDaniel ? (memberStatus === 'pending' ? 'red' : memberStatus === 'responded' ? 'green' : 'yellow') : 'green';
            return (
              <div
                key={m.name}
                className="card flat"
                style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: isDaniel ? 'pointer' : 'default' }}
                onClick={() => isDaniel && dispatch({ type: 'GO', target: 'case' })}
              >
                <Avatar name={m.name} color={m.color} size="sm" status={flag === 'red' ? 'away' : 'online'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="task-title">{m.name}</div>
                  <div className="task-meta">{isDaniel ? 'דניאל לוי' : 'חבר צוות'}</div>
                </div>
                <span className={`chip ${flag} dot`}>{flag === 'red' ? 'באיחור' : flag === 'yellow' ? 'בתהליך' : 'תקין'}</span>
              </div>
            );
          })}
        </div>

        {/* Recent team activity */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>פעילות אחרונה</span>
        </div>
        <div className="stack" style={{ gap: 4 }}>
          {state.activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 4px', alignItems: 'flex-start' }}>
              <Avatar name={a.who} color={a.color} size="sm" />
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45, color: 'var(--text-soft)' }}>
                <b style={{ color: 'var(--text)' }}>{a.who}</b> {a.what}
                <div className="tiny muted" style={{ marginTop: 2 }}>{a.when}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────── L3 Case View ─────────
function LeaderCaseView({ state, dispatch }) {
  const [whyOpen, setWhyOpen] = React.useState(false);

  return (
    <div className="screen">
      <AppBar
        title="טיפול במצב"
        subtitle="עיצוב מסך הלוגין"
        leading={
          <span className="icon-btn ghost" onClick={() => dispatch({ type: 'GO', target: 'dashboard' })}>
            <Icon name="chevron-right" size={22} />
          </span>
        }
        trailing={<span className="chip red dot">דורש פעולה</span>}
        compact
      />
      <div className="screen-scroll" style={{ paddingBottom: 110 }}>
        <div className="stack">
          {/* Scout summary */}
          <ScoutCard
            title="תקציר מצב"
            suggestion={
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar name="דניאל" color="oklch(0.55 0.13 30)" size="lg" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>דניאל לוי</div>
                  <div className="small muted">לא עדכן את "עיצוב מסך הלוגין" כבר 4 ימים</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <CountdownChip minutes={48 * 60} color="red" />
                    <span className="chip">‎4 ימים ללא עדכון</span>
                  </div>
                </div>
              </div>
            }
            why={
              <>
                המערכת זיהתה את המצב לפי שילוב של 3 קריטריונים:
                <ul style={{ margin: '6px 18px 0', padding: 0, color: 'var(--text-soft)' }}>
                  <li>סף זמן: 48 שעות לדדליין (רגישות גבוהה)</li>
                  <li>אין שינוי סטטוס מאז ‎22.5</li>
                  <li>היסטוריה: ‎2 עיכובים בחודש האחרון</li>
                </ul>
              </>
            }
          />

          {/* Progress comparison */}
          <div className="card">
            <div className="space-between" style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>סטטוס יחסי</div>
              <span className="tiny muted">קבוצה מול חבר</span>
            </div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span className="small" style={{ width: 76 }}>הקבוצה</span>
              <div className="bar" style={{ flex: 1 }}>
                <div className="bar-fill green" style={{ width: '72%' }} />
              </div>
              <span className="small muted" style={{ width: 36, textAlign: 'left' }}>72%</span>
            </div>
            <div className="row">
              <span className="small" style={{ width: 76 }}>דניאל</span>
              <div className="bar" style={{ flex: 1 }}>
                <div className="bar-fill red" style={{ width: '35%' }} />
              </div>
              <span className="small muted" style={{ width: 36, textAlign: 'left' }}>35%</span>
            </div>
          </div>

          {/* Activity history */}
          <div className="card">
            <div className="space-between" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>היסטוריית פעילות · 14 ימים</div>
              <span className="tiny muted">כניסה אחרונה: לפני יומיים</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 64 }}>
              {[2,1,3,2,4,1,0,2,3,1,2,0,0,0].map((h, i) => (
                <div key={i} className="activity-day">
                  <div className="activity-bar" style={{
                    height: Math.max(4, h * 12),
                    background: h === 0 ? 'var(--hair-strong)' : i > 10 ? 'var(--red)' : 'var(--primary)',
                  }} />
                  <span>{i % 3 === 0 ? `${28 - 14 + i}/5` : ''}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="row" style={{ gap: 16 }}>
              <span className="tiny muted">תגובות לתזכורות:</span>
              <span className="chip yellow">2/3 נענו</span>
            </div>
          </div>

          {/* Optional external context */}
          <div className="card" style={{ background: 'var(--chip)', border: 'none' }}>
            <div className="row" style={{ marginBottom: 6 }}>
              <Icon name="info" size={16} color="var(--text-mute)" />
              <div style={{ fontWeight: 600, fontSize: 13 }}>הקשר נוסף</div>
            </div>
            <div className="small muted">
              דניאל לא הגדיר סטטוס "לא זמין". הערה אחרונה שלו על המשימה: "מתחיל מחר בבוקר" (‎22.5).
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '18px 14px 0' }}>
          <button className="btn scout block" onClick={() => dispatch({ type: 'OPEN_SHEET', sheet: 'intervention' })}>
            <Icon name="sparkles" size={16} />
            ראה הצעות פעולה
          </button>
          <div className="tiny muted" style={{ textAlign: 'center', marginTop: 8 }}>
            Scout מציע. אתה מחליט.
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── L4 Intervention sheet ─────────
function InterventionSheet({ state, dispatch }) {
  const [selected, setSelected] = React.useState('reminder');

  const options = [
    {
      id: 'reminder', icon: 'message-circle', recommended: true,
      title: 'תזכורת פרטית קצרה',
      desc: 'הודעה פרטית, ידידותית. רק דניאל יראה.',
      priv: 'private',
    },
    {
      id: 'chat', icon: 'message-square',
      title: 'פתח שיחה אישית',
      desc: 'פתיחת צ\'אט 1:1. מתאים אם יש חשד לבעיה אישית.',
      priv: 'private',
    },
    {
      id: 'reassign', icon: 'shuffle',
      title: 'חלוקה מחדש',
      desc: 'הצעה לחבר אחר לקחת אחריות. גלוי לקבוצה.',
      priv: 'group',
    },
  ];

  return (
    <Sheet
      open={state.sheet === 'intervention'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
      title="בחירת רמת התערבות"
      subtitle="Scout מציע — אתה מחליט"
      footer={
        <button
          className="btn primary block"
          onClick={() => {
            dispatch({ type: 'SET_INTERVENTION', intervention: selected });
            dispatch({ type: 'OPEN_SHEET', sheet: 'compose' });
          }}
        >
          המשך עם {options.find(o => o.id === selected).title}
        </button>
      }
    >
      <div className="col" style={{ marginBottom: 12 }}>
        <ScoutCard
          title="המלצת Scout"
          suggestion={
            <>
              מומלץ להתחיל ב<b>תזכורת פרטית קצרה</b>. ההיסטוריה של דניאל מראה שהוא מגיב טוב לפניות פרטיות (‎2/3 בעבר).
            </>
          }
          why={
            <>
              <b>קריטריונים:</b> רמת רגישות בינונית — איחור קיים אך לא קריטי, היחסים בקבוצה תקינים, ויש עדיין זמן לדדליין. תזכורת קלה היא הצעד הפחות פולשני שעוד צפוי לעבוד.
            </>
          }
          actions={
            <span className="tiny muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="shield-check" size={12} />
              כל פעולה דורשת אישור שלך
            </span>
          }
        />
      </div>

      <div className="col" style={{ gap: 10 }}>
        {options.map(o => (
          <div
            key={o.id}
            className={`opt opt-wrap ${selected === o.id ? 'on' : ''} ${o.recommended ? 'recommended' : ''}`}
            onClick={() => setSelected(o.id)}
            style={{ position: 'relative' }}
          >
            <div className="opt-icon"><Icon name={o.icon} size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{o.title}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{o.desc}</div>
              <div style={{ marginTop: 6 }}>
                <span className={`priv ${o.priv}`}>
                  <Icon name={o.priv === 'private' ? 'lock' : 'users'} size={11} />
                  {o.priv === 'private' ? 'פרטי' : 'גלוי לקבוצה'}
                </span>
              </div>
            </div>
            <div className={`radio ${selected === o.id ? 'on' : ''}`} />
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ───────── L5 Compose / draft (sheet) ─────────
function ComposeSheet({ state, dispatch }) {
  const [tone, setTone] = React.useState('friendly');
  const [scheduled, setScheduled] = React.useState(false);
  const draftByTone = {
    friendly: 'היי דניאל 👋\nראיתי שעוד לא היה עדכון על מסך הלוגין. אם משהו חוסם, ספר לי – נסתדר.\nלא לחץ — נשארו עוד 48 שעות והכל גמיש.',
    neutral:  'היי דניאל,\nבדקתי את המשימה "עיצוב מסך הלוגין" וראיתי שלא היה עדכון מאז 22.5. נשמח לדעת איפה אתה עומד עד מחר.',
    formal:   'שלום דניאל,\nלצורך עמידה בלוחות הזמנים, נדרש עדכון סטטוס למשימה "עיצוב מסך הלוגין" עד 17:00 מחר.',
    urgent:   'דניאל, נשארו 48 שעות. אנחנו זקוקים לעדכון על "עיצוב מסך הלוגין" היום. תוכל לעדכן אותי תוך שעה?',
  };
  const [text, setText] = React.useState(draftByTone.friendly);
  React.useEffect(() => { setText(draftByTone[tone]); }, [tone]);

  const send = () => {
    dispatch({ type: 'SEND_MESSAGE', body: text, tone });
    dispatch({ type: 'CLOSE_SHEET' });
    dispatch({ type: 'GO', target: 'tracking' });
  };

  return (
    <Sheet
      open={state.sheet === 'compose'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
      title="ניסוח ושליחה"
      subtitle="Scout הכין טיוטה — אתה עורך ומאשר"
      footer={
        <div className="col">
          <button className="btn primary block" onClick={send}>
            <Icon name="send" size={16} />
            {scheduled ? 'תזמן ל-17:00' : 'שלח עכשיו'}
          </button>
          <div className="tiny muted" style={{ textAlign: 'center' }}>
            <Icon name="lock" size={11} /> ישלח בצ'אט פרטי. דניאל בלבד יראה.
          </div>
        </div>
      }
    >
      <div className="col" style={{ gap: 12 }}>
        {/* Goal */}
        <div className="scout-banner">
          <Icon name="target" size={16} color="var(--scout)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--scout-ink)' }}>מטרת ההודעה</div>
            <div className="small muted" style={{ marginTop: 2 }}>
              לקבל אישור התקדמות בלי להעמיס. ההודעה לא מאשימה.
            </div>
          </div>
        </div>

        {/* Tone */}
        <div>
          <div className="small" style={{ fontWeight: 600, marginBottom: 6 }}>טון</div>
          <ToneSeg value={tone} onChange={setTone} />
        </div>

        {/* Draft */}
        <div>
          <div className="space-between" style={{ marginBottom: 6 }}>
            <div className="small" style={{ fontWeight: 600 }}>טיוטה</div>
            <span className="tiny muted">{text.length} תווים</span>
          </div>
          <textarea
            className="ta"
            rows={6}
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        {/* Schedule */}
        <div className="row" style={{ justifyContent: 'space-between', padding: '6px 4px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>תזמון</div>
            <div className="small muted">סוף יום עבודה ({scheduled ? '17:00 היום' : 'עכשיו'})</div>
          </div>
          <span className={`switch ${scheduled ? 'on' : ''}`} onClick={() => setScheduled(s => !s)} />
        </div>
      </div>
    </Sheet>
  );
}

// ───────── L6 Tracking screen ─────────
function LeaderTracking({ state, dispatch }) {
  const status = state.danielStatus;
  const events = [];
  if (status !== 'pending') events.push({ icon: 'send', t: state.events.sent, label: 'התזכורת נשלחה לדניאל' });
  if (['read', 'responded'].includes(status)) events.push({ icon: 'eye', t: state.events.read, label: 'דניאל קרא את ההודעה' });
  if (status === 'responded') events.push({ icon: 'check-circle-2', t: state.events.responded, label: 'דניאל עדכן את המשימה ל-65%' });
  const esc = state.events.escalation;
  if (esc) events.push({ icon: 'alert-triangle', t: esc.at, label: 'אסקלציה: ' + esc.label, accent: 'var(--red)' });

  return (
    <div className="screen">
      <AppBar
        title="מעקב אחר תוצאה"
        subtitle="עיצוב מסך הלוגין"
        leading={
          <span className="icon-btn ghost" onClick={() => dispatch({ type: 'GO', target: 'dashboard' })}>
            <Icon name="chevron-right" size={22} />
          </span>
        }
        compact
      />
      <div className="screen-scroll">
        <div className="stack">
          {/* Sent confirmation */}
          <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
            <div className="success-circle">
              <Icon name="check" size={36} strokeWidth={2.6} />
            </div>
            <div style={{ marginTop: 12, fontWeight: 700, fontSize: 16 }}>הודעה נשלחה</div>
            <div className="small muted" style={{ marginTop: 4 }}>
              נשלחה בצ'אט פרטי. דניאל יקבל התראה במכשיר שלו.
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="space-between" style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>ציר תגובה</div>
              <span className={`chip ${esc ? 'red' : status === 'responded' ? 'green' : status === 'read' ? 'yellow' : 'red'} dot`}>
                {esc ? 'אסקלציה' : status === 'pending' ? 'ממתין' : status === 'sent' ? 'נשלח' : status === 'read' ? 'נקראה' : 'הושלם'}
              </span>
            </div>
            <div style={{ position: 'relative', paddingRight: 18 }}>
              <div style={{ position: 'absolute', top: 4, bottom: 4, right: 9, width: 2, background: 'var(--hair)' }} />
              {events.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14, position: 'relative' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: e.accent || 'var(--primary)', color: 'white',
                    display: 'grid', placeItems: 'center',
                    position: 'absolute', right: -8, top: 0,
                  }}>
                    <Icon name={e.icon} size={11} />
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{e.label}</div>
                    <div className="tiny muted">{e.t}</div>
                  </div>
                </div>
              ))}
              {status === 'pending' && (
                <div style={{ paddingRight: 20 }} className="small muted">ההודעה תישלח עוד רגע…</div>
              )}
              {status === 'sent' && (
                <div style={{ paddingRight: 20 }} className="small muted">
                  <Icon name="loader" size={12} /> ממתינים לתגובה…
                </div>
              )}
            </div>
          </div>

          {/* Flag transition */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>מצב הדגל בדאשבורד</div>
            <div className="row" style={{ gap: 10 }}>
              <span className={`chip red dot`} style={{ opacity: status === 'pending' || status === 'sent' ? 1 : 0.35 }}>אדום</span>
              <Icon name="arrow-left" size={14} color="var(--text-mute)" />
              <span className={`chip yellow dot`} style={{ opacity: status === 'read' ? 1 : 0.35 }}>צהוב</span>
              <Icon name="arrow-left" size={14} color="var(--text-mute)" />
              <span className={`chip green dot`} style={{ opacity: status === 'responded' ? 1 : 0.35 }}>ירוק</span>
            </div>
          </div>

          {esc && (
            <div className="card" style={{ background: 'var(--scout-soft)', border: '1px solid color-mix(in oklch, var(--scout) 30%, transparent)' }}>
              <div className="row" style={{ gap: 8 }}>
                <Icon name="shield-alert" size={18} color="var(--scout-ink)" />
                <div style={{ fontWeight: 700 }}>הופעלה אסקלציה</div>
              </div>
              <div className="small" style={{ marginTop: 4, color: 'var(--text-soft)' }}>
                {esc.label} · {esc.at}. Scout ימשיך לעקוב וידווח לך על כל שינוי.{' '}
                {esc.kind === 'risk' ? 'המשימה סומנה "בסיכון" בלוח הקבוצתי.' : 'הפעולה נשלחה בערוץ פרטי.'}
              </div>
            </div>
          )}

          {status === 'responded' && (
            <div className="card" style={{ background: 'var(--green-soft)', border: '1px solid color-mix(in oklch, var(--green) 30%, transparent)' }}>
              <div className="row">
                <Icon name="party-popper" size={18} color="var(--green)" />
                <div style={{ fontWeight: 600 }}>הסיטואציה נסגרה.</div>
              </div>
              <div className="small" style={{ marginTop: 4, color: 'var(--text-soft)' }}>
                דניאל הגיב תוך {state.events.responseTime || '8 דקות'} ועדכן את המשימה ל-65%. אין צורך בפעולה נוספת.
              </div>
            </div>
          )}

          {(status === 'sent' || status === 'read') && !esc && (
            <button className="btn block" onClick={() => dispatch({ type: 'OPEN_SHEET', sheet: 'escalation' })}>
              <Icon name="alert-triangle" size={16} />
              דניאל לא מגיב? אופציות אסקלציה
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────── L7 Escalation sheet ─────────
function EscalationSheet({ state, dispatch }) {
  const [pick, setPick] = React.useState('second');
  const opts = [
    { id: 'second', icon: 'message-circle-more', title: 'תזכורת שנייה — ישירה יותר', desc: 'עדיין פרטית, ניסוח חד יותר.', priv: 'private' },
    { id: '1on1', icon: 'phone', title: 'פתיחת שיחה אישית', desc: 'שיחת 1:1 בהודעות המשימה.', priv: 'private' },
    { id: 'risk', icon: 'flag', title: 'סימון המשימה "בסיכון"', desc: 'דגל גלוי לכל הקבוצה.', priv: 'group' },
    { id: 'reassign', icon: 'shuffle', title: 'הצעת חלוקה מחדש', desc: 'Scout ינסח הודעה לחבר אחר.', priv: 'group' },
  ];
  return (
    <Sheet
      open={state.sheet === 'escalation'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
      title="התזכורת לא נענתה"
      subtitle="‎18 שעות לדדליין. Scout מציע 4 צעדים."
      footer={
        <button className="btn primary block" onClick={() => {
          const chosen = opts.find(o => o.id === pick);
          dispatch({ type: 'ESCALATE', kind: pick, label: chosen ? chosen.title : 'אסקלציה' });
          dispatch({ type: 'CLOSE_SHEET' });
        }}>אישור ושליחה</button>
      }
    >
      <div className="scout-banner" style={{ marginBottom: 12 }}>
        <Icon name="alert-triangle" size={16} color="var(--scout)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--scout-ink)' }}>מה ידוע</div>
          <div className="small muted" style={{ marginTop: 2 }}>
            ההודעה נקראה אבל המשימה לא השתנתה. נותרו 18 שעות.
          </div>
        </div>
      </div>

      <div className="col" style={{ gap: 10 }}>
        {opts.map(o => (
          <div
            key={o.id}
            className={`opt ${pick === o.id ? 'on' : ''}`}
            onClick={() => setPick(o.id)}
          >
            <div className="opt-icon"><Icon name={o.icon} size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{o.title}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{o.desc}</div>
              <div style={{ marginTop: 6 }}>
                <span className={`priv ${o.priv}`}>
                  <Icon name={o.priv === 'private' ? 'lock' : 'users'} size={11} />
                  {o.priv === 'private' ? 'פרטי' : 'גלוי לקבוצה'}
                </span>
              </div>
            </div>
            <div className={`radio ${pick === o.id ? 'on' : ''}`} />
          </div>
        ))}
      </div>
    </Sheet>
  );
}

Object.assign(window, {
  LeaderLockScreen, LeaderDashboard, LeaderCaseView,
  InterventionSheet, ComposeSheet, LeaderTracking, EscalationSheet,
});
