import type { Locale } from '@/lib/config/site';

export interface LocalizedContactText {
  readonly en: string;
  readonly fa: string;
  readonly ar?: string;
}

export type ContactSocialPlatform = 'instagram' | 'linkedin' | 'x';

export interface ContactSocialLink {
  readonly platform: ContactSocialPlatform;
  readonly href: string;
}

export interface StudioContactConfig {
  readonly artworkSrc: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailHref: string;
  readonly address: LocalizedContactText;
  readonly mapsHref: string;
  readonly socials: readonly ContactSocialLink[];
}

export const STUDIO_CONTACT: StudioContactConfig = {
  artworkSrc: '/assets/aistudio/Paper_airplane_flying_over_rock_cd6bb293_2K_7e20e6ca.jpg',
  phoneDisplay: '+98 21 9028 4598',
  phoneHref: 'tel:+982190284598',
  email: 'studio@rasman.ir',
  emailHref: 'mailto:studio@rasman.ir',
  address: {
    en: 'Tehran, Motahari St., No. 55',
    fa: 'تهران، خیابان مطهری، پلاک ۵۵',
    ar: 'طهران، شارع مطهري، رقم ٥٥',
  },
  mapsHref: 'https://maps.google.com/?q=Motahari+St+55+Tehran',
  socials: [
    { platform: 'instagram', href: 'https://instagram.com' },
    { platform: 'linkedin', href: 'https://linkedin.com' },
    { platform: 'x', href: 'https://x.com' },
  ],
};

export function getContactLocalizedText(
  text: LocalizedContactText,
  locale: Locale
): string {
  return text[locale] ?? text.en;
}
