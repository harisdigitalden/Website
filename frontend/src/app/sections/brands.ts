import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../core/api.service';
import { Brand } from '../core/models';

// Endless scrolling strip of client logos. Clients are listed in
// backend/content.go; the strip repeats them so it looks full even with few.
@Component({
  selector: 'app-brands',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (brands().length) {
      <section class="brands">
        <div class="container head">
          <span class="eyebrow">Our clients</span>
          <h2>Brands That <span class="gold">Trust Us</span></h2>
          <p>Businesses we've helped grow — and many more on the way.</p>
        </div>

        <div class="marquee" [style.--duration.s]="duration()">
          <div class="track">
            @for (b of loop(); track $index) {
              <a
                class="logo"
                [href]="b.url"
                target="_blank"
                rel="noopener"
                [title]="b.name"
                [attr.aria-hidden]="$index >= brands().length ? 'true' : null"
                [attr.tabindex]="$index >= brands().length ? -1 : null"
              >
                <img [src]="b.logo" [alt]="b.name" loading="lazy" />
              </a>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .brands { padding: 80px 0; background: var(--midnight); overflow: hidden; border-block: 1px solid var(--border); }
    .head { text-align: center; margin-bottom: 40px; }
    .eyebrow { color: var(--accent); background: rgba(216, 174, 98, 0.12); }
    h2 { color: #fff; font-size: clamp(1.75rem, 3.5vw, 2.5rem); }
    .gold { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    p { color: #aeb6bd; margin: 0; }

    .marquee {
      position: relative;
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }
    .track { display: flex; gap: 28px; width: max-content; animation: scroll var(--duration, 30s) linear infinite; }
    .marquee:hover .track { animation-play-state: paused; }
    @keyframes scroll { to { transform: translateX(calc(-50% - 14px)); } }

    .logo {
      flex: 0 0 auto; width: 240px; height: 130px; padding: 14px 22px; border-radius: 18px;
      display: flex; align-items: center; justify-content: center; overflow: hidden; background: #141c21; border: 1px solid rgba(216, 174, 98, 0.25);
      transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    }
    .logo:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 14px 34px rgba(216, 174, 98, 0.25); }
    .logo img { width: 100%; height: 100%; min-height: 0; object-fit: contain; }
    @media (max-width: 640px) { .logo { width: 180px; height: 96px; padding: 14px 18px; } }
  `,
})
export class Brands {
  private readonly api = inject(ApiService);
  protected readonly brands = toSignal(this.api.brands$, { initialValue: [] as Brand[] });

  // Repeat the list until one half fills a wide screen, then double it so the
  // -50% translate loops seamlessly.
  protected readonly loop = computed(() => {
    const list = this.brands();
    if (!list.length) return [];
    let half: Brand[] = [...list];
    while (half.length < 8) half = half.concat(list);
    return half.concat(half);
  });

  protected readonly duration = computed(() => Math.max(20, this.loop().length * 3));
}
