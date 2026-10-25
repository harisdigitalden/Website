import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import {
  SceneAccounts,
  SceneApp,
  SceneCertificate,
  SceneCountdown,
  SceneCustomers,
  SceneEnd,
  SceneInterval,
  SceneLedger,
  SceneShowcase,
  SceneSocial,
  SceneSupport,
  SceneTitle,
  SceneWebsite,
} from './movie-scenes';

interface Scene {
  key: string;
  label: string;
  act: string;
  subtitle: string;
  ms: number;
}

// The story, in order. Each scene plays for `ms` milliseconds, then the next starts.
const SCENES: Scene[] = [
  { key: 'curtain', label: '', act: '🎬 Now Showing', subtitle: '', ms: 2000 },
  { key: 'countdown', label: '3·2·1', act: 'Opening', subtitle: '', ms: 3300 },
  { key: 'certificate', label: 'Certificate', act: 'Opening', subtitle: 'Certified U — Universal Growth.', ms: 4500 },
  { key: 'title', label: 'Your Brand', act: 'ప్రారంభం · Intro', subtitle: "Hari's Digital Den presents… your brand, coming online with us.", ms: 4800 },
  { key: 'website', label: 'Going Online', act: 'Intro · Mass Entry', subtitle: 'Mass entry! Your brand goes online with a website that steals the show.', ms: 6000 },
  { key: 'accounts', label: 'Accounts & Email', act: 'Intro · Setup', subtitle: 'We set up all your social accounts and your business email.', ms: 6200 },
  { key: 'social', label: 'FB & Instagram', act: 'Intro · Marketing', subtitle: 'Facebook & Instagram marketing goes live — the buzz begins.', ms: 6000 },
  { key: 'app', label: 'Mobile App', act: 'Intro · App', subtitle: 'Your customers open your app with one tap.', ms: 6000 },
  { key: 'ledger', label: 'Digital Ledger', act: 'Intro · Ledger', subtitle: 'Your digital ledger — every invoice, purchase & payment tracked, on computer & mobile.', ms: 6200 },
  { key: 'interval', label: 'Interval', act: 'విరామం · Interval', subtitle: 'Setup complete ✓ — grab your popcorn, the second half begins.', ms: 4800 },
  { key: 'customers', label: 'Customers', act: 'Second Half', subtitle: 'Customers start coming… HOUSEFULL!', ms: 6200 },
  { key: 'support', label: 'Support & Branding', act: 'Second Half', subtitle: 'Weekly posts, brand materials & constant support — we stay with your business.', ms: 6800 },
  { key: 'showcase', label: 'Talent Showcase', act: 'క్లైమాక్స్ · Climax', subtitle: 'Festival posts & everyday interaction with your customers — our talent showcase.', ms: 7000 },
  { key: 'end', label: 'Book Your Show', act: 'శుభం · The End', subtitle: '…Sequel loading. Book your show — let’s grow together.', ms: 7000 },
];

// Services page "movie": an auto-playing cinema that tells the Hari's Digital
// Den story scene by scene, like a Telugu film. Pauses when off screen.
@Component({
  selector: 'app-services-movie',
  imports: [
    SceneCountdown, SceneCertificate, SceneTitle, SceneWebsite, SceneAccounts, SceneSocial,
    SceneApp, SceneLedger, SceneInterval, SceneCustomers, SceneSupport, SceneShowcase, SceneEnd,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section movie">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">🎬 Now Showing</span>
          <h2>Your Brand — <span class="gradient-text">The Blockbuster</span></h2>
          <p>How we grow your business, told like a Telugu movie. Sit back — it plays by itself.</p>
        </div>

        <div class="hall">
          <span class="beam" aria-hidden="true"></span>
          <span class="curtain l" aria-hidden="true"></span>
          <span class="curtain r" aria-hidden="true"></span>

          <div class="screen" #screen [class.paused]="!running()" role="img" [attr.aria-label]="scene().subtitle || scene().label">
            @switch (scene().key) {
              @case ('countdown') { <app-scene-countdown /> }
              @case ('certificate') { <app-scene-certificate /> }
              @case ('title') { <app-scene-title /> }
              @case ('website') { <app-scene-website /> }
              @case ('accounts') { <app-scene-accounts /> }
              @case ('social') { <app-scene-social /> }
              @case ('app') { <app-scene-app /> }
              @case ('ledger') { <app-scene-ledger /> }
              @case ('interval') { <app-scene-interval /> }
              @case ('customers') { <app-scene-customers /> }
              @case ('support') { <app-scene-support /> }
              @case ('showcase') { <app-scene-showcase /> }
              @case ('end') { <app-scene-end /> }
            }
            <span class="act">{{ scene().act }}</span>
            @if (scene().subtitle) {
              <p class="subtitle">{{ scene().subtitle }}</p>
            }
            <span class="grain" aria-hidden="true"></span>

            <!-- Theatre curtains: open at the start, close after the end -->
            <span class="drape l" [class.closed]="curtainClosed()" aria-hidden="true"></span>
            <span class="drape r" [class.closed]="curtainClosed()" aria-hidden="true"></span>
            <span class="valance" aria-hidden="true"></span>
          </div>

          <div class="seats" aria-hidden="true">
            @for (s of seats; track s) { <i></i> }
          </div>
        </div>

        <div class="controls">
          <button type="button" class="play" (click)="playing.update((p) => !p)" [attr.aria-label]="playing() ? 'Pause' : 'Play'">
            {{ playing() ? '❚❚' : '▶' }}
          </button>
          <div class="segments">
            @for (s of scenes; track s.key; let i = $index) {
              @if (s.label) {
                <button type="button" [class.on]="i === index()" (click)="go(i)" [title]="s.label">
                  <span class="bar"><span class="fill" [style.width.%]="i < index() ? 100 : i === index() ? progress() * 100 : 0"></span></span>
                  <small>{{ s.label }}</small>
                </button>
              }
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .movie { overflow: hidden; }
    .hall { position: relative; padding: 0 4%; }
    .beam {
      position: absolute; left: 50%; top: -30%; width: 120%; height: 150%; transform: translateX(-50%); pointer-events: none;
      background: linear-gradient(180deg, rgba(243, 209, 141, 0.14), rgba(243, 209, 141, 0) 70%);
      clip-path: polygon(47% 0, 53% 0, 100% 100%, 0 100%); animation: flicker 3s steps(2) infinite;
    }
    @keyframes flicker { 0%, 100% { opacity: 0.9; } 40% { opacity: 0.65; } 70% { opacity: 1; } }
    .curtain {
      position: absolute; top: -4%; bottom: 10%; width: 7%; z-index: 2; pointer-events: none;
      background: repeating-linear-gradient(90deg, #3a0d12 0 12px, #5c1520 12px 22px, #2a080c 22px 30px);
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.7);
    }
    .curtain.l { left: 0; border-radius: 0 0 40% 0; border-right: 3px solid #d8ae62; }
    .curtain.r { right: 0; border-radius: 0 0 0 40%; border-left: 3px solid #d8ae62; }

    .screen {
      position: relative; aspect-ratio: 16 / 9; container-type: inline-size; overflow: hidden; border-radius: 10px;
      background: #090e13; border: 2px solid rgba(216, 174, 98, 0.45);
      box-shadow: 0 0 60px rgba(216, 174, 98, 0.18), 0 30px 80px rgba(0, 0, 0, 0.6);
    }
    .screen.paused ::ng-deep * { animation-play-state: paused !important; }
    .act {
      position: absolute; top: 2.5cqw; left: 2.5cqw; z-index: 3; padding: 0.5cqw 1.2cqw; border-radius: 2cqw;
      background: rgba(9, 14, 19, 0.75); border: 1px solid rgba(216, 174, 98, 0.45); color: #f3d18d;
      font: 600 max(9px, 1.15cqw) 'Noto Sans Telugu', var(--font-head); letter-spacing: 0.08em;
    }
    .subtitle {
      position: absolute; left: 8%; right: 8%; bottom: 2.5cqw; z-index: 3; margin: 0; text-align: center;
      font: 700 max(11px, 1.8cqw)/1.35 var(--font-body); color: #ffe27a;
      text-shadow: 0 2px 0 #000, 0 0 6px #000, 0 0 12px rgba(0, 0, 0, 0.8);
      animation: sub 0.4s ease both;
    }
    @keyframes sub { from { opacity: 0; transform: translateY(1cqw); } }
    .grain {
      position: absolute; inset: -50%; z-index: 4; pointer-events: none; opacity: 0.04;
      background-image: radial-gradient(rgba(255, 255, 255, 0.9) 0.6px, transparent 0.8px), radial-gradient(rgba(255, 255, 255, 0.6) 0.5px, transparent 0.7px);
      background-size: 7px 7px, 13px 11px; animation: grain 0.5s steps(3) infinite;
    }
    @keyframes grain { 33% { transform: translate(-2%, 1%); } 66% { transform: translate(1%, -2%); } }

    /* Velvet drapes that cover the screen; .closed slides them shut */
    .drape {
      position: absolute; top: 0; bottom: 0; width: 51%; z-index: 6; pointer-events: none;
      background:
        linear-gradient(180deg, transparent 88%, #d8ae62 88%, #d8ae62 89.5%, #8a6428 89.5%, #8a6428 91%, transparent 91%),
        repeating-linear-gradient(90deg, #3a0d12 0 2.2cqw, #6a1824 2.2cqw 3.6cqw, #2a080c 3.6cqw 5cqw);
      box-shadow: inset 0 0 4cqw rgba(0, 0, 0, 0.75);
      transition: transform 1.7s cubic-bezier(0.65, 0, 0.3, 1);
    }
    .drape.l { left: 0; transform: translateX(-100%); border-right: 2px solid #d8ae62; }
    .drape.r { right: 0; transform: translateX(100%); border-left: 2px solid #d8ae62; }
    .drape.closed { transform: none; }
    .valance {
      position: absolute; top: 0; left: 0; right: 0; height: 4.5cqw; z-index: 7; pointer-events: none;
      background: repeating-linear-gradient(90deg, #4a0f17 0 3cqw, #6a1824 3cqw 6cqw);
      border-bottom: 0.35cqw solid #d8ae62; border-radius: 0 0 40% 40% / 0 0 1.6cqw 1.6cqw;
      box-shadow: 0 0.8cqw 2cqw rgba(0, 0, 0, 0.6);
    }
    .screen .act { top: 6cqw; }

    .seats { position: relative; z-index: 3; display: flex; justify-content: center; gap: 1.2%; margin-top: -3.5%; }
    .seats i { width: 5.2%; aspect-ratio: 1 / 1.1; border-radius: 50% 50% 20% 20%; background: #05080b; box-shadow: 0 -2px 0 rgba(216, 174, 98, 0.12); }
    .seats i:nth-child(odd) { transform: translateY(12%); }

    .controls { display: flex; align-items: center; gap: 14px; margin-top: 22px; }
    .play {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; border: 0; cursor: pointer;
      background: var(--gradient); color: var(--on-gold); font: 700 0.9rem var(--font-head);
    }
    .segments { flex: 1; display: grid; grid-template-columns: repeat(13, 1fr); gap: 6px; }
    .segments button { display: grid; gap: 6px; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; }
    .bar { height: 4px; border-radius: 2px; background: rgba(216, 174, 98, 0.2); overflow: hidden; }
    .fill { display: block; height: 100%; background: var(--gradient); }
    .segments small { font: 600 0.68rem/1.2 var(--font-head); color: var(--muted); }
    .segments button.on small { color: var(--champagne); }
    @media (max-width: 900px) {
      .segments small { display: none; }
      .curtain { width: 5%; }
    }
  `,
})
export class ServicesMovie {
  protected readonly scenes = SCENES;
  protected readonly seats = Array.from({ length: 14 }, (_, i) => i);

  protected readonly index = signal(0);
  protected readonly progress = signal(0);
  protected readonly playing = signal(true);
  private readonly visible = signal(false);

  protected readonly scene = computed(() => SCENES[this.index()]);
  protected readonly running = computed(() => this.playing() && this.visible());
  /** Closed before the show starts and during the last moments of the finale. */
  protected readonly curtainClosed = computed(() => {
    const key = this.scene().key;
    const p = this.progress();
    return (key === 'curtain' && p < 0.08) || (key === 'end' && p > 0.76);
  });

  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');
  private elapsed = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // Only play while the cinema is on screen.
      const observer = new IntersectionObserver(([e]) => this.visible.set(e.isIntersecting), { threshold: 0.35 });
      observer.observe(this.screen().nativeElement);

      let last = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const dt = now - last;
        last = now;
        if (this.running()) {
          this.elapsed += dt;
          const p = this.elapsed / this.scene().ms;
          if (p >= 1) this.go((this.index() + 1) % SCENES.length);
          else this.progress.set(p);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(raf);
      });
    });
  }

  protected go(i: number): void {
    this.elapsed = 0;
    this.progress.set(0);
    this.index.set(i);
  }
}
