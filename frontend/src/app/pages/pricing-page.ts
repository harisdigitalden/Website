import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CameraIntro } from '../layout/camera-intro';
import { CtaBanner } from '../sections/cta-banner';
import { Faq } from '../sections/faq';
import { Pricing } from '../sections/pricing';
import { PageHero } from '../shared/page-hero';

@Component({
  selector: 'app-pricing-page',
  imports: [PageHero, Pricing, Faq, CtaBanner, CameraIntro],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-camera-intro caption="Plans &amp; Pricing" />
    <app-page-hero
      crumb="Pricing"
      heading="Plans &amp; Pricing"
      subtitle="A one-time Digital Setup Package and a monthly Social Media Maintenance Package — everything clearly listed."
    />
    <app-pricing />
    <app-faq />
    <app-cta-banner />
  `,
})
export class PricingPage {}
