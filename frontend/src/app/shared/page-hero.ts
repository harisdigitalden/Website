import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container fade-up">
        <div class="breadcrumb"><a routerLink="/">Home</a> / {{ crumb() }}</div>
        <h1>{{ heading() }}</h1>
        <p>{{ subtitle() }}</p>
      </div>
    </section>
  `,
})
export class PageHero {
  readonly heading = input.required<string>();
  readonly subtitle = input('');
  readonly crumb = input.required<string>();
}
