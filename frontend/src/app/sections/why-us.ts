import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-why-us',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--soft">
      <div class="container layout">
        <div class="intro">
          <span class="eyebrow">Why choose us</span>
          <h2>Your Growth Partner, <span class="gradient-text">Not Just an Agency</span></h2>
          <p>
            We treat your business like our own. Every rupee you invest is tracked, every campaign
            is built around your goals, and you always know exactly what we are doing and why.
          </p>
          <ul class="check-list">
            <li><app-icon name="check" [size]="16" /> All login credentials handed over to you</li>
            <li><app-icon name="check" [size]="16" /> Clear plans — domain charged at actual cost</li>
            <li><app-icon name="check" [size]="16" /> One review meeting with you every month</li>
          </ul>
          <a routerLink="/about" class="btn btn--outline">More about us</a>
        </div>

        <div class="grid grid--2">
          @for (r of reasons; track r.title) {
            <div class="reason">
              <div class="icon-badge"><app-icon [name]="r.icon" [size]="24" /></div>
              <h3>{{ r.title }}</h3>
              <p>{{ r.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; gap: 48px; align-items: center; }
    @media (min-width: 992px) { .layout { grid-template-columns: 0.9fr 1.1fr; gap: 64px; } }
    .intro h2 { font-size: clamp(1.75rem, 3.5vw, 2.5rem); }
    .intro p { color: var(--muted); font-size: 1.05rem; }
    .intro .check-list { margin: 24px 0 32px; }
    .reason { background: var(--charcoal); border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); }
    .reason h3 { font-size: 1.1rem; }
    .reason p { color: var(--muted); margin: 0; font-size: 0.95rem; }
    .reason .icon-badge { width: 48px; height: 48px; margin-bottom: 16px; }
  `,
})
export class WhyUs {
  protected readonly reasons = [
    { icon: 'target', title: 'Strategy Driven', text: 'Weekly content planning and strategy built around your business.' },
    { icon: 'branding', title: 'Creative Content', text: 'Reels, festival posts and custom designs with your logo.' },
    { icon: 'chart', title: 'Business Growth', text: 'Monthly performance reviews with clear, simple insights.' },
    { icon: 'users', title: 'Partnerships', text: 'Business collaborations that extend your brand’s reach.' },
  ];
}
