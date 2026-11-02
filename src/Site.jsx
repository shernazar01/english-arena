import { useState, useEffect } from "react";
import { GAMES, GameShell, Profile, Rating, loadProfile, KEY, AVATARS } from "./Arena";
import { MORE_GAMES } from "./MoreGames";
import { THEME_CSS } from "./Theme";

const ALL = [...GAMES, ...MORE_GAMES];
const GROUPS = [
  { id: "kichik", name: "Kichik guruh", age: "3–5-sinf", emoji: "🌱", text: "Oddiy so'zlar, rasmlar va qisqa o'yinlar. Hayvonlar, ranglar, mevalar." },
  { id: "orta", name: "O'rta guruh", age: "6–9-sinf", emoji: "🌿", text: "Ko'proq so'z, gap tuzish, yozish va eshitib tushunish." },
  { id: "katta", name: "Katta guruh", age: "10-sinf va 18–20 yosh", emoji: "🌳", text: "Tezkor o'yinlar, poygalar va sinfdoshlar bilan reyting kurashi." },
];
const FAQ = [
  ["Kimlar uchun?", "3-sinf o'quvchilaridan 18–20 yoshgacha bo'lgan o'quvchilar uchun. Har kim o'z guruhini tanlaydi."],
  ["Telefonda ishlaydimi?", "Ha. Sayt telefon, planshet va kompyuterda bir xil qulay ishlaydi."],
  ["Natijalarim saqlanadimi?", "Ha, XP, daraja va kunlik vazifalar shu qurilmada saqlanadi. Hisob bilan kirish (login) keyingi bosqichda ulanadi."],
  ["Yangi o'yinlar qo'shiladimi?", "Ha. O'yinlar soni muntazam ko'paytiriladi, har safar savollar yangilanib turadi."],
];

function useHash() {
  const [h, setH] = useState(() => location.hash.slice(1) || "/");
  useEffect(() => {
    const f = () => setH(location.hash.slice(1) || "/");
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return h;
}
const go = (to) => { location.hash = to; window.scrollTo(0, 0); };

function Landing({ p }) {
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState({ name: "", text: "" });
  const send = (e) => {
    e.preventDefault();
    // Hozircha xabar shu brauzerda saqlanadi. Keyin Supabase yoki email xizmatiga ulanadi.
    try {
      const old = JSON.parse(localStorage.getItem("english-arena-msgs") || "[]");
      localStorage.setItem("english-arena-msgs", JSON.stringify([...old, { ...msg, at: Date.now() }]));
    } catch (err) {}
    setSent(true); setMsg({ name: "", text: "" });
  };
  return (
    <>
      <section className="lhero">
        <h1>O'yna.<br />O'rgan.<br />G'olib bo'l!</h1>
        <p>Ingliz tilini o'yin orqali o'rgan: 3-sinfdan 18–20 yoshgacha, telefonda ham, kompyuterda ham.</p>
        <div className="row left">
          <button className="btn big" onClick={() => go(p.registered ? "/games" : "/start")}>{p.registered ? "O'yinlarga o'tish" : "Boshlash"}</button>
          <a className="ghost" href="#/rating">Reytingni ko'r</a>
        </div>
        <div className="tiles">
          {ALL.map((g, i) => (
            <a key={g.id} href="#/games" className="tile" style={{ background: g.color, transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
              <span>{g.emoji}</span><b>{g.name}</b>
            </a>
          ))}
        </div>
      </section>

      <h2 className="sec">Nimalar bor?</h2>
      <div className="feats">
        {[["🎮", `${ALL.length} ta o'yin`, "Bosish, sudrash, yozish, eshitish: har o'yin boshqacha."],
          ["📅", "Kunlik vazifalar", "Har kuni yangi vazifa va qo'shimcha XP."],
          ["🏆", "Sinf reytingi", "Sinfdoshlaring bilan XP bo'yicha musobaqa."],
          ["👤", "Shaxsiy profil", "Daraja, ketma-ket kunlar va avatar."]].map(([e, t, d]) => (
          <div key={t} className="feat"><span>{e}</span><b>{t}</b><p>{d}</p></div>))}
      </div>

      <h2 className="sec">Guruhlar</h2>
      <div className="feats">
        {GROUPS.map((g) => (
          <div key={g.id} className="feat group"><span>{g.emoji}</span><b>{g.name}</b><small>{g.age}</small><p>{g.text}</p></div>))}
      </div>

      <h2 className="sec">Qanday ishlaydi?</h2>
      <ol className="steps">
        <li><b>Ro'yxatdan o't</b> ismingni va guruhingni tanla.</li>
        <li><b>O'yna</b> o'yin tanla, ball to'pla.</li>
        <li><b>Yuksal</b> XP yig'ib reytingda yuqoriga chiq.</li>
      </ol>

      <h2 className="sec">Ko'p so'raladigan savollar</h2>
      <div className="faq">{FAQ.map(([q, a], i) => (
        <div key={q} className="qa">
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}<span>{open === i ? "−" : "+"}</span></button>
          {open === i && <p>{a}</p>}
        </div>))}
      </div>

      <h2 className="sec">Bog'lanish</h2>
      <form className="panel cform" onSubmit={send}>
        {sent ? <p className="thanks">Rahmat! Xabaringiz qabul qilindi. ✅</p> : <>
          <input required placeholder="Ismingiz" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} />
          <textarea required rows={4} placeholder="Savol yoki taklifingiz" value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })} />
          <button className="btn" type="submit">Yuborish</button></>}
      </form>
    </>
  );
}

function Start({ p, setP }) {
  const [f, setF] = useState({ name: p.registered ? p.name : "", group: p.group || "kichik", avatar: p.avatar });
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    setP({ ...p, name: f.name.trim(), group: f.group, avatar: f.avatar, registered: true });
    go("/games");
  };
  return (
    <form className="panel" onSubmit={submit}>
      <h2 className="sec">{p.registered ? "Ma'lumotlarni o'zgartirish" : "Xush kelibsan!"}</h2>
      <label className="lbl" htmlFor="nm">Isming</label>
      <input id="nm" className="typebox left" maxLength={18} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Masalan: Aziza" />
      <p className="lbl">Guruhing</p>
      <div className="feats">{GROUPS.map((g) => (
        <button type="button" key={g.id} className={"feat group pick" + (f.group === g.id ? " on" : "")} onClick={() => setF({ ...f, group: g.id })}>
          <span>{g.emoji}</span><b>{g.name}</b><small>{g.age}</small></button>))}</div>
      <p className="lbl">Avatar</p>
      <div className="avs">{AVATARS.map((a) => <button type="button" key={a} className={a === f.avatar ? "on" : ""} onClick={() => setF({ ...f, avatar: a })}>{a}</button>)}</div>
      <p><button className="btn big" type="submit">Saqlash va o'ynash</button></p>
    </form>
  );
}

function Games({ onPlay }) {
  const [q, setQ] = useState("");
  const list = ALL.filter((g) => (g.name + g.desc).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h2 className="sec">O'yinlar ({ALL.length})</h2>
      <input className="typebox left" placeholder="O'yin qidirish..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="O'yin qidirish" />
      <div className="games" style={{ marginTop: 14 }}>
        {list.map((g) => (
          <button key={g.id} className="gcard" style={{ "--c": g.color }} onClick={() => onPlay(g)}>
            <span className="gemo">{g.emoji}</span><b>{g.name}</b><small>{g.desc}</small></button>))}
        {!list.length && <p>Bunday o'yin topilmadi. Boshqa so'z bilan qidirib ko'r.</p>}
      </div>
    </>
  );
}

function Daily({ p, onClaim }) {
  const d = p.daily;
  const tasks = [
    { id: "g2", t: "2 ta o'yin o'yna", now: Math.min(d.games, 2), max: 2, r: 20 },
    { id: "x60", t: "Bugun 60 XP yig'", now: Math.min(d.xp, 60), max: 60, r: 20 },
    { id: "perf", t: "1 ta xatosiz o'yin qil", now: Math.min(d.perfect, 1), max: 1, r: 30 },
  ];
  return (
    <>
      <h2 className="sec">Kunlik vazifalar</h2>
      <div className="tasks">{tasks.map((k) => {
        const ok = k.now >= k.max;
        return (
          <div key={k.id} className={"task" + (ok ? " ready" : "")}>
            <div><b>{k.t}</b><div className="bar"><i style={{ width: (k.now / k.max) * 100 + "%" }} /></div></div>
            {d.claimed.includes(k.id) ? <span className="done">✓ Olindi</span>
              : <button className="btn sm" disabled={!ok} onClick={() => onClaim(k.id, k.r)}>+{k.r} XP</button>}
          </div>);
      })}</div>
      <p className="lbl">Vazifalar har kuni yangilanadi. 🔥 Ketma-ket kun: {p.streak}</p>
    </>
  );
}

export default function Site() {
  const [p, setP] = useState(loadProfile);
  const [game, setGame] = useState(null);
  const route = useHash();
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }, [p]);
  useEffect(() => { setGame(null); }, [route]);

  const onResult = (score, perfect) => setP((q) => ({
    ...q, xp: q.xp + score, games: q.games + 1,
    daily: { ...q.daily, games: q.daily.games + 1, xp: q.daily.xp + score, perfect: q.daily.perfect + (perfect ? 1 : 0) },
  }));
  const onClaim = (id, r) => setP((q) => ({ ...q, xp: q.xp + r, daily: { ...q.daily, claimed: [...q.daily.claimed, id] } }));

  const links = [["/", "Bosh sahifa"], ["/games", "O'yinlar"], ["/daily", "Vazifalar"], ["/rating", "Reyting"], ["/profile", "Profil"]];
  let page;
  if (game) page = <GameShell game={game} onExit={() => setGame(null)} onResult={onResult} />;
  else if (route === "/games") page = <Games onPlay={setGame} />;
  else if (route === "/daily") page = <Daily p={p} onClaim={onClaim} />;
  else if (route === "/rating") page = <Rating p={p} />;
  else if (route === "/profile") page = <><Profile p={p} setP={setP} /><p><a className="ghost" href="#/start">Guruh va ismni o'zgartirish</a></p></>;
  else if (route === "/start") page = <Start p={p} setP={setP} />;
  else page = <Landing p={p} />;

  return (
    <div className="app site">
      <style>{THEME_CSS}</style>
      <header className="top">
        <a className="logo" href="#/">🏟️ English Arena</a>
        <span className="pill">{p.avatar} {p.registered ? p.name : "Mehmon"} · {p.xp} XP</span>
      </header>
      <nav className="tnav" aria-label="Asosiy menyu">
        {links.map(([to, l]) => <a key={to} href={"#" + to} className={route === to && !game ? "on" : ""}>{l}</a>)}
      </nav>
      <main>{page}</main>
      <footer className="foot">© English Arena · O'yna va o'rgan</footer>
    </div>
  );
}
