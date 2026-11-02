import { useState, useEffect, useMemo } from "react";

/* ================= MA'LUMOT ================= */
const WORDS = [
  ["apple","olma","🍎"],["cat","mushuk","🐱"],["dog","it","🐶"],["book","kitob","📚"],
  ["sun","quyosh","☀️"],["car","mashina","🚗"],["fish","baliq","🐟"],["house","uy","🏠"],
  ["tree","daraxt","🌳"],["milk","sut","🥛"],["bird","qush","🐦"],["star","yulduz","⭐"],
  ["water","suv","💧"],["banana","banan","🍌"],["pencil","qalam","✏️"],["moon","oy","🌙"],
  ["flower","gul","🌸"],["bread","non","🍞"],["ball","to'p","⚽"],["cake","tort","🍰"],
].map(([en, uz, e]) => ({ en, uz, e }));

// Hozircha namunaviy sinfdoshlar. Keyinchalik Supabase jadvalidan olinadi.
const CLASSMATES = [
  { name: "Aziza", avatar: "🦄", xp: 540 }, { name: "Javohir", avatar: "🐯", xp: 410 },
  { name: "Madina", avatar: "🐼", xp: 365 }, { name: "Sardor", avatar: "🚀", xp: 250 },
  { name: "Nilufar", avatar: "🦋", xp: 180 }, { name: "Bekzod", avatar: "🐸", xp: 90 },
];
export const AVATARS = ["🦊","🐯","🐼","🦄","🚀","🐸","🦋","🐧","🦁","🐙"];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pick = (n) => shuffle(WORDS).slice(0, n);
const isoDay = (d = new Date()) => d.toISOString().slice(0, 10);
export const KEY = "english-arena-v1";

function freshDaily() { return { date: isoDay(), games: 0, xp: 0, perfect: 0, claimed: [] }; }

export function loadProfile() {
  let p = null;
  try { p = JSON.parse(localStorage.getItem(KEY)); } catch (e) { p = null; }
  if (!p) p = { name: "Yangi o'quvchi", avatar: "🦊", xp: 0, streak: 1, last: isoDay(), games: 0, daily: freshDaily() };
  const t = isoDay();
  if (p.last !== t) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    p.streak = p.last === isoDay(y) ? p.streak + 1 : 1;
    p.last = t;
  }
  if (p.daily.date !== t) p.daily = freshDaily();
  return p;
}

/* ================= O'YINLAR ================= */
function Whack({ finish }) {
  const [t, setT] = useState(20);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState({ target: WORDS[0], holes: Array(9).fill(null) });
  const [hit, setHit] = useState(null);

  const spawn = () => {
    const w = pick(4);
    const spots = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4);
    const holes = Array(9).fill(null);
    spots.forEach((s, i) => (holes[s] = w[i]));
    setRound({ target: w[Math.floor(Math.random() * 4)], holes });
  };
  useEffect(() => {
    spawn();
    const a = setInterval(spawn, 1600);
    const b = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  useEffect(() => { if (t === 0) finish(score, false); }, [t]);

  const tap = (i) => {
    const w = round.holes[i];
    if (!w) return;
    const ok = w.en === round.target.en;
    setScore((s) => Math.max(0, s + (ok ? 10 : -5)));
    setHit({ i, ok });
    setTimeout(() => setHit(null), 350);
    if (ok) spawn();
  };

  return (
    <div>
      <div className="hud"><span>⏱ {t}s</span><span>⭐ {score}</span></div>
      <p className="prompt">Uzbekcha: <b>{round.target.uz}</b> — inglizchasini bos!</p>
      <div className="holes">
        {round.holes.map((w, i) => (
          <button key={i} className={"hole" + (w ? " up" : "") + (hit && hit.i === i ? (hit.ok ? " good" : " bad") : "")} onClick={() => tap(i)}>
            {w ? <><span className="mole">🐹</span><span className="tag">{w.en}</span></> : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

function Memory({ finish }) {
  const cards = useMemo(() => shuffle(pick(6).flatMap((w) => [
    { id: w.en + "a", key: w.en, label: w.en, side: "en" },
    { id: w.en + "b", key: w.en, label: w.uz, side: "uz" },
  ])), []);
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => { if (done.length === 12) finish(Math.max(10, 70 - moves * 4), moves === 6); }, [done]);

  const flip = (c) => {
    if (open.length === 2 || open.includes(c.id) || done.includes(c.id)) return;
    const next = [...open, c.id];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [x, y] = next.map((id) => cards.find((k) => k.id === id));
      if (x.key === y.key) setTimeout(() => { setDone((d) => [...d, x.id, y.id]); setOpen([]); }, 400);
      else setTimeout(() => setOpen([]), 850);
    }
  };

  return (
    <div>
      <div className="hud"><span>🔁 Urinish: {moves}</span><span>✅ {done.length / 2}/6</span></div>
      <p className="prompt">Inglizcha va o'zbekcha juftlarni top!</p>
      <div className="mem">
        {cards.map((c) => {
          const shown = open.includes(c.id) || done.includes(c.id);
          return (
            <button key={c.id} className={"card" + (shown ? " shown " + c.side : "") + (done.includes(c.id) ? " ok" : "")} onClick={() => flip(c)}>
              {shown ? c.label : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Match({ finish }) {
  const pairs = useMemo(() => pick(6), []);
  const right = useMemo(() => shuffle(pairs), [pairs]);
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState({});
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState(null);
  const colors = ["#FF8A1F", "#2FB457", "#3BA7FF", "#FF4D5E", "#B26BFF", "#F2B705"];

  useEffect(() => { if (Object.keys(done).length === 6) finish(Math.max(10, 60 - wrong * 5), wrong === 0); }, [done]);

  const clickRight = (w) => {
    if (!sel || done[w.en]) return;
    if (sel === w.en) { setDone((d) => ({ ...d, [w.en]: colors[Object.keys(d).length] })); setSel(null); }
    else { setWrong((x) => x + 1); setFlash(w.en); setTimeout(() => setFlash(null), 400); }
  };

  return (
    <div>
      <div className="hud"><span>❌ Xato: {wrong}</span><span>🔗 {Object.keys(done).length}/6</span></div>
      <p className="prompt">Chapdan so'z tanla, o'ngdan tarjimasini bos.</p>
      <div className="match">
        <div>{pairs.map((w) => (
          <button key={w.en} className={"chip" + (sel === w.en ? " sel" : "")} style={done[w.en] ? { background: done[w.en], color: "#fff" } : null}
            onClick={() => !done[w.en] && setSel(w.en)}>{w.en}</button>
        ))}</div>
        <div>{right.map((w) => (
          <button key={w.uz} className={"chip" + (flash === w.en ? " shake" : "")} style={done[w.en] ? { background: done[w.en], color: "#fff" } : null}
            onClick={() => clickRight(w)}>{w.uz}</button>
        ))}</div>
      </div>
    </div>
  );
}

function Drag({ finish }) {
  const items = useMemo(() => pick(6), []);
  const chips = useMemo(() => shuffle(items), [items]);
  const [placed, setPlaced] = useState({});
  const [wrong, setWrong] = useState(0);
  const [sel, setSel] = useState(null);

  useEffect(() => { if (Object.keys(placed).length === 6) finish(Math.max(10, 60 - wrong * 5), wrong === 0); }, [placed]);

  const drop = (box, en) => {
    if (!en || placed[box.en]) return;
    if (en === box.en) setPlaced((p) => ({ ...p, [box.en]: true }));
    else setWrong((x) => x + 1);
    setSel(null);
  };
  const used = Object.keys(placed);

  return (
    <div>
      <div className="hud"><span>❌ Xato: {wrong}</span><span>📦 {used.length}/6</span></div>
      <p className="prompt">So'zni sudrab rasmga tashla (yoki so'zni, so'ng rasmni bos).</p>
      <div className="boxes">
        {items.map((b) => (
          <div key={b.en} className={"box" + (placed[b.en] ? " full" : "")}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => drop(b, e.dataTransfer.getData("text"))}
            onClick={() => drop(b, sel)}>
            <span className="emo">{b.e}</span>
            <small>{placed[b.en] ? b.en : "?"}</small>
          </div>
        ))}
      </div>
      <div className="bank">
        {chips.filter((w) => !placed[w.en]).map((w) => (
          <span key={w.en} draggable className={"chip drag" + (sel === w.en ? " sel" : "")}
            onDragStart={(e) => e.dataTransfer.setData("text", w.en)}
            onClick={() => setSel(w.en)}>{w.en}</span>
        ))}
      </div>
    </div>
  );
}

export const GAMES = [
  { id: "whack", name: "Ur-so'zni", emoji: "🔨", desc: "Sichqoncha yoki barmoq bilan to'g'ri so'zni ur!", color: "#FF8A1F", C: Whack },
  { id: "memory", name: "Xotira kartalari", emoji: "🧠", desc: "Juftliklarni eslab qol va top.", color: "#2FB457", C: Memory },
  { id: "match", name: "Juftlashtir", emoji: "🔗", desc: "6 ta so'zni 6 ta tarjimaga ulang.", color: "#3BA7FF", C: Match },
  { id: "drag", name: "Sudrab tashla", emoji: "🎯", desc: "So'zlarni rasmlarga sudrab joylashtir.", color: "#FF4D5E", C: Drag },
];

export function GameShell({ game, onExit, onResult }) {
  const [run, setRun] = useState(0);
  const [res, setRes] = useState(null);
  const finish = (score, perfect) => { setRes({ score, perfect }); onResult(score, perfect); };
  const G = game.C;
  return (
    <section className="shell" style={{ "--c": game.color }}>
      <header className="shellbar">
        <button className="ghost" onClick={onExit}>← Orqaga</button>
        <h2>{game.emoji} {game.name}</h2>
      </header>
      {res ? (
        <div className="result">
          <div className="big">{res.perfect ? "🏆" : res.score > 40 ? "🎉" : "👍"}</div>
          <h3>{res.perfect ? "Mukammal!" : "Zo'r o'ynading!"}</h3>
          <p className="xp">+{res.score} XP</p>
          <div className="row">
            <button className="btn" onClick={() => { setRes(null); setRun((r) => r + 1); }}>Yana o'ynash</button>
            <button className="ghost" onClick={onExit}>Bosh sahifa</button>
          </div>
        </div>
      ) : <G key={run} finish={finish} />}
    </section>
  );
}

/* ================= SAHIFALAR ================= */
function Home({ p, onPlay, onClaim }) {
  const d = p.daily;
  const tasks = [
    { id: "g2", t: "2 ta o'yin o'yna", ok: d.games >= 2, r: 20, now: Math.min(d.games, 2), max: 2 },
    { id: "x60", t: "Bugun 60 XP yig'", ok: d.xp >= 60, r: 20, now: Math.min(d.xp, 60), max: 60 },
    { id: "perf", t: "1 ta xatosiz o'yin qil", ok: d.perfect >= 1, r: 30, now: Math.min(d.perfect, 1), max: 1 },
  ];
  return (
    <>
      <div className="hero">
        <h1>English Arena</h1>
        <p>O'yna, o'rgan va sinfdoshlaringdan o'zib ket!</p>
      </div>
      <h2 className="sec">Kunlik vazifalar</h2>
      <div className="tasks">
        {tasks.map((k) => (
          <div key={k.id} className={"task" + (k.ok ? " ready" : "")}>
            <div><b>{k.t}</b><div className="bar"><i style={{ width: (k.now / k.max) * 100 + "%" }} /></div></div>
            {d.claimed.includes(k.id) ? <span className="done">✓ Olindi</span>
              : <button className="btn sm" disabled={!k.ok} onClick={() => onClaim(k.id, k.r)}>+{k.r} XP</button>}
          </div>
        ))}
      </div>
      <h2 className="sec">O'yinlar</h2>
      <div className="games">
        {GAMES.map((g) => (
          <button key={g.id} className="gcard" style={{ "--c": g.color }} onClick={() => onPlay(g)}>
            <span className="gemo">{g.emoji}</span><b>{g.name}</b><small>{g.desc}</small>
          </button>
        ))}
      </div>
    </>
  );
}

export function Profile({ p, setP }) {
  const lvl = Math.floor(p.xp / 100) + 1;
  return (
    <div className="panel">
      <div className="me"><span className="av">{p.avatar}</span>
        <input value={p.name} maxLength={18} onChange={(e) => setP({ ...p, name: e.target.value })} aria-label="Ism" /></div>
      <div className="stats">
        <div><b>{p.xp}</b><small>XP</small></div>
        <div><b>{lvl}</b><small>Daraja</small></div>
        <div><b>🔥 {p.streak}</b><small>Kun ketma-ket</small></div>
        <div><b>{p.games}</b><small>O'yin</small></div>
      </div>
      <p className="lbl">Keyingi darajagacha</p>
      <div className="bar big"><i style={{ width: (p.xp % 100) + "%" }} /></div>
      <p className="lbl">Avatar tanla</p>
      <div className="avs">{AVATARS.map((a) => (
        <button key={a} className={a === p.avatar ? "on" : ""} onClick={() => setP({ ...p, avatar: a })}>{a}</button>))}
      </div>
    </div>
  );
}

export function Rating({ p }) {
  const all = [...CLASSMATES, { name: p.name, avatar: p.avatar, xp: p.xp, me: true }].sort((a, b) => b.xp - a.xp);
  return (
    <div className="panel">
      <h2 className="sec">Sinf reytingi</h2>
      {all.map((s, i) => (
        <div key={s.name + i} className={"rank" + (s.me ? " me" : "")}>
          <span className="pos">{i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</span>
          <span className="av sm">{s.avatar}</span>
          <b>{s.name}{s.me ? " (sen)" : ""}</b>
          <span className="pts">{s.xp} XP</span>
        </div>
      ))}
    </div>
  );
}

/* ================= ASOSIY ================= */
export default function App() {
  const [p, setP] = useState(loadProfile);
  const [tab, setTab] = useState("home");
  const [game, setGame] = useState(null);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }, [p]);

  const onResult = (score, perfect) => setP((q) => ({
    ...q, xp: q.xp + score, games: q.games + 1,
    daily: { ...q.daily, games: q.daily.games + 1, xp: q.daily.xp + score, perfect: q.daily.perfect + (perfect ? 1 : 0) },
  }));
  const onClaim = (id, r) => setP((q) => ({ ...q, xp: q.xp + r, daily: { ...q.daily, claimed: [...q.daily.claimed, id] } }));

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="top">
        <b className="logo">🏟️ English Arena</b>
        <span className="pill">{p.avatar} {p.xp} XP</span>
      </header>
      <main>
        {game ? <GameShell game={game} onExit={() => setGame(null)} onResult={onResult} />
          : tab === "home" ? <Home p={p} onPlay={setGame} onClaim={onClaim} />
          : tab === "profile" ? <Profile p={p} setP={setP} />
          : <Rating p={p} />}
      </main>
      <nav className="nav">
        {[["home", "🏠", "Bosh sahifa"], ["rating", "🏆", "Reyting"], ["profile", "👤", "Profil"]].map(([id, e, l]) => (
          <button key={id} className={tab === id && !game ? "on" : ""} onClick={() => { setGame(null); setTab(id); }}>
            <span>{e}</span>{l}
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ================= DIZAYN ================= */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@600;700;800&display=swap');
:root{--carrot:#FF8A1F;--leaf:#2FB457;--butter:#FFF3B0;--cream:#FFFBE6;--ink:#2D2440;--sky:#3BA7FF;--red:#FF4D5E}
*{box-sizing:border-box}
.app{min-height:100vh;background:var(--cream);color:var(--ink);font-family:'Nunito',system-ui,sans-serif;padding-bottom:84px}
button{font-family:inherit;cursor:pointer;border:0}
main{max-width:920px;margin:0 auto;padding:16px}
.top{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--leaf);color:#fff;position:sticky;top:0;z-index:5}
.logo{font-family:'Baloo 2',sans-serif;font-size:22px}
.pill{background:var(--butter);color:var(--ink);padding:6px 14px;border-radius:999px;font-weight:800}
.hero{background:var(--carrot);color:#fff;border-radius:28px 28px 28px 6px;padding:28px 24px;margin-bottom:8px}
.hero h1{font-family:'Baloo 2',sans-serif;font-size:clamp(34px,7vw,56px);margin:0;line-height:1}
.hero p{margin:8px 0 0;font-size:18px;font-weight:700}
.sec{font-family:'Baloo 2',sans-serif;font-size:24px;margin:22px 0 10px}
.tasks{display:grid;gap:10px}
.task{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--butter);border-radius:18px;padding:14px 16px}
.task.ready{outline:3px solid var(--leaf)}
.task>div:first-child{flex:1}
.bar{height:10px;background:#fff;border-radius:99px;overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--leaf);border-radius:99px;transition:width .4s}
.bar.big{height:16px}
.done{color:var(--leaf);font-weight:800}
.btn{background:var(--c,var(--carrot));color:#fff;padding:12px 20px;border-radius:14px;font-weight:800;font-size:16px}
.btn.sm{padding:8px 14px;background:var(--leaf)}
.btn:disabled{background:#d9d3bd;cursor:not-allowed}
.ghost{background:#fff;color:var(--ink);padding:10px 16px;border-radius:14px;font-weight:800}
.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.gcard{background:var(--c);color:#fff;border-radius:24px;padding:20px;text-align:left;display:flex;flex-direction:column;gap:6px;min-height:170px;transition:transform .15s}
.gcard:hover{transform:translateY(-4px) rotate(-1deg)}
.gemo{font-size:42px}.gcard b{font-size:20px;font-family:'Baloo 2',sans-serif}.gcard small{font-size:14px;font-weight:700;opacity:.95}
.shell{background:#fff;border-radius:26px;padding:16px;border:4px solid var(--c)}
.shellbar{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.shellbar h2{margin:0;font-family:'Baloo 2',sans-serif;color:var(--c)}
.hud{display:flex;justify-content:space-between;font-weight:800;font-size:18px;background:var(--butter);padding:8px 14px;border-radius:14px}
.prompt{text-align:center;font-size:18px;font-weight:700;margin:12px 0}
.prompt b{color:var(--carrot);font-size:24px}
.holes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:460px;margin:0 auto}
.hole{aspect-ratio:1;border-radius:50% 50% 24px 24px;background:#7a4b22;position:relative;overflow:hidden}
.hole.up{background:#a8692f}
.mole{font-size:clamp(34px,10vw,56px);display:block;animation:pop .25s}
.tag{display:block;background:#fff;color:var(--ink);font-weight:800;border-radius:10px;padding:2px 8px;margin:2px auto 0;width:max-content;max-width:90%}
.hole.good{background:var(--leaf)}.hole.bad{background:var(--red)}
@keyframes pop{from{transform:translateY(40px)}to{transform:none}}
.mem{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:520px;margin:0 auto}
.card{aspect-ratio:1;border-radius:18px;background:var(--leaf);color:#fff;font-size:26px;font-weight:800}
.card.shown.en{background:var(--carrot)}.card.shown.uz{background:var(--sky)}
.card.shown{font-size:clamp(14px,3.6vw,20px)}.card.ok{opacity:.55}
.match{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:520px;margin:0 auto}
.match>div{display:grid;gap:10px;align-content:start}
.chip{display:block;width:100%;background:var(--butter);color:var(--ink);border-radius:14px;padding:12px;font-weight:800;font-size:17px;text-align:center}
.chip.sel{outline:4px solid var(--carrot)}
.chip.shake{animation:sh .4s;background:var(--red);color:#fff}
@keyframes sh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.boxes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px;margin:0 auto}
.box{aspect-ratio:1;border:4px dashed var(--sky);border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800}
.box.full{border-style:solid;border-color:var(--leaf);background:#e9f9ee}
.emo{font-size:clamp(34px,10vw,52px)}
.bank{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:16px}
.chip.drag{width:auto;cursor:grab;background:var(--carrot);color:#fff;padding:10px 18px}
.result{text-align:center;padding:20px}.big{font-size:72px}
.result h3{font-family:'Baloo 2',sans-serif;font-size:30px;margin:0}
.xp{font-size:28px;font-weight:800;color:var(--leaf);margin:6px 0 16px}
.row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.panel{background:#fff;border-radius:26px;padding:20px}
.me{display:flex;align-items:center;gap:14px}
.av{font-size:54px;background:var(--butter);border-radius:50%;width:84px;height:84px;display:grid;place-items:center}
.av.sm{font-size:26px;width:44px;height:44px}
.me input{flex:1;font:800 24px 'Baloo 2',sans-serif;border:3px solid var(--butter);border-radius:14px;padding:8px 12px;color:var(--ink);min-width:0}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:18px 0}
.stats div{background:var(--butter);border-radius:16px;padding:12px 6px;text-align:center}
.stats b{display:block;font-size:22px}.stats small{font-weight:700}
.lbl{font-weight:800;margin:14px 0 6px}
.avs{display:flex;flex-wrap:wrap;gap:8px}
.avs button{font-size:30px;background:var(--cream);border-radius:14px;padding:6px 10px}.avs .on{outline:4px solid var(--leaf)}
.rank{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;margin-bottom:8px;background:var(--cream)}
.rank.me{background:var(--butter);outline:3px solid var(--carrot)}
.pos{width:34px;text-align:center;font-size:22px;font-weight:800}.pts{margin-left:auto;font-weight:800;color:var(--leaf)}
.nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;background:#fff;border-top:4px solid var(--butter);padding:6px 0 8px;z-index:6}
.nav button{background:none;font-weight:800;font-size:13px;color:#8a8398;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 18px;border-radius:14px}
.nav button span{font-size:24px}.nav .on{color:var(--carrot);background:var(--butter)}
button:focus-visible,input:focus-visible{outline:4px solid var(--sky);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
