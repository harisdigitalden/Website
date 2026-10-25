import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../core/api.service';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-faq',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container narrow">
        <div class="section-head">
          <span class="eyebrow">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know before getting started.</p>
        </div>
        <div class="list">
          @for (f of faqs(); track f.question; let i = $index) {
            <div class="item" [class.open]="open() === i">
              <button type="button" [attr.aria-expanded]="open() === i" (click)="toggle(i)">
                <span>{{ f.question }}</span>
                <app-icon name="chevron" [size]="20" />
              </button>
              <div class="answer"><p>{{ f.answer }}</p></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .narrow { max-width: 860px; }
    .list { display: grid; gap: 14px; }
    .item { border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--charcoal); overflow: hidden; }
    .item.open { border-color: var(--primary); box-shadow: var(--shadow); }
    button {
      width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 20px 22px; border: 0; background: none; cursor: pointer; text-align: left;
      font: 600 1rem var(--font-head); color: var(--ink);
    }
    button app-icon { transition: transform 0.25s; color: var(--primary); flex-shrink: 0; }
    .open button app-icon { transform: rotate(180deg); }
    .answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s; }
    .answer p { overflow: hidden; margin: 0; padding: 0 22px; color: var(--muted); }
    .open .answer { grid-template-rows: 1fr; }
    .open .answer p { padding-bottom: 20px; }
  `,
})
export class Faq {
  private readonly api = inject(ApiService);
  protected readonly faqs = toSignal(this.api.faqs$, { initialValue: [] });
  protected readonly open = signal<number | null>(0);

  protected toggle(i: number): void {
    this.open.update((cur) => (cur === i ? null : i));
  }
}
