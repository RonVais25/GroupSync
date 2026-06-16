// student.jsx — Student (Yoav) screens S1–S6

// ───────── S1 Student Dashboard ─────────
function StudentDashboard({ state, dispatch }) {
  return (
    <div className="screen">
      <AppBar
        title="שלום יואב"
        subtitle="‎3 דברים השתנו מאז שהיית פה"
        trailing={
          <>
            <span className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
              <Icon name="sun" size={18} />
            </span>
            <Avatar name="י" color="oklch(0.60 0.12 160)" />
          </>
        }
      />
      <div className="screen-scroll">
        {/* "מאז הכניסה האחרונה שלך" — Scout digest */}
        <div style={{ padding: '0 14px 14px' }}>
          <ScoutCard
            title="מאז הכניסה האחרונה שלך"
            suggestion={
              <div>
                <div className="small muted" style={{ marginBottom: 8 }}>
                  לפני 18 שעות · ‎3 שינויים, ‎1 נוגע אליך ישירות
                </div>
                <div className="col" style={{ gap: 8 }}>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <span className="new-badge">חדש</span>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <b>נועה</b> הקצתה לך משימה: <b>אינטגרציית API לתשלום</b>
                    </div>
                  </div>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <Icon name="calendar-clock" size={14} color="var(--text-mute)" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text-soft)' }}>
                      הדדליין שלך ל"מסך הכניסה" נשאר ‎28.5
                    </div>
                  </div>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <Icon name="message-square" size={14} color="var(--text-mute)" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text-soft)' }}>
                      <b>שירה</b> כתבה הערה על "תרשים DB"
                    </div>
                  </div>
                </div>
              </div>
            }
            why={
              <>
                Scout מסנן את העדכונים ומבליט רק את אלו <b>שדורשים פעולה ממך</b> או משפיעים על הזמן שלך.
              </>
            }
          />
        </div>

        {/* My project + team */}
        <div className="section-h">
          <span>הפרויקט שלי</span>
        </div>
        <div style={{ padding: '0 14px 4px' }}>
          <div className="card">
            <div className="space-between" style={{ marginBottom: 10 }}>
              <div>
                <div className="task-title">אפליקציית הזמנת אוכל לאוניברסיטה</div>
                <div className="task-meta">הגשה 4.6 · ראש קבוצה: נועה</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>64%</div>
                <div className="tiny muted">הקבוצה</div>
              </div>
            </div>
            <div className="bar"><div className="bar-fill" style={{ width: '64%' }} /></div>
            <div style={{ display: 'flex', marginTop: 12 }}>
              {[
                { name: 'נועה', color: 'oklch(0.62 0.10 235)' },
                { name: 'דניאל', color: 'oklch(0.60 0.13 30)' },
                { name: 'שירה', color: 'oklch(0.62 0.12 160)' },
                { name: 'יואב', color: 'oklch(0.60 0.12 100)' },
                { name: 'תום', color: 'oklch(0.62 0.10 305)' },
              ].map((m, i) => (
                <span key={m.name} className="avatar sm"
                  style={{ background: m.color, color: 'white', border: '2px solid var(--card)', marginLeft: i ? -10 : 0 }}>
                  {m.name.charAt(0)}
                </span>
              ))}
              <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-mute)', alignSelf: 'center' }}>5 חברים</div>
            </div>
          </div>
        </div>

        {/* All options the system offers (assignment: main screen surfaces everything) */}
        <OptionsGrid items={[
          { icon: 'inbox', label: 'המשימות שלי', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'tasks' }) },
          { icon: 'sparkles', label: 'משימה חדשה', tint: { bg: 'var(--scout-soft)', fg: 'var(--scout-ink)' }, onPress: () => dispatch({ type: 'GO_S', target: 'taskDetail' }) },
          { icon: 'calendar', label: 'תכנון ביומן', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'diary' }) },
          { icon: 'gauge', label: 'העומס שלי', onPress: () => dispatch({ type: 'TOAST', msg: 'מד עומס שבועי — להדגמה בלבד' }) },
          { icon: 'timer', label: 'הערכת מאמץ', onPress: () => dispatch({ type: 'TOAST', msg: 'הערכת מאמץ של Scout — נפתחת בתוך משימה' }) },
          { icon: 'bell', label: 'תזכורות', onPress: () => dispatch({ type: 'TOAST', msg: 'תזכורות — להדגמה בלבד' }) },
          { icon: 'message-circle', label: 'צ׳אט קבוצתי', onPress: () => dispatch({ type: 'TOAST', msg: 'צ׳אט קבוצתי — להדגמה בלבד' }) },
          { icon: 'settings', label: 'הגדרות', onPress: () => dispatch({ type: 'NAV_TAB', tab: 'profile' }) },
        ]} />

        {/* My tasks */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>המשימות שלי</span>
          <span className="tiny muted">‎4 פעילות · ‎1 חדשה</span>
        </div>
        <div className="stack">
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

        {/* Capacity heatbar */}
        <div className="section-h" style={{ marginTop: 16 }}>
          <span>העומס שלך השבוע</span>
          <span className="tiny muted">‎18ש מתוך ‎25</span>
        </div>
        <div style={{ padding: '0 14px' }}>
          <div className="card">
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
              {[6, 4, 3, 8, 2, 0, 0].map((h, i) => (
                <div key={i} className="activity-day">
                  <div className="activity-bar" style={{
                    height: Math.max(4, h * 7),
                    background: h > 6 ? 'var(--yellow)' : h > 0 ? 'var(--primary)' : 'var(--hair-strong)',
                    width: 18,
                  }} />
                  <span>{['א','ב','ג','ד','ה','ו','ש'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── S2 Task detail + Scout estimate ─────────
function StudentTaskDetail({ state, dispatch }) {
  return (
    <div className="screen">
      <AppBar
        title="משימה חדשה"
        subtitle="אינטגרציית API לתשלום"
        leading={
          <span className="icon-btn ghost" onClick={() => dispatch({ type: 'GO_S', target: 'dashboard' })}>
            <Icon name="chevron-right" size={22} />
          </span>
        }
        trailing={<span className="new-badge">חדש</span>}
        compact
      />
      <div className="screen-scroll" style={{ paddingBottom: 110 }}>
        <div className="stack">
          {/* Task meta */}
          <div className="card">
            <div className="space-between" style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>אינטגרציית API לתשלום</div>
              <span className="chip">‎P1 — חשוב</span>
            </div>
            <div className="small" style={{ color: 'var(--text-soft)', lineHeight: 1.55 }}>
              חיבור Stripe / Paypal לזרימת ההזמנה. כולל handling של webhooks ובדיקות עם sandbox.
            </div>
            <div className="divider" />
            <div className="col" style={{ gap: 6 }}>
              <div className="row" style={{ gap: 8 }}>
                <Icon name="calendar" size={14} color="var(--text-mute)" />
                <span className="small">דדליין: <b>1.6</b> · עוד 6 ימים</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Icon name="user" size={14} color="var(--text-mute)" />
                <span className="small">הגדיר: <b>נועה</b> · נדון בפגישה ‎12.5</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Icon name="paperclip" size={14} color="var(--text-mute)" />
                <span className="small">‎2 קבצים: <span style={{ color: 'var(--primary)' }}>spec.pdf</span>, <span style={{ color: 'var(--primary)' }}>API_keys.txt</span></span>
              </div>
            </div>
          </div>

          {/* Scout effort estimate */}
          <ScoutCard
            title="הערכת מאמץ"
            suggestion={
              <div>
                <div className="row" style={{ gap: 12, alignItems: 'baseline' }}>
                  <div className="big-num" style={{ color: 'var(--scout-ink)' }}>{state.estimate.lo}–{state.estimate.hi}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-soft)' }}>שעות עבודה ממוקדת</div>
                </div>
                <div className="row" style={{ gap: 6, marginTop: 8 }}>
                  <span className="chip">ביטחון: בינוני</span>
                  <span className="chip">‎±1 שעה</span>
                </div>
              </div>
            }
            why={
              <>
                בסיס ההערכה:
                <ul style={{ margin: '6px 18px 0', padding: 0, color: 'var(--text-soft)' }}>
                  <li>משימה דומה: "אינטגרציה ל-Auth0" — ‎5.5ש בפועל</li>
                  <li>‎4 endpoints, ‎2 webhooks (לפי ה-spec)</li>
                  <li>אתה לא עבדת מול Stripe בעבר — מקדם למידה +1ש</li>
                </ul>
              </>
            }
            actions={
              <>
                <button className="btn scout sm" onClick={() => dispatch({ type: 'OPEN_SHEET_S', sheet: 'effort' })}>
                  <Icon name="pencil" size={13} />
                  עדכן הערכה
                </button>
                <button className="btn sm subtle" onClick={() => dispatch({ type: 'OPEN_SHEET_S', sheet: 'askScout' })}>
                  שאל את Scout
                </button>
              </>
            }
          />

          {/* CTA */}
          <button className="btn primary block" onClick={() => dispatch({ type: 'GO_S', target: 'calendar' })}>
            <Icon name="calendar-plus" size={16} />
            תכנן בלוח הזמנים שלי
          </button>
          <div className="tiny muted" style={{ textAlign: 'center' }}>
            Scout יציע חלונות זמן מתאימים — תוכל לשנות.
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── S3 Edit estimate sheet ─────────
function EffortSheet({ state, dispatch }) {
  const [hi, setHi] = React.useState(state.estimate.hi);
  const [lo, setLo] = React.useState(state.estimate.lo);
  const [note, setNote] = React.useState('');
  const save = () => {
    dispatch({ type: 'SET_ESTIMATE', lo, hi, note });
    dispatch({ type: 'CLOSE_SHEET_S' });
    dispatch({ type: 'TOAST', msg: 'ההערכה עודכנה' });
  };
  return (
    <Sheet
      open={state.sheetS === 'effort'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET_S' })}
      title="עדכון הערכת זמן"
      subtitle="מה ההערכה שלך, לפי הניסיון האישי?"
      footer={<button className="btn primary block" onClick={save}>שמור הערכה</button>}
    >
      <div className="col" style={{ gap: 14 }}>
        <div className="card flat" style={{ background: 'var(--chip)', border: 'none' }}>
          <div className="space-between">
            <div>
              <div className="small muted">הערכה מינימלית</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>שעות עבודה</div>
            </div>
            <Stepper value={lo} onChange={v => setLo(Math.min(v, hi - 0.5))} min={0.5} max={20} suffix="ש" />
          </div>
        </div>
        <div className="card flat" style={{ background: 'var(--chip)', border: 'none' }}>
          <div className="space-between">
            <div>
              <div className="small muted">הערכה מקסימלית</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>שעות עבודה</div>
            </div>
            <Stepper value={hi} onChange={v => setHi(Math.max(v, lo + 0.5))} min={0.5} max={20} suffix="ש" />
          </div>
        </div>

        <div>
          <div className="small" style={{ fontWeight: 600, marginBottom: 6 }}>הערה אישית (אופציונלי)</div>
          <textarea
            className="ta"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="לדוגמה: צריך ללמוד את ה-API החדש לפני שמתחילים"
          />
        </div>

        <div className="scout-banner">
          <Icon name="info" size={14} color="var(--scout)" />
          <div className="small" style={{ color: 'var(--text-soft)' }}>
            ההערה שלך תעזור ל-Scout לדייק את ההערכות הבאות. הקבוצה לא תראה אותה.
          </div>
        </div>
      </div>
    </Sheet>
  );
}

// ───────── Ask-Scout side panel sheet ─────────
function AskScoutSheet({ state, dispatch }) {
  const Qs = [
    { q: 'מה החלקים הכי קשים?', a: 'הטיפול ב-webhooks (אסינכרוני, נדרשת בדיקה שכל מצב מקצה לקצה עובד). זה ה-30% האחרונים של ההערכה.' },
    { q: 'האם זה תלוי במשימות אחרות?', a: 'תלוי ב"סכמת DB - הזמנות" של שירה (כרגע ב-60%, אמורה להיגמר עד 30.5). תוכל להתחיל בעבודה מקדימה לפני.' },
    { q: 'יש דוגמאות ברפו?', a: 'יש אינטגרציה ל-Auth0 שעשית בנובמבר — אותו דפוס בערך. ראיתי שב-services/auth.ts יש את ה-pattern שאפשר לשכפל.' },
  ];
  const [open, setOpen] = React.useState({});
  return (
    <Sheet
      open={state.sheetS === 'askScout'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET_S' })}
      title="שאל את Scout"
      subtitle="שאלות נפוצות על המשימה הזו"
    >
      <div className="col" style={{ gap: 8 }}>
        {Qs.map((it, i) => (
          <div key={i} className="card flat" style={{ border: '1px solid var(--hair)' }}>
            <div className="space-between" style={{ cursor: 'pointer' }} onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{it.q}</div>
              <Icon name={open[i] ? 'chevron-up' : 'chevron-down'} size={16} color="var(--text-mute)" />
            </div>
            {open[i] && (
              <div className="small" style={{ marginTop: 8, color: 'var(--text-soft)', lineHeight: 1.6 }}>
                {it.a}
              </div>
            )}
          </div>
        ))}

        <div className="card flat" style={{ background: 'var(--scout-tint)', border: '1px solid color-mix(in oklch, var(--scout) 20%, transparent)' }}>
          <div className="small" style={{ color: 'var(--scout-ink)', fontWeight: 600, marginBottom: 6 }}>שאל משהו אחר</div>
          <input
            type="text"
            placeholder="הקלד שאלה…"
            style={{
              width: '100%',
              border: '1px solid color-mix(in oklch, var(--scout) 20%, transparent)',
              background: 'var(--card)',
              borderRadius: 10, padding: '10px 12px',
              fontFamily: 'inherit', fontSize: 13,
            }}
          />
        </div>
      </div>
    </Sheet>
  );
}

// ───────── S4 Calendar (weekly) ─────────
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = ['א','ב','ג','ד','ה','ו','ש'];

function StudentCalendar({ state, dispatch }) {
  const [blocks, setBlocks] = React.useState(state.calendarBlocks);
  const [selected, setSelected] = React.useState(null);
  const confirmed = blocks.every(b => b.confirmed);

  // existing personal blocks (fixed)
  const existing = [
    { day: 0, hour: 11, len: 2, label: 'מערכות מידע' },
    { day: 1, hour: 15, len: 1.5, label: 'אימון' },
    { day: 3, hour: 9, len: 2, label: 'הרצאה' },
    { day: 4, hour: 16, len: 2, label: 'פגישת קבוצה' },
  ];

  // A slot fits if it stays on the 9–18 grid and overlaps no existing event or other block.
  const onGrid = (hour, len) => hour >= 9 && hour + len <= 19;
  const slotFree = (day, hour, len, selfId) =>
    onGrid(hour, len)
    && !existing.some(e => e.day === day && e.hour < hour + len && e.hour + e.len > hour)
    && !blocks.some(b => b.id !== selfId && b.day === day && b.hour < hour + len && b.hour + b.len > hour);

  // Tap a block to select it; tap it again to confirm.
  const onBlockClick = (id) => {
    if (selected === id) {
      setBlocks(bs => bs.map(b => b.id === id ? { ...b, confirmed: true } : b));
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  // With a block selected, tap a free cell to move it there.
  const onCellClick = (day, hour) => {
    if (selected == null) return;
    const blk = blocks.find(b => b.id === selected);
    if (!blk) return;
    if (!slotFree(day, hour, blk.len, blk.id)) {
      dispatch({ type: 'TOAST', msg: 'אין מספיק מקום פנוי כאן' });
      return;
    }
    setBlocks(bs => bs.map(b => b.id === selected ? { ...b, day, hour, confirmed: false } : b));
  };

  // "סדר מחדש" — Scout re-resolves any conflicting block into the first free slot.
  const rearrange = () => {
    setSelected(null);
    setBlocks(bs => bs.map(b => {
      const free = (d, h) => onGrid(h, b.len)
        && !existing.some(e => e.day === d && e.hour < h + b.len && e.hour + e.len > h)
        && !bs.some(o => o.id !== b.id && o.day === d && o.hour < h + b.len && o.hour + o.len > h);
      if (free(b.day, b.hour)) return b;
      for (let h = 9; h <= 19 - b.len; h++) if (free(b.day, h)) return { ...b, hour: h, confirmed: false };
      for (let d = 0; d < 7; d++) for (let h = 9; h <= 19 - b.len; h++) if (free(d, h)) return { ...b, day: d, hour: h, confirmed: false };
      return b;
    }));
    dispatch({ type: 'TOAST', msg: 'Scout סידר מחדש את הבלוקים' });
  };

  // Persist the final arrangement so the diary reflects it, then open reminders.
  const goReminders = () => {
    dispatch({ type: 'SET_CALENDAR_BLOCKS', blocks });
    dispatch({ type: 'OPEN_SHEET_S', sheet: 'reminders' });
  };

  return (
    <div className="screen">
      <AppBar
        title="תכנון השבוע"
        subtitle="הצעת חלוקה מ-Scout"
        leading={
          <span className="icon-btn ghost" onClick={() => dispatch({ type: 'GO_S', target: 'taskDetail' })}>
            <Icon name="chevron-right" size={22} />
          </span>
        }
        compact
      />
      <div className="screen-scroll" style={{ paddingBottom: 150 }}>
        <div style={{ padding: '0 14px 10px' }}>
          <ScoutCard
            title="חלוקה מומלצת"
            suggestion={
              <div>
                <b>3 בלוקים של ‎2 שעות</b> במהלך 4 הימים הקרובים. הוקדמתי מעט כדי להשאיר חלון לבדיקות לפני הדדליין.
              </div>
            }
            why={
              <>
                <ul style={{ margin: '0 18px 0 0', padding: 0, color: 'var(--text-soft)' }}>
                  <li>בחרתי שעות בוקר — לפי הנתונים שלך אתה הכי פוקוסי לפני 12:00</li>
                  <li>הימנעות מימי ד' אחה"צ (יש פגישת קבוצה)</li>
                  <li>נשארת 4 שעות חיץ לתיקונים לפני 1.6</li>
                </ul>
              </>
            }
          />
        </div>

        {/* Week strip */}
        <div style={{ padding: '0 14px' }}>
          <div className="space-between" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>26 — 1 ביוני</div>
            <div className="row" style={{ gap: 6 }}>
              <span className="chip" style={{ background: 'color-mix(in oklch, var(--text) 30%, transparent)', color: 'white' }}>קיים</span>
              <span className="chip scout">Scout</span>
            </div>
          </div>

          <div className="cal-grid">
            <div className="cal-cell header"> </div>
            {DAYS.map((d, i) => (
              <div key={d} className="cal-cell header">
                {d}<br/>
                <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-mute)' }}>{26 + i > 31 ? (26 + i - 31) : 26 + i}</span>
              </div>
            ))}
            {HOURS.map(h => (
              <React.Fragment key={h}>
                <div className="cal-cell hour" style={{ minHeight: 38 }}>{h}:00</div>
                {DAYS.map((d, di) => {
                  // existing block in this cell?
                  const ex = existing.find(e => e.day === di && e.hour === h);
                  const sc = blocks.find(b => b.day === di && b.hour === h);
                  const conflict = sc && existing.some(e => e.day === di && e.hour < h + 2 && e.hour + e.len > h);
                  const moveTarget = !ex && !sc && selected != null;
                  return (
                    <div key={di} className="cal-cell"
                      style={{ minHeight: 38, cursor: moveTarget ? 'pointer' : 'default' }}
                      onClick={moveTarget ? () => onCellClick(di, h) : undefined}>
                      {ex && (
                        <div className="cal-block existing" style={{ height: 38 * ex.len - 4 }}>
                          {ex.label}
                        </div>
                      )}
                      {sc && (
                        <div
                          className={`cal-block scout ${sc.confirmed ? 'confirmed' : ''} ${conflict ? 'conflict' : ''} ${selected === sc.id ? 'selected' : ''}`}
                          style={{ height: 38 * sc.len - 4 }}
                          onClick={(e) => { e.stopPropagation(); onBlockClick(sc.id); }}
                        >
                          {conflict ? '⚠ ' : sc.confirmed ? '✓ ' : selected === sc.id ? '● ' : ''}תשלום ‎{sc.len}ש
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="row" style={{ gap: 8 }}>
              <Icon name={confirmed ? 'check-circle-2' : 'info'} size={14} color={confirmed ? 'var(--green)' : 'var(--text-mute)'} />
              <span className="small muted">
                {confirmed
                  ? 'כל הבלוקים אושרו ✓'
                  : selected != null
                    ? 'הבלוק נבחר — הקש על משבצת פנויה כדי להזיז, או על הבלוק שוב כדי לאשר.'
                    : 'הקש על בלוק כדי לבחור, ואז על משבצת פנויה כדי להזיז. הקש שוב לאישור.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 72,
        background: 'var(--card)', borderTop: '1px solid var(--hair)',
        padding: '12px 14px 14px',
      }}>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn subtle" style={{ flex: 1 }} onClick={rearrange}>
            <Icon name="shuffle" size={14} />
            סדר מחדש
          </button>
          <button className="btn primary" style={{ flex: 2 }} onClick={goReminders}>
            המשך לתזכורות
            <Icon name="arrow-left" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────── S5 Reminders sheet ─────────
function RemindersSheet({ state, dispatch }) {
  const opts = [
    { id: 'before10', label: '10 דקות לפני כל בלוק', icon: 'bell', default: true },
    { id: 'morning', label: 'סיכום של יום העבודה בבוקר', icon: 'sun', default: true },
    { id: 'day', label: 'יום לפני הדדליין', icon: 'calendar-clock', default: true },
    { id: 'final', label: '4 שעות לפני הדדליין', icon: 'alarm-clock', default: false },
  ];
  const [picked, setPicked] = React.useState(() => Object.fromEntries(opts.map(o => [o.id, o.default])));
  const save = () => {
    dispatch({ type: 'CLOSE_SHEET_S' });
    dispatch({ type: 'GO_S', target: 'confirmation' });
  };
  return (
    <Sheet
      open={state.sheetS === 'reminders'}
      onClose={() => dispatch({ type: 'CLOSE_SHEET_S' })}
      title="תזכורות"
      subtitle="ערוצי תזכורת לבלוקים שלך"
      footer={<button className="btn primary block" onClick={save}>שמור והפעל</button>}
    >
      <div className="col" style={{ gap: 8 }}>
        {opts.map(o => (
          <div
            key={o.id}
            className="card flat"
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => setPicked(p => ({ ...p, [o.id]: !p[o.id] }))}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--chip)', color: 'var(--text-soft)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={o.icon} size={16} />
            </div>
            <div style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{o.label}</div>
            <div className={`switch ${picked[o.id] ? 'on' : ''}`} />
          </div>
        ))}
      </div>

      <div className="scout-banner" style={{ marginTop: 14 }}>
        <Icon name="bell-ring" size={16} color="var(--scout)" />
        <div className="small" style={{ color: 'var(--text-soft)' }}>
          תזכורות יישלחו רק אליך. אף אחד בקבוצה לא יראה.
        </div>
      </div>
    </Sheet>
  );
}

// ───────── S6 Confirmation ─────────
function StudentConfirmation({ state, dispatch }) {
  // Reflect the blocks the student actually planned (persisted from the calendar).
  const DAY_NAMES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  const fmtBlock = (b) => {
    const date = 26 + b.day > 31 ? 26 + b.day - 31 : 26 + b.day;
    const month = 26 + b.day > 31 ? 6 : 5;
    const pad = (n) => String(n).padStart(2, '0');
    return `${DAY_NAMES[b.day]}' ${date}.${month} · ${pad(b.hour)}:00 — ${pad(b.hour + b.len)}:00`;
  };
  const blocks = state.calendarBlocks;
  return (
    <div className="screen">
      <AppBar title="" compact />
      <div className="screen-scroll" style={{ padding: '40px 20px 100px' }}>
        <div className="success-circle">
          <Icon name="check" size={40} strokeWidth={2.6} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>קלטנו את המשימה</div>
          <div className="small muted" style={{ marginTop: 6 }}>
            סטטוס: <b>בתהליך</b> · ‎{blocks.length} בלוקים נקבעו ביומן · ‎3 תזכורות הופעלו
          </div>
        </div>

        <div className="col" style={{ marginTop: 24, gap: 10 }}>
          <div className="card">
            <div className="space-between">
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>אינטגרציית API לתשלום</div>
                <div className="small muted" style={{ marginTop: 2 }}>‎P1 · דדליין ‎1.6</div>
              </div>
              <span className="chip green dot">פעיל</span>
            </div>
            <div className="divider" />
            <div className="col" style={{ gap: 6 }}>
              {blocks.map(b => (
                <div key={b.id} className="row" style={{ gap: 8 }}>
                  <Icon name="calendar" size={14} color="var(--text-mute)" />
                  <span className="small">{fmtBlock(b)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="scout-banner">
            <Icon name="sparkles" size={16} color="var(--scout)" />
            <div className="small" style={{ color: 'var(--text-soft)' }}>
              אני אזכיר לך 10 דקות לפני כל בלוק. בהצלחה!
            </div>
          </div>
        </div>

        <div className="col" style={{ marginTop: 24, gap: 8 }}>
          <button className="btn primary block" onClick={() => dispatch({ type: 'GO_S', target: 'dashboard' })}>
            חזרה לדאשבורד
          </button>
          <button className="btn ghost block" onClick={() => dispatch({ type: 'GO_S', target: 'calendar' })}>
            הצג ביומן
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  StudentDashboard, StudentTaskDetail, EffortSheet, AskScoutSheet,
  StudentCalendar, RemindersSheet, StudentConfirmation,
});
