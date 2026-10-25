import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaBanner } from '../sections/cta-banner';
import { Stats } from '../sections/stats';
import { WhyUs } from '../sections/why-us';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

@Component({
  selector: 'app-about-page',
  imports: [PageHero, Stats, WhyUs, CtaBanner, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      crumb="About Us"
      heading="About Hari's Digital Den"
      subtitle="Brand | Content | Growth — a creative digital marketing studio for businesses in Andhra Pradesh & Telangana."
    />

    <section class="section">
      <div class="container story">
        <div>
          <span class="eyebrow">Who we are</span>
          <h2>Your Brand. <span class="gradient-text">Our Creativity.</span></h2>
          <p>
            Hari's Digital Den helps businesses go digital the right way — with a professional
            website, a consistent brand identity and active social media that people trust.
          </p>
          <p>
            We take care of everything: building your website, creating and setting up your
            Instagram, Facebook, YouTube, Pinterest, X and Threads accounts, designing your logo
            and business stationery, and posting fresh content every week. You focus on your
            business — we help it grow. DM us and let's grow together!
          </p>
        </div>
        <div class="grid grid--2 values">
          @for (v of values; track v.title) {
            <div class="value">
              <app-icon [name]="v.icon" [size]="28" />
              <h3>{{ v.title }}</h3>
              <p>{{ v.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <app-stats />
    <div class="spacer"></div>
    <app-why-us />
    <div class="spacer"></div>
    <app-cta-banner />
  `,
  styles: `
    .story { display: grid; gap: 48px; align-items: center; }
    @media (min-width: 992px) { .story { grid-template-columns: 1fr 1fr; gap: 64px; } }
    .story h2 { font-size: clamp(1.75rem, 3.5vw, 2.5rem); }
    .story p { color: var(--muted); font-size: 1.05rem; }
    .value { padding: 28px; border-radius: var(--radius); background: var(--bg-soft); border: 1px solid var(--border); }
    .value app-icon { color: var(--primary); margin-bottom: 14px; }
    .value h3 { font-size: 1.1rem; }
    .value p { font-size: 0.95rem; margin: 0; }
    .spacer { height: 72px; }
  `,
})
export class AboutPage {
  protected readonly values = [
    { icon: 'target', title: 'Strategy Driven', text: 'Every post and campaign is planned around your business goals.' },
    { icon: 'branding', title: 'Creative Content', text: 'Reels, designs and videos with your branding that stand out.' },
    { icon: 'chart', title: 'Business Growth', text: 'Monthly reviews and insights so you can see your progress.' },
    { icon: 'users', title: 'Partnerships & Collaborations', text: 'We help you build collaborations that grow your reach.' },
  ];
}
