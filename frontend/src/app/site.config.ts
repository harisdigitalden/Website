// Business details shown across the site. The email is still a placeholder —
// replace it with your real address.
export const SITE = {
  name: "Hari's Digital Den",
  tagline: 'Brand | Content | Growth',
  phoneDisplay: '+91 93931 41224',
  phoneHref: 'tel:+919393141224',
  whatsappNumber: '919393141224',
  email: 'harisdigitalden@gmail.com',
  address: 'Andhra Pradesh & Telangana — expanding all over India',
  hours: 'Mon – Sat, 10:00 AM – 7:00 PM',
  social: [
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/harisdigitalden/' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/profile.php?id=61595347683871' },
    { name: 'X (Twitter)', icon: 'x', url: 'https://x.com/harisdigitalden' },
    { name: 'Threads', icon: 'threads', url: 'https://www.threads.com/@harisdigitalden' },
  ],
};

export function whatsappLink(text = "Hi Hari's Digital Den, I would like to know more about your services."): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
