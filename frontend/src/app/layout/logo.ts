import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" class="logo" aria-label="Hari's Digital Den home">
      <img
        [src]="full() ? 'images/logo-full.png' : 'images/logo.png'"
        alt="Hari's Digital Den — Brand | Content | Growth"
        [style.height.px]="height()"
      />
    </a>
  `,
  styles: `
    .logo { display: inline-flex; }
    img { width: auto; max-width: 46vw; object-fit: contain; }
  `,
})
export class Logo {
  /** Full version includes the row of social media icons. */
  readonly full = input(false);
  readonly height = input(64);
}
