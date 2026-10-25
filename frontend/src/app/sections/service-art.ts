import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../shared/icon';

// Small animated illustration for each service tab, keyed by service slug.
// It is re-created when the tab changes, so the animation replays.
@Component({
  selector: 'app-service-art',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="art" aria-hidden="true">
      <span class="glow"></span>
      @switch (slug()) {
        @case ('website-development') {
          <div class="browser">
            <div class="bar"><i></i><i></i><i></i><span>🔒 yourbrand.in</span></div>
            <div class="body">
              <div class="nav"><img src="images/logo-full.png" alt="" /><span>Home · Services · Contact</span></div>
              <div class="hero-img"><img src="images/stock/cafe.jpg" alt="" /><b>Welcome!</b></div>
              <span class="go">Book Now</span>
            </div>
            <span class="cursor">👆</span>
          </div>
        }
        @case ('mobile-app-development') {
          <div class="phone">
            <div class="splash"><img src="images/logo-full.png" alt="" /></div>
            <div class="screens">
              <div class="scr"><img src="images/stock/food.jpg" alt="" /><em>Order food</em></div>
              <div class="scr"><img src="images/stock/shirts.jpg" alt="" /><em>Shop fashion</em></div>
              <div class="scr done"><b>✓</b><em>Order placed</em></div>
            </div>
            <span class="tapdot"></span>
          </div>
        }
        @case ('social-media-marketing') {
          <div class="feed">
            <div class="post">
              <div class="who"><img src="apple-touch-icon.png" alt="" /><b>yourbrand</b></div>
              <div class="pics">
                <img src="images/stock/dosa.jpg" alt="" />
                <img src="images/stock/boutique.jpg" alt="" />
                <img src="images/stock/salon.jpg" alt="" />
              </div>
              <span class="likes">❤️ 2.4K likes</span>
            </div>
            <span class="soc i1" style="background: linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)"><app-icon name="instagram" [size]="20" /></span>
            <span class="soc i2" style="background:#1877f2"><app-icon name="facebook" [size]="20" /></span>
            <span class="soc i3" style="background:#ff0000"><app-icon name="youtube" [size]="20" /></span>
            <span class="soc i4" style="background:#0a66c2"><app-icon name="linkedin" [size]="20" /></span>
            <span class="heart h1">❤️</span><span class="heart h2">❤️</span><span class="heart h3">😍</span>
          </div>
        }
        @case ('branding') {
          <div class="brand">
            <div class="letter"><img src="images/logo-full.png" alt="" /><i></i><i></i><i></i></div>
            <div class="vcard">
              <div class="face front"><img src="images/logo-full.png" alt="" /></div>
              <div class="face back">
                <img src="images/logo-full.png" alt="" />
                <b>Hari's Digital Den</b><small>Brand · Content · Growth</small>
                <span>📞 +91 93931 41224</span>
                <span>📸 &#64;harisdigitalden</span>
              </div>
            </div>
            <div class="sw"><i></i><i></i><i></i><i></i></div>
          </div>
        }
        @case ('email-domain-setup') {
          <div class="mail">
            <svg class="gmail" viewBox="0 0 48 36">
              <path fill="#4285F4" d="M3 36h8V17L0 9v24c0 1.7 1.3 3 3 3z" />
              <path fill="#34A853" d="M37 36h8c1.7 0 3-1.3 3-3V9l-11 8z" />
              <path fill="#FBBC04" d="M37 3v14l11-8V5c0-3.7-4.2-5.8-7.2-3.6z" />
              <path fill="#EA4335" d="M11 17V3l13 9.75L37 3v14L24 26.75z" />
              <path fill="#C5221F" d="M0 5v4l11 8V3L7.2 1.4C4.2-.8 0 1.3 0 5z" />
            </svg>
            <div class="env"><img src="images/logo-full.png" alt="" /></div>
            <div class="addr"><span class="typed">name&#64;yourbrand.in</span></div>
            <span class="ok">✓ Delivered</span>
          </div>
        }
        @case ('digital-ledger') {
          <div class="ledger">
            <div class="rows">
              <span><b>+₹12,500</b><i>✓</i></span>
              <span class="out"><b>−₹4,200</b><i>✓</i></span>
              <span><b>+₹25,000</b><i>✓</i></span>
            </div>
            <div class="bars"><i></i><i></i><i></i><i></i><i></i></div>
            <span class="coin">₹</span>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .art { position: relative; width: 280px; height: 260px; display: grid; place-items: center; }
    .glow { position: absolute; inset: 15%; border-radius: 50%; background: radial-gradient(circle, rgba(216,174,98,.3), transparent 70%); filter: blur(20px); }
    @keyframes pop { from { opacity: 0; transform: scale(.4); } }
    @keyframes up { from { opacity: 0; transform: translateY(14px); } }
    @keyframes wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }
    @keyframes float { 50% { transform: translateY(-8px); } }

    /* Website */
    .browser { position: relative; width: 240px; border-radius: 12px; overflow: hidden; background: #0d151b; border: 2px solid rgba(216,174,98,.6); box-shadow: 0 0 30px rgba(216,174,98,.25); animation: up .6s both; }
    .bar { display: flex; align-items: center; gap: 4px; padding: 7px 9px; background: #141c21; }
    .bar i { width: 7px; height: 7px; border-radius: 50%; background: #e5484d; }
    .bar i:nth-child(2) { background: #f5a524; } .bar i:nth-child(3) { background: #2fbf71; }
    .bar span { margin-left: 6px; font-size: .62rem; color: #97a1aa; }
    .body { display: grid; gap: 9px; padding: 10px; }
    .nav { display: flex; align-items: center; justify-content: space-between; animation: up .5s .4s both; }
    .nav img { height: 26px; width: auto; }
    .nav span { font: 600 .55rem var(--font-head); color: #aeb6bd; }
    .hero-img { position: relative; height: 110px; border-radius: 8px; overflow: hidden; animation: wipe .8s 1s both; }
    .hero-img img { width: 100%; height: 100%; object-fit: cover; animation: zoom 5s ease-out 1s both; }
    .hero-img b { position: absolute; left: 10px; bottom: 8px; font: 800 1rem var(--font-head); color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.6); animation: up .5s 1.8s both; }
    @keyframes zoom { from { transform: scale(1.15); } }
    .go { justify-self: start; padding: 6px 14px; border-radius: 99px; background: var(--gradient); color: #090e13; font: 700 .72rem var(--font-head); animation: pop .4s 2.4s both; }
    .cursor { position: absolute; font-size: 1.3rem; animation: cur 3.2s ease-in-out .3s both; }
    @keyframes cur { 0% { left: 85%; top: 25%; opacity: 0; } 30% { opacity: 1; } 85% { left: 18%; top: 84%; } 92% { transform: scale(.85); } 100% { left: 18%; top: 84%; } }

    /* Mobile app */
    .phone { position: relative; width: 120px; height: 230px; border-radius: 22px; border: 6px solid #0d1419; background: #090e13; overflow: hidden; box-shadow: 0 0 0 2px rgba(216,174,98,.5), 0 0 30px rgba(216,174,98,.25); animation: up .6s both; }
    .splash { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; padding: 14px; background: radial-gradient(circle, #16242e, #090e13 75%); animation: hide .4s 1.5s forwards; }
    .splash img { width: 100%; animation: pop .7s .3s both; }
    @keyframes hide { to { opacity: 0; visibility: hidden; } }
    .screens { display: flex; width: 300%; height: 100%; animation: swipe 4.6s ease-in-out 1.6s both; }
    @keyframes swipe { 0%, 30% { transform: none; } 45%, 65% { transform: translateX(-33.33%); } 80%, 100% { transform: translateX(-66.66%); } }
    .scr { flex: 1; position: relative; display: grid; align-content: end; padding: 10px; background: #090e13; }
    .scr img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .scr em { position: relative; padding: 5px 8px; border-radius: 8px; background: rgba(9,14,19,.75); font: 700 .68rem var(--font-head); font-style: normal; color: #fff; text-align: center; }
    .scr.done { align-content: center; justify-items: center; gap: 8px; }
    .scr.done b { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: #2fbf71; color: #fff; font-size: 1.4rem; }
    .scr.done em { background: none; }
    .tapdot { position: absolute; left: 50%; top: 60%; width: 26px; height: 26px; margin: -13px; border-radius: 50%; border: 2px solid #f3d18d; opacity: 0; animation: tap 1.5s ease-out .9s 3; }
    @keyframes tap { 0% { opacity: .9; transform: scale(.4); } 60%, 100% { opacity: 0; transform: scale(1.8); } }

    /* Social media */
    .feed { position: relative; width: 240px; height: 240px; display: grid; place-items: center; }
    .post { width: 140px; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 14px 30px rgba(0,0,0,.45); animation: up .6s both; }
    .who { display: flex; align-items: center; gap: 6px; padding: 6px 8px; }
    .who img { width: 20px; height: 20px; border-radius: 50%; }
    .who b { font: 700 .62rem var(--font-head); color: #141c21; }
    .pics { position: relative; height: 130px; overflow: hidden; }
    .pics img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; animation: slide 7.5s infinite; }
    .pics img:nth-child(2) { animation-delay: 2.5s; }
    .pics img:nth-child(3) { animation-delay: 5s; }
    @keyframes slide { 0% { opacity: 0; transform: scale(1.1); } 6%, 33% { opacity: 1; } 40%, 100% { opacity: 0; transform: scale(1); } }
    .likes { display: block; padding: 7px 10px; font: 700 .72rem var(--font-head); color: #141c21; }
    .soc { position: absolute; width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; color: #fff; box-shadow: 0 8px 18px rgba(0,0,0,.4); animation: pop .4s both, float 3s ease-in-out infinite; }
    .i1 { left: 8px; top: 30px; animation-delay: .5s, .9s; }
    .i2 { right: 8px; top: 40px; animation-delay: .8s, 1.2s; }
    .i3 { left: 14px; bottom: 34px; animation-delay: 1.1s, 1.5s; }
    .i4 { right: 14px; bottom: 30px; animation-delay: 1.4s, 1.8s; }
    .heart { position: absolute; bottom: 60px; font-size: 1.1rem; opacity: 0; animation: rise 2.6s ease-in infinite; }
    .h1 { left: 46%; animation-delay: 1s; } .h2 { left: 56%; animation-delay: 1.8s; } .h3 { left: 40%; animation-delay: 2.5s; }
    @keyframes rise { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-120px); } }

    /* Branding */
    .brand { position: relative; width: 240px; height: 240px; }
    /* Letterhead behind, visiting card flipping in front */
    .letter { position: absolute; left: 14px; top: 8px; width: 120px; height: 160px; padding: 10px; border-radius: 6px; background: #fffbf4; box-shadow: 0 12px 26px rgba(0,0,0,.45); display: grid; align-content: start; gap: 7px; transform: rotate(-8deg); animation: up .6s .2s both; }
    .letter img { width: 70%; background: #090e13; border-radius: 4px; padding: 4px; }
    .letter i { height: 5px; border-radius: 3px; background: #d9dee2; }
    .vcard { position: absolute; right: 8px; top: 70px; width: 170px; height: 100px; perspective: 700px; animation: up .6s .6s both; }
    .face { position: absolute; inset: 0; border-radius: 10px; backface-visibility: hidden; box-shadow: 0 14px 30px rgba(0,0,0,.55); animation: turn-card 5s ease-in-out 1.4s infinite; }
    .front { display: grid; place-items: center; padding: 12px; background: #090e13; border: 1px solid #d8ae62; }
    .front img { width: 92%; }
    .back { display: grid; align-content: center; gap: 2px; padding: 10px 12px; background: #fffbf4; color: #141c21; transform: rotateY(180deg); animation-name: turn-back; }
    .back img { position: absolute; right: 8px; top: 8px; width: 46px; background: #090e13; border-radius: 4px; padding: 2px; }
    .back b { font: 800 .7rem var(--font-head); }
    .back small { font-size: .52rem; color: #8c6428; margin-bottom: 4px; }
    .back span { font-size: .55rem; color: #5a6168; }
    @keyframes turn-card { 0%, 35% { transform: rotateY(0); } 50%, 85% { transform: rotateY(180deg); } 100% { transform: rotateY(360deg); } }
    @keyframes turn-back { 0%, 35% { transform: rotateY(180deg); } 50%, 85% { transform: rotateY(360deg); } 100% { transform: rotateY(540deg); } }
    .sw { position: absolute; left: 22px; bottom: 30px; display: flex; gap: 6px; }
    .sw i { width: 22px; height: 22px; border-radius: 6px; animation: pop .35s both; }
    .sw i:nth-child(1) { background: #090e13; border: 1px solid #333; animation-delay: 2s; }
    .sw i:nth-child(2) { background: #d8ae62; animation-delay: 2.15s; }
    .sw i:nth-child(3) { background: #f3d18d; animation-delay: 2.3s; }
    .sw i:nth-child(4) { background: #fffbf4; animation-delay: 2.45s; }

    /* Email & domain */
    .mail { position: relative; width: 250px; height: 240px; display: grid; place-items: center; align-content: center; gap: 12px; }
    .gmail { position: absolute; top: 0; right: 10px; width: 62px; filter: drop-shadow(0 6px 14px rgba(0,0,0,.4)); animation: pop .5s 1.6s both, float 3s ease-in-out 2.1s infinite; }
    .env {
      position: relative; width: 150px; height: 96px; display: grid; place-items: center; padding: 18px 24px 10px; border-radius: 8px;
      background: #fffbf4; box-shadow: 0 14px 30px rgba(0,0,0,.45); animation: fly 1.3s ease-out both;
    }
    .env::before { content: ''; position: absolute; inset: 0 0 auto; height: 50%; background: linear-gradient(to bottom right, transparent 49%, #eadfca 50%) left / 50% 100% no-repeat, linear-gradient(to bottom left, transparent 49%, #eadfca 50%) right / 50% 100% no-repeat; }
    .env img { position: relative; width: 100%; background: #090e13; border-radius: 4px; padding: 4px; }
    @keyframes fly { from { opacity: 0; transform: translate(-100px, 40px) rotate(-20deg) scale(.6); } }
    .addr { padding: 7px 14px; border-radius: 10px; background: #141c21; border: 1px solid rgba(216,174,98,.5); color: #fff; font: 700 .85rem var(--font-head); }
    .typed { display: inline-block; white-space: nowrap; animation: wipe 1.2s steps(18) 1.3s both; }
    .ok { padding: 4px 12px; border-radius: 99px; background: #2fbf71; color: #fff; font: 700 .75rem var(--font-head); animation: pop .4s 2.7s both; }

    /* Ledger */
    .ledger { position: relative; width: 240px; display: grid; gap: 12px; }
    .rows { display: grid; gap: 7px; padding: 12px; border-radius: 12px; background: var(--ivory); }
    .rows span { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; border-radius: 7px; background: #fff; border: 1px solid #eadfca; animation: up .4s both; }
    .rows span:nth-child(1) { animation-delay: .4s; } .rows span:nth-child(2) { animation-delay: .9s; } .rows span:nth-child(3) { animation-delay: 1.4s; }
    .rows b { font: 700 .8rem var(--font-head); color: #0b7a3b; } .rows .out b { color: #c62828; }
    .rows i { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; background: #2fbf71; color: #fff; font-style: normal; font-size: .65rem; }
    .bars { display: flex; align-items: flex-end; gap: 8px; height: 60px; padding: 0 12px; }
    .bars i { flex: 1; border-radius: 4px 4px 0 0; background: var(--gradient); transform-origin: bottom; animation: grow .6s both; }
    .bars i:nth-child(1) { height: 35%; animation-delay: 1.8s; } .bars i:nth-child(2) { height: 50%; animation-delay: 1.95s; }
    .bars i:nth-child(3) { height: 45%; animation-delay: 2.1s; } .bars i:nth-child(4) { height: 72%; animation-delay: 2.25s; }
    .bars i:nth-child(5) { height: 100%; animation-delay: 2.4s; }
    @keyframes grow { from { transform: scaleY(0); } }
    .coin { position: absolute; right: -10px; top: -14px; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: var(--gradient); color: #090e13; font: 800 1.3rem var(--font-head); box-shadow: 0 0 20px rgba(216,174,98,.5); animation: spinc 2.4s linear infinite; }
    @keyframes spinc { to { transform: rotateY(360deg); } }
  `,
})
export class ServiceArt {
  readonly slug = input.required<string>();
}
