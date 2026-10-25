export interface Service {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  features: string[];
  featured: boolean;
}

export interface FeatureGroup {
  title: string;
  icon: string;
  items: string[];
}

export interface Package {
  id: string;
  label: string;
  name: string;
  price: number;
  period: string;
  billing: string;
  tagline: string;
  groups: FeatureGroup[];
  notes: string[];
  popular: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number;
  initials: string;
}

export interface Brand {
  name: string;
  logo: string;
  url: string;
}

export interface InstagramPost {
  type: 'reel' | 'p';
  code: string;
  label?: string;
  emoji?: string;
  image?: string;
}

export interface Showcase {
  brand: string;
  handle: string;
  profile: string;
  logo: string;
  bio: string;
  posts: InstagramPost[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  plan: string;
  message: string;
  website: string; // honeypot
}

export interface ContactResponse {
  id: string;
  message: string;
}
