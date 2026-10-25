import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../shared/icon';

// Animated "studio" scene for the About page: the logo inside spinning
// camera-lens rings, surrounded by floating cards for the work we do.
@Component({
  selector: 'app-about-visual',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scene" aria-hidden="true">
      <div class="lens">
        <span class="ring r1"></span>
        <span class="ring r2"></span>
        <span class="ring r3"><i></i><i></i><i></i></span>
        <span class="flash"></span>
        <div class="core"><img src="images/logo-full.png" alt="" /></div>
      </div>

      <!-- Website -->
      <div class="card web">
        <div class="bar"><i></i><i></i><i></i><span>yourbrand.in</span></div>
        <div class="banner"></div>
        <div class="lines"><span></span><span></span><span class="short"></span></div>
        <small><app-icon name="web" [size]="12" /> Website</small>
      </div>

      <!-- Reel -->
      <div class="card reel">
        <div class="screen">
          <span class="play"><app-icon name="arrow" [size]="16" /></span>
          <span class="heart"><app-icon name="heart" [size]="14" [filled]="true" /></span>
          <div class="progress"><span></span></div>
        </div>
        <small><app-icon name="instagram" [size]="12" /> Reels</small>
      </div>

      <!-- Brand kit -->
      <div class="card kit">
        <div class="swatches">
          @for (c of palette; track c) {
            <span [style.background]="c"></span>
          }
        </div>
        <div class="type"><b>Aa</b><span>Poppins · Inter</span></div>
        <small><app-icon name="branding" [size]="12" /> Brand Kit</small>
      </div>

      <!-- Growth -->
      <div class="card growth">
        <div class="bars">
          @for (h of bars; track $index) {
            <span [style.--h.%]="h" [style.animation-delay.ms]="$index * 120"></span>
          }
        </div>
        <strong>▲ Growth</strong>
        <small><app-icon name="chart" [size]="12" /> Insights</small>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .scene { --size: min(540px, 90vw); position: relative; width: var(--size); height: var(--size); margin: 0 auto; }

    /* Camera lens with the logo */
    .lens { position: absolute; inset: 18%; border-radius: 50%; }
    .ring { position: absolute; border-radius: 50%; }
    .r1 { inset: 0; border: 2px dashed rgba(216, 174, 98, 0.5); animation: spin 26s linear infinite; }
    .r2 { inset: 7%; border: 6px solid transparent; border-top-color: var(--gold); border-right-color: rgba(216, 174, 98, 0.35); animation: spin 6s linear infinite reverse; }
    .r3 { inset: 14%; border: 1px solid rgba(216, 174, 98, 0.3); animation: spin 14s linear infinite; }
    .r3 i { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--champagne); box-shadow: 0 0 14px var(--gold); top: -5px; left: calc(50% - 5px); }
    .r3 i:nth-child(2) { top: auto; bottom: -5px; }
    .r3 i:nth-child(3) { top: calc(50% - 5px); left: -5px; }
    .flash {
      position: absolute; inset: 22%; border-radius: 50%; background: radial-gradient(circle, rgba(243, 209, 141, 0.55), transparent 70%);
      animation: flash 5s ease-in-out infinite;
    }
    @keyframes flash { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.9); } 86% { opacity: 1; transform: scale(1.15); } }
    .core {
      position: absolute; inset: 21%; border-radius: 50%; display: grid; place-items: center; padding: 9%;
      background: radial-gradient(circle at 35% 30%, #16242e, var(--obsidian) 75%);
      border: 2px solid rgba(216, 174, 98, 0.6); box-shadow: 0 0 50px rgba(216, 174, 98, 0.3);
    }
    .core img { width: 100%; height: auto; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Floating work cards */
    .card {
      position: absolute; padding: 12px; border-radius: 16px; background: var(--charcoal);
      border: 1px solid rgba(216, 174, 98, 0.35); box-shadow: 0 20px 44px rgba(0, 0, 0, 0.5);
      animation: float 6s ease-in-out infinite;
    }
    .card small { display: flex; align-items: center; gap: 5px; margin-top: 8px; font: 600 0.7rem var(--font-head); color: var(--champagne); letter-spacing: 0.04em; }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(var(--tilt, 0deg)); }
      50% { transform: translateY(-14px) rotate(var(--tilt, 0deg)); }
    }

    .web { --tilt: -5deg; top: 2%; left: 0; width: 38%; }
    .bar { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
    .bar i { width: 7px; height: 7px; border-radius: 50%; background: #e5484d; }
    .bar i:nth-child(2) { background: #f5a524; }
    .bar i:nth-child(3) { background: #2fbf71; }
    .bar span { margin-left: 6px; font-size: 0.6rem; color: var(--muted); }
    .banner { height: 46px; border-radius: 8px; background: var(--gradient); }
    .lines { display: grid; gap: 5px; margin-top: 8px; }
    .lines span {
      height: 6px; border-radius: 3px;
      background: linear-gradient(90deg, #22303a 0%, #3a4a56 50%, #22303a 100%); background-size: 200% 100%;
      animation: shimmer 1.8s linear infinite;
    }
    .lines .short { width: 60%; }
    @keyframes shimmer { to { background-position: -200% 0; } }

    .reel { --tilt: 6deg; top: 0; right: 2%; width: 26%; animation-delay: 1s; }
    .screen {
      position: relative; aspect-ratio: 9 / 14; border-radius: 10px; overflow: hidden;
      background: radial-gradient(circle at 30% 25%, #2a3a46, var(--obsidian) 70%);
    }
    .play {
      position: absolute; inset: 0; margin: auto; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
      background: rgba(255, 255, 255, 0.9); color: var(--obsidian); animation: beat 1.6s ease-in-out infinite;
    }
    @keyframes beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    .heart { position: absolute; right: 8px; bottom: 16px; color: var(--pink); animation: rise 2.4s ease-in infinite; }
    @keyframes rise { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-60px); opacity: 0; } }
    .progress { position: absolute; left: 8px; right: 8px; bottom: 6px; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, 0.25); }
    .progress span { display: block; height: 100%; border-radius: 2px; background: var(--gold); animation: play 4s linear infinite; }
    @keyframes play { from { width: 0; } to { width: 100%; } }

    .kit { --tilt: 4deg; bottom: 4%; left: 2%; width: 34%; animation-delay: 2s; }
    .swatches { display: flex; gap: 5px; }
    .swatches span {
      flex: 1; aspect-ratio: 1; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.15);
      animation: pop 3s ease-in-out infinite;
    }
    .swatches span:nth-child(2) { animation-delay: 0.15s; }
    .swatches span:nth-child(3) { animation-delay: 0.3s; }
    .swatches span:nth-child(4) { animation-delay: 0.45s; }
    .swatches span:nth-child(5) { animation-delay: 0.6s; }
    @keyframes pop { 0%, 70%, 100% { transform: none; } 80% { transform: translateY(-5px) scale(1.1); } }
    .type { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .type b { font: 800 1.3rem var(--font-head); color: #fff; }
    .type span { font-size: 0.62rem; color: var(--muted); }

    .growth { --tilt: -4deg; bottom: 2%; right: 0; width: 34%; animation-delay: 3s; }
    .bars { display: flex; align-items: flex-end; gap: 5px; height: 60px; }
    .bars span {
      flex: 1; height: var(--h); border-radius: 4px 4px 0 0; background: var(--gradient); transform-origin: bottom;
      animation: grow 3s ease-in-out infinite;
    }
    @keyframes grow { 0% { transform: scaleY(0.15); } 40%, 85% { transform: scaleY(1); } 100% { transform: scaleY(0.15); } }
    .growth strong { display: block; margin-top: 6px; font: 700 0.85rem var(--font-head); color: #2fbf71; }

    @media (max-width: 640px) {
      .card { padding: 8px; }
      .card small { font-size: 0.6rem; }
      .banner { height: 30px; }
      .bars { height: 40px; }
    }
  `,
})
export class AboutVisual {
  protected readonly palette = ['#090e13', '#101b22', '#d8ae62', '#f3d18d', '#fffbf4'];
  protected readonly bars = [30, 45, 40, 62, 70, 88, 100];
}
