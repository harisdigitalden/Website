import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaBanner } from '../sections/cta-banner';
import { Process } from '../sections/process';
import { ServicesGrid } from '../sections/services-grid';
import { PageHero } from '../shared/page-hero';

@Component({
  selector: 'app-services-page',
  imports: [PageHero, ServicesGrid, Process, CtaBanner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      crumb="Services"
      heading="Our Digital Marketing Services"
      subtitle="Websites, mobile apps, social media setup & marketing, branding, business email and digital ledger — everything you need to grow online."
    />
    <app-services-grid />
    <app-process />
    <div class="spacer"></div>
    <app-cta-banner />
  `,
  styles: `.spacer { height: 80px; }`,
})
export class ServicesPage {}
