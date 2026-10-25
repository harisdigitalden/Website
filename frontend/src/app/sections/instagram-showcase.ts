import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../core/api.service';
import { Showcase } from '../core/models';
import { Icon } from '../shared/icon';

interface Floater {
  icon: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

interface Story {
  label: string;
  emoji: string;
  image: string;
  link: string;
}

const STORY_MS = 5000;
const POST_CODE = /^[A-Za-z0-9_-]+$/;

// Client work on Instagram, as an auto-playing Instagram "Stories" player.
// Each story is a full-resolution photo from the client's real posts, shown in
// full (blurred copy behind, like Instagram) with a slow zoom. Tapping the
// middle of a story opens the original post. Posts are in backend/content.go.
@Component({
  selector: 'app-instagram-showcase',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (client(); as s) {
      <section class="showcase" #section>
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
            <p>Real projects we showcase for our clients — posted every week.</p>
          </div>

          <div class="layout">
            <div class="profile-col">
              <a class="profile" [href]="s.profile" target="_blank" rel="noopener">
                <span class="ring"><img [src]="s.logo" [alt]="s.brand" /></span>
                <span class="who">
                  <strong>{{ s.brand }}</strong>
                  <small>&#64;{{ s.handle }}</small>
                  <span class="bio">{{ s.bio }}</span>
                </span>
              </a>

              <div class="highlights" role="tablist" aria-label="Story highlights">
                @for (st of stories(); track st.image; let i = $index) {
                  <button type="button" role="tab" [attr.aria-selected]="i === index()" [class.on]="i === index()" (click)="go(i)">
                    <span class="bubble"><img [src]="st.image" alt="" loading="lazy" /><i>{{ st.emoji }}</i></span>
                    <small>{{ st.label }}</small>
                  </button>
                }
              </div>
            </div>

            <div class="phone" (pointerdown)="held.set(true)" (pointerup)="held.set(false)" (pointerleave)="held.set(false)">
              <div class="screen" [class.paused]="!running()">
                <!-- Each photo is mounted the first time it's needed, then kept -->
                @for (st of stories(); track st.image; let i = $index) {
                  @if (visited().has(i)) {
                    <div class="media" [class.active]="i === index()">
                      <img class="backdrop" [src]="st.image" alt="" />
                      <img class="photo" [src]="st.image" [alt]="s.brand + ' — ' + st.label" />
                    </div>
                  }
                }
                <span class="shade" aria-hidden="true"></span>

                <div class="bars">
                  @for (st of stories(); track st.image; let i = $index) {
                    <span class="bar">
                      @if (i < index()) {
                        <span class="fill done"></span>
                      } @else if (i === index()) {
                        @for (k of key(); track k) {
                          <span class="fill run" [style.animation-duration.ms]="storyMs"></span>
                        }
                      }
                    </span>
                  }
                </div>

                <div class="top">
                  <img [src]="s.logo" alt="" />
                  <b>{{ s.handle }}</b>
                  <small>{{ story()?.label }}</small>
                  <span class="dots">•••</span>
                </div>

                @if (story(); as st) {
                  @for (k of key(); track k) {
                    <div class="caption">
                      <strong>{{ st.emoji }} {{ st.label }}</strong>
                      <small>Real project by &#64;{{ s.handle }}</small>
                    </div>
                    <div class="hearts" aria-hidden="true"><span>❤️</span><span>😍</span><span>❤️</span><span>🔥</span></div>
                  }
                  <a class="open" [href]="st.link" target="_blank" rel="noopener" aria-label="Open this post on Instagram"></a>
                }

                <button type="button" class="tap prev" aria-label="Previous story" (click)="go(index() - 1)"></button>
                <button type="button" class="tap next" aria-label="Next story" (click)="go(index() + 1)"></button>

                <div class="reply">
                  <span>Send message</span>
                  <span class="like">❤️</span>
                  <app-icon name="social" [size]="18" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .showcase { position: relative; overflow: hidden; padding: 90px 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, #132530 0%, var(--navy-deep) 100%); }
    .inner { position: relative; z-index: 1; }
    .head { text-align: center; max-width: 720px; margin: 0 auto 44px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 6px; }
    h2 { color: #fff; font-size: clamp(1.75rem, 3.5vw, 2.6rem); }
    .gold { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .head p { color: var(--muted); margin: 0; }

    /* Floating social icons drifting upwards */
    .floaters { position: absolute; inset: 0; pointer-events: none; }
    .floater { position: absolute; bottom: -60px; color: var(--accent); opacity: 0; animation: rise linear infinite; }
    .floater:nth-child(3n) { color: #ee2a7b; }
    .floater:nth-child(4n) { color: #fff; }
    @keyframes rise {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.3; }
      85% { opacity: 0.2; }
      100% { transform: translateY(-900px) rotate(25deg); opacity: 0; }
    }

    .layout { display: grid; gap: 48px; align-items: center; justify-items: center; }
    @media (min-width: 992px) { .layout { grid-template-columns: 1fr auto; justify-items: stretch; gap: 64px; } }

    /* Profile + story highlights */
    .profile-col { display: grid; gap: 28px; justify-items: start; max-width: 540px; }
    .profile { display: flex; align-items: center; gap: 18px; color: #fff; }
    .ring { width: 96px; height: 96px; border-radius: 50%; padding: 4px; flex-shrink: 0; background: conic-gradient(#f9ce34, #ee2a7b, #6228d7, #f9ce34); animation: spin 4s linear infinite; }
    .ring img { width: 100%; height: 100%; border-radius: 50%; object-fit: contain; padding: 10px; background: var(--obsidian); border: 3px solid var(--obsidian); animation: spin 4s linear infinite reverse; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .who { display: flex; flex-direction: column; line-height: 1.35; }
    .who strong { font: 700 1.2rem var(--font-head); }
    .who small { color: var(--gold); font-weight: 600; }
    .bio { color: var(--muted); font-size: 0.92rem; margin-top: 4px; }
    .highlights { display: flex; flex-wrap: nowrap; gap: 14px; max-width: 100%; overflow-x: auto; scrollbar-width: none; padding: 4px 2px; }
    .highlights::-webkit-scrollbar { display: none; }
    .highlights button { flex: 0 0 auto; display: grid; justify-items: center; align-content: start; gap: 6px; width: 70px; padding: 0; border: 0; background: none; cursor: pointer; }
    .bubble {
      position: relative; width: 64px; height: 64px; border-radius: 50%; background: var(--obsidian);
      border: 3px solid var(--obsidian); box-shadow: 0 0 0 2px rgba(216, 174, 98, 0.45); transition: box-shadow 0.25s, transform 0.25s;
    }
    .bubble img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .bubble i { position: absolute; right: -6px; bottom: -4px; font-style: normal; font-size: 1rem; }
    .highlights button.on .bubble { box-shadow: 0 0 0 3px var(--gold); transform: scale(1.08); }
    .highlights small { font: 600 0.72rem/1.2 var(--font-head); color: #d9dee2; text-align: center; }

    /* The story viewer: Instagram post shape (4:5) so square and wide photos fit large */
    .phone {
      position: relative; width: min(460px, 92vw); aspect-ratio: 4 / 5; border-radius: 34px; padding: 12px;
      background: #0d1419; border: 2px solid rgba(216, 174, 98, 0.5);
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(216, 174, 98, 0.15);
      user-select: none; -webkit-user-select: none; touch-action: manipulation;
    }
    .screen { position: relative; height: 100%; border-radius: 24px; overflow: hidden; background: #090e13; }
    .screen.paused * { animation-play-state: paused !important; }

    /* The photo is always shown in full; a blurred copy fills the rest of the screen */
    .media { position: absolute; inset: 0; opacity: 0; transition: opacity 0.6s ease; }
    .media.active { opacity: 1; }
    .backdrop { position: absolute; inset: -10%; width: 120%; height: 120%; object-fit: cover; filter: blur(22px) brightness(0.55) saturate(1.2); }
    .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5)); }
    .media.active .photo { animation: kenburns 6s ease-out forwards; }
    @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.05); } }
    .shade { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, transparent 16%, transparent 66%, rgba(0, 0, 0, 0.75) 100%); }

    .bars { position: absolute; top: 12px; left: 10px; right: 10px; z-index: 5; display: flex; gap: 4px; }
    .bar { flex: 1; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, 0.35); overflow: hidden; }
    .fill { display: block; height: 100%; background: #fff; }
    .fill.done { width: 100%; }
    .fill.run { width: 0; animation: fill linear forwards; }
    @keyframes fill { to { width: 100%; } }
    .top { position: absolute; top: 24px; left: 12px; right: 12px; z-index: 5; display: flex; align-items: center; gap: 8px; color: #fff; }
    .top img { width: 30px; height: 30px; border-radius: 50%; object-fit: contain; padding: 3px; background: var(--obsidian); border: 1.5px solid #fff; }
    .top b { font: 700 0.82rem var(--font-head); }
    .top small { color: rgba(255, 255, 255, 0.75); font-size: 0.75rem; }
    .dots { margin-left: auto; letter-spacing: 1px; font-size: 0.7rem; }

    .caption { position: absolute; left: 18px; right: 18px; bottom: 72px; z-index: 5; color: #fff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); pointer-events: none; animation: up 0.5s ease 0.5s both; }
    .caption strong { display: block; font: 800 1.35rem/1.15 var(--font-head); }
    .caption small { display: block; font-size: 0.85rem; opacity: 0.92; margin-top: 4px; }
    @keyframes up { from { opacity: 0; transform: translateY(14px); } }
    .hearts span { position: absolute; z-index: 5; right: 22px; bottom: 70px; font-size: 1.3rem; opacity: 0; pointer-events: none; animation: heart 3s ease-in infinite; }
    .hearts span:nth-child(2) { right: 34px; animation-delay: 0.7s; }
    .hearts span:nth-child(3) { right: 16px; animation-delay: 1.4s; }
    .hearts span:nth-child(4) { right: 28px; animation-delay: 2.1s; }
    @keyframes heart { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(-200px) scale(1.1); } }

    /* Left/right thirds move between stories; the middle opens the post on Instagram */
    .open { position: absolute; top: 60px; bottom: 70px; left: 32%; right: 32%; z-index: 4; }
    .tap { position: absolute; top: 60px; bottom: 70px; width: 32%; z-index: 4; border: 0; background: transparent; cursor: pointer; }
    .tap.prev { left: 0; }
    .tap.next { right: 0; }
    .reply { position: absolute; left: 12px; right: 12px; bottom: 14px; z-index: 5; display: flex; align-items: center; gap: 12px; color: #fff; }
    .reply span:first-child { flex: 1; padding: 10px 16px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.6); font-size: 0.82rem; color: rgba(255, 255, 255, 0.85); }
    .like { font-size: 1.3rem; animation: beat 1.4s ease-in-out infinite; }
    @keyframes beat { 50% { transform: scale(1.2); } }
  `,
})
export class InstagramShowcase {
  private readonly api = inject(ApiService);
  private readonly section = viewChild<ElementRef<HTMLElement>>('section');

  private readonly showcases = toSignal(this.api.showcase$, { initialValue: [] as Showcase[] });
  protected readonly client = computed(() => this.showcases()[0] ?? null);

  protected readonly stories = computed<Story[]>(() =>
    (this.client()?.posts ?? [])
      .filter((p) => p.image && POST_CODE.test(p.code))
      .map((p) => ({
        label: p.label ?? '',
        emoji: p.emoji ?? '📸',
        image: p.image!,
        link: `https://www.instagram.com/${p.type === 'reel' ? 'reel' : 'p'}/${p.code}/`,
      })),
  );
  protected readonly storyMs = STORY_MS;

  protected readonly index = signal(0);
  protected readonly visited = signal(new Set<number>([0, 1]));
  protected readonly held = signal(false);
  private readonly visible = signal(false);
  private readonly tick = signal(0);
  // A new key per story re-creates the caption and progress bar so they replay.
  protected readonly key = computed(() => [this.tick()]);
  protected readonly story = computed(() => this.stories()[this.index()] ?? null);
  protected readonly running = computed(() => this.visible() && !this.held());

  protected readonly floaters: Floater[] = Array.from({ length: 14 }, (_, i) => ({
    icon: ['instagram', 'heart', 'facebook', 'youtube', 'social', 'threads', 'x'][i % 7],
    left: (i * 7.3 + 3) % 100,
    size: 18 + ((i * 5) % 18),
    delay: (i * 1.7) % 12,
    duration: 12 + ((i * 3) % 10),
  }));

  private elapsed = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let observer: IntersectionObserver | undefined;
      let last = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        // The section renders once the client data arrives; observe it then.
        const el = this.section()?.nativeElement;
        if (el && !observer) {
          observer = new IntersectionObserver(([e]) => this.visible.set(e.isIntersecting), { threshold: 0.3 });
          observer.observe(el);
        }
        if (this.running() && this.stories().length) {
          this.elapsed += now - last;
          if (this.elapsed >= STORY_MS) this.go(this.index() + 1);
        }
        last = now;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      destroyRef.onDestroy(() => {
        observer?.disconnect();
        cancelAnimationFrame(raf);
      });
    });
  }

  protected go(i: number): void {
    const n = this.stories().length;
    if (!n) return;
    const next = ((i % n) + n) % n;
    this.index.set(next);
    // Load the following photo in the background so it's ready in time.
    this.visited.update((v) => new Set(v).add(next).add((next + 1) % n));
    this.elapsed = 0;
    this.tick.update((t) => t + 1);
  }
}
