import type { Locale } from '@/lib/config/site';

export type PodcastCategoryId =
  | 'all'
  | 'sustainable'
  | 'urban'
  | 'acoustics'
  | 'materials'
  | 'research';

export interface LocalizedText {
  readonly en: string;
  readonly fa: string;
  readonly ar?: string;
}

export interface PodcastCategory {
  readonly id: PodcastCategoryId;
  readonly label: LocalizedText;
}

export interface PodcastPlatformLinks {
  readonly castbox: string;
  readonly spotify: string;
  readonly youtube: string;
}

export interface PodcastEpisode {
  readonly id: string;
  readonly episodeCode: string;
  readonly categoryId: Exclude<PodcastCategoryId, 'all'>;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly description: LocalizedText;
  readonly speakers: LocalizedText;
  readonly publishedAt: string;
  readonly durationSeconds: number;
  readonly durationLabel: string;
  readonly initialLikes: number;
  readonly coverImage: string;
  readonly coverAlt: LocalizedText;
  readonly waveform: readonly number[];
  readonly frequencyHz: number;
  readonly platforms: PodcastPlatformLinks;
}

/** Deterministic architectural waveform generator (pure, SSR-safe, zero randomness) */
function buildWaveform(seed: number, count = 72): readonly number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const waveA = Math.abs(Math.sin((i + seed * 3) * 0.42));
    const waveB = Math.abs(Math.cos((i * 1.15 + seed * 7) * 0.27));
    const accent = i % 9 === seed % 4 ? 0.32 : 0;
    const height = Math.min(1, Math.max(0.14, waveA * 0.55 + waveB * 0.35 + accent));
    bars.push(Number(height.toFixed(2)));
  }
  return bars;
}

export const PODCAST_CATEGORIES: readonly PodcastCategory[] = [
  {
    id: 'all',
    label: { en: 'All Episodes', fa: 'همه اپیزودها', ar: 'جميع الحلقات' },
  },
  {
    id: 'sustainable',
    label: {
      en: 'Sustainable Architecture',
      fa: 'معماری پایدار',
      ar: 'العمارة المستدامة',
    },
  },
  {
    id: 'urban',
    label: {
      en: 'Urban Architecture',
      fa: 'معماری شهری',
      ar: 'العمارة الحضرية',
    },
  },
  {
    id: 'acoustics',
    label: {
      en: 'Acoustic Spaces',
      fa: 'فضاهای آکوستیک',
      ar: 'الفضاءات الصوتية',
    },
  },
  {
    id: 'materials',
    label: {
      en: 'Vernacular Materials',
      fa: 'مصالح بوم‌آورد',
      ar: 'المواد المحلية',
    },
  },
  {
    id: 'research',
    label: {
      en: 'Spatial Research',
      fa: 'پژوهش فضایی',
      ar: 'البحث المكاني',
    },
  },
] as const;

export const PODCAST_EPISODES: readonly PodcastEpisode[] = [
  {
    id: 'ep-01-compacted-earth',
    episodeCode: 'EP 01',
    categoryId: 'acoustics',
    title: {
      en: 'Ep 01: Acoustic Calm Inside Compacted Earth Galleries',
      fa: 'اپیزود ۰۱: آرامش آکوستیک در گالری‌های خاک کوبیده',
    },
    subtitle: {
      en: 'Thermal mass, reverberation & stillness',
      fa: 'جرم حرارتی، بازتاب صدا و سکوت فضایی',
    },
    description: {
      en: 'An intimate field conversation on how rammed-earth walls absorb harsh urban frequencies, regulate seasonal humidity, and choreograph serene gallery thresholds without synthetic acoustic panels.',
      fa: 'گفت‌وگویی میدانی درباره اینکه دیوارهای خاک کوبیده چگونه فرکانس‌های مزاحم شهری را جذب می‌کنند، رطوبت فصلی را متعادل می‌سازند و بدون پنل‌های مصنوعی، آرامش آکوستیک خلق می‌کنند.',
    },
    speakers: {
      en: 'Amirhossein Kiani, Sara Rahimi',
      fa: 'امیرحسین کیانی، سارا رحیمی',
    },
    publishedAt: '2026-11-04',
    durationSeconds: 2200,
    durationLabel: '36:40',
    initialLikes: 34,
    coverImage: '/images/podcast/ep-01-earth-gallery.jpg',
    coverAlt: {
      en: 'Minimalist rammed-earth gallery wall washed in soft natural daylight',
      fa: 'دیوار گالری خاک کوبیده با نور طبیعی ملایم',
    },
    waveform: buildWaveform(1),
    frequencyHz: 196,
    platforms: {
      castbox: '#castbox-ep-01',
      spotify: '#spotify-ep-01',
      youtube: '#youtube-ep-01',
    },
  },
  {
    id: 'ep-02-passive-courtyards',
    episodeCode: 'EP 02',
    categoryId: 'sustainable',
    title: {
      en: 'Ep 02: Daylight Geometry in Contemporary Brick Courtyards',
      fa: 'اپیزود ۰۲: هندسه نور روز در حیاط‌های آجری معاصر',
    },
    subtitle: {
      en: 'Microclimates & shadow choreography',
      fa: 'اقلیم خُرد و حرکت سایه در حیاط مرکزی',
    },
    description: {
      en: 'Exploring passive cooling geometry across arid plateau residences, where perforated brick screens filter zenith sunlight and cut summer cooling loads by nearly half.',
      fa: 'بررسی هندسه سرمایش غیرفعال در خانه‌های فلات مرکزی؛ جایی که جداره‌های آجری مشبک نور عمودی را پالایش کرده و بار سرمایشی تابستان را به‌طور چشمگیری کاهش می‌دهند.',
    },
    speakers: {
      en: 'Navid Mansouri, Parisa Nouri',
      fa: 'نوید منصوری، پریسا نوری',
    },
    publishedAt: '2026-10-21',
    durationSeconds: 2535,
    durationLabel: '42:15',
    initialLikes: 48,
    coverImage: '/images/podcast/ep-02-brick-courtyard.jpg',
    coverAlt: {
      en: 'Architectural courtyard casting sharp geometric daylight shadows across brickwork',
      fa: 'حیاط معماری با سایه‌های هندسی نور روز روی جداره آجری',
    },
    waveform: buildWaveform(2),
    frequencyHz: 220,
    platforms: {
      castbox: '#castbox-ep-02',
      spotify: '#spotify-ep-02',
      youtube: '#youtube-ep-02',
    },
  },
  {
    id: 'ep-03-walkable-fabric',
    episodeCode: 'EP 03',
    categoryId: 'urban',
    title: {
      en: 'Ep 03: Stitching Historic Alleyways Back Into the Active City',
      fa: 'اپیزود ۰۳: پیوند دوباره کوچه‌های بافت تاریخی به شهر زنده',
    },
    subtitle: {
      en: 'Urban regeneration & pedestrian scale',
      fa: 'بازآفرینی شهری و مقیاس پیاده‌محور',
    },
    description: {
      en: 'Urban designers and conservation engineers unpack low-intervention strategies for revitalizing historic quarters while preserving neighborhood identity and everyday walkability.',
      fa: 'طراحان شهری و مهندسان مرمت راهکارهای کم‌مداخله برای احیای محله‌های تاریخی را با حفظ هویت بومی و پیاده‌مداری روزمره تحلیل می‌کنند.',
    },
    speakers: {
      en: 'Kaveh Farhadi, Mina Tavakoli',
      fa: 'کاوه فرهادی، مینا توکلی',
    },
    publishedAt: '2026-10-08',
    durationSeconds: 1890,
    durationLabel: '31:30',
    initialLikes: 29,
    coverImage: '/images/podcast/ep-03-urban-alley.jpg',
    coverAlt: {
      en: 'Minimalist pedestrian urban passage framed by warm masonry elevations',
      fa: 'گذرگاه پیاده‌محور شهری با جداره‌های بنایی',
    },
    waveform: buildWaveform(3),
    frequencyHz: 246.94,
    platforms: {
      castbox: '#castbox-ep-03',
      spotify: '#spotify-ep-03',
      youtube: '#youtube-ep-03',
    },
  },
  {
    id: 'ep-04-timber-tectonics',
    episodeCode: 'EP 04',
    categoryId: 'materials',
    title: {
      en: 'Ep 04: Reclaiming Local Timber & Lime Plaster in Eco-Lodges',
      fa: 'اپیزود ۰۴: بازگشت چوب بومی و اندود آهک در اقامتگاه‌های بوم‌گردی',
    },
    subtitle: {
      en: 'Low-carbon joinery & breathable envelopes',
      fa: 'اتصالات کم‌کربن و پوسته‌های تنفس‌پذیر',
    },
    description: {
      en: 'From northern forest stewardship to breathable lime renders, we trace the full supply chain of zero-waste modular eco-tourism structures built in collaboration with local artisans.',
      fa: 'از بهره‌برداری مسئولانه از چوب تا اندودهای تنفس‌پذیر آهک؛ زنجیره ساخت سازه‌های مدولار کم‌اثر برای بوم‌گردی را با همراهی استادکاران محلی بررسی می‌کنیم.',
    },
    speakers: {
      en: 'Sina Bahrami, Hoda Kazemi',
      fa: 'سینا بهرامی، هدی کاظمی',
    },
    publishedAt: '2026-09-24',
    durationSeconds: 2345,
    durationLabel: '39:05',
    initialLikes: 41,
    coverImage: '/images/podcast/ep-04-timber-joinery.jpg',
    coverAlt: {
      en: 'Minimal architectural timber joinery detail in balanced studio light',
      fa: 'جزئیات اتصال چوبی معماری در نور متعادل',
    },
    waveform: buildWaveform(4),
    frequencyHz: 261.63,
    platforms: {
      castbox: '#castbox-ep-04',
      spotify: '#spotify-ep-04',
      youtube: '#youtube-ep-04',
    },
  },
  {
    id: 'ep-05-water-landscapes',
    episodeCode: 'EP 05',
    categoryId: 'research',
    title: {
      en: 'Ep 05: Qanat Hydraulics & Contemporary Regenerative Landscapes',
      fa: 'اپیزود ۰۵: هیدرولیک قنات و منظرهای احیاگر معاصر',
    },
    subtitle: {
      en: 'Water-sensitive masterplanning',
      fa: 'طراحی جامع حساس به آب و اقلیم',
    },
    description: {
      en: 'How centuries-old subterranean water channels inform modern rainwater harvesting, terraced public parks, and resilient regional tourism masterplans.',
      fa: 'چگونه کانال‌های زیرزمینی کهن الهام‌بخش جمع‌آوری آب باران، پارک‌های پلکانی عمومی و طرح‌های جامع گردشگری تاب‌آور در مقیاس منطقه‌ای می‌شوند.',
    },
    speakers: {
      en: 'Dr. Reza Shirazi, Tara Ebrahimi',
      fa: 'دکتر رضا شیرازی، تارا ابراهیمی',
    },
    publishedAt: '2026-09-10',
    durationSeconds: 2670,
    durationLabel: '44:30',
    initialLikes: 56,
    coverImage: '/images/podcast/ep-05-water-basin.jpg',
    coverAlt: {
      en: 'Calm architectural stone basin reflecting minimal concrete geometry',
      fa: 'حوض سنگی مینیمال با انعکاس هندسه معماری',
    },
    waveform: buildWaveform(5),
    frequencyHz: 293.66,
    platforms: {
      castbox: '#castbox-ep-05',
      spotify: '#spotify-ep-05',
      youtube: '#youtube-ep-05',
    },
  },
  {
    id: 'ep-06-portable-shelters',
    episodeCode: 'EP 06',
    categoryId: 'sustainable',
    title: {
      en: 'Ep 06: Designing Reversible Portable Shelters for Fragile Terrain',
      fa: 'اپیزود ۰۶: طراحی سازه‌های پرتابل برگشت‌پذیر برای بسترهای شکننده',
    },
    subtitle: {
      en: 'Zero-foundation footprints & mobility',
      fa: 'استقرار بدون فونداسیون و ردپای حداقلی',
    },
    description: {
      en: 'A structural deep-dive into dry-assembled cabins that touch sensitive alpine and desert terrain lightly, allowing entire sites to return to nature untouched.',
      fa: 'بررسی سازه‌ای کلبه‌های خشک‌چین که با کمترین تماس بر بسترهای حساس کوهستانی و کویری می‌نشینند و امکان بازگشت کامل زمین به طبیعت را فراهم می‌کنند.',
    },
    speakers: {
      en: 'Mehdi Salimi, Negar Azizi',
      fa: 'مهدی سلیمی، نگار عزیزی',
    },
    publishedAt: '2026-08-28',
    durationSeconds: 2050,
    durationLabel: '34:10',
    initialLikes: 37,
    coverImage: '/images/podcast/ep-06-modular-cabin.jpg',
    coverAlt: {
      en: 'Minimalist modular architectural pavilion resting lightly above natural terrain',
      fa: 'پاویون مدولار مینیمال مستقر بر بستر طبیعی',
    },
    waveform: buildWaveform(6),
    frequencyHz: 329.63,
    platforms: {
      castbox: '#castbox-ep-06',
      spotify: '#spotify-ep-06',
      youtube: '#youtube-ep-06',
    },
  },
] as const;

export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}

export function formatPlaybackTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
