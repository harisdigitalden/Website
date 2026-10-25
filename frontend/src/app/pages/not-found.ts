import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container">
        <h1>404 — Page not found</h1>
        <p>The page you are looking for doesn't exist or has moved.</p>
        <p><a routerLink="/" class="btn btn--light">Back to home</a></p>
      </div>
    </section>
  `,
  styles: `.btn { margin-top: 24px; }`,
})
export class NotFound {}
