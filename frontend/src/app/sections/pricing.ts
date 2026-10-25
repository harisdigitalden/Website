import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Package } from '../core/models';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" id="pricing">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Plans &amp; Pricing</span>
          <h2>Simple Plans, <span class="gradient-text">Complete Solutions</span></h2>
          <p>Start with a one-time digital setup, then let us grow your brand every month.</p>
        </div>

        <div class="plans">
          @for (p of packages(); track p.id) {
            <article class="plan panel-light" [class.popular]="p.popular">
              <header class="plan-head">
                <span class="label">{{ p.label }}</span>
                <h3>{{ p.name }}</h3>
                <span class="billing">{{ p.billing }}</span>
              </header>

              <div class="plan-body">
                <p class="tagline">{{ p.tagline }}</p>
                <div class="groups">
                  @for (g of p.groups; track g.title) {
                    <div class="group">
                      <span class="g-icon"><app-icon [name]="g.icon" [size]="20" /></span>
                      <div>
                        <h4>{{ g.title }}</h4>
                        <ul class="check-list">
                          @for (item of g.items; track item) {
                            <li><app-icon name="check" [size]="14" /> {{ item }}</li>
                          }
                        </ul>
                      </div>
                    </div>
                  }
                </div>

                @for (n of p.notes; track n) {
                  <p class="note"><app-icon name="shield" [size]="16" /> {{ n }}</p>
                }
              </div>

              <footer class="plan-foot">
                <div class="price">
                  <small>{{ p.billing === 'Monthly' ? 'Monthly maintenance' : 'Investment (one time)' }}</small>
                  <span class="amount">{{ inr(p.price) }}</span>
                  <span class="period">{{ p.period }}</span>
                </div>
                <a routerLink="/contact" [queryParams]="{ plan: planLabel(p) }" class="btn btn--dark">
                  Choose {{ p.label }} <app-icon name="arrow" [size]="16" />
                </a>
              </footer>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .plans { display: grid; gap: 32px; align-items: start; }
    @media (min-width: 1100px) { .plans { grid-template-columns: 1fr 1fr; } }
    .plan {
      display: flex; flex-direction: column; border-radius: 22px; overflow: hidden; background: #fffbf4;
      border: 1px solid #eadfca; box-shadow: var(--shadow-lg);
    }
    .plan.popular { outline: 2px solid var(--primary); }
    .plan-head {
      display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 22px 28px;
      background: linear-gradient(90deg, #0b0a08 0%, #101b22 60%, #6e5124 100%); color: #fff;
    }
    .label { font: 800 1.5rem var(--font-head); color: var(--accent); }
    .plan-head h3 { flex: 1; margin: 0; color: #fff; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .billing { font: 600 0.8rem var(--font-head); text-transform: uppercase; letter-spacing: 0.1em; color: #f3d18d; }
    .plan-body { padding: 26px 28px 8px; flex: 1; }
    .tagline { color: var(--muted); margin-bottom: 22px; }
    .groups { display: grid; gap: 22px; }
    @media (min-width: 640px) { .groups { grid-template-columns: 1fr 1fr; } }
    .group { display: flex; gap: 14px; align-items: flex-start; }
    .g-icon {
      width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
      background: #f6e9c8; color: #7a5a26;
    }
    h4 { font-size: 0.98rem; margin-bottom: 8px; }
    .group .check-list { gap: 6px; }
    .group .check-list li { font-size: 0.88rem; line-height: 1.45; gap: 8px; }
    .group .check-list app-icon { color: var(--primary); margin-top: 3px; }
    .note {
      display: flex; gap: 10px; align-items: flex-start; margin: 22px 0 10px; padding: 12px 16px; border-radius: 12px;
      background: #fff5e0; color: #8a4b0a; font-weight: 600; font-size: 0.92rem;
    }
    .note app-icon { margin-top: 3px; flex-shrink: 0; }
    .plan-foot {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px;
      margin: 16px 28px 28px; padding: 20px 24px; border-radius: 16px; background: var(--gradient); color: var(--on-gold);
    }
    .price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
    .price small { width: 100%; font: 700 0.78rem var(--font-head); text-transform: uppercase; letter-spacing: 0.1em; }
    .amount { font: 800 2.3rem var(--font-head); line-height: 1.1; }
    .period { font-weight: 600; }
    .btn--dark { background: var(--navy-deep); color: #fff; }
    .btn--dark:hover { box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35); }
  `,
})
export class Pricing {
  private readonly api = inject(ApiService);
  protected readonly packages = toSignal(this.api.packages$, { initialValue: [] });

  private readonly formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  protected inr(value: number): string {
    return this.formatter.format(value);
  }

  protected planLabel(p: Package): string {
    return `${p.label} – ${p.name}`;
  }
}
