import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';

// The scenes of the Services page movie. Each one is a short CSS animation that
// replays from the start whenever it comes on screen. Sizes use cqw (percent of
// the cinema screen's width) so every scene scales with the screen.

const HOST = `:host { position: absolute; inset: 0; display: block; overflow: hidden; }`;
const SPOTS = `
  .spot { position: absolute; top: -25%; width: 26%; height: 150%; transform-origin: 50% 0; filter: blur(0.6cqw);
    background: linear-gradient(180deg, rgba(243, 209, 141, 0.38), rgba(243, 209, 141, 0) 80%); clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%); }
  .spot.l { left: 12%; animation: swing-l 3.5s ease-in-out infinite alternate; }
  .spot.r { right: 12%; animation: swing-r 3.5s ease-in-out infinite alternate; }
  @keyframes swing-l { from { transform: rotate(28deg); } to { transform: rotate(-12deg); } }
  @keyframes swing-r { from { transform: rotate(-28deg); } to { transform: rotate(12deg); } }
`;

/** Counts up to a target while the scene is on screen. */
function counter(target: number, ms: number) {
  const value = signal(0);
  const destroyRef = inject(DestroyRef);
  afterNextRender(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / ms);
      value.set(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(id);
    }, 50);
    destroyRef.onDestroy(() => clearInterval(id));
  });
  return value;
}

const inr = new Intl.NumberFormat('en-IN');

// 3-2-1 film leader countdown
@Component({
  selector: 'app-scene-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="leader">
      <span class="cross h"></span><span class="cross v"></span>
      <span class="sweep"></span>
      <span class="ring"></span>
      <span class="nums"><b>3</b><b>2</b><b>1</b></span>
    </div>
  `,
  styles: [HOST, `
    :host { background: radial-gradient(circle, #3a434a, #12181d 70%); }
    .leader { position: absolute; left: 50%; top: 50%; width: 30cqw; height: 30cqw; margin: -15cqw; }
    .cross { position: absolute; background: rgba(255, 255, 255, 0.35); }
    .cross.h { left: -40%; right: -40%; top: 50%; height: 2px; }
    .cross.v { top: -40%; bottom: -40%; left: 50%; width: 2px; }
    .ring { position: absolute; inset: 0; border-radius: 50%; border: 0.5cqw solid rgba(255, 255, 255, 0.85); box-shadow: inset 0 0 0 2.2cqw rgba(255, 255, 255, 0.08); }
    .sweep { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(rgba(216, 174, 98, 0.6) var(--deg), transparent var(--deg)); animation: sweep 1s linear 3; }
    @property --deg { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
    @keyframes sweep { from { --deg: 0deg; } to { --deg: 360deg; } }
    .nums { position: absolute; inset: 0; display: grid; place-items: center; }
    /* forwards (not both): each number stays hidden until its own second */
    .nums b { grid-area: 1 / 1; font: 800 max(50px, 17cqw)/1 var(--font-head); color: #fff; opacity: 0; animation: num 1s steps(1) forwards; }
    .nums b:nth-child(2) { animation-delay: 1s; }
    .nums b:nth-child(3) { animation-delay: 2s; }
    @keyframes num { 0%, 99% { opacity: 1; } 100% { opacity: 0; } }
  `],
})
export class SceneCountdown {}

// Growth certificate (censor-card style)
@Component({
  selector: 'app-scene-certificate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cert">
      <div class="head"><span class="badge">U</span><div><b>GROWTH CERTIFICATE</b><small>Certified for universal business growth</small></div></div>
      <dl>
        <dt>Title</dt><dd>YOUR BRAND</dd>
        <dt>Managed by</dt><dd>Hari's Digital Den</dd>
        <dt>Platforms</dt><dd>Instagram · Facebook · YouTube</dd>
        <dt>Genre</dt><dd>Mass · Growth · Blockbuster</dd>
        <dt>Rating</dt><dd>⭐⭐⭐⭐⭐</dd>
      </dl>
      <span class="seal">APPROVED</span>
    </div>
  `,
  styles: [HOST, `
    :host { display: grid; place-items: center; background: radial-gradient(circle, #10241a, #050b07 75%); }
    .cert { position: relative; width: 56cqw; padding: 3cqw 3.6cqw; border: 0.4cqw double #b9e6c4; border-radius: 1cqw; background: rgba(8, 22, 14, 0.85); color: #e8f6ec; animation: in 0.8s ease both; }
    @keyframes in { from { opacity: 0; transform: scale(0.9); filter: blur(0.8cqw); } }
    .head { display: flex; align-items: center; gap: 2cqw; margin-bottom: 2cqw; }
    .badge { width: 7cqw; height: 7cqw; border-radius: 50%; display: grid; place-items: center; border: 0.5cqw solid #b9e6c4; font: 800 max(18px, 3.8cqw) var(--font-head); color: #b9e6c4; }
    .head b { display: block; font: 800 max(12px, 2.4cqw) var(--font-head); letter-spacing: 0.15em; color: #b9e6c4; }
    .head small { font-size: max(8px, 1.2cqw); color: #7fae8a; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 0.9cqw 2.4cqw; margin: 0; }
    dt { font: 600 max(8px, 1.15cqw) var(--font-head); letter-spacing: 0.15em; text-transform: uppercase; color: #7fae8a; }
    dd { margin: 0; font: 700 max(10px, 1.6cqw) var(--font-head); animation: type 0.4s both; }
    dd:nth-of-type(1) { animation-delay: 0.6s; }
    dd:nth-of-type(2) { animation-delay: 0.9s; }
    dd:nth-of-type(3) { animation-delay: 1.2s; }
    dd:nth-of-type(4) { animation-delay: 1.5s; }
    dd:nth-of-type(5) { animation-delay: 1.8s; }
    @keyframes type { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0); } }
    .seal { position: absolute; right: 3cqw; bottom: 2.4cqw; padding: 0.6cqw 1.6cqw; border: 0.35cqw solid #2fbf71; border-radius: 0.6cqw; color: #2fbf71; font: 800 max(11px, 2cqw) var(--font-head); letter-spacing: 0.15em; transform: rotate(-12deg); animation: stamp 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 2.5s both; }
    @keyframes stamp { from { opacity: 0; transform: rotate(-12deg) scale(3); } to { opacity: 1; transform: rotate(-12deg) scale(1); } }
  `],
})
export class SceneCertificate {}

// Opening titles: your brand is coming online
@Component({
  selector: 'app-scene-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="spot l"></span><span class="spot r"></span>
    <div class="c">
      <small>Hari's Digital Den presents</small>
      <strong>YOUR BRAND</strong>
      <em>is coming online</em>
      <span class="te">ప్రారంభం</span>
    </div>
  `,
  styles: [HOST, SPOTS, `
    .c { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 1.6cqw; text-align: center; }
    small { font: 600 max(10px, 1.7cqw) var(--font-head); letter-spacing: 0.35em; text-transform: uppercase; color: #c9d0d6; animation: fade 0.8s 0.3s both; }
    strong { font: 800 max(30px, 9cqw)/1 var(--font-head); letter-spacing: 0.04em; background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; animation: slam 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) 1s both; }
    em { font: 600 italic max(14px, 2.6cqw) var(--font-head); color: #fff; letter-spacing: 0.08em; animation: fade 0.9s 2s both; }
    .te { font: 700 max(16px, 3cqw) 'Noto Sans Telugu', 'Nirmala UI', sans-serif; color: var(--champagne); animation: fade 1s 2.8s both; }
    @keyframes fade { from { opacity: 0; transform: translateY(1cqw); } }
    @keyframes slam { from { opacity: 0; transform: scale(2.4); filter: blur(1.2cqw); } }
  `],
})
export class SceneTitle {}

// Mass entry: the website rises and builds itself, then goes LIVE
@Component({
  selector: 'app-scene-website',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="push">
      <span class="spot l"></span><span class="spot r"></span>
      <div class="smoke"><i></i><i></i><i></i></div>
      <div class="browser">
        <div class="bar"><i></i><i></i><i></i><span>🔒 www.yourbrand.in</span></div>
        <div class="page">
          <div class="nav"><b>YOUR BRAND</b><span>Home</span><span>Services</span><span>Gallery</span><span>Contact</span></div>
          <div class="hero">
            <div class="copy">
              <span class="h1">Welcome to Your Brand</span>
              <span class="h2">Quality you can trust — now online.</span>
              <span class="h2 s">Open today · 9 AM – 9 PM</span>
              <span class="cta">📞 Call Now</span>
            </div>
            <div class="img"><span>Grand Opening ✨</span></div>
          </div>
          <div class="cards"><span>🛍️ Products</span><span>🎁 Offers</span><span>⭐ Reviews</span></div>
        </div>
      </div>
      <div class="live">● LIVE</div>
    </div>
  `,
  styles: [HOST, SPOTS, `
    .push { position: absolute; inset: 0; animation: push 6s ease-out both; }
    @keyframes push { from { transform: scale(1); } to { transform: scale(1.07); } }
    .smoke i { position: absolute; bottom: -12%; width: 45%; height: 32%; border-radius: 50%; background: rgba(210, 220, 230, 0.13); filter: blur(3cqw); animation: drift 6s ease-in-out infinite alternate; }
    .smoke i:nth-child(1) { left: -8%; }
    .smoke i:nth-child(2) { left: 28%; animation-delay: -2s; }
    .smoke i:nth-child(3) { left: 62%; animation-delay: -4s; }
    @keyframes drift { to { transform: translateX(6%) scale(1.15); } }

    .browser {
      position: absolute; left: 21%; right: 21%; top: 13%; bottom: 15%; border-radius: 1.2cqw; overflow: hidden;
      background: #0d151b; border: 2px solid rgba(216, 174, 98, 0.65); box-shadow: 0 0 5cqw rgba(216, 174, 98, 0.35);
      animation: rise 1.4s cubic-bezier(0.2, 0.9, 0.3, 1.15) 0.3s both;
    }
    @keyframes rise { from { opacity: 0; transform: translateY(75%) scale(0.7); } }
    .bar { display: flex; align-items: center; gap: 0.5cqw; padding: 0.8cqw 1cqw; background: #141c21; }
    .bar i { width: 0.9cqw; height: 0.9cqw; border-radius: 50%; background: #e5484d; }
    .bar i:nth-child(2) { background: #f5a524; }
    .bar i:nth-child(3) { background: #2fbf71; }
    .bar span { margin-left: 1cqw; font-size: max(8px, 1.1cqw); color: #97a1aa; }
    .page { padding: 1.6cqw; display: grid; gap: 1.6cqw; }
    .nav { display: flex; align-items: center; gap: 1.2cqw; animation: drop 0.5s 1.6s both; }
    .nav b { margin-right: auto; font: 800 max(9px, 1.5cqw) var(--font-head); letter-spacing: 0.08em; background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .nav span { font: 600 max(7px, 1cqw) var(--font-head); color: #aeb6bd; }
    .hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.8cqw; align-items: center; }
    .copy { display: grid; gap: 0.9cqw; }
    .h1 { justify-self: start; white-space: nowrap; font: 800 max(11px, 2.3cqw)/1.15 var(--font-head); color: #fff; animation: wipe 0.9s steps(21) 2.2s both; }
    .h2 { justify-self: start; white-space: nowrap; font: 500 max(8px, 1.2cqw) var(--font-body); color: #aeb6bd; animation: wipe 0.5s 3s both; }
    .h2.s { color: #2fbf71; font-weight: 600; animation-delay: 3.2s; }
    .cta { justify-self: start; padding: 0.7cqw 1.6cqw; border-radius: 2cqw; background: var(--gradient); color: #090e13; font: 700 max(8px, 1.15cqw) var(--font-head); animation: pop 0.45s 3.4s both; }
    .img { position: relative; aspect-ratio: 4 / 3; border-radius: 1cqw; display: grid; align-items: end; padding: 1cqw; background: radial-gradient(circle at 30% 30%, #f3d18d, #bd8b3e 55%, #4a3517); animation: reveal 0.8s 2s both; }
    .img span { font: 800 max(9px, 1.5cqw) var(--font-head); color: #fff; text-shadow: 0 0.3cqw 1cqw rgba(0, 0, 0, 0.5); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2cqw; }
    .cards span {
      display: grid; place-items: center; height: 5cqw; border-radius: 0.8cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.3);
      font: 600 max(8px, 1.2cqw) var(--font-head); color: #eef1f3; animation: drop 0.5s both;
    }
    .cards span:nth-child(1) { animation-delay: 3.3s; }
    .cards span:nth-child(2) { animation-delay: 3.45s; }
    .cards span:nth-child(3) { animation-delay: 3.6s; }
    .live {
      position: absolute; top: 8%; right: 15%; padding: 0.7cqw 1.8cqw; border-radius: 0.6cqw; background: #e5484d; color: #fff;
      font: 800 max(11px, 2cqw) var(--font-head); letter-spacing: 0.15em; box-shadow: 0 0 4cqw rgba(229, 72, 77, 0.7);
      transform: rotate(8deg); animation: stamp 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 4s both;
    }
    @keyframes drop { from { opacity: 0; transform: translateY(-1.5cqw); } }
    @keyframes wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes pop { from { opacity: 0; transform: scale(0.3); } }
    @keyframes reveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes stamp { from { opacity: 0; transform: rotate(8deg) scale(3.5); } to { opacity: 1; transform: rotate(8deg) scale(1); } }
  `],
})
export class SceneWebsite {}

// Mobile app: a finger taps the app icon and the app opens
@Component({
  selector: 'app-scene-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="phone">
      <div class="screen">
        <div class="home">
          @for (n of [1, 2, 3, 4]; track n) { <i></i> }
          <b class="mine"><img src="apple-touch-icon.png" alt="" /></b>
          @for (n of [5, 6, 7, 8]; track n) { <i></i> }
        </div>
        <span class="ripple"></span>
        <div class="app">
          <div class="splash"><img src="images/logo-full.png" alt="" /></div>
          <div class="ui">
            <div class="top">Your Brand</div>
            <div class="card c1"><span></span><em></em></div>
            <div class="card c2"><span></span><em></em></div>
            <div class="card c3"><span></span><em></em></div>
            <div class="toast">✓ Order placed</div>
          </div>
        </div>
      </div>
      <span class="finger"></span>
    </div>
    <div class="chips">
      <span>📅 Bookings</span><span>🛒 Orders</span><span>📖 Catalogue</span>
    </div>
  `,
  styles: [HOST, `
    :host { background: radial-gradient(circle at 40% 50%, #16242e, transparent 60%); }
    .phone { position: absolute; left: 36%; top: 8%; width: 17cqw; aspect-ratio: 9 / 18.5; border-radius: 2.6cqw; border: 0.8cqw solid #0d1419; background: #000; box-shadow: 0 0 0 2px rgba(216, 174, 98, 0.5), 0 3cqw 6cqw rgba(0, 0, 0, 0.6); animation: in 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; }
    @keyframes in { from { opacity: 0; transform: translateY(20%) rotate(-8deg); } }
    .screen { position: absolute; inset: 0; border-radius: 1.8cqw; overflow: hidden; background: linear-gradient(160deg, #1c2c38, #090e13); }
    .home { position: absolute; inset: 14% 10% auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4cqw; }
    .home i { aspect-ratio: 1; border-radius: 0.9cqw; background: #2a3540; }
    .mine { aspect-ratio: 1; border-radius: 0.9cqw; overflow: hidden; box-shadow: 0 0 2cqw rgba(216, 174, 98, 0.8); animation: glow 0.8s ease-in-out 0.6s 2 alternate; }
    .mine img { width: 100%; height: 100%; object-fit: cover; }
    @keyframes glow { to { transform: scale(1.15); } }
    .ripple { position: absolute; left: 50%; top: 27%; width: 3cqw; height: 3cqw; margin: -1.5cqw; border-radius: 50%; border: 2px solid #f3d18d; opacity: 0; animation: ripple 0.6s ease-out 2s both; }
    @keyframes ripple { 0% { opacity: 1; transform: scale(0.4); } 100% { opacity: 0; transform: scale(3.2); } }

    .finger {
      position: absolute; left: 50%; top: 27%; width: 3.6cqw; height: 16cqw; margin-left: -1.8cqw; border-radius: 1.8cqw 1.8cqw 1.2cqw 1.2cqw;
      background: linear-gradient(90deg, #a8693f, #d39a6a 45%, #b8794c); transform-origin: 50% 0;
      box-shadow: inset 0 0.6cqw 0 rgba(255, 255, 255, 0.15);
      animation: tap 2.6s ease-in-out 0.3s both;
    }
    .finger::before { content: ''; position: absolute; left: 18%; right: 18%; top: 0.5cqw; height: 2.2cqw; border-radius: 1cqw 1cqw 0.6cqw 0.6cqw; background: rgba(255, 230, 215, 0.55); }
    @keyframes tap {
      0% { opacity: 0; transform: translate(9cqw, 14cqw) rotate(-28deg); }
      45% { opacity: 1; transform: translate(0.4cqw, 0.4cqw) rotate(-12deg); }
      62% { transform: translate(0, 0.9cqw) rotate(-12deg) scale(0.96); }
      75% { opacity: 1; transform: translate(0.4cqw, 0.4cqw) rotate(-12deg); }
      100% { opacity: 0; transform: translate(9cqw, 14cqw) rotate(-28deg); }
    }

    .app { position: absolute; inset: 0; background: var(--obsidian); transform-origin: 50% 27%; transform: scale(0.12); opacity: 0; animation: open 0.5s ease-out 2.15s forwards; }
    @keyframes open { to { transform: none; opacity: 1; } }
    .splash { position: absolute; inset: 0; display: grid; place-items: center; padding: 12%; animation: out 0.3s 3.2s forwards; }
    @keyframes out { to { opacity: 0; } }
    .ui { position: absolute; inset: 0; padding: 14% 8% 8%; display: grid; align-content: start; gap: 1cqw; opacity: 0; animation: show 0.3s 3.3s forwards; }
    @keyframes show { to { opacity: 1; } }
    .top { font: 700 max(9px, 1.3cqw) var(--font-head); color: var(--champagne); }
    .card { display: flex; align-items: center; gap: 0.8cqw; padding: 0.9cqw; border-radius: 0.8cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.3); animation: slide 0.4s both; }
    .card span { width: 3cqw; height: 3cqw; border-radius: 0.6cqw; background: var(--gradient); }
    .card em { flex: 1; height: 0.8cqw; border-radius: 0.4cqw; background: #2a3540; }
    .c1 { animation-delay: 3.4s; }
    .c2 { animation-delay: 3.55s; }
    .c3 { animation-delay: 3.7s; }
    @keyframes slide { from { opacity: 0; transform: translateX(60%); } }
    .toast { justify-self: center; margin-top: 1cqw; padding: 0.6cqw 1.2cqw; border-radius: 2cqw; background: #2fbf71; color: #fff; font: 700 max(8px, 1.1cqw) var(--font-head); animation: pop 0.4s cubic-bezier(0.3, 1.6, 0.5, 1) 4.4s both; }
    @keyframes pop { from { opacity: 0; transform: scale(0.3); } }

    .chips { position: absolute; left: 58%; top: 30%; display: grid; gap: 1.4cqw; }
    .chips span { padding: 1cqw 1.8cqw; border-radius: 3cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.45); color: #eef1f3; font: 600 max(10px, 1.6cqw) var(--font-head); animation: chip 0.5s both; }
    .chips span:nth-child(1) { animation-delay: 3.8s; }
    .chips span:nth-child(2) { animation-delay: 4.1s; }
    .chips span:nth-child(3) { animation-delay: 4.4s; }
    @keyframes chip { from { opacity: 0; transform: translateX(-3cqw); } }
  `],
})
export class SceneApp {}

// We create and brand all the social accounts and business email
@Component({
  selector: 'app-scene-accounts',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile">
      <span class="ring"><img src="apple-touch-icon.png" alt="" /></span>
      <b>&#64;yourbrand</b>
      <small>Brand kit applied ✓</small>
    </div>
    <div class="grid">
      @for (p of platforms; track p.name; let i = $index) {
        <div class="acc" [style.--d]="i">
          <span class="ic" [style.background]="p.color"><app-icon [name]="p.icon" [size]="18" /></span>
          <span class="name">{{ p.name }}</span>
          <span class="status"><em><i></i>Creating…</em><strong>✓ Live</strong></span>
        </div>
      }
    </div>
    <div class="done">All accounts live ✓</div>
  `,
  styles: [HOST, `
    :host { display: grid; grid-template-columns: 1fr 2.2fr; align-items: center; gap: 3cqw; padding: 0 6cqw; }
    .profile { display: grid; justify-items: center; gap: 0.8cqw; text-align: center; animation: in 0.6s both; }
    .ring { width: 13cqw; height: 13cqw; border-radius: 50%; padding: 0.6cqw; background: conic-gradient(#f9ce34, #ee2a7b, #6228d7, #f9ce34); animation: spin 3s linear infinite; }
    .ring img { width: 100%; height: 100%; border-radius: 50%; border: 0.5cqw solid #090e13; animation: spin 3s linear infinite reverse; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .profile b { font: 700 max(12px, 2cqw) var(--font-head); color: #fff; }
    .profile small { font-size: max(9px, 1.2cqw); color: #2fbf71; animation: in 0.4s 1s both; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2cqw; }
    .acc {
      display: flex; align-items: center; gap: 1cqw; padding: 1cqw 1.2cqw; border-radius: 1cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.3);
      animation: in 0.4s calc(var(--d) * 0.35s + 0.4s) both;
    }
    .ic { width: 3.4cqw; height: 3.4cqw; border-radius: 0.8cqw; display: grid; place-items: center; color: #fff; flex-shrink: 0; }
    .name { flex: 1; font: 600 max(9px, 1.4cqw) var(--font-head); color: #eef1f3; }
    .status { position: relative; font: 600 max(8px, 1.1cqw) var(--font-head); }
    .status em { display: inline-flex; align-items: center; gap: 0.4cqw; font-style: normal; color: #97a1aa; animation: hide 0s calc(var(--d) * 0.35s + 1.3s) forwards; }
    .status em i { width: 1cqw; height: 1cqw; border-radius: 50%; border: 2px solid #97a1aa; border-top-color: transparent; animation: spin 0.6s linear infinite; }
    .status strong { position: absolute; right: 0; top: 0; color: #2fbf71; opacity: 0; animation: show 0.3s calc(var(--d) * 0.35s + 1.3s) forwards; white-space: nowrap; }
    @keyframes hide { to { opacity: 0; } }
    @keyframes show { from { transform: scale(0.5); } to { opacity: 1; transform: none; } }
    @keyframes in { from { opacity: 0; transform: translateY(2cqw); } }
    .done {
      position: absolute; left: 50%; bottom: 13%; transform: translateX(-50%); padding: 0.8cqw 2cqw; border-radius: 3cqw; background: #2fbf71; color: #fff;
      font: 700 max(10px, 1.5cqw) var(--font-head); animation: in 0.5s 4.5s both;
    }
  `],
})
export class SceneAccounts {
  protected readonly platforms = [
    { name: 'Instagram', icon: 'instagram', color: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' },
    { name: 'Facebook', icon: 'facebook', color: '#1877f2' },
    { name: 'YouTube', icon: 'youtube', color: '#ff0000' },
    { name: 'LinkedIn', icon: 'linkedin', color: '#0a66c2' },
    { name: 'X', icon: 'x', color: '#000' },
    { name: 'Threads', icon: 'threads', color: '#000' },
    { name: 'Pinterest', icon: 'pinterest', color: '#e60023' },
    { name: 'Business Email', icon: 'mail', color: '#bd8b3e' },
  ];
}

// Facebook & Instagram marketing goes live
@Component({
  selector: 'app-scene-social',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="post ig">
      <div class="top"><span class="logo ig-g"><app-icon name="instagram" [size]="14" /></span><b>yourbrand</b><small>Sponsored</small></div>
      <div class="pic"><span>Grand Opening 🎉</span></div>
      <div class="meta"><span class="heart">❤️</span> <b>{{ fmt(likes()) }}</b> likes</div>
    </div>

    <div class="mega">
      <span class="horn">📣</span>
      <span class="wave w1"></span><span class="wave w2"></span><span class="wave w3"></span>
      <b>Campaign live</b>
    </div>

    <div class="post fb">
      <div class="top"><span class="logo fb-b"><app-icon name="facebook" [size]="14" /></span><b>Your Brand</b><small>Sponsored · 🌐</small></div>
      <div class="pic"><span>Festive Offer 🪔</span></div>
      <div class="meta">👍❤️ <b>{{ fmt(reach()) }}</b> people reached</div>
    </div>

    <div class="floaters">
      <span>❤️</span><span>👍</span><span>🔥</span><span>😍</span><span>💬</span><span>❤️</span>
    </div>
  `,
  styles: [HOST, `
    :host { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 3cqw; padding: 0 8cqw; background: radial-gradient(circle at 50% 50%, #16242e, #090e13 70%); }
    .post { border-radius: 1.4cqw; overflow: hidden; background: #fff; color: #141c21; box-shadow: 0 2cqw 5cqw rgba(0, 0, 0, 0.55); animation: in 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; }
    .fb { animation-delay: 0.5s; }
    @keyframes in { from { opacity: 0; transform: translateY(8cqw) rotate(-6deg); } }
    .top { display: flex; align-items: center; gap: 0.8cqw; padding: 1cqw 1.2cqw; }
    .top b { font: 700 max(9px, 1.3cqw) var(--font-head); }
    .top small { margin-left: auto; font-size: max(7px, 1cqw); color: #6b7280; }
    .logo { width: 2.6cqw; height: 2.6cqw; border-radius: 50%; display: grid; place-items: center; color: #fff; }
    .ig-g { background: linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7); }
    .fb-b { background: #1877f2; }
    .pic { aspect-ratio: 4 / 3; display: grid; place-items: center; background: linear-gradient(135deg, #101b22, #2a3540); }
    .ig .pic { background: radial-gradient(circle at 30% 30%, #f3d18d, #bd8b3e 55%, #4a3517); }
    .pic span { font: 800 max(11px, 2.2cqw) var(--font-head); color: #fff; text-shadow: 0 0.4cqw 1cqw rgba(0, 0, 0, 0.5); animation: pulse 1.6s ease-in-out infinite alternate; }
    @keyframes pulse { to { transform: scale(1.06); } }
    .meta { padding: 1cqw 1.2cqw; font-size: max(8px, 1.2cqw); }
    .meta b { font-variant-numeric: tabular-nums; }
    .heart { display: inline-block; animation: beat 0.8s ease-in-out infinite; }
    @keyframes beat { 50% { transform: scale(1.3); } }

    .mega { position: relative; display: grid; justify-items: center; gap: 1cqw; }
    .horn { font-size: max(26px, 6cqw); animation: shout 0.6s ease-in-out infinite alternate; }
    @keyframes shout { to { transform: rotate(-10deg) scale(1.08); } }
    .wave { position: absolute; top: 2cqw; width: 6cqw; height: 6cqw; border-radius: 50%; border: 0.3cqw solid #d8ae62; opacity: 0; animation: wave 1.8s ease-out infinite; }
    .w2 { animation-delay: 0.6s; }
    .w3 { animation-delay: 1.2s; }
    @keyframes wave { 0% { opacity: 0.9; transform: scale(0.6); } 100% { opacity: 0; transform: scale(2.6); } }
    .mega b { padding: 0.6cqw 1.4cqw; border-radius: 2cqw; background: #2fbf71; color: #fff; font: 700 max(9px, 1.3cqw) var(--font-head); white-space: nowrap; animation: in 0.5s 1.2s both; }

    .floaters span { position: absolute; bottom: -8%; font-size: max(14px, 2.6cqw); opacity: 0; animation: float 3s ease-out infinite; }
    .floaters span:nth-child(1) { left: 18%; animation-delay: 1s; }
    .floaters span:nth-child(2) { left: 72%; animation-delay: 1.4s; }
    .floaters span:nth-child(3) { left: 30%; animation-delay: 1.9s; }
    .floaters span:nth-child(4) { left: 82%; animation-delay: 2.3s; }
    .floaters span:nth-child(5) { left: 24%; animation-delay: 2.8s; }
    .floaters span:nth-child(6) { left: 66%; animation-delay: 3.2s; }
    @keyframes float { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(-40cqw) rotate(20deg); } }
  `],
})
export class SceneSocial {
  protected readonly likes = counter(2840, 5000);
  protected readonly reach = counter(18600, 5000);

  protected fmt(n: number): string {
    return inr.format(n);
  }
}

// Customers start coming to the shop — HOUSEFULL!
@Component({
  selector: 'app-scene-customers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shop">
      <div class="awning"></div>
      <div class="sign">YOUR BRAND</div>
      <div class="front"><span class="win"></span><span class="door"></span><span class="win"></span></div>
    </div>
    <div class="street"></div>
    @for (c of left; track $index) { <span class="cust l" [style.--d]="$index">{{ c }}</span> }
    @for (c of right; track $index) { <span class="cust r" [style.--d]="$index">{{ c }}</span> }
    <div class="pops"><span>+1 follower</span><span>🛒 New order</span><span>❤️ 24 likes</span><span>⭐ 5-star review</span></div>
    <div class="count"><small>Customers today</small><b>{{ customers() }}</b></div>
    <div class="bang">HOUSEFULL 🔥</div>
  `,
  styles: [HOST, `
    :host { background: linear-gradient(180deg, #0c1720 0%, #101b22 70%, #0a0f14 100%); }
    .shop { position: absolute; left: 35%; right: 35%; bottom: 20%; height: 50%; display: grid; grid-template-rows: auto auto 1fr; animation: in 0.6s both; }
    .awning { height: 4.5cqw; border-radius: 0.6cqw 0.6cqw 0 0; background: repeating-linear-gradient(90deg, #d8ae62 0 3cqw, #101b22 3cqw 6cqw); box-shadow: 0 1cqw 2cqw rgba(0, 0, 0, 0.5); }
    .sign { padding: 1cqw; text-align: center; background: #090e13; border: 2px solid #d8ae62; font: 800 max(11px, 2.2cqw) var(--font-head); letter-spacing: 0.12em; color: #f3d18d; text-shadow: 0 0 1.5cqw rgba(243, 209, 141, 0.8); }
    .front { display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 1cqw; padding: 1.4cqw; background: #141c21; border: 2px solid #2a3540; border-top: 0; }
    .win { border-radius: 0.6cqw; background: linear-gradient(180deg, #f3d18d, #bd8b3e); opacity: 0.85; }
    .door { border-radius: 1cqw 1cqw 0 0; background: radial-gradient(circle at 50% 30%, #fff1cc, #d8ae62 60%, #6e5124); box-shadow: 0 0 4cqw rgba(243, 209, 141, 0.6); }
    .street { position: absolute; left: 0; right: 0; bottom: 0; height: 20%; background: linear-gradient(180deg, #1b2730, #0a0f14); border-top: 2px solid rgba(216, 174, 98, 0.25); }

    .cust { position: absolute; bottom: 19%; font-size: max(18px, 3.6cqw); line-height: 1; opacity: 0; filter: drop-shadow(0 0.6cqw 0.6cqw rgba(0, 0, 0, 0.5)); }
    .cust.l { animation: walk-l 3.4s linear calc(var(--d) * 0.55s) infinite, bob 0.35s ease-in-out infinite alternate; }
    .cust.r { animation: walk-r 3.4s linear calc(var(--d) * 0.55s + 0.25s) infinite, bob 0.35s ease-in-out infinite alternate; }
    @keyframes walk-l { 0% { left: -6%; opacity: 1; } 85% { left: 46%; opacity: 1; } 100% { left: 47.5%; opacity: 0; } }
    @keyframes walk-r { 0% { left: 104%; opacity: 1; } 85% { left: 50%; opacity: 1; } 100% { left: 48.5%; opacity: 0; } }
    @keyframes bob { to { margin-bottom: 0.8cqw; } }

    .pops span {
      position: absolute; left: 50%; top: 36%; padding: 0.5cqw 1.2cqw; border-radius: 2cqw; white-space: nowrap; background: #ffffff; color: #141c21;
      font: 700 max(9px, 1.3cqw) var(--font-head); opacity: 0; animation: float-up 2.4s ease-out infinite;
    }
    .pops span:nth-child(1) { margin-left: -16cqw; animation-delay: 0.8s; }
    .pops span:nth-child(2) { margin-left: 6cqw; animation-delay: 1.4s; }
    .pops span:nth-child(3) { margin-left: -10cqw; animation-delay: 2s; }
    .pops span:nth-child(4) { margin-left: 10cqw; animation-delay: 2.6s; }
    @keyframes float-up { 0% { opacity: 0; transform: translateY(4cqw) scale(0.8); } 15% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-4cqw); } }

    .count { position: absolute; top: 7%; right: 5%; padding: 1cqw 1.6cqw; border-radius: 1cqw; background: var(--ivory); color: #141c21; text-align: right; }
    .count small { display: block; font-size: max(8px, 1.1cqw); color: #5a6168; }
    .count b { font: 800 max(14px, 3cqw)/1 var(--font-head); font-variant-numeric: tabular-nums; }
    .bang {
      position: absolute; top: 6%; left: 50%; transform: translateX(-50%); white-space: nowrap;
      font: 800 max(18px, 4.6cqw) var(--font-head); letter-spacing: 0.06em; color: #fff;
      text-shadow: 0 0 2cqw #ff7a2f, 0 0 5cqw #e5484d; animation: bang 0.6s cubic-bezier(0.3, 1.8, 0.5, 1) 3.4s both, shake 0.4s 4s 2;
    }
    @keyframes bang { from { opacity: 0; transform: translateX(-50%) scale(3); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
    @keyframes shake { 25% { margin-left: -0.8cqw; } 75% { margin-left: 0.8cqw; } }
    @keyframes in { from { opacity: 0; transform: translateY(4cqw); } }
  `],
})
export class SceneCustomers {
  protected readonly left = ['🧑', '👩', '👨‍💼', '👵', '🧔'];
  protected readonly right = ['👩‍💼', '👨', '👧', '🧑‍🦱', '👴'];
  private readonly raw = counter(1248, 5000);
  protected readonly customers = () => inr.format(this.raw());
}

// Interval: setup complete
@Component({
  selector: 'app-scene-interval',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="c">
      <span class="pop">🍿</span>
      <span class="te">విరామం</span>
      <strong>INTERVAL</strong>
      <ul>
        @for (item of done; track item; let i = $index) {
          <li [style.--d]="i"><i>✓</i>{{ item }}</li>
        }
      </ul>
      <small>Second half: customers, support &amp; branding →</small>
    </div>
  `,
  styles: [HOST, `
    :host { background: var(--gradient); color: #090e13; }
    .c { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 1cqw; text-align: center; }
    .pop { font-size: max(24px, 5cqw); animation: bounce 0.8s ease-in-out infinite alternate; }
    @keyframes bounce { to { transform: translateY(-1.5cqw) rotate(8deg); } }
    .te { font: 700 max(16px, 3.2cqw)/1.2 'Noto Sans Telugu', 'Nirmala UI', sans-serif; }
    strong { font: 800 max(28px, 7cqw)/1 var(--font-head); letter-spacing: 0.14em; animation: zoom 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    @keyframes zoom { from { opacity: 0; transform: scale(1.8); } }
    ul { list-style: none; margin: 1cqw 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 1cqw 2cqw; }
    li { display: flex; align-items: center; gap: 0.6cqw; font: 700 max(10px, 1.6cqw) var(--font-head); animation: tick 0.4s calc(var(--d) * 0.4s + 1s) both; }
    li i { width: 2.2cqw; height: 2.2cqw; border-radius: 50%; display: grid; place-items: center; background: #090e13; color: #2fbf71; font-style: normal; font-size: max(9px, 1.3cqw); }
    @keyframes tick { from { opacity: 0; transform: scale(0.5); } }
    small { margin-top: 1.2cqw; font: 600 max(10px, 1.5cqw) var(--font-head); opacity: 0; animation: fade 0.6s 2.9s forwards; }
    @keyframes fade { to { opacity: 0.85; } }
  `],
})
export class SceneInterval {
  protected readonly done = ['Online Presence', 'Accounts & Email', 'Facebook & Instagram', 'Mobile App', 'Digital Ledger'];
}

// Second half: weekly posts, brand materials and constant support
@Component({
  selector: 'app-scene-support',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel cal">
      <h4>This week's posts</h4>
      <div class="days">
        @for (d of days; track d.name) {
          <div class="day">
            <small>{{ d.name }}</small>
            @if (d.post) { <span class="post" [class.fest]="d.fest" [style.--d]="d.order">{{ d.post }}</span> }
          </div>
        }
      </div>
      <p>4–5 posts every week</p>
    </div>

    <div class="panel kit">
      <h4>Brand materials</h4>
      <div class="stack">
        <div class="m letter"><img src="images/logo-full.png" alt="" /><i></i><i></i><i></i></div>
        <div class="m card"><img src="images/logo-full.png" alt="" /><b>Your Brand</b><span>+91 ••••• •••••</span></div>
        <div class="m logo"><img src="images/logo-full.png" alt="" /></div>
      </div>
    </div>

    <div class="panel chat">
      <h4>Constant support</h4>
      <div class="msgs">
        <span class="b them" style="--d: 0">Need a Diwali post 🪔</span>
        <span class="typing" style="--d: 1"><i></i><i></i><i></i></span>
        <span class="b us" style="--d: 2">On it! Ready in 2 hrs ✅</span>
        <span class="b them" style="--d: 3">Super 🙌</span>
        <span class="b us" style="--d: 4">📅 Monthly review booked</span>
      </div>
    </div>
  `,
  styles: [HOST, `
    :host { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 2cqw; padding: 6cqw 4cqw 10cqw; }
    .panel { position: relative; border-radius: 1.4cqw; padding: 1.6cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.35); animation: in 0.5s both; }
    .kit { animation-delay: 0.2s; }
    .chat { animation-delay: 0.4s; }
    h4 { margin: 0 0 1.2cqw; font: 700 max(9px, 1.5cqw) var(--font-head); color: #f3d18d; }
    @keyframes in { from { opacity: 0; transform: translateY(3cqw); } }

    .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5cqw; }
    .day { display: grid; gap: 0.5cqw; align-content: start; min-height: 11cqw; padding: 0.5cqw; border-radius: 0.6cqw; background: #0d151b; }
    .day small { font: 600 max(7px, 0.95cqw) var(--font-head); color: #97a1aa; text-align: center; }
    .post { display: grid; place-items: center; aspect-ratio: 1; border-radius: 0.5cqw; background: var(--gradient); font-size: max(10px, 1.8cqw); animation: drop 0.45s cubic-bezier(0.3, 1.5, 0.5, 1) calc(var(--d) * 0.55s + 0.8s) both; }
    .post.fest { background: linear-gradient(135deg, #ff9a3c, #e5484d); }
    @keyframes drop { from { opacity: 0; transform: translateY(-5cqw) rotate(-20deg); } }
    .cal p { margin: 1cqw 0 0; font: 600 max(8px, 1.2cqw) var(--font-head); color: #2fbf71; }

    .stack { position: relative; height: 18cqw; }
    .m { position: absolute; left: 50%; top: 50%; border-radius: 0.6cqw; box-shadow: 0 1.5cqw 3cqw rgba(0, 0, 0, 0.55); background: #fffbf4; }
    .m img { display: block; }
    .letter { width: 12cqw; height: 16cqw; margin: -8cqw 0 0 -6cqw; padding: 1cqw; display: grid; align-content: start; gap: 0.6cqw; animation: fly-1 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.1) 1s both; }
    .letter img { width: 50%; background: #090e13; border-radius: 0.3cqw; padding: 0.3cqw; }
    .letter i { height: 0.6cqw; border-radius: 0.3cqw; background: #d9dee2; }
    .card { width: 13cqw; height: 7.5cqw; margin: -1cqw 0 0 -7cqw; padding: 0.9cqw; background: #090e13; border: 1px solid #d8ae62; display: grid; align-content: center; animation: fly-2 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.1) 1.8s both; }
    .card img { width: 55%; }
    .card b { font: 700 max(8px, 1.1cqw) var(--font-head); color: #f3d18d; }
    .card span { font-size: max(7px, 0.9cqw); color: #97a1aa; }
    .logo { width: 9cqw; height: 9cqw; margin: -3cqw 0 0 1cqw; border-radius: 50%; background: #090e13; border: 2px solid #d8ae62; display: grid; place-items: center; padding: 1cqw; animation: fly-3 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.1) 2.6s both; }
    .logo img { width: 100%; }
    @keyframes fly-1 { from { opacity: 0; transform: translate(-20cqw, -10cqw) rotate(-40deg); } to { transform: rotate(-8deg); } }
    @keyframes fly-2 { from { opacity: 0; transform: translate(20cqw, 10cqw) rotate(40deg); } to { transform: rotate(6deg); } }
    @keyframes fly-3 { from { opacity: 0; transform: translateY(-15cqw) scale(0.4); } to { transform: none; } }

    .msgs { display: grid; gap: 0.9cqw; }
    .b { max-width: 90%; padding: 0.8cqw 1.1cqw; border-radius: 1.2cqw; font: 600 max(8px, 1.15cqw)/1.35 var(--font-body); animation: msg 0.4s calc(var(--d) * 0.75s + 0.8s) both; }
    .them { justify-self: start; background: #2a3540; color: #eef1f3; border-bottom-left-radius: 0.3cqw; }
    .us { justify-self: end; background: var(--gradient); color: #090e13; border-bottom-right-radius: 0.3cqw; }
    .typing { justify-self: end; display: flex; gap: 0.4cqw; padding: 0.9cqw 1.1cqw; border-radius: 1.2cqw; background: #2a3540; animation: msg 0.3s calc(var(--d) * 0.75s + 0.8s) both, gone 0.2s calc(var(--d) * 0.75s + 1.5s) forwards; }
    .typing i { width: 0.7cqw; height: 0.7cqw; border-radius: 50%; background: #d8ae62; animation: dot 0.6s ease-in-out infinite alternate; }
    .typing i:nth-child(2) { animation-delay: 0.2s; }
    .typing i:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dot { to { transform: translateY(-0.5cqw); opacity: 0.4; } }
    @keyframes msg { from { opacity: 0; transform: translateY(1.5cqw) scale(0.9); } }
    @keyframes gone { to { opacity: 0; height: 0; padding: 0; margin: -0.45cqw 0; } }
  `],
})
export class SceneSupport {
  protected readonly days = [
    { name: 'Mon', post: '📸', order: 0 },
    { name: 'Tue', post: '🎬', order: 1 },
    { name: 'Wed', post: '' },
    { name: 'Thu', post: '💡', order: 2 },
    { name: 'Fri', post: '' },
    { name: 'Sat', post: '🏠', order: 3 },
    { name: 'Sun', post: '🪔', order: 4, fest: true },
  ];
}

// Digital ledger: every invoice, purchase and payment tracked
@Component({
  selector: 'app-scene-ledger',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="book">
      <div class="head"><app-icon name="ledger" [size]="18" /><b>Digital Ledger</b><small>October</small></div>
      <div class="rows">
        @for (r of rows; track r.label; let i = $index) {
          <div class="row" [style.--d]="i">
            <span class="tag" [class.in]="r.in">{{ r.in ? 'IN' : 'OUT' }}</span>
            <span class="label">{{ r.label }}</span>
            <span class="amt" [class.in]="r.in">{{ r.in ? '+' : '−' }}₹{{ r.amount }}</span>
            <span class="ok">✓</span>
          </div>
        }
      </div>
      <div class="totals">
        <div><small>Income</small><b class="g">₹{{ fmt(income()) }}</b></div>
        <div><small>Expenses</small><b class="r">₹{{ fmt(expenses()) }}</b></div>
        <div><small>Profit</small><b>₹{{ fmt(income() - expenses()) }}</b></div>
      </div>
    </div>

    <div class="side">
      <div class="chart">
        <small>This year</small>
        <div class="bars">
          @for (h of bars; track $index) { <span [style.--h.%]="h" [style.--d]="$index"></span> }
        </div>
      </div>
      <div class="sync">💻 <i></i> 📱<small>Computer &amp; mobile, always in sync</small></div>
      <div class="report">📄 Monthly report ready</div>
    </div>
  `,
  styles: [HOST, `
    :host { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.4cqw; padding: 7cqw 6cqw 9cqw; background: radial-gradient(circle at 30% 30%, #16242e, #090e13 70%); }
    .book { border-radius: 1.4cqw; padding: 1.6cqw; background: var(--ivory); color: #141c21; box-shadow: 0 2cqw 5cqw rgba(0, 0, 0, 0.5); animation: in 0.6s both; }
    .head { display: flex; align-items: center; gap: 0.8cqw; padding-bottom: 1cqw; margin-bottom: 1cqw; border-bottom: 2px solid #eadfca; color: #8c6428; }
    .head b { font: 800 max(10px, 1.6cqw) var(--font-head); color: #141c21; }
    .head small { margin-left: auto; font: 600 max(8px, 1.1cqw) var(--font-head); color: #5a6168; }
    .rows { display: grid; gap: 0.7cqw; }
    .row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 1cqw; padding: 0.8cqw 1cqw; border-radius: 0.7cqw; background: #fff; border: 1px solid #eadfca; animation: row 0.45s calc(var(--d) * 0.55s + 0.6s) both; }
    .tag { padding: 0.2cqw 0.7cqw; border-radius: 0.4cqw; font: 800 max(7px, 0.9cqw) var(--font-head); background: #fdecec; color: #c62828; }
    .tag.in { background: #e7f8ee; color: #0b7a3b; }
    .label { font: 600 max(8px, 1.15cqw) var(--font-body); }
    .amt { font: 700 max(8px, 1.2cqw) var(--font-head); color: #c62828; font-variant-numeric: tabular-nums; }
    .amt.in { color: #0b7a3b; }
    .ok { width: 1.8cqw; height: 1.8cqw; border-radius: 50%; display: grid; place-items: center; background: #2fbf71; color: #fff; font-size: max(7px, 1cqw); }
    @keyframes row { from { opacity: 0; transform: translateX(-4cqw); } }
    .totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1cqw; margin-top: 1.4cqw; }
    .totals div { padding: 0.8cqw 1cqw; border-radius: 0.7cqw; background: #141c21; color: #fff; }
    .totals small { display: block; font-size: max(7px, 0.95cqw); color: #aeb6bd; }
    .totals b { font: 800 max(10px, 1.7cqw) var(--font-head); font-variant-numeric: tabular-nums; color: #f3d18d; }
    .totals b.g { color: #2fbf71; }
    .totals b.r { color: #ff6b5f; }

    .side { display: grid; align-content: center; gap: 1.6cqw; }
    .chart { padding: 1.4cqw; border-radius: 1.2cqw; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.35); animation: in 0.6s 0.3s both; }
    .chart small { font: 600 max(8px, 1.1cqw) var(--font-head); color: #f3d18d; }
    .bars { display: flex; align-items: flex-end; gap: 0.6cqw; height: 11cqw; margin-top: 1cqw; }
    .bars span { flex: 1; height: var(--h); border-radius: 0.4cqw 0.4cqw 0 0; background: var(--gradient); transform-origin: bottom; animation: grow 0.6s calc(var(--d) * 0.15s + 1s) both; }
    @keyframes grow { from { transform: scaleY(0); } }
    .sync { display: flex; align-items: center; flex-wrap: wrap; gap: 0.8cqw; font-size: max(14px, 2.4cqw); animation: in 0.6s 0.6s both; }
    .sync i { flex: 0 0 6cqw; height: 0.4cqw; border-radius: 0.2cqw; background: repeating-linear-gradient(90deg, #d8ae62 0 0.8cqw, transparent 0.8cqw 1.4cqw); background-size: 1.4cqw 100%; animation: flow 0.6s linear infinite; }
    @keyframes flow { to { background-position: 1.4cqw 0; } }
    .sync small { flex-basis: 100%; font: 600 max(8px, 1.1cqw) var(--font-head); color: #aeb6bd; }
    .report { justify-self: start; padding: 0.8cqw 1.6cqw; border-radius: 2cqw; background: #2fbf71; color: #fff; font: 700 max(9px, 1.3cqw) var(--font-head); animation: pop 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 4.3s both; }
    @keyframes pop { from { opacity: 0; transform: scale(0.3); } }
    @keyframes in { from { opacity: 0; transform: translateY(3cqw); } }
  `],
})
export class SceneLedger {
  protected readonly rows = [
    { label: 'Invoice #1024 · Paid', amount: '12,500', in: true },
    { label: 'Purchase · Materials', amount: '4,200', in: false },
    { label: 'Payment received · UPI', amount: '25,000', in: true },
    { label: 'Festival campaign', amount: '3,000', in: false },
  ];
  protected readonly bars = [28, 36, 33, 48, 55, 52, 66, 72, 85, 100];
  protected readonly income = counter(37500, 4000);
  protected readonly expenses = counter(7200, 4000);

  protected fmt(n: number): string {
    return inr.format(n);
  }
}

// Talent showcase: festival posts and everyday interaction with customers
@Component({
  selector: 'app-scene-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Our Talent Showcase</h3>
    <div class="reel">
      <div class="track">
        @for (f of loop; track $index) {
          <div class="post" [style.background]="f.bg">
            <span class="emoji">{{ f.emoji }}</span>
            <b>{{ f.name }}</b>
            <small>Wishes from Your Brand</small>
          </div>
        }
      </div>
    </div>
    <div class="talk">
      <span class="b them" style="--d: 0">Beautiful Ugadi post! 😍</span>
      <span class="b us" style="--d: 1">Thank you! 🙏 Visit us for festive offers</span>
      <span class="b them" style="--d: 2">Is the Diwali offer still on? 🪔</span>
      <span class="b us" style="--d: 3">Yes! Till Sunday ✨ Reply sent in 5 mins</span>
    </div>
  `,
  styles: [HOST, `
    :host { display: grid; grid-template-rows: auto auto 1fr; gap: 1.6cqw; padding: 6cqw 0 9cqw; background: radial-gradient(circle at 50% 30%, #1c2c38, #090e13 70%); }
    h3 { margin: 0; text-align: center; font: 800 max(14px, 2.6cqw) var(--font-head); background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; animation: in 0.6s both; }
    .reel { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
    .track { display: flex; gap: 1.6cqw; width: max-content; animation: slide 14s linear infinite; }
    @keyframes slide { to { transform: translateX(calc(-50% - 0.8cqw)); } }
    .post {
      flex: 0 0 auto; width: 15cqw; aspect-ratio: 1; border-radius: 1.2cqw; display: grid; place-content: center; justify-items: center; gap: 0.4cqw;
      text-align: center; color: #fff; border: 0.25cqw solid rgba(255, 255, 255, 0.85); box-shadow: 0 1.5cqw 3cqw rgba(0, 0, 0, 0.5);
    }
    .emoji { font-size: max(20px, 4.4cqw); animation: bob 1.4s ease-in-out infinite alternate; }
    @keyframes bob { to { transform: translateY(-0.6cqw) rotate(6deg); } }
    .post b { font: 800 max(9px, 1.45cqw)/1.15 var(--font-head); text-shadow: 0 0.2cqw 0.6cqw rgba(0, 0, 0, 0.4); }
    .post small { font-size: max(7px, 0.95cqw); opacity: 0.9; }
    .talk { display: grid; align-content: start; gap: 0.8cqw; width: 56cqw; margin: 0 auto; }
    .b { max-width: 75%; padding: 0.8cqw 1.2cqw; border-radius: 1.2cqw; font: 600 max(8px, 1.2cqw)/1.35 var(--font-body); animation: msg 0.4s calc(var(--d) * 0.9s + 0.8s) both; }
    .them { justify-self: start; background: #2a3540; color: #eef1f3; border-bottom-left-radius: 0.3cqw; }
    .us { justify-self: end; background: var(--gradient); color: #090e13; border-bottom-right-radius: 0.3cqw; }
    @keyframes msg { from { opacity: 0; transform: translateY(1.5cqw) scale(0.9); } }
    @keyframes in { from { opacity: 0; transform: translateY(2cqw); } }
  `],
})
export class SceneShowcase {
  private readonly festivals = [
    { name: 'Happy Sankranti', emoji: '🪁', bg: 'linear-gradient(135deg, #ff9a3c, #e5484d)' },
    { name: 'Happy Ugadi', emoji: '🌿', bg: 'linear-gradient(135deg, #2fbf71, #0b7a3b)' },
    { name: 'Vinayaka Chavithi', emoji: '🐘', bg: 'linear-gradient(135deg, #f5a524, #bd5b1e)' },
    { name: 'Happy Diwali', emoji: '🪔', bg: 'linear-gradient(135deg, #d8ae62, #6e2a8a)' },
    { name: 'Merry Christmas', emoji: '🎄', bg: 'linear-gradient(135deg, #e5484d, #1a7a4c)' },
    { name: 'Ramzan Mubarak', emoji: '🌙', bg: 'linear-gradient(135deg, #1f3b73, #0e7c86)' },
    { name: 'Independence Day', emoji: '🎆', bg: 'linear-gradient(135deg, #ff9933, #138808)' },
  ];
  // Doubled so the slide loops seamlessly.
  protected readonly loop = [...this.festivals, ...this.festivals];
}

// The End — శుభం, Book Your Show
@Component({
  selector: 'app-scene-end',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="confetti">
      @for (n of bits; track n) { <i [style.--x.%]="(n * 37) % 100" [style.--d]="(n * 7) % 13" [style.--h]="(n * 5) % 4"></i> }
    </div>
    <div class="c">
      <span class="te">శుభం</span>
      <strong>THE END</strong>
      <small>…Sequel loading. Let's grow together.</small>
      <a routerLink="/contact" class="btn btn--primary">🎟️ Book Your Show</a>
    </div>
  `,
  styles: [HOST, `
    :host { background: radial-gradient(circle at 50% 45%, #241a0a, #070b0f 72%); }
    .c { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 1.2cqw; text-align: center; }
    .te { font: 700 max(36px, 9cqw)/1.1 'Noto Sans Telugu', 'Nirmala UI', sans-serif; background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; animation: rise 1s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    strong { font: 800 max(16px, 3.2cqw) var(--font-head); letter-spacing: 0.4em; color: #fff; animation: fade 0.8s 0.8s both; }
    small { color: #aeb6bd; font-size: max(10px, 1.5cqw); animation: fade 0.8s 1.4s both; }
    .btn { animation: fade 0.8s 2s both; }
    @keyframes rise { from { opacity: 0; transform: translateY(4cqw) scale(0.8); } }
    @keyframes fade { from { opacity: 0; } }
    .confetti i {
      position: absolute; top: -5%; left: var(--x); width: 0.9cqw; height: 1.6cqw; border-radius: 0.2cqw; opacity: 0.9;
      background: #d8ae62; animation: fall calc(2.6s + var(--h) * 0.7s) linear calc(var(--d) * -0.37s) infinite;
    }
    .confetti i:nth-child(3n) { background: #f3d18d; }
    .confetti i:nth-child(4n) { background: #fffbf4; }
    @keyframes fall { to { transform: translateY(60cqw) rotate(540deg); } }
  `],
})
export class SceneEnd {
  protected readonly bits = Array.from({ length: 28 }, (_, i) => i + 1);
}
