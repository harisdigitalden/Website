import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { ContactRequest } from '../core/models';
import { Icon } from '../shared/icon';
import { SITE, whatsappLink } from '../site.config';

type Status = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--soft" id="contact">
      <div class="container layout">
        <aside class="info">
          <span class="eyebrow">Contact us</span>
          <h2>Let's Talk About <span class="gradient-text">Your Growth</span></h2>
          <p>
            Fill in the form and our team will call you within 24 hours with a free strategy for your
            business. Prefer to chat? Message us on WhatsApp.
          </p>
          <ul class="channels">
            <li>
              <span class="ic"><app-icon name="phone" /></span>
              <span><small>Call us</small><a [href]="site.phoneHref">{{ site.phoneDisplay }}</a></span>
            </li>
            <li>
              <span class="ic wa"><app-icon name="whatsapp" /></span>
              <span><small>WhatsApp</small><a [href]="whatsapp" target="_blank" rel="noopener">Chat instantly</a></span>
            </li>
            <li>
              <span class="ic"><app-icon name="mail" /></span>
              <span><small>Email</small><a [href]="'mailto:' + site.email">{{ site.email }}</a></span>
            </li>
            <li>
              <span class="ic"><app-icon name="clock" /></span>
              <span><small>Working hours</small>{{ site.hours }}</span>
            </li>
          </ul>
        </aside>

        <div class="form-card panel-light">
          @if (status() === 'success') {
            <div class="done">
              <span class="ic big"><app-icon name="check" [size]="36" /></span>
              <h3>Thank you!</h3>
              <p>{{ serverMessage() }}</p>
              <button class="btn btn--outline" type="button" (click)="reset()">Send another enquiry</button>
            </div>
          } @else {
            <h3>Get a Free Consultation</h3>
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <div class="form-grid">
                <div class="field" [class.invalid]="showError('name')">
                  <label for="name">Full name *</label>
                  <input id="name" formControlName="name" autocomplete="name" placeholder="Your name" />
                  @if (showError('name')) { <span class="error">{{ errorText('name', 'Please enter your name.') }}</span> }
                </div>
                <div class="field" [class.invalid]="showError('phone')">
                  <label for="phone">Mobile number *</label>
                  <input id="phone" formControlName="phone" type="tel" autocomplete="tel" placeholder="98765 43210" />
                  @if (showError('phone')) { <span class="error">{{ errorText('phone', 'Enter a valid 10-digit mobile number.') }}</span> }
                </div>
                <div class="field" [class.invalid]="showError('email')">
                  <label for="email">Email *</label>
                  <input id="email" formControlName="email" type="email" autocomplete="email" placeholder="you@business.com" />
                  @if (showError('email')) { <span class="error">{{ errorText('email', 'Enter a valid email address.') }}</span> }
                </div>
                <div class="field">
                  <label for="business">Business name</label>
                  <input id="business" formControlName="business" autocomplete="organization" placeholder="Your business" />
                </div>
                <div class="field" [class.invalid]="showError('service')">
                  <label for="service">Service needed *</label>
                  <select id="service" formControlName="service">
                    <option value="" disabled>Select a service</option>
                    @for (opt of serviceOptions(); track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                  @if (showError('service')) { <span class="error">{{ errorText('service', 'Please choose a service.') }}</span> }
                </div>
                <div class="field">
                  <label for="plan">Interested plan</label>
                  <select id="plan" formControlName="plan">
                    <option value="">Select a plan</option>
                    @for (p of planOptions(); track p) {
                      <option [value]="p">{{ p }}</option>
                    }
                  </select>
                </div>
                <div class="field full">
                  <label for="message">Tell us about your goals</label>
                  <textarea id="message" formControlName="message" rows="4" placeholder="E.g. I want more enquiries for my clinic from Instagram…"></textarea>
                </div>
                <div class="honeypot" aria-hidden="true">
                  <label for="website">Website</label>
                  <input id="website" formControlName="website" tabindex="-1" autocomplete="off" />
                </div>
                @if (status() === 'error') {
                  <div class="alert alert--error full">{{ serverMessage() }}</div>
                }
                <div class="full">
                  <button class="btn btn--primary btn--block" type="submit" [disabled]="status() === 'sending'">
                    {{ status() === 'sending' ? 'Sending…' : 'Get My Free Strategy' }}
                    <app-icon name="arrow" [size]="18" />
                  </button>
                  <p class="privacy"><app-icon name="shield" [size]="14" /> Your details are 100% safe. We never spam.</p>
                </div>
              </div>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; gap: 48px; }
    @media (min-width: 992px) { .layout { grid-template-columns: 0.85fr 1.15fr; gap: 64px; align-items: start; } }
    .info h2 { font-size: clamp(1.75rem, 3.5vw, 2.5rem); }
    .info p { color: var(--muted); font-size: 1.05rem; }
    .channels { display: grid; gap: 18px; margin-top: 32px; }
    .channels li { display: flex; align-items: center; gap: 16px; font-weight: 600; }
    .channels small { display: block; font-weight: 500; color: var(--muted); font-size: 0.8rem; }
    .channels a { color: var(--ink); }
    .ic {
      width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0;
      background: rgba(216, 174, 98, 0.12); color: var(--gold); border: 1px solid rgba(216, 174, 98, 0.3);
    }
    .ic.wa { background: #e3f9eb; color: #128c4a; }
    .form-card { border-radius: 24px; border-top: 4px solid var(--gold); padding: 36px 28px; box-shadow: var(--shadow-lg); position: relative; }
    @media (min-width: 640px) { .form-card { padding: 44px 40px; } }
    .form-card h3 { font-size: 1.4rem; margin-bottom: 24px; }
    .privacy { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 12px 0 0; font-size: 0.82rem; color: var(--muted); }
    .done { text-align: center; padding: 40px 0; }
    .done p { color: var(--muted); }
    .ic.big { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; background: #e7f8ee; color: var(--success); }
  `,
})
export class ContactSection {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  protected readonly site = SITE;
  protected readonly whatsapp = whatsappLink();
  protected readonly status = signal<Status>('idle');
  protected readonly serverMessage = signal('');

  private readonly services = toSignal(this.api.services$, { initialValue: [] });
  private readonly packages = toSignal(this.api.packages$, { initialValue: [] });
  private readonly preselectedService = this.route.snapshot.queryParamMap.get('service') ?? '';
  private readonly preselectedPlan = this.route.snapshot.queryParamMap.get('plan') ?? '';

  protected readonly serviceOptions = computed(() => [
    ...this.services().map((s) => s.title),
    'Complete Digital Marketing',
    'Other',
  ]);

  protected readonly planOptions = computed(() => [
    ...this.packages().map((p) => `${p.label} – ${p.name}`),
    'Both plans',
    'Not sure yet',
  ]);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+?91|0)?[\s-]?[6-9]\d{4}[\s-]?\d{5}$/)]],
    email: ['', [Validators.required, Validators.email]],
    business: [''],
    service: [this.preselectedService || (this.preselectedPlan ? 'Complete Digital Marketing' : ''), Validators.required],
    plan: [this.preselectedPlan],
    message: ['', Validators.maxLength(2000)],
    website: [''],
  });

  protected showError(name: keyof ContactRequest): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected errorText(name: keyof ContactRequest, fallback: string): string {
    return this.form.controls[name].getError('server') ?? fallback;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    this.api.submitContact(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.serverMessage.set(res.message);
        this.status.set('success');
      },
      error: (err: HttpErrorResponse) => {
        const fields: Record<string, string> = err.error?.fields ?? {};
        for (const [key, msg] of Object.entries(fields)) {
          const control = this.form.get(key);
          control?.setErrors({ server: msg });
          control?.markAsTouched();
        }
        this.serverMessage.set(err.error?.error ?? `Could not send your enquiry. Please call ${SITE.phoneDisplay} or WhatsApp us.`);
        this.status.set('error');
      },
    });
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
