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
          <p>
            We work with businesses across Andhra Pradesh, Telangana and beyond — in Hyderabad,
            Visakhapatnam (Vizag), Vijayawada, Guntur, Tirupati, Warangal, Bengaluru and more.
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

    <!-- Cities we serve: pin cards on a moving route, right to left -->
    <div class="cities">
      <span class="label">📍 We serve</span>
      <div class="route" aria-hidden="true">
        <div class="track">
          @for (c of citiesLoop; track $index) {
            <div class="pin" [style.--i]="$index" [title]="c.name + ' — famous for ' + c.famous">
              <span class="emoji">{{ c.emoji }}</span>
              <b class="name">{{ c.name }}</b>
            </div>
          }
        </div>
      </div>
      <span class="sr-only">We serve {{ cityNames }}.</span>
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

    /* Cities band: pin cards travelling right to left along a dashed gold route */
    .cities {
      position: relative; overflow: hidden; padding: 26px 0; background: var(--midnight);
      border-block: 1px solid var(--border);
    }
    .cities::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 190px; z-index: 2;
      background: linear-gradient(90deg, var(--midnight) 70%, transparent);
    }
    .cities::after {
      content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 80px; z-index: 2;
      background: linear-gradient(270deg, var(--midnight), transparent);
    }
    .label {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%); z-index: 3; padding: 8px 16px; border-radius: 999px;
      background: var(--gradient); color: var(--obsidian); font: 700 0.85rem var(--font-head); white-space: nowrap;
      box-shadow: 0 0 0 0 rgba(216, 174, 98, 0.6); animation: ping 4s ease-out infinite;
    }
    @keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(216, 174, 98, 0.55); } 100% { box-shadow: 0 0 0 14px rgba(216, 174, 98, 0); } }
    .route { position: relative; }
    /* The dashed route line the cards travel along */
    .route::before {
      content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 2px;
      background: repeating-linear-gradient(90deg, rgba(216, 174, 98, 0.7) 0 10px, transparent 10px 20px);
      background-size: 20px 2px; animation: dash 4s linear infinite;
    }
    @keyframes dash { to { background-position: -20px 0; } }
    .track { position: relative; display: flex; align-items: center; gap: 34px; width: max-content; padding-left: 34px; animation: travel 160s linear infinite; }
    .route:hover .track { animation-play-state: paused; }
    @keyframes travel { to { transform: translateX(-50%); } }

    .pin {
      display: flex; align-items: center; gap: 12px; padding: 8px 18px 8px 8px; border-radius: 999px; white-space: nowrap;
      background: var(--charcoal); border: 1px solid rgba(216, 174, 98, 0.35); box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .pin:hover { transform: translateY(-6px) scale(1.05); border-color: var(--gold); box-shadow: 0 14px 30px rgba(216, 174, 98, 0.25); }
    .emoji {
      width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; font-size: 1.6rem;
      background: radial-gradient(circle at 35% 30%, #1c2c38, var(--obsidian)); border: 2px solid var(--gold);
      box-shadow: 0 0 14px rgba(216, 174, 98, 0.35);
      /* each pin bobs a little after the previous one, making a wave */
      animation: bob 5s ease-in-out calc(var(--i) * -0.4s) infinite;
    }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    .name { font: 700 1.05rem var(--font-head); color: #fff; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

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

  // Cities we serve, each with what it's famous for.
  private readonly cities = [
    { name: 'Hyderabad', emoji: '🕌', famous: 'Charminar & biryani' },
    { name: 'Secunderabad', emoji: '🚆', famous: 'Railway junction' },
    { name: 'Visakhapatnam', emoji: '🏖️', famous: 'Beaches & port' },
    { name: 'Vijayawada', emoji: '🌉', famous: 'Prakasam Barrage' },
    { name: 'Guntur', emoji: '🌶️', famous: 'Chillies' },
    { name: 'Tirupati', emoji: '🛕', famous: 'Tirumala temple' },
    { name: 'Nellore', emoji: '🦐', famous: 'Prawns & seafood' },
    { name: 'Kakinada', emoji: '🍬', famous: 'Kakinada Kaja' },
    { name: 'Rajahmundry', emoji: '🌊', famous: 'Godavari river' },
    { name: 'Warangal', emoji: '🏰', famous: 'Warangal Fort' },
    { name: 'Karimnagar', emoji: '✨', famous: 'Silver filigree' },
    { name: 'Kurnool', emoji: '💎', famous: 'Diamond hunting' },
    { name: 'Khammam', emoji: '🪨', famous: 'Granite' },
    { name: 'Nizamabad', emoji: '🌿', famous: 'Turmeric' },
    { name: 'Anantapur', emoji: '🥜', famous: 'Groundnuts' },
    { name: 'Ongole', emoji: '🐂', famous: 'Ongole bulls' },
    { name: 'Eluru', emoji: '🧶', famous: 'Hand-woven carpets' },
    { name: 'Bengaluru', emoji: '💻', famous: 'India’s IT city' },
  ];
  // Doubled so the -50% scroll loops seamlessly.
  protected readonly citiesLoop = [...this.cities, ...this.cities];
  protected readonly cityNames = this.cities.map((c) => c.name).join(', ');

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
