import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Icon } from '../shared/icon';
import { whatsappLink } from '../site.config';
import { ServicesOrbit } from './services-orbit';

// Services as individual tabs, under the animated services illustration.
// Link to a tab with /services?tab=<slug>.
@Component({
  selector: 'app-services-grid',
  imports: [RouterLink, Icon, ServicesOrbit],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section services" [class.section--soft]="soft()" id="services">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">What we do</span>
          <h2>Our Digital Marketing Services <span class="gradient-text">That Grow Your Business</span></h2>
          <p>
            Websites, mobile apps, social media, branding, email and accounting — everything your business
            needs to grow online, under one roof.
          </p>
        </div>

        <app-services-orbit />

        @if (services().length) {
          <div class="tabs" role="tablist" aria-label="Services">
            @for (s of services(); track s.slug) {
              <button
                type="button"
                role="tab"
                [id]="'tab-' + s.slug"
                [attr.aria-selected]="s.slug === activeSlug()"
                [attr.aria-controls]="'panel-' + s.slug"
                [class.active]="s.slug === activeSlug()"
                (click)="selected.set(s.slug)"
              >
                <app-icon [name]="s.icon" [size]="18" />
                <span>{{ s.title }}</span>
              </button>
            }
          </div>

          @if (active(); as s) {
            <div class="panel fade-up" role="tabpanel" [id]="'panel-' + s.slug" [attr.aria-labelledby]="'tab-' + s.slug">
              <div class="panel-copy">
                <div class="icon-badge"><app-icon [name]="s.icon" [size]="28" /></div>
                <h3>{{ s.title }}</h3>
                <p class="summary">{{ s.summary }}</p>
                <ul class="check-list features">
                  @for (f of s.features; track f) {
                    <li><app-icon name="check" [size]="16" /> {{ f }}</li>
                  }
                </ul>
                <div class="actions">
                  <a class="btn btn--primary" routerLink="/contact" [queryParams]="{ service: s.title }">
                    Enquire now <app-icon name="arrow" [size]="16" />
                  </a>
                  <a class="btn btn--outline" [href]="whatsappFor(s.title)" target="_blank" rel="noopener">
                    <app-icon name="whatsapp" [size]="16" /> Ask on WhatsApp
                  </a>
                </div>
              </div>
              <div class="panel-art" aria-hidden="true">
                <span class="art-ring r1"></span>
                <span class="art-ring r2"></span>
                <span class="art-icon"><app-icon [name]="s.icon" [size]="72" /></span>
                <span class="art-step">{{ indexOf(s.slug) + 1 }} / {{ services().length }}</span>
              </div>
            </div>
          }
        } @else {
          <p class="empty">Loading services…</p>
        }
      </div>
    </section>
  `,
  styles: `
    .tabs {
      display: flex; gap: 10px; overflow-x: auto; padding: 6px; margin-bottom: 28px; scrollbar-width: none;
      background: var(--charcoal); border: 1px solid var(--border); border-radius: 18px;
    }
    .tabs::-webkit-scrollbar { display: none; }
    @media (min-width: 1100px) { .tabs { display: grid; grid-template-columns: repeat(6, 1fr); } }
    .tabs button {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 16px;
      border: 1px solid transparent; border-radius: 12px; background: none; cursor: pointer; text-align: left;
      font: 600 0.88rem/1.25 var(--font-head); color: var(--muted); transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .tabs button:hover { color: #fff; border-color: var(--border); }
    .tabs button.active { background: var(--gradient); color: var(--on-gold); box-shadow: 0 8px 22px rgba(216, 174, 98, 0.3); }
    .tabs button app-icon { flex-shrink: 0; }

    .panel {
      display: grid; gap: 32px; align-items: center; padding: 36px 28px; border-radius: 24px;
      background: linear-gradient(135deg, var(--charcoal), var(--midnight)); border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
    }
    @media (min-width: 900px) { .panel { grid-template-columns: 1.4fr 1fr; padding: 48px; } }
    .panel h3 { font-size: clamp(1.4rem, 2.6vw, 2rem); }
    .summary { color: var(--muted); font-size: 1.05rem; }
    .features { margin: 22px 0 30px; }
    @media (min-width: 640px) { .features { grid-template-columns: 1fr 1fr; } }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; }

    .panel-art { position: relative; height: 300px; display: grid; place-items: center; }
    .art-ring { position: absolute; border-radius: 50%; border: 1px dashed rgba(216, 174, 98, 0.4); animation: turn 30s linear infinite; }
    .r1 { width: 260px; height: 260px; }
    .r2 { width: 190px; height: 190px; border-style: solid; border-color: rgba(216, 174, 98, 0.2); animation-direction: reverse; }
    @keyframes turn { to { transform: rotate(360deg); } }
    .art-icon {
      width: 140px; height: 140px; border-radius: 36px; display: grid; place-items: center; color: var(--on-gold);
      background: var(--gradient); box-shadow: 0 0 60px rgba(216, 174, 98, 0.35); animation: hover 4s ease-in-out infinite;
    }
    @keyframes hover { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-10px) rotate(4deg); } }
    .art-step { position: absolute; bottom: 8px; right: 8px; font: 600 0.8rem var(--font-head); color: var(--muted); letter-spacing: 0.1em; }
    .empty { text-align: center; color: var(--muted); }
  `,
})
export class ServicesGrid {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly soft = input(false);

  protected readonly services = toSignal(this.api.services$, { initialValue: [] });
  private readonly tabParam = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('tab') ?? '')), { initialValue: '' });
  // Follows ?tab= in the URL, but a click on a tab can override it.
  protected readonly selected = linkedSignal(() => this.tabParam());

  protected readonly activeSlug = computed(() => {
    const list = this.services();
    return list.some((s) => s.slug === this.selected()) ? this.selected() : (list[0]?.slug ?? '');
  });
  protected readonly active = computed(() => this.services().find((s) => s.slug === this.activeSlug()) ?? null);

  protected indexOf(slug: string): number {
    return this.services().findIndex((s) => s.slug === slug);
  }

  protected whatsappFor(title: string): string {
    return whatsappLink(`Hi Hari's Digital Den, I'm interested in ${title}.`);
  }
}
