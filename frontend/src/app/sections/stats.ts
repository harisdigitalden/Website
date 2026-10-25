import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-stats',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats">
      <div class="container">
        <div class="band">
          @for (s of stats; track s.label) {
            <div class="stat">
              <app-icon [name]="s.icon" [size]="28" />
              <strong>{{ s.value }}</strong>
              <span>{{ s.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .stats { margin-top: -40px; position: relative; z-index: 2; background: linear-gradient(var(--obsidian) 0 40px, var(--obsidian) 40px); }
    .band {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; padding: 36px 24px;
      background: var(--navy); border: 1px solid rgba(216, 174, 98, 0.35); border-radius: 24px;
      box-shadow: var(--shadow-lg); color: #c9d0d6;
    }
    @media (min-width: 768px) { .band { grid-template-columns: repeat(4, 1fr); padding: 44px; } }
    .stat { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
    .stat app-icon { color: var(--accent); }
    strong { font: 800 clamp(1.8rem, 4vw, 2.5rem) var(--font-head); color: #fff; line-height: 1.1; }
    span { font-size: 0.92rem; }
  `,
})
export class Stats {
  protected readonly stats = [
    { icon: 'social', value: '7', label: 'Social Platforms We Manage' },
    { icon: 'clock', value: '4–5', label: 'Posts Every Week' },
    { icon: 'chart', value: 'Monthly', label: 'Performance Review' },
    { icon: 'location', value: 'AP & TS', label: 'Serving Andhra Pradesh & Telangana · Expanding all over India' },
  ];
}
