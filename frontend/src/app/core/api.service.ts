import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { Brand, ContactRequest, ContactResponse, Faq, Package, Service, Showcase, Testimonial } from './models';

// Talks to the Go backend. In development, /api is proxied to
// http://localhost:8080 (see proxy.conf.json).
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  readonly services$ = this.cached<Service[]>('/api/services');
  readonly packages$ = this.cached<Package[]>('/api/packages');
  readonly testimonials$ = this.cached<Testimonial[]>('/api/testimonials');
  readonly faqs$ = this.cached<Faq[]>('/api/faqs');
  readonly brands$ = this.cached<Brand[]>('/api/brands');
  readonly showcase$ = this.cached<Showcase[]>('/api/showcase');

  submitContact(body: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>('/api/contact', body);
  }

  private cached<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError((err) => {
        console.error(`GET ${url} failed — is the Go backend running?`, err);
        return of([] as T);
      }),
      shareReplay(1),
    );
  }
}
