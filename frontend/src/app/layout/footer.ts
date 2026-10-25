import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { SITE, whatsappLink } from '../site.config';
import { Logo } from './logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container cols">
        <div class="about">
          <app-logo [full]="true" [height]="120" />
          <p>
            Your Brand. Our Creativity. Digital marketing, websites &amp; apps, Reels, branding and
            media for businesses across Andhra Pradesh &amp; Telangana — expanding all over India.
          </p>
          <div class="social">
            @for (s of site.social; track s.url) {
              <a [href]="s.url" target="_blank" rel="noopener" [attr.aria-label]="s.name" [title]="s.name">
                <app-icon [name]="s.icon" />
              </a>
            }
          </div>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            @for (l of serviceLinks; track l.tab) {
              <li><a routerLink="/services" [queryParams]="{ tab: l.tab }" fragment="services">{{ l.label }}</a></li>
            }
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/pricing">Plans &amp; Pricing</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/contact">Free Consultation</a></li>
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul class="contact">
            <li><app-icon name="phone" [size]="18" /><a [href]="site.phoneHref">{{ site.phoneDisplay }}</a></li>
            <li><app-icon name="whatsapp" [size]="18" /><a [href]="whatsapp" target="_blank" rel="noopener">Chat on WhatsApp</a></li>
            <li><app-icon name="mail" [size]="18" /><a [href]="'mailto:' + site.email">{{ site.email }}</a></li>
            <li><app-icon name="location" [size]="18" /><span>{{ site.address }}</span></li>
            <li><app-icon name="clock" [size]="18" /><span>{{ site.hours }}</span></li>
          </ul>
        </div>
      </div>

      <div class="container bottom">
        <span>© {{ year }} {{ site.name }}. All rights reserved.</span>
        <span>{{ site.tagline }}</span>
      </div>
    </footer>
  `,
  styles: `
    .footer { background: var(--navy-deep); color: #aeb6bd; padding-top: 72px; font-size: 0.95rem; border-top: 1px solid rgba(216, 174, 98, 0.2); }
    .cols { display: grid; gap: 40px; padding-bottom: 48px; }
    @media (min-width: 640px) { .cols { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 992px) { .cols { grid-template-columns: 1.6fr 1fr 1fr 1.4fr; } }
    .about p { margin: 20px 0; max-width: 360px; }
    h4 { color: var(--accent); font-size: 1.05rem; margin-bottom: 18px; }
    ul { display: grid; gap: 10px; }
    a { color: #aeb6bd; transition: color 0.2s; }
    a:hover { color: #fff; }
    .contact li { display: flex; gap: 10px; align-items: flex-start; }
    .contact app-icon { color: var(--accent); margin-top: 3px; }
    .social { display: flex; gap: 10px; }
    .social a {
      width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
      background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(216, 174, 98, 0.3); color: var(--accent);
      transition: background 0.2s, color 0.2s;
    }
    .social a:hover { background: var(--gradient); color: var(--on-gold); }
    .bottom {
      display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
      padding-top: 24px; padding-bottom: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.85rem;
    }
    .bottom span:last-child { letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  `,
})
export class Footer {
  protected readonly site = SITE;
  protected readonly whatsapp = whatsappLink();
  protected readonly year = new Date().getFullYear();
  protected readonly serviceLinks = [
    { tab: 'website-development', label: 'Website Development' },
    { tab: 'mobile-app-development', label: 'Mobile App Development' },
    { tab: 'social-media-marketing', label: 'Social Media Marketing' },
    { tab: 'branding', label: 'Branding Materials' },
    { tab: 'email-domain-setup', label: 'Business Email & Domain' },
    { tab: 'digital-ledger', label: 'Digital Ledger' },
  ];
}
