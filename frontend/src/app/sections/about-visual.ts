import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icon } from '../shared/icon';

type Tile =
  | { kind: 'logo'; src: string; alt: string; tall?: boolean; light?: boolean }
  | { kind: 'word'; text: string }
  | { kind: 'social'; icon: string; label: string; bg: string }
  | { kind: 'web' }
  | { kind: 'app' }
  | { kind: 'chart' }
  | { kind: 'palette' }
  | { kind: 'ledger' }
  | { kind: 'quote' };

// About page visual: a 3D-tilted "creative wall" — three columns of work tiles
// scrolling endlessly in opposite directions, tilting gently with the mouse.
@Component({
  selector: 'app-about-visual',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stage" aria-hidden="true" (pointermove)="tilt($event)" (pointerleave)="reset()">
      <div class="wall" [style.--rx.deg]="rx()" [style.--ry.deg]="ry()">
        @for (col of columns; track $index; let c = $index) {
          <div class="col" [class.down]="c === 1" [style.--speed.s]="speeds[c]">
            <div class="strip">
              @for (t of col.concat(col); track $index) {
                @switch (t.kind) {
                  @case ('logo') {
                    <div class="tile logo" [class.tall]="t.tall" [class.light]="t.light"><img [src]="t.src" [alt]="t.alt" /></div>
                  }
                  @case ('word') {
                    <div class="tile word"><span>{{ t.text }}</span></div>
                  }
                  @case ('social') {
                    <div class="tile social" [style.background]="t.bg">
                      <app-icon [name]="t.icon" [size]="34" />
                      <small>{{ t.label }}</small>
                    </div>
                  }
                  @case ('web') {
                    <div class="tile web">
                      <div class="bar"><i></i><i></i><i></i></div>
                      <div class="hero-block"></div>
                      <div class="row"><span></span><span></span><span></span></div>
                      <small>Website</small>
                    </div>
                  }
                  @case ('app') {
                    <div class="tile app">
                      <div class="phone"><span class="notch"></span><span class="ui"></span><span class="ui short"></span><span class="btn"></span></div>
                      <small>Mobile App</small>
                    </div>
                  }
                  @case ('chart') {
                    <div class="tile chart">
                      <div class="bars"><span></span><span></span><span></span><span></span><span></span></div>
                      <small>Insights ▲</small>
                    </div>
                  }
                  @case ('palette') {
                    <div class="tile palette">
                      <span style="background:#090e13"></span><span style="background:#101b22"></span>
                      <span style="background:#d8ae62"></span><span style="background:#f3d18d"></span>
                      <small>Brand Kit</small>
                    </div>
                  }
                  @case ('ledger') {
                    <div class="tile ledger">
                      <app-icon name="ledger" [size]="26" />
                      <div class="lines"><span></span><span></span><span></span></div>
                      <small>Digital Ledger</small>
                    </div>
                  }
                  @case ('quote') {
                    <div class="tile quote"><span>“Your Brand.<br /><b>Our Creativity.</b>”</span></div>
                  }
                }
              }
            </div>
          </div>
        }
      </div>
      <span class="shine"></span>
    </div>
  `,
  styles: `
    :host { display: block; }
    .stage {
      position: relative; height: 580px; perspective: 1400px; overflow: hidden; border-radius: 28px;
      mask-image: linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent);
      -webkit-mask-image: linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent);
    }
    .wall {
      --rx: 0deg; --ry: 0deg;
      position: absolute; inset: -12% -6%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      transform: rotateX(calc(22deg + var(--rx))) rotateY(calc(-14deg + var(--ry))) rotateZ(8deg);
      transform-style: preserve-3d; transition: transform 0.4s ease-out;
    }
    .col { overflow: visible; }
    .strip { display: flex; flex-direction: column; gap: 16px; animation: up var(--speed, 30s) linear infinite; }
    .col.down .strip { animation-name: down; }
    .stage:hover .strip { animation-play-state: paused; }
    @keyframes up { from { transform: translateY(0); } to { transform: translateY(calc(-50% - 8px)); } }
    @keyframes down { from { transform: translateY(calc(-50% - 8px)); } to { transform: translateY(0); } }

    .tile {
      position: relative; border-radius: 18px; padding: 14px; min-height: 120px; overflow: hidden;
      background: var(--charcoal); border: 1px solid rgba(216, 174, 98, 0.25);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45); transition: transform 0.3s, border-color 0.3s;
    }
    .tile:hover { transform: translateZ(30px) scale(1.04); border-color: var(--gold); }
    .tile small {
      position: absolute; left: 14px; bottom: 10px; font: 600 0.68rem var(--font-head); letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--champagne);
    }

    .logo { display: grid; place-items: center; min-height: 110px; background: var(--obsidian); }
    .logo.tall { min-height: 170px; }
    .logo.light { background: #fff; }
    .logo img { width: 100%; height: 100%; max-height: 120px; object-fit: contain; }

    .word { display: grid; place-items: center; min-height: 130px; background: var(--gradient); }
    .word span { font: 800 clamp(1.3rem, 2.4vw, 1.9rem) var(--font-head); color: var(--obsidian); letter-spacing: -0.01em; }

    .social { display: grid; place-items: center; min-height: 130px; color: #fff; border: 0; }
    .social small { color: rgba(255, 255, 255, 0.9); }

    .web { min-height: 150px; }
    .bar { display: flex; gap: 4px; margin-bottom: 8px; }
    .bar i { width: 7px; height: 7px; border-radius: 50%; background: #e5484d; }
    .bar i:nth-child(2) { background: #f5a524; }
    .bar i:nth-child(3) { background: #2fbf71; }
    .hero-block { height: 50px; border-radius: 8px; background: var(--gradient); }
    .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px; }
    .row span { height: 26px; border-radius: 6px; background: #22303a; }

    .app { display: grid; place-items: center; min-height: 190px; background: radial-gradient(circle at 50% 30%, #1c2c38, var(--charcoal)); }
    .phone {
      position: relative; width: 70px; height: 130px; border-radius: 14px; border: 3px solid #2a3a46; background: var(--obsidian);
      display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 8px 8px; margin-bottom: 14px;
    }
    .notch { position: absolute; top: 4px; width: 22px; height: 4px; border-radius: 2px; background: #2a3a46; }
    .ui { width: 100%; height: 24px; border-radius: 5px; background: var(--gradient); }
    .ui.short { height: 10px; width: 70%; background: #2a3a46; }
    .phone .btn { margin-top: auto; width: 80%; height: 12px; border-radius: 6px; background: #2fbf71; }

    .chart { min-height: 140px; }
    .bars { display: flex; align-items: flex-end; gap: 6px; height: 84px; }
    .bars span { flex: 1; border-radius: 4px 4px 0 0; background: var(--gradient); }
    .bars span:nth-child(1) { height: 30%; }
    .bars span:nth-child(2) { height: 48%; }
    .bars span:nth-child(3) { height: 42%; }
    .bars span:nth-child(4) { height: 70%; }
    .bars span:nth-child(5) { height: 96%; }

    .palette { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; align-content: start; min-height: 110px; }
    .palette span { aspect-ratio: 1; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.12); }

    .ledger { min-height: 130px; color: var(--gold); }
    .ledger .lines { display: grid; gap: 6px; margin-top: 10px; }
    .ledger .lines span { height: 7px; border-radius: 4px; background: #22303a; }
    .ledger .lines span:nth-child(2) { width: 75%; }
    .ledger .lines span:nth-child(3) { width: 55%; background: rgba(47, 191, 113, 0.5); }

    .quote { display: grid; place-items: center; min-height: 150px; text-align: center; background: linear-gradient(160deg, var(--midnight), var(--obsidian)); }
    .quote span { font: 600 1.05rem/1.35 var(--font-head); color: #eef1f3; }
    .quote b { color: var(--gold); }

    /* Light sweep across the wall */
    .shine {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(105deg, transparent 35%, rgba(243, 209, 141, 0.12) 50%, transparent 65%);
      background-size: 250% 100%; animation: sweep 7s ease-in-out infinite;
    }
    @keyframes sweep { 0% { background-position: 150% 0; } 60%, 100% { background-position: -100% 0; } }

    @media (max-width: 640px) {
      .stage { height: 460px; }
      .wall { gap: 10px; }
      .strip { gap: 10px; }
      .tile { padding: 10px; border-radius: 14px; }
    }
  `,
})
export class AboutVisual {
  protected readonly speeds = [34, 42, 30];

  protected readonly columns: Tile[][] = [
    [
      { kind: 'logo', src: 'images/logo-full.png', alt: "Hari's Digital Den", tall: true },
      { kind: 'social', icon: 'instagram', label: 'Reels', bg: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' },
      { kind: 'palette' },
      { kind: 'word', text: 'Brand' },
      { kind: 'logo', src: 'images/brands/vsn-interiors.webp', alt: 'VSN Interiors' },
      { kind: 'ledger' },
    ],
    [
      { kind: 'web' },
      { kind: 'logo', src: 'images/brands/mirai.png', alt: 'Mirai', light: true },
      { kind: 'word', text: 'Content' },
      { kind: 'social', icon: 'facebook', label: 'Facebook', bg: '#1877f2' },
      { kind: 'chart' },
      { kind: 'logo', src: 'images/brands/inchx-interio.png', alt: 'InchX Interio' },
    ],
    [
      { kind: 'app' },
      { kind: 'word', text: 'Growth' },
      { kind: 'social', icon: 'linkedin', label: 'LinkedIn', bg: '#0a66c2' },
      { kind: 'quote' },
      { kind: 'social', icon: 'youtube', label: 'YouTube', bg: '#ff0000' },
      { kind: 'logo', src: 'images/logo-full.png', alt: "Hari's Digital Den" },
    ],
  ];

  protected readonly rx = signal(0);
  protected readonly ry = signal(0);

  protected tilt(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    this.ry.set(x * 12);
    this.rx.set(-y * 10);
  }

  protected reset(): void {
    this.rx.set(0);
    this.ry.set(0);
  }
}
