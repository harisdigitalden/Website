import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactSection } from '../sections/contact-section';
import { Faq } from '../sections/faq';
import { PageHero } from '../shared/page-hero';

@Component({
  selector: 'app-contact-page',
  imports: [PageHero, ContactSection, Faq],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero
      crumb="Contact"
      heading="Get Your Free Consultation"
      subtitle="Tell us about your business and we'll share a custom growth plan within 24 hours."
    />
    <app-contact-section />
    <app-faq />
  `,
})
export class ContactPage {}
