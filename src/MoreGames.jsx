import { useState, useEffect, useMemo, useRef } from "react";

const W = [
  ["apple","olma","🍎"],["cat","mushuk","🐱"],["dog","it","🐶"],["book","kitob","📚"],["sun","quyosh","☀️"],
  ["car","mashina","🚗"],["fish","baliq","🐟"],["house","uy","🏠"],["tree","daraxt","🌳"],["milk","sut","🥛"],
  ["bird","qush","🐦"],["star","yulduz","⭐"],["water","suv","💧"],["banana","banan","🍌"],["pencil","qalam","✏️"],
  ["moon","oy","🌙"],["flower","gul","🌸"],["bread","non","🍞"],["ball","to'p","⚽"],["cake","tort","🍰"],
  ["red","qizil","🔴"],["blue","ko'k","🔵"],["green","yashil","🟢"],["yellow","sariq","🟡"],["pizza","pitsa","🍕"],
  ["rain","yomg'ir","🌧️"],["snow","qor","❄️"],["horse","ot","🐴"],["cow","sigir","🐄"],["chicken","tovuq","🐔"],
  ["egg","tuxum","🥚"],["door","eshik","🚪"],["clock","soat","⏰"],["phone","telefon","📱"],["shoe","poyabzal","👟"],
  ["hat","shlyapa","🎩"],["rabbit","quyon","🐰"],["lion","sher","🦁"],["monkey","maymun","🐵"],["rose","atirgul","🌹"],
].map(([en, uz, e]) => ({ en, uz, e }));
const SENTS = [
  ["I like apples", "Men olmani yaxshi ko'raman"], ["The cat is small", "Mushuk kichkina"],
  ["She has a red ball", "Uning qizil to'pi bor"], ["We play in the park", "Biz bog'da o'ynaymiz"],
  ["My dog can run", "Mening itim yugura oladi"], ["He reads a book", "U kitob o'qiydi"],
  ["The sun is hot", "Quyosh issiq"], ["I drink milk every day", "Men har kuni sut ichaman"],
  ["They are my friends", "Ular mening do'stlarim"], ["The bird can fly", "Qush ucha oladi"],
];
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pick = (n) => shuffle(W).slice(0, n);
const options = (w) => shuffle([w, ...shuffle(W.filter((x) => x.en !== w.en)).slice(0, 3)]);

/* 1. Harf teruvchi: harflarni tartib bilan bos */
function Letters({ finish }) {
  const words = useMemo(() => pick(5), []);
  const [i, setI] = useState(0);
  const [got, setGot] = useState([]);
  const [wrong, setWrong] = useState(0);
  const w = words[i];
  const bank = useMemo(() => shuffle([...w.en].map((c, k) => ({ c, k }))), [i]);
  const tap = (l) => {
    if (got.includes(l.k) || l.c !== w.en[got.length]) { if (!got.includes(l.k)) setWrong((x) => x + 1); return; }
    const n = [...got, l.k];
    setGot(n);
    if (n.length === w.en.length) setTimeout(() => {
      if (i === 4) finish(Math.max(10, 60 - wrong * 4), wrong === 0); else { setI(i + 1); setGot([]); }
    }, 500);
  };
  return (
    <div className="center">
      <div className="hud"><span>❌ {wrong}</span><span>{i + 1}/5</span></div>
      <div className="bigemo">{w.e}</div>
      <p className="prompt">{w.uz}</p>
      <div className="slots">{[...w.en].map((c, k) => <span key={k} className="slot">{got[k] !== undefined ? c : ""}</span>)}</div>
      <div className="bank">{bank.map((l) => (
        <button key={l.k} className="chip drag" disabled={got.includes(l.k)} onClick={() => tap(l)}>{l.c}</button>))}</div>
    </div>
  );
}

/* 2. Yozish poygasi: klaviaturada yoz */
function Typing({ finish }) {
  const words = useMemo(() => pick(8), []);
  const [i, setI] = useState(0);
  const [v, setV] = useState("");
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(false);
  const [t, setT] = useState(60);
  useEffect(() => { const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { if (t === 0) finish(ok * 10, false); }, [t]);
  const w = words[i];
  const next = (good) => {
    const n = ok + (good ? 1 : 0);
    setV("");
    if (i === 7) finish(n * 10, n === 8); else { setOk(n); setI(i + 1); }
  };
  const submit = (e) => {
    e.preventDefault();
    if (v.trim().toLowerCase() === w.en) next(true);
    else { setBad(true); setTimeout(() => setBad(false), 400); }
  };
  return (
    <div className="center">
      <div className="hud"><span>⏱ {t}s</span><span>✅ {ok}</span></div>
      <div className="bigemo">{w.e}</div>
      <p className="prompt">{w.uz} <small>({w.en.length} harf)</small></p>
      <form onSubmit={submit}>
        <input className={"typebox" + (bad ? " shake" : "")} autoFocus value={v} onChange={(e) => setV(e.target.value)} placeholder="Inglizchasini yoz..." />
        <div className="row"><button className="btn" type="submit">Tekshir</button>
          <button className="ghost" type="button" onClick={() => next(false)}>O'tkazib yubor</button></div>
      </form>
    </div>
  );
}

/* 3. Mashina poygasi: to'g'ri javob = mashina oldinga */
function Race({ finish }) {
  const qs = useMemo(() => pick(8).map((w) => ({ w, opts: options(w) })), []);
  const [i, setI] = useState(0);
  const [me, setMe] = useState(0);
  const [bot, setBot] = useState(0);
  const [ok, setOk] = useState(0);
  const over = useRef(false);
  useEffect(() => { const id = setInterval(() => setBot((b) => b + 1), 6000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (over.current) return;
    if (me >= 8) { over.current = true; finish(ok * 10 + (bot < 8 ? 20 : 0), ok === 8); }
    else if (bot >= 8 || i >= 8) { over.current = true; finish(ok * 10, false); }
  }, [me, bot, i]);
  if (i >= 8) return null;
  const pickOpt = (o) => { if (o.en === qs[i].w.en) { setMe((m) => m + 1); setOk((x) => x + 1); } setI(i + 1); };
  return (
    <div>
      <div className="track"><span style={{ left: me * 11 + "%" }}>🏎️</span><span style={{ left: bot * 11 + "%", top: 38 }}>🚙</span><em>🏁</em></div>
      <div className="bigemo">{qs[i].w.e}</div>
      <p className="prompt">Bu inglizchada nima?</p>
      <div className="opts">{qs[i].opts.map((o) => <button key={o.en} className="chip" onClick={() => pickOpt(o)}>{o.en}</button>)}</div>
    </div>
  );
}

/* 4. Sehrli so'z: harf topish, 6 ta jon */
function Hang({ finish }) {
  const rounds = useMemo(() => pick(3), []);
  const [r, setR] = useState(0);
  const [g, setG] = useState([]);
  const [lives, setLives] = useState(6);
  const [won, setWon] = useState(0);
  const [miss, setMiss] = useState(0);
  const w = rounds[r].en;
  const next = (win) => {
    const nw = won + (win ? 1 : 0);
    if (r === 2) finish(nw * 20, nw === 3 && miss === 0);
    else { setWon(nw); setR(r + 1); setG([]); setLives(6); }
  };
  const press = (ch) => {
    if (g.includes(ch) || lives === 0) return;
    const ng = [...g, ch];
    setG(ng);
    if (!w.includes(ch)) { setMiss((m) => m + 1); const l = lives - 1; setLives(l); if (l === 0) setTimeout(() => next(false), 900); }
    else if ([...w].every((c) => ng.includes(c))) setTimeout(() => next(true), 500);
  };
  return (
    <div className="center">
      <div className="hud"><span>{"❤️".repeat(lives) || "💔"}</span><span>{r + 1}/3</span></div>
      <div className="bigemo">{rounds[r].e}</div>
      <p className="prompt">{rounds[r].uz}</p>
      <div className="slots">{[...w].map((c, k) => <span key={k} className="slot">{g.includes(c) || lives === 0 ? c : ""}</span>)}</div>
      <div className="kb">{"abcdefghijklmnopqrstuvwxyz".split("").map((c) => (
        <button key={c} className={"key" + (g.includes(c) ? (w.includes(c) ? " yes" : " no") : "")} onClick={() => press(c)}>{c}</button>))}</div>
    </div>
  );
}

/* 5. Gap tuzish: so'zlarni tartibga sol */
function Sentence({ finish }) {
  const qs = useMemo(() => shuffle(SENTS).slice(0, 5), []);
  const [i, setI] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(0);
  const words = useMemo(() => shuffle(qs[i][0].split(" ").map((w, k) => ({ w, k }))), [i]);
  const check = () => {
    if (placed.map((k) => words.find((x) => x.k === k).w).join(" ") === qs[i][0]) {
      if (i === 4) finish(Math.max(10, 60 - wrong * 6), wrong === 0); else { setI(i + 1); setPlaced([]); }
    } else { setWrong((x) => x + 1); setPlaced([]); }
  };
  return (
    <div className="center">
      <div className="hud"><span>❌ {wrong}</span><span>{i + 1}/5</span></div>
      <p className="prompt">Inglizchaga o'gir: <b>{qs[i][1]}</b></p>
      <div className="line">{placed.map((k) => (
        <button key={k} className="chip drag" onClick={() => setPlaced(placed.filter((x) => x !== k))}>{words.find((x) => x.k === k).w}</button>))}</div>
      <div className="bank">{words.filter((x) => !placed.includes(x.k)).map((x) => (
        <button key={x.k} className="chip" onClick={() => setPlaced([...placed, x.k])}>{x.w}</button>))}</div>
      <button className="btn" disabled={placed.length !== words.length} onClick={check}>Tekshir</button>
    </div>
  );
}

/* 6. Ha yoki yo'q: 3 soniyada javob ber */
function TrueFalse({ finish }) {
  const qs = useMemo(() => pick(15).map((w) => {
    const t = Math.random() < 0.5;
    return { w, t, shown: t ? w.uz : shuffle(W.filter((x) => x.en !== w.en))[0].uz };
  }), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [st, setSt] = useState(0);
  const [miss, setMiss] = useState(0);
  const q = qs[i];
  const answer = (v) => {
    const good = v === q.t;
    const ns = good ? st + 1 : 0;
    const sc = score + (good ? 5 + (ns >= 3 ? 2 : 0) : 0);
    setSt(ns); setScore(sc);
    if (!good) setMiss((m) => m + 1);
    if (i === 14) finish(sc, miss === 0 && good); else setI(i + 1);
  };
  useEffect(() => { const id = setTimeout(() => answer(null), 3000); return () => clearTimeout(id); }, [i]);
  return (
    <div className="center">
      <div className="hud"><span>🔥 {st}</span><span>⭐ {score}</span></div>
      <div key={i} className="timebar" />
      <div className="bigemo">{q.w.e}</div>
      <p className="prompt"><b>{q.w.en}</b> = {q.shown}</p>
      <div className="row"><button className="btn tf yes" onClick={() => answer(true)}>✔ Ha</button>
        <button className="btn tf no" onClick={() => answer(false)}>✖ Yo'q</button></div>
    </div>
  );
}

/* 7. So'z qidirish: harflar katagidan so'z top */
function Search({ finish }) {
  const N = 8;
  const { grid, words } = useMemo(() => {
    const g = Array(N * N).fill("");
    const placed = [];
    pick(4).forEach((w) => {
      const t = w.en.toUpperCase();
      for (let k = 0; k < 200; k++) {
        const h = Math.random() < 0.5;
        const r = Math.floor(Math.random() * (h ? N : N - t.length + 1));
        const c = Math.floor(Math.random() * (h ? N - t.length + 1 : N));
        const idx = [...t].map((_, j) => (h ? r * N + c + j : (r + j) * N + c));
        if (idx.every((x, j) => g[x] === "" || g[x] === t[j])) { idx.forEach((x, j) => (g[x] = t[j])); placed.push(w); break; }
      }
    });
    const L = "ABCDEFGHIJKLMNOPRSTUWY";
    return { grid: g.map((x) => x || L[Math.floor(Math.random() * L.length)]), words: placed };
  }, []);
  const [sel, setSel] = useState([]);
  const [found, setFound] = useState([]);
  const [cells, setCells] = useState([]);
  const [clr, setClr] = useState(0);
  useEffect(() => { if (found.length === words.length) finish(Math.max(20, 60 - clr * 3), clr === 0); }, [found]);
  const tap = (i) => {
    if (sel.includes(i) || cells.includes(i)) return;
    const n = [...sel, i];
    const s = n.map((x) => grid[x]).join("").toLowerCase();
    const hit = words.find((w) => !found.includes(w.en) && (w.en === s || [...w.en].reverse().join("") === s));
    if (hit) { setFound((f) => [...f, hit.en]); setCells((c) => [...c, ...n]); setSel([]); } else setSel(n);
  };
  return (
    <div className="center">
      <div className="hud"><span>🔎 {found.length}/{words.length}</span><button className="ghost" onClick={() => { setSel([]); setClr((c) => c + 1); }}>Tozalash</button></div>
      <p className="prompt">Topish kerak: {words.map((w) => (
        <span key={w.en} className={"find" + (found.includes(w.en) ? " got" : "")}>{w.e} {w.uz}</span>))}</p>
      <div className="wgrid">{grid.map((c, i) => (
        <button key={i} className={"cell" + (sel.includes(i) ? " sel" : "") + (cells.includes(i) ? " ok" : "")} onClick={() => tap(i)}>{c}</button>))}</div>
    </div>
  );
}

/* 8. Eshitib top: so'zni tingla, rasmni tanla */
function Listen({ finish }) {
  const qs = useMemo(() => pick(8).map((w) => ({ w, opts: options(w) })), []);
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(qs[i].w.en);
      u.lang = "en-US"; u.rate = 0.85;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) {}
  };
  useEffect(() => { speak(); }, [i]);
  const answer = (o) => {
    const n = ok + (o.en === qs[i].w.en ? 1 : 0);
    if (i === 7) finish(n * 10, n === 8); else { setOk(n); setI(i + 1); }
  };
  return (
    <div className="center">
      <div className="hud"><span>✅ {ok}</span><span>{i + 1}/8</span></div>
      <button className="btn speaker" onClick={speak}>🔊 Tingla</button>
      <p className="prompt">Eshitgan so'zingga mos rasmni tanla</p>
      <div className="opts">{qs[i].opts.map((o) => <button key={o.en} className="chip emochip" onClick={() => answer(o)}>{o.e}</button>)}</div>
    </div>
  );
}

export const MORE_GAMES = [
  { id: "letters", name: "Harf teruvchi", emoji: "🔤", desc: "Harflarni to'g'ri tartibda bos.", color: "#B26BFF", C: Letters },
  { id: "typing", name: "Yozish poygasi", emoji: "⌨️", desc: "60 soniyada iloji boricha ko'p so'z yoz.", color: "#2FB457", C: Typing },
  { id: "race", name: "Mashina poygasi", emoji: "🏎️", desc: "To'g'ri javob bersang mashinang oldinga yuradi.", color: "#FF4D5E", C: Race },
  { id: "hang", name: "Sehrli so'z", emoji: "🪄", desc: "Harflarni topib so'zni och, 6 ta jon bor.", color: "#3BA7FF", C: Hang },
  { id: "sentence", name: "Gap tuz", emoji: "🧩", desc: "So'zlarni tartibga solib gap yasa.", color: "#F2A900", C: Sentence },
  { id: "tf", name: "Ha yoki yo'q", emoji: "⚡", desc: "3 soniyada to'g'ri yoki xato de!", color: "#FF8A1F", C: TrueFalse },
  { id: "search", name: "So'z qidirish", emoji: "🔎", desc: "Harflar orasidan yashirin so'zlarni top.", color: "#1FA89A", C: Search },
  { id: "listen", name: "Eshitib top", emoji: "🎧", desc: "So'zni eshit va to'g'ri rasmni tanla.", color: "#E0559B", C: Listen },
];

export const MORE_CSS = `
.center{text-align:center}
.bigemo{font-size:clamp(64px,18vw,96px);margin:8px 0}
.slots{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:10px 0}
.slot{width:38px;height:48px;border-bottom:5px solid var(--carrot);font:800 28px 'Baloo 2',sans-serif;display:grid;place-items:center;text-transform:uppercase}
.typebox{width:100%;max-width:360px;font:800 24px 'Baloo 2',sans-serif;text-align:center;padding:12px;border:4px solid var(--butter);border-radius:16px;margin-bottom:12px;color:var(--ink)}
.track{position:relative;height:84px;background:#d9efe0;border-radius:16px;margin-bottom:6px;overflow:hidden}
.track span{position:absolute;top:4px;font-size:32px;transition:left .5s}
.track em{position:absolute;right:6px;top:20px;font-size:32px;font-style:normal}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:420px;margin:0 auto}
.emochip{font-size:48px;padding:14px}
.kb{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:460px;margin:8px auto}
.key{width:40px;height:44px;border-radius:12px;background:var(--butter);font:800 18px 'Nunito',sans-serif;color:var(--ink);text-transform:uppercase}
.key.yes{background:var(--leaf);color:#fff}.key.no{background:var(--red);color:#fff;opacity:.6}
.line{min-height:56px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;border-bottom:4px dashed var(--butter);padding-bottom:10px;margin-bottom:10px}
.timebar{height:10px;background:var(--red);border-radius:99px;transform-origin:left;animation:drain 3s linear forwards}
@keyframes drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.tf{font-size:22px;padding:16px 28px}.tf.yes{background:var(--leaf)}.tf.no{background:var(--red)}
.wgrid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;max-width:400px;margin:10px auto}
.cell{aspect-ratio:1;border-radius:10px;background:var(--butter);font:800 clamp(14px,4vw,20px) 'Nunito',sans-serif;color:var(--ink)}
.cell.sel{background:var(--carrot);color:#fff}.cell.ok{background:var(--leaf);color:#fff}
.find{display:inline-block;background:var(--butter);border-radius:10px;padding:2px 10px;margin:3px;font-size:16px}
.find.got{background:var(--leaf);color:#fff;text-decoration:line-through}
.speaker{font-size:26px;padding:18px 34px;margin:12px 0}
`;
