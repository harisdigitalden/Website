import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../core/api.service';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-testimonials',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--soft">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Client stories</span>
          <h2>Loved by Businesses <span class="gradient-text">Across India</span></h2>
          <p>Don't just take our word for it — here's what our clients say.</p>
        </div>
        <div class="grid grid--2">
          @for (t of testimonials(); track t.name) {
            <figure class="card quote">
              <div class="stars">
                @for (s of stars(t.rating); track $index) {
                  <app-icon name="star" [size]="18" [filled]="true" />
                }
              </div>
              <blockquote>“{{ t.quote }}”</blockquote>
              <figcaption>
                <span class="avatar">{{ t.initials }}</span>
                <span>
                  <strong>{{ t.name }}</strong>
                  <small>{{ t.role }} · {{ t.city }}</small>
                </span>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .quote { margin: 0; display: flex; flex-direction: column; }
    .stars { display: flex; gap: 2px; color: #f5a623; margin-bottom: 16px; }
    blockquote { margin: 0 0 24px; font-size: 1.05rem; color: var(--ink); flex: 1; }
    figcaption { display: flex; align-items: center; gap: 14px; line-height: 1.3; }
    figcaption small { display: block; color: var(--muted); }
    .avatar {
      width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
      background: var(--gradient); color: #fff; font: 700 0.9rem var(--font-head); flex-shrink: 0;
    }
  `,
})
export class Testimonials {
  private readonly api = inject(ApiService);
  protected readonly testimonials = toSignal(this.api.testimonials$, { initialValue: [] });

  protected stars(n: number): number[] {
    return Array.from({ length: n });
  }
}
