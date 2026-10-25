import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Brands } from '../sections/brands';
import { ContactSection } from '../sections/contact-section';
import { CtaBanner } from '../sections/cta-banner';
import { Hero } from '../sections/hero';
import { InstagramShowcase } from '../sections/instagram-showcase';
import { Process } from '../sections/process';
import { ServicesGrid } from '../sections/services-grid';
import { Stats } from '../sections/stats';
import { WhyUs } from '../sections/why-us';

// Pricing and FAQ live on the Pricing page only.
// Add <app-testimonials /> back once real client reviews are in backend/content.go.
@Component({
  selector: 'app-home',
  imports: [Hero, Stats, Brands, InstagramShowcase, ServicesGrid, WhyUs, Process, CtaBanner, ContactSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-stats />
    <app-services-grid />
    <app-brands />
    <app-instagram-showcase />
    <app-why-us />
    <app-process />
    <app-cta-banner />
    <app-contact-section />
  `,
})
export class Home {}
