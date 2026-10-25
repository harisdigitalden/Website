import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../core/api.service';
import { InstagramPost, Showcase } from '../core/models';
import { Icon } from '../shared/icon';

interface Floater {
  icon: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const POST_CODE = /^[A-Za-z0-9_-]+$/;

// Client Instagram work, shown with Instagram's official embeds inside phone
// frames, over a background of floating social icons.
@Component({
  selector: 'app-instagram-showcase',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (s of showcases(); track s.handle) {
      <section class="showcase">
        <div class="floaters" aria-hidden="true">
          @for (f of floaters; track $index) {
            <span
              class="floater"
              [style.left.%]="f.left"
              [style.animation-delay.s]="f.delay"
              [style.animation-duration.s]="f.duration"
            >
              <app-icon [name]="f.icon" [size]="f.size" [filled]="f.icon === 'heart'" />
            </span>
          }
        </div>

        <div class="container inner">
          <div class="head">
            <span class="eyebrow"><app-icon name="instagram" [size]="14" /> Client work on Instagram</span>
            <h2>Content We Create, <span class="gold">Live on Instagram</span></h2>
            <p>Reels, posts and stories we design and publish for our clients — tap play to watch.</p>
          </div>

          <a class="profile" [href]="s.profile" target="_blank" rel="noopener">
            <span class="ring"><img [src]="s.logo" [alt]="s.brand" /></span>
            <span class="who">
              <strong>{{ s.brand }}</strong>
              <small>&#64;{{ s.handle }}</small>
              <span class="bio">{{ s.bio }}</span>
            </span>
            <span class="btn btn--insta"><app-icon name="instagram" [size]="18" /> Follow</span>
          </a>

          <div class="phones">
            @for (p of s.posts; track p.code; let i = $index) {
              <div class="phone" [style.animation-delay.s]="i * 0.6" [class.tilt-left]="i % 2 === 0">
                <span class="notch"></span>
                <iframe
                  [src]="embedUrl(p)"
                  [title]="s.brand + ' Instagram ' + (p.type === 'reel' ? 'Reel' : 'post')"
                  loading="lazy"
                  scrolling="no"
                  allowtransparency="true"
                  allow="autoplay; encrypted-media; picture-in-picture"
                ></iframe>
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .showcase { position: relative; overflow: hidden; padding: 90px 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, #132530 0%, var(--navy-deep) 100%); }
    .inner { position: relative; z-index: 1; }
    .head { text-align: center; max-width: 720px; margin: 0 auto 36px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); background: rgba(216, 174, 98, 0.12); }
    h2 { color: #fff; font-size: clamp(1.75rem, 3.5vw, 2.6rem); }
    .gold { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .head p { color: #aeb6bd; margin: 0; }

    /* Floating social icons drifting upwards */
    .floaters { position: absolute; inset: 0; pointer-events: none; }
    .floater {
      position: absolute; bottom: -60px; color: var(--accent); opacity: 0;
      animation: rise linear infinite;
    }
    .floater:nth-child(3n) { color: #ee2a7b; }
    .floater:nth-child(4n) { color: #fff; }
    @keyframes rise {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.35; }
      85% { opacity: 0.25; }
      100% { transform: translateY(-900px) rotate(25deg); opacity: 0; }
    }

    /* Client profile card with an animated Instagram story ring */
    .profile {
      display: flex; flex-wrap: wrap; align-items: center; gap: 18px; max-width: 640px; margin: 0 auto 48px;
      padding: 18px 22px; border-radius: 20px; background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(216, 174, 98, 0.25); color: #fff; transition: border-color 0.25s;
    }
    .profile:hover { border-color: var(--accent); }
    .ring {
      position: relative; width: 84px; height: 84px; border-radius: 50%; padding: 4px; flex-shrink: 0;
      background: conic-gradient(#f9ce34, #ee2a7b, #6228d7, #f9ce34); animation: spin 4s linear infinite;
    }
    .ring img {
      width: 100%; height: 100%; border-radius: 50%; object-fit: contain; padding: 10px;
      background: #0b0a08; border: 3px solid #0b0a08; animation: spin 4s linear infinite reverse;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .who { flex: 1; min-width: 200px; display: flex; flex-direction: column; line-height: 1.35; }
    .who strong { font: 700 1.1rem var(--font-head); }
    .who small { color: var(--accent); font-weight: 600; }
    .bio { color: #aeb6bd; font-size: 0.9rem; margin-top: 4px; }
    .btn--insta { background: linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7); color: #fff; padding: 11px 20px; }

    /* Phone frames holding the Instagram embeds */
    .phones {
      display: flex; gap: 24px; justify-content: safe center; padding: 10px 4px 30px;
      overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    }
    .phones::-webkit-scrollbar { display: none; }
    .phone {
      position: relative; flex: 0 0 auto; width: 254px; height: 520px; border-radius: 38px; padding: 12px;
      background: #141c21; border: 2px solid rgba(216, 174, 98, 0.45); scroll-snap-align: center;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55), 0 0 40px rgba(216, 174, 98, 0.12);
      animation: bob 6s ease-in-out infinite;
    }
    .phone.tilt-left { --tilt: -2deg; }
    .phone:not(.tilt-left) { --tilt: 2deg; }
    @keyframes bob {
      0%, 100% { transform: translateY(0) rotate(var(--tilt)); }
      50% { transform: translateY(-14px) rotate(var(--tilt)); }
    }
    .phone:hover { animation-play-state: paused; }
    .notch {
      position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 90px; height: 18px;
      background: #141c21; border-radius: 0 0 12px 12px; z-index: 2;
    }
    iframe { width: 100%; height: 100%; border: 0; border-radius: 28px; background: #fff; }
    @media (max-width: 640px) { .phone { width: 250px; height: 500px; } }
  `,
})
export class InstagramShowcase {
  private readonly api = inject(ApiService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly showcases = toSignal(this.api.showcase$, { initialValue: [] as Showcase[] });

  protected readonly floaters: Floater[] = Array.from({ length: 14 }, (_, i) => ({
    icon: ['instagram', 'heart', 'facebook', 'youtube', 'social', 'threads', 'x'][i % 7],
    left: (i * 7.3 + 3) % 100,
    size: 18 + ((i * 5) % 18),
    delay: (i * 1.7) % 12,
    duration: 12 + ((i * 3) % 10),
  }));

  private readonly urls = computed(() => {
    const cache = new Map<string, SafeResourceUrl>();
    for (const s of this.showcases()) {
      for (const p of s.posts) {
        if ((p.type === 'reel' || p.type === 'p') && POST_CODE.test(p.code)) {
          cache.set(p.code, this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.instagram.com/${p.type}/${p.code}/embed/`));
        }
      }
    }
    return cache;
  });

  protected embedUrl(p: InstagramPost): SafeResourceUrl | null {
    return this.urls().get(p.code) ?? null;
  }
}
