import { Routes } from '@angular/router';
import { Home } from './pages/home';

const suffix = " | Hari's Digital Den";

export const routes: Routes = [
  { path: '', component: Home, title: "Hari's Digital Den | Digital Marketing Agency in AP & Telangana" },
  {
    path: 'services',
    loadComponent: () => import('./pages/services-page').then((m) => m.ServicesPage),
    title: 'Services — Websites, Instagram & Facebook Marketing, Branding' + suffix,
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing-page').then((m) => m.PricingPage),
    title: 'Plans & Pricing' + suffix,
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
    title: 'About Us' + suffix,
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page').then((m) => m.ContactPage),
    title: 'Contact — Free Consultation' + suffix,
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
    title: 'Page not found' + suffix,
  },
];
