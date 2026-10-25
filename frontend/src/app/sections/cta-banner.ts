import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { SITE } from '../site.config';

@Component({
  selector: 'app-cta-banner',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta">
      <div class="container">
        <div class="box">
          <div>
            <h2>Ready to <span>Grow Together?</span></h2>
            <p>Book a free consultation and get a plan tailored to your business — no obligation.</p>
          </div>
          <div class="actions">
            <a routerLink="/contact" class="btn btn--primary">Book Free Consultation</a>
            <a [href]="site.phoneHref" class="btn btn--ghost-light">
              <app-icon name="phone" [size]="18" /> {{ site.phoneDisplay }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta { padding: 0 0 80px; }
    .box {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 28px;
      padding: 48px 40px; border-radius: 28px; color: #d9dee2; border: 1px solid rgba(216, 174, 98, 0.4);
      background: radial-gradient(500px 200px at 90% 0%, rgba(216, 174, 98, 0.35), transparent 70%), var(--navy-deep);
      box-shadow: var(--shadow-lg);
    }
    h2 { color: #fff; font-size: clamp(1.5rem, 3vw, 2.2rem); }
    h2 span { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; }
    p { margin: 0; font-size: 1.05rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 14px; }
    @media (max-width: 640px) { .box { padding: 36px 24px; } }
  `,
})
export class CtaBanner {
  protected readonly site = SITE;
}
