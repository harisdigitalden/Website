import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../shared/icon';
import { SITE } from '../site.config';
import { Logo } from './logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header" [class.scrolled]="scrolled()">
      <div class="container bar">
        <app-logo [full]="true" [height]="72" />

        <nav class="nav" [class.open]="menuOpen()" aria-label="Main">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              (click)="menuOpen.set(false)"
              >{{ link.label }}</a
            >
          }
          <a routerLink="/contact" class="btn btn--primary nav-cta" (click)="menuOpen.set(false)">
            Free Consultation
          </a>
        </nav>

        <div class="actions">
          <a [href]="site.phoneHref" class="phone">
            <span class="phone-icon"><app-icon name="phone" [size]="18" /></span>
            <span>
              <small>Call us</small>
              {{ site.phoneDisplay }}
            </span>
          </a>
          <button
            class="toggle"
            type="button"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Toggle menu"
            (click)="menuOpen.update((v) => !v)"
          >
            <app-icon [name]="menuOpen() ? 'close' : 'menu'" [size]="26" />
          </button>
        </div>
      </div>
    </header>
  `,
  styles: `
    .header {
      position: fixed; inset: 0 0 auto; z-index: 100; height: var(--header-h);
      background: rgba(9, 14, 19, 0.94); backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(216, 174, 98, 0.15); transition: box-shadow 0.3s;
    }
    .header.scrolled { box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35); }
    .bar { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }

    .nav { display: flex; align-items: center; gap: 30px; }
    .nav a:not(.btn) {
      font: 500 0.95rem var(--font-head); color: #eef1f3; position: relative; padding: 6px 0;
    }
    .nav a:not(.btn)::after {
      content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 0;
      background: var(--gradient); transition: width 0.25s;
    }
    .nav a:not(.btn):hover::after, .nav a.active::after { width: 100%; }
    .nav a.active { color: var(--accent); }

    .actions { display: flex; align-items: center; gap: 12px; }
    .phone { display: flex; align-items: center; gap: 10px; color: #fff; font: 600 0.95rem var(--font-head); }
    .phone small { display: block; font: 500 0.72rem var(--font-body); color: #97a1aa; }
    .phone-icon {
      width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
      background: rgba(216, 174, 98, 0.15); color: var(--accent);
    }
    .toggle { display: none; background: none; border: 0; color: #fff; cursor: pointer; padding: 4px; }
    .nav-cta { display: none; }

    @media (max-width: 1100px) { .phone { display: none; } }

    @media (max-width: 991px) {
      .toggle { display: block; }
      .nav-cta { display: inline-flex; margin-top: 8px; }
      .nav {
        position: fixed; top: var(--header-h); left: 0; right: 0; flex-direction: column; align-items: stretch;
        gap: 4px; padding: 16px; background: var(--navy-deep); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        transform: translateY(-120%); opacity: 0; visibility: hidden;
        transition: transform 0.3s, opacity 0.3s, visibility 0.3s;
      }
      .nav.open { transform: none; opacity: 1; visibility: visible; }
      .nav a:not(.btn) { padding: 12px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
      .nav a:not(.btn)::after { display: none; }
    }
  `,
})
export class Header {
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  protected readonly links = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }
}
