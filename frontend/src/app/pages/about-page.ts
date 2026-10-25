import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { AboutVisual } from '../sections/about-visual';
import { CtaBanner } from '../sections/cta-banner';
import { Stats } from '../sections/stats';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { Reveal } from '../shared/reveal';

const WORDS = ['Websites', 'Mobile Apps', 'Reels', 'Brands', 'Growth'];

@Component({
  selector: 'app-about-page',
  imports: [PageHero, Stats, CtaBanner, Icon, AboutVisual, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      crumb="About Us"
      heading="About Hari's Digital Den"
      subtitle="Brand | Content | Growth — a creative digital marketing studio serving Andhra Pradesh & Telangana and expanding all over India."
    />

    <section class="section">
      <div class="container story">
        <div class="copy" appReveal>
          <span class="eyebrow">Who we are</span>
          <h2>
            We create
            <span class="word-box">
              @for (w of word(); track w.key) {
                <span class="word">{{ w.text }}</span>
              }
            </span>
            <br />that people love.
          </h2>
          <p>
            Hari's Digital Den helps businesses go digital the right way — with a professional
            website, a consistent brand identity and active social media that people trust.
          </p>
          <p>
            We take care of everything: building your website and mobile app, creating and managing
            your Instagram, Facebook, YouTube, LinkedIn, Pinterest, X and Threads accounts, designing
            your logo and business stationery, and posting fresh content every week. You focus on your
            business — we help it grow. DM us and let's grow together!
          </p>
          <div class="motto">
            <span>Brand</span><i></i><span>Content</span><i></i><span>Growth</span>
          </div>
        </div>
        <div appReveal [revealDelay]="150">
          <app-about-visual />
        </div>
      </div>
    </section>

    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        @for (t of tickerLoop; track $index) {
          <span>{{ t }}</span><b>✦</b>
        }
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">What drives us</span>
          <h2>Built on <span class="gradient-text">Four Promises</span></h2>
        </div>
        <div class="grid grid--4">
          @for (v of values; track v.title; let i = $index) {
            <div class="value" appReveal [revealDelay]="i * 120">
              <span class="v-icon"><app-icon [name]="v.icon" [size]="26" /></span>
              <h3>{{ v.title }}</h3>
              <p>{{ v.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <app-stats />
    <div class="spacer"></div>
    <app-cta-banner />
  `,
  styles: `
    .story { display: grid; gap: 48px; align-items: center; }
    @media (min-width: 992px) { .story { grid-template-columns: 1fr 1.05fr; gap: 56px; } }
    .story h2 { font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.25; }
    .story p { color: var(--muted); font-size: 1.05rem; }

    /* Rotating word in the headline */
    .word-box { display: inline-grid; vertical-align: bottom; overflow: hidden; height: 1.25em; }
    .word {
      grid-area: 1 / 1; background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: word-in 2.4s ease both;
    }
    @keyframes word-in {
      0% { transform: translateY(100%); opacity: 0; }
      15%, 85% { transform: none; opacity: 1; }
      100% { transform: translateY(-100%); opacity: 0; }
    }

    .motto { display: flex; align-items: center; gap: 14px; margin-top: 26px; font: 600 0.8rem var(--font-head); letter-spacing: 0.3em; text-transform: uppercase; color: var(--champagne); }
    .motto i { width: 28px; height: 1px; background: var(--gold); }

    /* Scrolling services ticker */
    .ticker { overflow: hidden; padding: 22px 0; background: var(--gradient); }
    .ticker-track { display: flex; align-items: center; gap: 28px; width: max-content; animation: tick 40s linear infinite; }
    .ticker span { font: 800 clamp(1.2rem, 2.4vw, 1.8rem) var(--font-head); color: var(--obsidian); white-space: nowrap; }
    .ticker b { color: var(--obsidian); opacity: 0.6; }
    @keyframes tick { to { transform: translateX(-50%); } }

    .value {
      padding: 30px 26px; border-radius: var(--radius); background: var(--charcoal); border: 1px solid var(--border);
      transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .value:hover { transform: translateY(-6px); border-color: rgba(216, 174, 98, 0.55); box-shadow: var(--shadow-lg); }
    .v-icon {
      width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; margin-bottom: 18px;
      color: var(--on-gold); background: var(--gradient); transition: transform 0.4s;
    }
    .value:hover .v-icon { transform: rotate(-8deg) scale(1.08); }
    .value h3 { font-size: 1.1rem; }
    .value p { font-size: 0.95rem; margin: 0; color: var(--muted); }
    .spacer { height: 72px; }
  `,
})
export class AboutPage {
  protected readonly values = [
    { icon: 'target', title: 'Strategy Driven', text: 'Every post and campaign is planned around your business goals.' },
    { icon: 'branding', title: 'Creative Content', text: 'Reels, designs and videos with your branding that stand out.' },
    { icon: 'chart', title: 'Business Growth', text: 'Monthly reviews and insights so you can see your progress.' },
    { icon: 'users', title: 'Partnerships', text: 'We help you build collaborations that grow your reach.' },
  ];

  private readonly ticker = [
    'Websites', 'Mobile Apps', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Reels',
    'Branding', 'Business Email', 'Digital Ledger',
  ];
  // Doubled so the -50% scroll loops seamlessly.
  protected readonly tickerLoop = [...this.ticker, ...this.ticker];

  private readonly tick = signal(0);
  // A new key each tick re-creates the word so its animation replays.
  protected readonly word = computed(() => [{ key: this.tick(), text: WORDS[this.tick() % WORDS.length] }]);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const id = setInterval(() => this.tick.update((t) => t + 1), 2400);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}
