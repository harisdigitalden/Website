import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../shared/icon';
import { SITE, whatsappLink } from '../site.config';

// Sticky WhatsApp + call buttons — standard on Indian business sites.
@Component({
  selector: 'app-floating-contact',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="fab whatsapp" [href]="whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <app-icon name="whatsapp" [size]="28" />
    </a>
    <a class="fab call" [href]="site.phoneHref" aria-label="Call us">
      <app-icon name="phone" [size]="22" />
    </a>
  `,
  styles: `
    :host { position: fixed; right: 18px; bottom: 18px; z-index: 90; display: flex; flex-direction: column; gap: 12px; }
    .fab {
      width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2); transition: transform 0.2s;
    }
    .fab:hover { transform: scale(1.08); }
    .whatsapp { background: var(--whatsapp); animation: pulse 2.4s infinite; }
    .call { background: var(--gradient); color: var(--on-gold); width: 48px; height: 48px; align-self: center; }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
      70% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
      100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
    }
  `,
})
export class FloatingContact {
  protected readonly site = SITE;
  protected readonly whatsapp = whatsappLink();
}
