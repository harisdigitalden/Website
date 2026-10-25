import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../shared/icon';

interface Orbiter {
  icon: string;
  label: string;
  angle: number;
  color?: string;
}

// Illustration for the services section: the logo at the centre with every
// service and platform orbiting around it on two slowly turning rings.
@Component({
  selector: 'app-services-orbit',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orbit" aria-hidden="true">
      <span class="glow"></span>
      <span class="track t1"></span>
      <span class="track t2"></span>
      <span class="track t3"></span>

      <div class="ring inner">
        @for (o of inner; track o.icon) {
          <span class="holder" [style.--a.deg]="o.angle">
            <span class="badge" [style.background]="o.color ?? null" [title]="o.label">
              <app-icon [name]="o.icon" [size]="22" />
            </span>
          </span>
        }
      </div>

      <div class="ring outer">
        @for (o of outer; track o.icon) {
          <span class="holder" [style.--a.deg]="o.angle">
            <span class="badge big">
              <app-icon [name]="o.icon" [size]="24" />
              <small>{{ o.label }}</small>
            </span>
          </span>
        }
      </div>

      <div class="core">
        <img src="images/logo-full.png" alt="" />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .orbit {
      --size: min(620px, 92vw);
      position: relative; width: var(--size); height: var(--size); margin: 0 auto 56px;
    }
    .glow {
      position: absolute; inset: 22%; border-radius: 50%;
      background: radial-gradient(circle, rgba(216, 174, 98, 0.35), transparent 70%); filter: blur(30px);
      animation: breathe 4s ease-in-out infinite;
    }
    @keyframes breathe { 0%, 100% { opacity: 0.6; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } }
    .track { position: absolute; border-radius: 50%; border: 1px dashed rgba(216, 174, 98, 0.35); }
    .t1 { inset: 26%; }
    .t2 { inset: 8%; border-style: solid; border-color: rgba(216, 174, 98, 0.15); }
    .t3 { inset: 0; border-color: rgba(216, 174, 98, 0.08); }

    .ring { position: absolute; inset: 0; animation: spin 60s linear infinite; }
    .ring.inner { --r: calc(var(--size) * 0.24); animation-duration: 40s; animation-direction: reverse; }
    .ring.outer { --r: calc(var(--size) * 0.42); }
    .holder {
      position: absolute; top: 50%; left: 50%; width: 0; height: 0;
      transform: rotate(var(--a)) translateX(var(--r)) rotate(calc(-1 * var(--a)));
    }
    .badge {
      position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center;
      width: 48px; height: 48px; border-radius: 50%; color: #fff; background: var(--charcoal);
      border: 1px solid rgba(216, 174, 98, 0.45); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
      /* Counter-spin at the ring's speed so icons stay upright. */
      animation: counter 40s linear infinite;
    }
    .badge.big {
      width: 92px; height: 92px; gap: 4px; align-content: center; color: var(--champagne);
      background: radial-gradient(circle at 30% 25%, #1c2c38, var(--charcoal));
      animation-duration: 60s; animation-direction: reverse;
    }
    .badge.big small { font: 600 0.62rem/1.15 var(--font-head); color: #eef1f3; text-align: center; max-width: 80px; }
    .inner .badge { animation-direction: normal; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes counter { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

    .core {
      position: absolute; inset: 31%; border-radius: 50%; display: grid; place-items: center; padding: 8%;
      background: radial-gradient(circle at 35% 30%, #16242e, var(--obsidian) 75%);
      border: 2px solid rgba(216, 174, 98, 0.55); box-shadow: 0 0 60px rgba(216, 174, 98, 0.25), inset 0 0 40px rgba(0, 0, 0, 0.6);
    }
    .core img { width: 100%; height: auto; }

    @media (max-width: 640px) {
      .badge { width: 38px; height: 38px; }
      .badge.big { width: 64px; height: 64px; }
      .badge.big small { display: none; }
    }
  `,
})
export class ServicesOrbit {
  protected readonly inner: Orbiter[] = [
    { icon: 'instagram', label: 'Instagram', angle: 0, color: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' },
    { icon: 'facebook', label: 'Facebook', angle: 51, color: '#1877f2' },
    { icon: 'youtube', label: 'YouTube', angle: 103, color: '#ff0000' },
    { icon: 'linkedin', label: 'LinkedIn', angle: 154, color: '#0a66c2' },
    { icon: 'pinterest', label: 'Pinterest', angle: 206, color: '#e60023' },
    { icon: 'x', label: 'X', angle: 257, color: '#000' },
    { icon: 'threads', label: 'Threads', angle: 309, color: '#000' },
  ];

  protected readonly outer: Orbiter[] = [
    { icon: 'web', label: 'Websites', angle: 0 },
    { icon: 'mobile', label: 'Mobile Apps', angle: 45 },
    { icon: 'social', label: 'Social Media', angle: 90 },
    { icon: 'branding', label: 'Branding', angle: 135 },
    { icon: 'mail', label: 'Email & Domain', angle: 180 },
    { icon: 'ledger', label: 'Digital Ledger', angle: 225 },
    { icon: 'chart', label: 'Growth', angle: 270 },
    { icon: 'eye', label: 'Reels & Content', angle: 315 },
  ];
}
