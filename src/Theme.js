// English Arena: yangi dizayn ("arkada stiker" uslubi). Butun saytning yagona stili shu yerda.
export const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Rubik:wght@500;600;700;800&display=swap');
:root{--ink:#1B1B3A;--paper:#FFFBEB;--carrot:#FF7A00;--leaf:#1FB85A;--butter:#FFE45C;--cream:#FFF6C9;--sky:#2D9CFF;--red:#FF4B4B;--grape:#8B5CF6;--sh:4px 4px 0 var(--ink)}
*{box-sizing:border-box}
.app{min-height:100vh;color:var(--ink);font-family:'Rubik',system-ui,sans-serif;font-weight:500;background-color:var(--paper);background-image:radial-gradient(rgba(27,27,58,.14) 1.6px,transparent 1.7px);background-size:24px 24px}
button{font-family:inherit;cursor:pointer;border:0;color:var(--ink)}
main{max-width:980px;margin:0 auto;padding:20px 16px 8px}
a{color:inherit}

/* yuqori panel va menyu */
.top{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 16px;background:var(--butter);border-bottom:4px solid var(--ink);position:sticky;top:0;z-index:5}
.logo{font:400 26px 'Lilita One',sans-serif;color:var(--ink);text-decoration:none;letter-spacing:.5px}
.pill{background:#fff;border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);padding:5px 12px;border-radius:999px;font-weight:700;font-size:14px;max-width:55vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tnav{display:flex;gap:8px;overflow-x:auto;padding:12px 16px;background:#fff;border-bottom:4px solid var(--ink)}
.tnav a{white-space:nowrap;padding:8px 16px;border:3px solid var(--ink);border-radius:999px;font-weight:700;text-decoration:none;background:#fff}
.tnav a:hover{background:var(--cream)}
.tnav a.on{background:var(--carrot);box-shadow:3px 3px 0 var(--ink)}
.sec{font:400 30px 'Lilita One',sans-serif;margin:34px 0 14px;letter-spacing:.3px}

/* tugmalar */
.btn{background:var(--carrot);color:var(--ink);padding:12px 20px;border:3px solid var(--ink);border-radius:14px;font-weight:800;font-size:16px;box-shadow:var(--sh);transition:transform .08s,box-shadow .08s}
.btn:active:not(:disabled){transform:translate(3px,3px);box-shadow:1px 1px 0 var(--ink)}
.btn:disabled{background:#e4e0cf;color:#8d8aa3;box-shadow:none;cursor:not-allowed}
.btn.sm{padding:7px 12px;background:var(--leaf)}
.btn.big{font-size:20px;padding:15px 26px}
.ghost{background:#fff;color:var(--ink);padding:10px 16px;border:3px solid var(--ink);border-radius:14px;font-weight:700;box-shadow:3px 3px 0 var(--ink);text-decoration:none;display:inline-block}
.ghost:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
.row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.row.left{justify-content:flex-start;margin:20px 0}

/* panellar */
.panel,.shell{background:#fff;border:3px solid var(--ink);border-radius:24px;box-shadow:6px 6px 0 var(--ink);padding:20px}
.shell{padding:0;overflow:hidden}
.shellbar{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--c);border-bottom:3px solid var(--ink)}
.shellbar h2{margin:0;font:400 26px 'Lilita One',sans-serif;color:var(--ink)}
.shell>:not(.shellbar){margin:16px}
.hud{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:800;font-size:17px;background:var(--cream);border:3px solid var(--ink);padding:6px 12px;border-radius:14px}
.prompt{text-align:center;font-size:18px;font-weight:600;margin:14px 0}
.prompt b{font:400 26px 'Lilita One',sans-serif;background:var(--butter);padding:0 8px;border-radius:8px}
.prompt small{font-weight:500;opacity:.7}
.center{text-align:center}
.bigemo{font-size:clamp(64px,18vw,96px);margin:8px 0}

/* o'yin kartochkalari */
.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
.gcard{background:#fff;border:3px solid var(--ink);border-top:16px solid var(--c);border-radius:20px;box-shadow:var(--sh);text-align:left;display:flex;flex-direction:column;gap:6px;padding:14px 16px 18px;min-height:176px;transition:transform .1s,box-shadow .1s}
.gcard:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}
.gcard:active{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--ink)}
.gemo{font-size:42px}
.gcard b{font:400 22px 'Lilita One',sans-serif}
.gcard small{font-size:14px;font-weight:500}

/* kunlik vazifalar */
.tasks{display:grid;gap:12px}
.task{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#fff;border:3px solid var(--ink);border-radius:18px;padding:14px 16px;box-shadow:var(--sh)}
.task>div:first-child{flex:1}
.task.ready{background:#D6F8E1}
.done{font-weight:800}
.bar{height:14px;background:#fff;border:3px solid var(--ink);border-radius:99px;overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--leaf);transition:width .4s}
.bar.big{height:22px}

/* profil va reyting */
.me{display:flex;align-items:center;gap:14px}
.av{font-size:50px;background:var(--butter);border:3px solid var(--ink);border-radius:50%;width:84px;height:84px;display:grid;place-items:center;flex:none}
.av.sm{font-size:24px;width:44px;height:44px}
.me input{flex:1;min-width:0;font:400 26px 'Lilita One',sans-serif;border:3px solid var(--ink);border-radius:14px;padding:8px 12px;color:var(--ink);background:#fff}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:18px 0}
.stats div{background:var(--cream);border:3px solid var(--ink);border-radius:14px;padding:10px 4px;text-align:center}
.stats b{display:block;font:400 24px 'Lilita One',sans-serif}
.stats small{font-weight:600}
.lbl{font-weight:700;margin:16px 0 6px}
.avs{display:flex;flex-wrap:wrap;gap:8px}
.avs button{font-size:30px;background:#fff;border:3px solid var(--ink);border-radius:14px;padding:4px 10px}
.avs .on{background:var(--butter);box-shadow:3px 3px 0 var(--ink)}
.rank{display:flex;align-items:center;gap:12px;padding:8px 12px;background:#fff;border:3px solid var(--ink);border-radius:16px;margin-bottom:10px}
.rank.me{background:var(--butter);box-shadow:var(--sh)}
.pos{width:36px;text-align:center;font:400 22px 'Lilita One',sans-serif}
.pts{margin-left:auto;font-weight:800}

/* natija oynasi */
.result{text-align:center;padding:12px}
.result .big{font-size:76px}
.result h3{font:400 34px 'Lilita One',sans-serif;margin:0}
.xp{display:inline-block;background:var(--leaf);border:3px solid var(--ink);border-radius:12px;padding:4px 16px;font:400 30px 'Lilita One',sans-serif;margin:10px 0 18px;box-shadow:var(--sh)}

/* ur-so'zni */
.holes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:460px;margin:0 auto}
.hole{aspect-ratio:1;border:3px solid var(--ink);border-radius:50% 50% 20px 20px;background:#9a6b3d;position:relative;overflow:hidden}
.hole.up{background:#c48a4e}
.hole.good{background:var(--leaf)}.hole.bad{background:var(--red)}
.mole{display:block;font-size:clamp(34px,10vw,56px);animation:pop .22s}
.tag{display:block;background:#fff;border:2px solid var(--ink);border-radius:9px;padding:1px 8px;margin:2px auto 0;width:max-content;max-width:92%;font-weight:800;font-size:14px}

/* xotira kartalari */
.mem{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:520px;margin:0 auto}
.card{aspect-ratio:1;border:3px solid var(--ink);border-radius:14px;background:var(--grape);color:#fff;font:400 28px 'Lilita One',sans-serif;box-shadow:3px 3px 0 var(--ink)}
.card.shown{color:var(--ink);font:700 clamp(14px,3.6vw,20px) 'Rubik',sans-serif}
.card.shown.en{background:var(--carrot)}.card.shown.uz{background:var(--sky)}
.card.ok{opacity:.6}

/* chiplar, juftlashtirish, sudrash */
.match{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:520px;margin:0 auto}
.match>div{display:grid;gap:10px;align-content:start}
.chip{display:block;width:100%;background:#fff;border:3px solid var(--ink);border-radius:12px;padding:11px;font-weight:700;font-size:17px;text-align:center;box-shadow:3px 3px 0 var(--ink)}
.chip[style]{color:var(--ink)!important}
.chip.sel{background:var(--butter);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--ink)}
.chip.shake{animation:sh .4s;background:var(--red)}
.chip.drag{width:auto;display:inline-block;cursor:grab;background:var(--butter);padding:10px 18px}
.chip:disabled{opacity:.35;box-shadow:none}
.boxes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px;margin:0 auto}
.box{aspect-ratio:1;border:3px dashed var(--ink);border-radius:18px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800}
.box.full{border-style:solid;background:#D6F8E1}
.emo{font-size:clamp(34px,10vw,52px)}
.bank{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:16px}
.emochip{font-size:48px;padding:12px}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:420px;margin:0 auto}

/* harf, yozish, poyga, qidirish va boshqalar */
.slots{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:12px 0}
.slot{width:38px;height:48px;border:3px solid var(--ink);border-radius:10px;background:#fff;display:grid;place-items:center;font:400 28px 'Lilita One',sans-serif;text-transform:uppercase}
.typebox{width:100%;max-width:360px;font:600 22px 'Rubik',sans-serif;text-align:center;padding:12px;border:3px solid var(--ink);border-radius:14px;margin-bottom:12px;background:#fff;color:var(--ink);box-shadow:3px 3px 0 var(--ink)}
.typebox.left{max-width:none;text-align:left;margin:0 0 4px;font-size:18px}
.typebox.shake{animation:sh .4s;background:#ffd9d9}
.track{position:relative;height:84px;background-color:#D6F8E1;background-image:repeating-linear-gradient(90deg,transparent 0 38px,rgba(27,27,58,.16) 38px 40px);border:3px solid var(--ink);border-radius:16px;margin-bottom:6px;overflow:hidden}
.track span{position:absolute;top:4px;font-size:32px;transition:left .5s}
.track em{position:absolute;right:6px;top:20px;font-size:32px;font-style:normal}
.kb{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:460px;margin:8px auto}
.key{width:40px;height:44px;border:3px solid var(--ink);border-radius:10px;background:#fff;font:700 18px 'Rubik',sans-serif;text-transform:uppercase;box-shadow:2px 2px 0 var(--ink)}
.key.yes{background:var(--leaf)}.key.no{background:var(--red);opacity:.55}
.line{min-height:56px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;border-bottom:4px dashed var(--ink);padding-bottom:10px;margin-bottom:10px}
.timebar{height:14px;background:var(--red);border:3px solid var(--ink);border-radius:99px;transform-origin:left;animation:drain 3s linear forwards}
.tf{font-size:22px;padding:16px 28px}.tf.yes{background:var(--leaf)}.tf.no{background:var(--red)}
.wgrid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;max-width:400px;margin:10px auto}
.cell{aspect-ratio:1;border:2px solid var(--ink);border-radius:9px;background:#fff;font:700 clamp(14px,4vw,20px) 'Rubik',sans-serif}
.cell.sel{background:var(--carrot)}.cell.ok{background:var(--leaf)}
.find{display:inline-block;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:2px 10px;margin:3px;font-size:16px;font-weight:700}
.find.got{background:var(--leaf);text-decoration:line-through}
.speaker{font-size:26px;padding:18px 34px;margin:12px 0}

/* bosh sahifa */
.lhero{background:var(--butter);border:4px solid var(--ink);border-radius:32px 32px 32px 8px;box-shadow:8px 8px 0 var(--ink);padding:clamp(20px,5vw,48px);margin-bottom:12px;overflow:hidden}
.lhero h1{font:400 clamp(48px,12vw,104px)/.92 'Lilita One',sans-serif;margin:0;letter-spacing:.5px;text-shadow:5px 5px 0 var(--carrot)}
.lhero p{font-size:19px;font-weight:600;max-width:520px;margin:16px 0 0}
.tiles{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.tile{display:flex;align-items:center;gap:8px;text-decoration:none;padding:9px 15px;border:3px solid var(--ink);border-radius:16px;font-weight:800;box-shadow:3px 3px 0 var(--ink);transition:transform .12s}
.tile span{font-size:26px}
.tile:hover{transform:rotate(0) scale(1.06)!important}
.feats{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
.feat{background:#fff;border:3px solid var(--ink);border-radius:20px;box-shadow:var(--sh);padding:18px;display:flex;flex-direction:column;gap:4px;text-align:left;font-family:inherit;color:var(--ink)}
.feat span{font-size:38px}
.feat b{font:400 22px 'Lilita One',sans-serif}
.feat p{margin:0}
.feat small{font-weight:700}
.feat.group{border-top-width:16px}
.feat.group:nth-child(1){border-top-color:var(--leaf)}
.feat.group:nth-child(2){border-top-color:var(--sky)}
.feat.group:nth-child(3){border-top-color:var(--carrot)}
.feat.pick{cursor:pointer}
.feat.pick.on{background:#D6F8E1;transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}
.steps{display:grid;gap:12px;padding:0;list-style:none;counter-reset:s}
.steps li{counter-increment:s;background:#fff;border:3px solid var(--ink);border-radius:18px;box-shadow:var(--sh);padding:16px 16px 16px 72px;position:relative;font-weight:500}
.steps li::before{content:counter(s);position:absolute;left:14px;top:50%;transform:translateY(-50%);width:42px;height:42px;border:3px solid var(--ink);border-radius:50%;background:var(--carrot);display:grid;place-items:center;font:400 22px 'Lilita One',sans-serif}
.faq{display:grid;gap:10px}
.qa{background:#fff;border:3px solid var(--ink);border-radius:16px;overflow:hidden}
.qa button{width:100%;display:flex;justify-content:space-between;gap:10px;padding:14px 18px;background:none;font:700 17px 'Rubik',sans-serif;text-align:left}
.qa p{margin:0;padding:0 18px 16px}
.cform{display:grid;gap:12px}
.cform input,.cform textarea{font:500 17px 'Rubik',sans-serif;padding:12px 14px;border:3px solid var(--ink);border-radius:14px;width:100%;color:var(--ink);background:#fff}
.thanks{font:400 24px 'Lilita One',sans-serif;margin:0}
.foot{text-align:center;padding:30px 16px;margin-top:44px;font-weight:600;border-top:4px solid var(--ink);background:var(--butter)}

button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:4px solid var(--sky);outline-offset:3px}
@keyframes pop{from{transform:translateY(40px)}to{transform:none}}
@keyframes sh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@media (max-width:520px){.stats{grid-template-columns:repeat(2,1fr)}.sec{font-size:26px}.lhero{box-shadow:5px 5px 0 var(--ink)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
