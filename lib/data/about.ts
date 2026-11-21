import type { Locale } from '@/lib/config/site';
import type { AuthorSocialLink, LocalizedText } from '@/lib/data/blog';

export interface StudioProfile {
  readonly paragraph: LocalizedText;
}

export interface StudioMember {
  readonly id: string;
  readonly name: LocalizedText;
  readonly role: LocalizedText;
  readonly bio?: LocalizedText;
  readonly portrait: string;
  readonly portraitAlt: LocalizedText;
  readonly socials: readonly AuthorSocialLink[];
}

export interface PreviousTeamMember {
  readonly id: string;
  readonly name: LocalizedText;
  readonly role: LocalizedText;
  readonly tenure: string;
  readonly portrait: string;
  readonly portraitAlt: LocalizedText;
}

export const STUDIO_PROFILE: StudioProfile = {
  paragraph: {
    en: 'Rasman is an independent architectural and spatial research practice founded in 2018 between Tehran and Zurich. Dedicated to passive environmental design, vernacular materiality, and quiet tectonic restraint, every commission—from residential courtyards in arid plateaus to cultural pavilions built of compacted earth and precision timber—begins by reading site wind, solar altitude, and local craft before drawing a single structural line.',
    fa: 'رسمان یک استودیوی مستقل معماری و پژوهش فضایی است که در سال ۱۳۹۷ میان تهران و زوریخ بنیان نهاده شد. تمرکز این استودیو بر طراحی اقلیمی غیرفعال، مصالح بومی و خویشتن‌داری تکتونیک است؛ از حیاط‌های مسکونی در فلات‌های خشک تا پاویون‌های فرهنگی با خاک کوبیده و چوب مهندسی‌شده، هر پروژه پیش از کشیدن نخستین خط با خوانش باد، زاویه خورشید و مهارت ساخت بومی آغاز می‌شود.',
  },
} as const;

export const STUDIO_FOUNDER: StudioMember = {
  id: 'dariush-rasman',
  name: {
    en: 'Dariush Rasman',
    fa: 'داریوش رسمان',
  },
  role: {
    en: 'Founder & Principal Architect',
    fa: 'بنیان‌گذار و معمار ارشد',
  },
  bio: {
    en: 'Founded Rasman Studio in 2018 after a decade of practice across Tehran and Basel. His work investigates thermal mass, shaded microclimates, and tactile tectonic assemblies that age with quiet dignity.',
    fa: 'استودیو رسمان را در سال ۱۳۹۷ پس از یک دهه فعالیت حرفه‌ای در تهران و بازل بنیان نهاد. پژوهش و آثار او بر جرم حرارتی، خرداقلیم‌های سایه‌دار و اتصالات ملموس معماری متمرکز است.',
  },
  portrait: '/images/team/dariush-rasman.jpg',
  portraitAlt: {
    en: 'Portrait of Dariush Rasman, Founder and Principal Architect',
    fa: 'پرتره داریوش رسمان، بنیان‌گذار و معمار ارشد رسمان',
  },
  socials: [
    { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
    { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    { platform: 'x', href: 'https://x.com/rasmanstudio' },
    { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
  ],
} as const;

export const CORE_TEAM_MEMBERS: readonly StudioMember[] = [
  {
    id: 'sara-farahmand',
    name: { en: 'Sara Farahmand', fa: 'سارا فرهمند' },
    role: { en: 'Partner & Materials Lead', fa: 'شریک و سرپرست پژوهش مصالح' },
    portrait: '/images/team/sara-farahmand.jpg',
    portraitAlt: {
      en: 'Portrait of Sara Farahmand, Partner and Materials Lead',
      fa: 'پرتره سارا فرهمند، شریک و سرپرست پژوهش مصالح',
    },
    socials: [
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
    ],
  },
  {
    id: 'navid-mansouri',
    name: { en: 'Navid Mansouri', fa: 'نوید منصوری' },
    role: { en: 'Senior Associate — Timber & Structure', fa: 'همکار ارشد — سازه‌های چوبی' },
    portrait: '/images/team/navid-mansouri.jpg',
    portraitAlt: {
      en: 'Portrait of Navid Mansouri, Timber and Structural Lead',
      fa: 'پرتره نوید منصوری، سرپرست سازه‌های چوبی',
    },
    socials: [
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
    ],
  },
  {
    id: 'mina-tavakoli',
    name: { en: 'Mina Tavakoli', fa: 'مینا توکلی' },
    role: { en: 'Lead Urban Architect', fa: 'معمار ارشد طراحی شهری' },
    portrait: '/images/team/mina-tavakoli.jpg',
    portraitAlt: {
      en: 'Portrait of Mina Tavakoli, Lead Urban Architect',
      fa: 'پرتره مینا توکلی، معمار ارشد طراحی شهری',
    },
    socials: [
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
      { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
    ],
  },
  {
    id: 'kian-sohrabi',
    name: { en: 'Kian Sohrabi', fa: 'کیان سهرابی' },
    role: { en: 'Project Architect — Detail & Craft', fa: 'معمار پروژه — جزئیات و اجرا' },
    portrait: '/images/team/kian-sohrabi.jpg',
    portraitAlt: {
      en: 'Portrait of Kian Sohrabi, Project Architect',
      fa: 'پرتره کیان سهرابی، معمار پروژه',
    },
    socials: [
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    ],
  },
  {
    id: 'tara-esfandiari',
    name: { en: 'Tara Esfandiari', fa: 'تارا اسفندیاری' },
    role: { en: 'Environmental & Daylight Analyst', fa: 'تحلیلگر اقلیم و نور روز' },
    portrait: '/images/team/tara-esfandiari.jpg',
    portraitAlt: {
      en: 'Portrait of Tara Esfandiari, Environmental Analyst',
      fa: 'پرتره تارا اسفندیاری، تحلیلگر اقلیم و نور روز',
    },
    socials: [
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
    ],
  },
] as const;

export const PREVIOUS_TEAM_MEMBERS: readonly PreviousTeamMember[] = [
  {
    id: 'prev-armin',
    name: { en: 'Armin Kazemi', fa: 'آرمین کاظمی' },
    role: { en: 'Senior Project Architect', fa: 'معمار ارشد پروژه' },
    tenure: '2019–2024',
    portrait: '/images/team/armin-kazemi.jpg',
    portraitAlt: { en: 'Portrait of Armin Kazemi', fa: 'پرتره آرمین کاظمی' },
  },
  {
    id: 'prev-niloofar',
    name: { en: 'Niloofar Bahrami', fa: 'نیلوفر بهرامی' },
    role: { en: 'Interior & Spatial Designer', fa: 'طراح داخلی و فضا' },
    tenure: '2020–2024',
    portrait: '/images/team/niloofar-bahrami.jpg',
    portraitAlt: { en: 'Portrait of Niloofar Bahrami', fa: 'پرتره نیلوفر بهرامی' },
  },
  {
    id: 'prev-parham',
    name: { en: 'Parham Shirazi', fa: 'پرهام شیرازی' },
    role: { en: 'Computational Designer', fa: 'طراح الگوریتمیک' },
    tenure: '2018–2023',
    portrait: '/images/team/parham-shirazi.jpg',
    portraitAlt: { en: 'Portrait of Parham Shirazi', fa: 'پرتره پرهام شیرازی' },
  },
  {
    id: 'prev-setareh',
    name: { en: 'Setareh Moradi', fa: 'ستاره مرادی' },
    role: { en: 'Landscape Architect', fa: 'معمار منظر' },
    tenure: '2021–2025',
    portrait: '/images/team/setareh-moradi.jpg',
    portraitAlt: { en: 'Portrait of Setareh Moradi', fa: 'پرتره ستاره مرادی' },
  },
  {
    id: 'prev-sina',
    name: { en: 'Sina Ghaffari', fa: 'سینا غفاری' },
    role: { en: 'BIM & Technical Coordinator', fa: 'هماهنگ‌کننده فنی و BIM' },
    tenure: '2019–2022',
    portrait: '/images/team/sina-ghaffari.jpg',
    portraitAlt: { en: 'Portrait of Sina Ghaffari', fa: 'پرتره سینا غفاری' },
  },
  {
    id: 'prev-hasti',
    name: { en: 'Hasti Niknam', fa: 'هستی نیکنام' },
    role: { en: 'Architectural Researcher', fa: 'پژوهشگر معماری' },
    tenure: '2022–2025',
    portrait: '/images/team/hasti-niknam.jpg',
    portraitAlt: { en: 'Portrait of Hasti Niknam', fa: 'پرتره هستی نیکنام' },
  },
] as const;

export function getAboutLocalizedText(
  text: LocalizedText,
  locale: Locale
): string {
  return text[locale] ?? text.en;
}
