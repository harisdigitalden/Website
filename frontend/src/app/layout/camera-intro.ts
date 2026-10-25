import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';

const INTRO_MS = 2900;

// Page-opening camera animation (inspired by the camera in the logo): the
// camera flies in, focuses, clicks with a flash, prints a photo of the logo,
// then the page opens by zooming through the lens. Used on the Pricing page.
@Component({
  selector: 'app-camera-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" role="presentation">
        <button class="skip" type="button" (click)="end()">Skip ›</button>

        <div class="cam-wrap">
          <svg class="camera" viewBox="0 0 240 190" aria-hidden="true">
            <defs>
              <linearGradient id="cam-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f3d18d" />
                <stop offset="0.5" stop-color="#d8ae62" />
                <stop offset="1" stop-color="#bd8b3e" />
              </linearGradient>
              <radialGradient id="cam-glass" cx="0.38" cy="0.35" r="0.7">
                <stop offset="0" stop-color="#2b4352" />
                <stop offset="0.6" stop-color="#101b22" />
                <stop offset="1" stop-color="#090e13" />
              </radialGradient>
            </defs>
            <path class="arc" d="M70 30 A100 100 0 0 1 222 128" fill="none" stroke="url(#cam-gold)" stroke-width="7" stroke-linecap="round" />
            <rect class="button" x="44" y="40" width="28" height="10" rx="4" fill="url(#cam-gold)" />
            <path d="M88 56 L102 34 H148 L162 56" fill="none" stroke="url(#cam-gold)" stroke-width="6" stroke-linejoin="round" />
            <rect x="26" y="56" width="188" height="112" rx="20" fill="#0d151b" stroke="url(#cam-gold)" stroke-width="6" />
            <circle class="led" cx="190" cy="78" r="6" fill="url(#cam-gold)" />
            <circle cx="120" cy="114" r="44" fill="url(#cam-glass)" stroke="url(#cam-gold)" stroke-width="6" />
            <circle class="focus" cx="120" cy="114" r="33" fill="none" stroke="url(#cam-gold)" stroke-width="3" stroke-dasharray="10 6" />
            <circle cx="120" cy="114" r="22" fill="none" stroke="url(#cam-gold)" stroke-width="2.5" />
            <circle class="shutter" cx="120" cy="114" r="31" fill="#090e13" />
            <circle cx="106" cy="100" r="6" fill="#ffffff" opacity="0.35" />
          </svg>

          <div class="photo">
            <img src="images/logo-full.png" alt="" />
            <span>{{ caption() }}</span>
          </div>
        </div>

        <p class="tag">Brand <i></i> Content <i></i> Growth</p>
        <div class="flash"></div>
      </div>
    }
  `,
  styles: `
    .intro {
      position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; align-content: center; gap: 28px;
      background: radial-gradient(circle at 50% 45%, #13202a, #090e13 65%);
      animation: intro-out 0.6s ease-in 2.3s forwards;
    }
    @keyframes intro-out { to { opacity: 0; visibility: hidden; } }

    .skip {
      position: absolute; top: 20px; right: 20px; padding: 8px 16px; border-radius: 999px; cursor: pointer;
      background: transparent; border: 1px solid rgba(216, 174, 98, 0.4); color: #f3d18d; font: 600 0.8rem 'Poppins', sans-serif;
    }

    .cam-wrap { position: relative; width: min(320px, 70vw); }
    .camera {
      position: relative; z-index: 2; width: 100%; overflow: visible;
      filter: drop-shadow(0 0 24px rgba(216, 174, 98, 0.45));
      transform-origin: 50% 60%;
      animation:
        cam-in 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2) both,
        cam-zoom 0.7s cubic-bezier(0.7, 0, 0.9, 0.4) 2.2s forwards;
    }
    @keyframes cam-in {
      from { transform: translateY(120px) scale(0.5) rotate(-14deg); opacity: 0; }
      to { transform: none; opacity: 1; }
    }
    /* Zoom into the lens so the page appears through it */
    @keyframes cam-zoom { to { transform: scale(14); opacity: 0; } }

    .arc { stroke-dasharray: 260; stroke-dashoffset: 260; animation: draw 0.7s ease-out 0.35s forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    .focus { transform-origin: 120px 114px; animation: focus 0.4s ease-in-out 0.6s 2 alternate; }
    @keyframes focus { to { transform: rotate(60deg) scale(1.08); } }
    .button { transform-box: fill-box; transform-origin: center; animation: press 0.22s ease-in-out 1.05s 1; }
    @keyframes press { 50% { transform: translateY(4px) scaleY(0.6); } }
    .led { animation: led 0.25s ease 1.1s 2 alternate; }
    @keyframes led { to { fill: #ffffff; } }
    .shutter { transform-origin: 120px 114px; transform: scale(0); animation: blink 0.3s ease-in-out 1.12s 1; }
    @keyframes blink { 50% { transform: scale(1); } }

    .flash {
      position: absolute; inset: 0; z-index: 5; pointer-events: none; background: #fffbf4; opacity: 0;
      animation: flash 0.6s ease-out 1.2s 1;
    }
    @keyframes flash { 0% { opacity: 0; } 12% { opacity: 0.95; } 100% { opacity: 0; } }

    /* Polaroid sliding out of the camera */
    .photo {
      position: absolute; z-index: 1; left: 50%; top: 58%; width: 72%; padding: 8px 8px 10px; border-radius: 6px;
      background: #fffbf4; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5); text-align: center;
      transform: translate(-50%, 0); opacity: 0;
      animation: print 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) 1.4s forwards;
    }
    .photo img { width: 100%; border-radius: 3px; background: #090e13; padding: 10px; }
    .photo span { display: block; margin-top: 6px; font: 700 0.75rem 'Poppins', sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: #141c21; }
    @keyframes print {
      0% { opacity: 1; transform: translate(-50%, -30%) rotate(0deg); }
      100% { opacity: 1; transform: translate(-50%, 62%) rotate(-4deg); }
    }

    .tag {
      margin: min(130px, 30vw) 0 0; display: flex; align-items: center; gap: 12px; color: #f3d18d; opacity: 0;
      font: 600 0.78rem 'Poppins', sans-serif; letter-spacing: 0.35em; text-transform: uppercase;
      animation: tag 0.5s ease 0.7s forwards;
    }
    .tag i { width: 22px; height: 1px; background: #d8ae62; }
    @keyframes tag { to { opacity: 1; } }

    @media (prefers-reduced-motion: reduce) {
      .intro { display: none; }
    }
  `,
})
export class CameraIntro {
  /** Text printed under the logo on the Polaroid. */
  readonly caption = input('');

  protected readonly visible = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.visible.set(true);
      document.body.style.overflow = 'hidden';
      this.timer = setTimeout(() => this.end(), INTRO_MS);
    });
    destroyRef.onDestroy(() => this.end());
  }

  protected end(): void {
    clearTimeout(this.timer);
    this.visible.set(false);
    document.body.style.overflow = '';
  }
}
