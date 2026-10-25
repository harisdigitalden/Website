import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { whatsappLink } from '../site.config';

interface Notice {
  icon: string;
  color: string;
  text: string;
}

const NOTICES: Notice[] = [
  { icon: 'heart', color: '#e1306c', text: '<b>priya.designs</b> liked your Reel' },
  { icon: 'userplus', color: '#d8ae62', text: '<b>+24 new followers</b> today' },
  { icon: 'message', color: '#1877f2', text: '<b>vsn.interiors</b> commented “Wow! 🔥”' },
  { icon: 'social', color: '#2fbf71', text: 'Your post was <b>shared 18 times</b>' },
  { icon: 'eye', color: '#a855f7', text: 'Reel crossed <b>10K views</b> 🎉' },
  { icon: 'chart', color: '#d8ae62', text: 'Engagement <b>up 32%</b> this week' },
];

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="container inner">
        <div class="copy fade-up">
          <span class="eyebrow">Brand · Content · Growth</span>
          <h1>
            Your Brand. <span class="gold">Our Creativity.</span>
          </h1>
          <p class="lead">
            Hari's Digital Den builds websites and mobile apps, sets up and manages your Instagram,
            Facebook, LinkedIn and all social media, and creates Reels, branding and content that grow
            your business — serving Andhra Pradesh &amp; Telangana and expanding all over India.
          </p>
          <div class="ctas">
            <a routerLink="/contact" class="btn btn--primary">
              Get Free Consultation <app-icon name="arrow" [size]="18" />
            </a>
            <a [href]="whatsapp" target="_blank" rel="noopener" class="btn btn--whatsapp">
              <app-icon name="whatsapp" [size]="18" /> WhatsApp Us
            </a>
          </div>
          <div class="platforms">
            <small>We set up &amp; manage</small>
            <div class="chips">
              @for (p of platforms; track p.icon) {
                <span class="chip" [title]="p.name" [style.background]="p.color"><app-icon [name]="p.icon" [size]="18" /></span>
              }
            </div>
          </div>
        </div>

        <div class="visual fade-up" aria-hidden="true">
          <div class="phone">
            <div class="phone-top">
              <img src="apple-touch-icon.png" alt="" class="dp" />
              <div>
                <strong>harisdigitalden</strong>
                <small>Sponsored · Reel</small>
              </div>
            </div>
            <div class="post">
              <span class="post-title">Grow<br />Together</span>
              <span class="play"><app-icon name="eye" [size]="14" /> {{ fmt(views()) }}</span>
              <div class="hearts">
                @for (h of [1, 2, 3, 4, 5, 6]; track h) {
                  <span class="h"><app-icon name="heart" [size]="16 + (h % 3) * 4" [filled]="true" /></span>
                }
              </div>
            </div>
            <div class="post-actions">
              <span class="like"><app-icon name="heart" [size]="22" [filled]="true" /></span>
              <app-icon name="message" [size]="20" />
              <app-icon name="social" [size]="20" />
            </div>
            <div class="likes"><b>{{ fmt(likes()) }} likes</b> · {{ fmt(comments()) }} comments</div>
          </div>

          <!-- Instagram views counting up -->
          <div class="float-card c1">
            <span class="ic insta"><app-icon name="instagram" [size]="20" /></span>
            <div>
              <small>Reel views</small>
              <strong>{{ fmt(views()) }}</strong>
              <svg class="spark" viewBox="0 0 80 24"><polyline points="0,20 12,17 24,18 36,12 48,13 60,7 72,5 80,2" /></svg>
            </div>
          </div>

          <!-- Facebook reach growing -->
          <div class="float-card c3">
            <span class="ic fb"><app-icon name="facebook" [size]="20" /></span>
            <div>
              <small>Facebook reach</small>
              <strong>{{ fmt(reach()) }}</strong>
              <span class="up">▲ {{ growth() }}% this week</span>
            </div>
          </div>

          <!-- Live notifications -->
          @for (n of notice(); track n.key) {
            <div class="notice c2">
              <span class="n-ic" [style.background]="n.color"><app-icon [name]="n.icon" [size]="16" [filled]="n.icon === 'heart'" /></span>
              <span class="n-text" [innerHTML]="n.text"></span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative; overflow: hidden; background: var(--obsidian); color: #c9d0d6;
      padding: calc(var(--header-h) + 56px) 0 96px;
    }
    .hero::before, .hero::after {
      content: ''; position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.28;
    }
    .hero::before { width: 460px; height: 460px; background: var(--gold); top: -160px; right: -100px; }
    .hero::after { width: 420px; height: 420px; background: #1d3442; bottom: -180px; left: -120px; opacity: 0.8; }
    .inner { position: relative; z-index: 1; display: grid; gap: 56px; align-items: center; }
    @media (min-width: 992px) { .inner { grid-template-columns: 1.1fr 0.9fr; } }

    h1 { color: #fff; font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.02em; }
    .gold { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .lead { font-size: 1.1rem; max-width: 590px; margin: 20px 0 32px; }
    .ctas { display: flex; flex-wrap: wrap; gap: 14px; }

    .platforms { margin-top: 40px; }
    .platforms small { display: block; margin-bottom: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.75rem; color: var(--champagne); }
    .chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .chip {
      width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; color: #fff;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08); transition: transform 0.2s;
    }
    .chip:hover { transform: translateY(-3px) scale(1.08); }

    /* Phone mock-up */
    .visual { position: relative; display: grid; place-items: center; min-height: 500px; animation-delay: 0.15s; }
    .phone {
      width: 280px; background: var(--charcoal); border-radius: 34px; padding: 16px; border: 8px solid #0d1419;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(216, 174, 98, 0.45); transform: rotate(-3deg); color: #fff;
    }
    .phone-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; line-height: 1.2; }
    .phone-top strong { font-size: 0.85rem; display: block; }
    .phone-top small { color: var(--muted); font-size: 0.7rem; }
    .dp { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); }
    .post {
      position: relative; height: 270px; border-radius: 16px; display: grid; place-items: center; text-align: center; overflow: hidden;
      background: radial-gradient(circle at 30% 20%, #1c2c38, var(--obsidian) 72%); border: 1px solid rgba(216, 174, 98, 0.25);
    }
    .post-title { font: 800 2rem/1.1 var(--font-head); background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .play {
      position: absolute; left: 10px; bottom: 10px; display: inline-flex; align-items: center; gap: 4px;
      font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 999px; background: rgba(0, 0, 0, 0.55);
    }
    .hearts { position: absolute; right: 14px; bottom: 0; width: 40px; height: 100%; pointer-events: none; }
    .h { position: absolute; bottom: -20px; left: 50%; color: var(--pink); opacity: 0; animation: heart-rise 3.6s ease-in infinite; }
    .h:nth-child(2) { animation-delay: 0.6s; color: #ff6b8a; margin-left: -12px; }
    .h:nth-child(3) { animation-delay: 1.2s; color: var(--gold); margin-left: 6px; }
    .h:nth-child(4) { animation-delay: 1.8s; margin-left: -6px; }
    .h:nth-child(5) { animation-delay: 2.4s; color: #ff6b8a; margin-left: 10px; }
    .h:nth-child(6) { animation-delay: 3s; color: var(--champagne); margin-left: -14px; }
    @keyframes heart-rise {
      0% { transform: translateY(0) scale(0.6); opacity: 0; }
      15% { opacity: 1; }
      100% { transform: translateY(-240px) translateX(-10px) scale(1.1); opacity: 0; }
    }
    .post-actions { display: flex; align-items: center; gap: 14px; margin-top: 12px; }
    .like { color: var(--pink); display: inline-flex; animation: pulse 1.2s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.25); } }
    .likes { font-size: 0.8rem; margin-top: 6px; color: #d9dee2; font-variant-numeric: tabular-nums; }

    /* Floating stat cards */
    .float-card {
      position: absolute; display: flex; align-items: center; gap: 12px; background: var(--ivory); color: var(--charcoal);
      padding: 12px 16px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); line-height: 1.2;
      animation: float 5s ease-in-out infinite; min-width: 180px;
    }
    .float-card small { display: block; color: #5a6168; font-size: 0.72rem; }
    .float-card strong { display: block; font: 800 1.25rem var(--font-head); font-variant-numeric: tabular-nums; }
    .ic { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; color: #fff; flex-shrink: 0; }
    .ic.insta { background: linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7); }
    .ic.fb { background: #1877f2; }
    .spark { width: 80px; height: 20px; display: block; margin-top: 2px; }
    .spark polyline {
      fill: none; stroke: #2fbf71; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
      stroke-dasharray: 120; stroke-dashoffset: 120; animation: draw 2.4s ease-out infinite;
    }
    @keyframes draw { 0% { stroke-dashoffset: 120; } 60%, 100% { stroke-dashoffset: 0; } }
    .up { font-size: 0.72rem; font-weight: 700; color: #1a9e57; }
    .c1 { top: 18px; left: -6px; }
    .c3 { top: 44%; right: -6px; animation-delay: 2s; }

    /* Notification toast */
    .notice {
      position: absolute; bottom: 34px; left: -16px; display: flex; align-items: center; gap: 10px; max-width: 270px;
      padding: 10px 14px; border-radius: 14px; background: rgba(20, 28, 33, 0.95); color: #eef1f3; font-size: 0.82rem;
      border: 1px solid rgba(216, 174, 98, 0.35); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      animation: toast 2.6s ease both;
    }
    .notice ::ng-deep b { color: #fff; }
    .n-ic { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex-shrink: 0; }
    @keyframes toast {
      0% { opacity: 0; transform: translateY(16px) scale(0.96); }
      12%, 85% { opacity: 1; transform: none; }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @media (max-width: 480px) {
      .float-card { min-width: 0; padding: 10px 12px; }
      .c1 { left: -4px; }
      .c3 { right: -4px; }
      .notice { left: 0; }
    }
  `,
})
export class Hero {
  protected readonly whatsapp = whatsappLink();
  protected readonly platforms = [
    { name: 'Instagram', icon: 'instagram', color: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' },
    { name: 'Facebook', icon: 'facebook', color: '#1877f2' },
    { name: 'YouTube', icon: 'youtube', color: '#ff0000' },
    { name: 'LinkedIn', icon: 'linkedin', color: '#0a66c2' },
    { name: 'Pinterest', icon: 'pinterest', color: '#e60023' },
    { name: 'X (Twitter)', icon: 'x', color: '#000' },
    { name: 'Threads', icon: 'threads', color: '#000' },
  ];

  // Illustrative live counters for the phone mock-up.
  protected readonly views = signal(12480);
  protected readonly reach = signal(8650);
  protected readonly likes = signal(2481);
  protected readonly comments = signal(186);
  protected readonly growth = signal(24);
  private readonly tick = signal(0);
  // A fresh key each tick re-creates the toast so its entrance animation replays.
  protected readonly notice = computed(() => [{ key: this.tick(), ...NOTICES[this.tick() % NOTICES.length] }]);

  private readonly formatter = new Intl.NumberFormat('en-IN');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const counters = setInterval(() => {
        this.views.update((v) => v + rand(8, 40));
        this.reach.update((v) => v + rand(5, 25));
        this.likes.update((v) => v + rand(1, 6));
        if (Math.random() < 0.3) this.comments.update((v) => v + 1);
        if (Math.random() < 0.15) this.growth.update((g) => Math.min(g + 1, 48));
      }, 700);
      const notices = setInterval(() => this.tick.update((t) => t + 1), 2600);
      destroyRef.onDestroy(() => {
        clearInterval(counters);
        clearInterval(notices);
      });
    });
  }

  protected fmt(n: number): string {
    return this.formatter.format(n);
  }
}
