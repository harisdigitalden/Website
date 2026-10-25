import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--dark">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">How we work</span>
          <h2>A Simple 4-Step Process to Grow Your Brand</h2>
          <p>No jargon, no confusion. Here's exactly how we take your business from idea to results.</p>
        </div>
        <ol class="steps">
          @for (step of steps; track step.title; let i = $index) {
            <li>
              <span class="num">0{{ i + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 24px; counter-reset: s; }
    @media (min-width: 640px) { .steps { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 992px) { .steps { grid-template-columns: repeat(4, 1fr); } }
    li {
      position: relative; padding: 32px 26px; border-radius: var(--radius);
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
      transition: background 0.25s, transform 0.25s;
    }
    li:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-4px); }
    .num {
      display: inline-block; font: 800 2.4rem var(--font-head); line-height: 1; margin-bottom: 16px;
      background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    h3 { font-size: 1.15rem; }
    p { margin: 0; color: #aeb6bd; font-size: 0.95rem; }
  `,
})
export class Process {
  protected readonly steps = [
    { title: 'Free Consultation', text: 'We understand your business, audience and goals on a quick call or WhatsApp chat.' },
    { title: 'Strategy & Plan', text: 'You get a clear plan with content ideas, ad strategy, timelines and fixed pricing.' },
    { title: 'Create & Launch', text: 'Our team designs your website, creatives and Reels, then launches your campaigns.' },
    { title: 'Optimise & Grow', text: 'We track results weekly, cut what doesn’t work and scale what does.' },
  ];
}
