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
  readonly title: LocalizedText;
  readonly publishedAt: string;
  readonly durationSeconds: number;
  readonly durationLabel: string;
  readonly waveform: readonly number[];
  readonly frequencyHz: number;
}

export interface PodcastShow {
  readonly id: string;
  readonly categoryId: Exclude<PodcastCategoryId, 'all'>;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly description: LocalizedText;
  readonly speakers: LocalizedText;
  readonly totalDurationLabel: string;
  readonly coverImage: string;
  readonly coverAlt: LocalizedText;
  readonly platforms: PodcastPlatformLinks;
  readonly episodes: readonly PodcastEpisode[];
}

/** Deterministic architectural waveform generator (pure, SSR-safe, zero randomness) */
function buildWaveform(seed: number, count = 72): readonly number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const waveA = Math.abs(Math.sin((i + seed * 3) * 0.42));
    const waveB = Math.abs(Math.cos((i * 1.15 + seed * 7) * 0.27));
    const accent = i % 9 === seed % 4 ? 0.32 : 0;
    const height = Math.min(
      1,
      Math.max(0.14, waveA * 0.55 + waveB * 0.35 + accent)
    );
    bars.push(Number(height.toFixed(2)));
  }
  return bars;
}

export const PODCAST_CATEGORIES: readonly PodcastCategory[] = [
  {
    id: 'all',
    label: { en: 'All Podcasts', fa: 'همه پادکست‌ها', ar: 'جميع البودكاستات' },
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

export const PODCAST_SHOWS: readonly PodcastShow[] = [
  {
    id: 'podcast-compacted-earth',
    categoryId: 'acoustics',
    title: {
      en: 'Earth & Acoustic Stillness',
      fa: 'خاک و سکوت آکوستیک',
      ar: 'التراب والسكون الصوتي',
    },
    subtitle: {
      en: 'Thermal mass, reverberation & calm thresholds',
      fa: 'جرم حرارتی، بازتاب صدا و آرامش فضایی',
      ar: 'الكتلة الحرارية والصدى والهدوء المكاني',
    },
    description: {
      en: 'An intimate architectural podcast series exploring how compacted-earth walls absorb harsh urban frequencies, regulate seasonal humidity, and choreograph serene gallery thresholds without synthetic acoustic panels.',
      fa: 'مجموعه پادکستی میدانی درباره اینکه دیوارهای خاک کوبیده چگونه فرکانس‌های مزاحم شهری را جذب می‌کنند، رطوبت فصلی را متعادل می‌سازند و بدون پنل‌های مصنوعی، آرامش آکوستیک خلق می‌کنند.',
      ar: 'سلسلة بودكاست معمارية ميدانية تستكشف كيف تمتص جدران التراب المدكوك ضوضاء المدينة وتوازن الرطوبة الموسمية وتصنع سكوناً صوتياً طبيعياً.',
    },
    speakers: {
      en: 'Amirhossein Kiani, Sara Rahimi',
      fa: 'امیرحسین کیانی، سارا رحیمی',
      ar: 'أميرحسين كياني، سارة رحيمي',
    },
    totalDurationLabel: '2h 18m',
    coverImage: '/images/podcast/ep-01-earth-gallery.jpg',
    coverAlt: {
      en: 'Minimalist rammed-earth gallery wall washed in soft natural daylight',
      fa: 'دیوار گالری خاک کوبیده با نور طبیعی ملایم',
      ar: 'جدار معرض من التراب المدكوك في ضوء النهار الطبيعي',
    },
    platforms: {
      castbox: '#castbox-earth-acoustics',
      spotify: '#spotify-earth-acoustics',
      youtube: '#youtube-earth-acoustics',
    },
    episodes: [
      {
        id: 'earth-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Compacted Earth as a Natural Sound Absorber',
          fa: 'اپیزود ۰۱: خاک کوبیده به‌عنوان جاذب طبیعی صدا',
          ar: 'الحلقة ٠١: التراب المدكوك كعازل صوتي طبيعي',
        },
        publishedAt: '2026-11-04',
        durationSeconds: 2200,
        durationLabel: '36:40',
        waveform: buildWaveform(1),
        frequencyHz: 196,
      },
      {
        id: 'earth-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Measuring Reverberation in Museum Thresholds',
          fa: 'اپیزود ۰۲: اندازه‌گیری بازتاب صدا در آستانه گالری‌ها',
          ar: 'الحلقة ٠٢: قياس الصدى في عتبات المعارض',
        },
        publishedAt: '2026-10-28',
        durationSeconds: 1980,
        durationLabel: '33:00',
        waveform: buildWaveform(11),
        frequencyHz: 207.65,
      },
      {
        id: 'earth-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Mineral Plasters & Breathable Indoor Humidity',
          fa: 'اپیزود ۰۳: اندودهای معدنی و تنظیم رطوبت داخلی',
          ar: 'الحلقة ٠٣: الطلاءات المعدنية وتوازن الرطوبة الداخلية',
        },
        publishedAt: '2026-10-19',
        durationSeconds: 2115,
        durationLabel: '35:15',
        waveform: buildWaveform(21),
        frequencyHz: 220,
      },
      {
        id: 'earth-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Designing Quiet Rooms Inside Dense Cities',
          fa: 'اپیزود ۰۴: طراحی فضاهای آرام در دل شهرهای پرتراکم',
          ar: 'الحلقة ٠٤: تصميم غرف هادئة وسط المدن المزدحمة',
        },
        publishedAt: '2026-10-10',
        durationSeconds: 1990,
        durationLabel: '33:10',
        waveform: buildWaveform(31),
        frequencyHz: 233.08,
      },
    ],
  },
  {
    id: 'podcast-passive-courtyards',
    categoryId: 'sustainable',
    title: {
      en: 'Daylight & Courtyard Geometry',
      fa: 'هندسه نور روز و حیاط مرکزی',
      ar: 'هندسة الضوء والفناء المركزي',
    },
    subtitle: {
      en: 'Microclimates & shadow choreography',
      fa: 'اقلیم خُرد و حرکت سایه در حیاط مرکزی',
      ar: 'المناخ المحلي وحركة الظلال في الفناء',
    },
    description: {
      en: 'A dedicated podcast on passive cooling geometry across arid plateau residences, examining how perforated brick screens filter zenith sunlight and cut summer cooling loads in half.',
      fa: 'پادکستی تخصصی درباره هندسه سرمایش غیرفعال در خانه‌های فلات مرکزی؛ بررسی اینکه چگونه جداره‌های آجری مشبک نور عمودی را پالایش کرده و بار سرمایشی تابستان را کاهش می‌دهند.',
      ar: 'بودكاست متخصص في هندسة التبريد السلبي لمنازل الهضبة الجافة وكيف تخفف الجدران الطوبية المثقبة من حرارة الصيف.',
    },
    speakers: {
      en: 'Navid Mansouri, Parisa Nouri',
      fa: 'نوید منصوری، پریسا نوری',
      ar: 'نويد منصوري، بريسا نوري',
    },
    totalDurationLabel: '2h 34m',
    coverImage: '/images/podcast/ep-02-brick-courtyard.jpg',
    coverAlt: {
      en: 'Architectural courtyard casting sharp geometric daylight shadows across brickwork',
      fa: 'حیاط معماری با سایه‌های هندسی نور روز روی جداره آجری',
      ar: 'فناء معماري بظلال هندسية حادة على الجدران الطوبية',
    },
    platforms: {
      castbox: '#castbox-courtyards',
      spotify: '#spotify-courtyards',
      youtube: '#youtube-courtyards',
    },
    episodes: [
      {
        id: 'courtyard-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Shadow Ratios in Contemporary Brick Courtyards',
          fa: 'اپیزود ۰۱: نسبت سایه‌اندازی در حیاط‌های آجری معاصر',
          ar: 'الحلقة ٠١: نسب الظل في الأفنية الطوبية المعاصرة',
        },
        publishedAt: '2026-10-21',
        durationSeconds: 2535,
        durationLabel: '42:15',
        waveform: buildWaveform(2),
        frequencyHz: 220,
      },
      {
        id: 'courtyard-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Perforated Masonry & Cross-Ventilation',
          fa: 'اپیزود ۰۲: آجرچینی مشبک و کوران هوای طبیعی',
          ar: 'الحلقة ٠٢: البناء المثقب والتهوية المتقاطعة',
        },
        publishedAt: '2026-10-12',
        durationSeconds: 2290,
        durationLabel: '38:10',
        waveform: buildWaveform(12),
        frequencyHz: 233.08,
      },
      {
        id: 'courtyard-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Night-Flush Thermal Mass Strategies',
          fa: 'اپیزود ۰۳: راهکارهای خنک‌سازی شبانه جرم حرارتی',
          ar: 'الحلقة ٠٣: استراتيجيات التبريد الليلي للكتلة الحرارية',
        },
        publishedAt: '2026-10-03',
        durationSeconds: 2145,
        durationLabel: '35:45',
        waveform: buildWaveform(22),
        frequencyHz: 246.94,
      },
      {
        id: 'courtyard-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Reimagining the Persian Iwan for Urban Plots',
          fa: 'اپیزود ۰۴: بازآفرینی ایوان ایرانی در قطعات شهری امروز',
          ar: 'الحلقة ٠٤: إعادة تصور الإيوان في القطع الحضرية الحديثة',
        },
        publishedAt: '2026-09-25',
        durationSeconds: 2270,
        durationLabel: '37:50',
        waveform: buildWaveform(32),
        frequencyHz: 261.63,
      },
    ],
  },
  {
    id: 'podcast-walkable-fabric',
    categoryId: 'urban',
    title: {
      en: 'The Walkable Historic City',
      fa: 'شهر پیاده‌مدار و بافت تاریخی',
      ar: 'المدينة التاريخية الصالحة للمشي',
    },
    subtitle: {
      en: 'Urban regeneration & pedestrian scale',
      fa: 'بازآفرینی شهری و مقیاس پیاده‌محور',
      ar: 'التجديد الحضري ومقياس المشاة',
    },
    description: {
      en: 'Urban designers and conservation engineers unpack low-intervention strategies for stitching historic quarters back into living cities while protecting everyday pedestrian culture.',
      fa: 'گفت‌وگوی طراحان شهری و مهندسان مرمت درباره راهکارهای کم‌مداخله برای پیوند دوباره بافت‌های تاریخی به شهر زنده و حفظ فرهنگ پیاده‌مداری روزمره.',
      ar: 'مصممون حضريون ومهندسو ترميم يناقشون استراتيجيات منخفضة التدخل لإحياء الأحياء التاريخية وحماية ثقافة المشي.',
    },
    speakers: {
      en: 'Kaveh Farhadi, Mina Tavakoli',
      fa: 'کاوه فرهادی، مینا توکلی',
      ar: 'كاوه فرهادي، مينا توكلي',
    },
    totalDurationLabel: '2h 06m',
    coverImage: '/images/podcast/ep-03-urban-alley.jpg',
    coverAlt: {
      en: 'Minimalist pedestrian urban passage framed by warm masonry elevations',
      fa: 'گذرگاه پیاده‌محور شهری با جداره‌های بنایی',
      ar: 'ممر حضري للمشاة محاط بواجهات حجرية دافئة',
    },
    platforms: {
      castbox: '#castbox-walkable-city',
      spotify: '#spotify-walkable-city',
      youtube: '#youtube-walkable-city',
    },
    episodes: [
      {
        id: 'urban-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Stitching Historic Alleyways Into Active Districts',
          fa: 'اپیزود ۰۱: پیوند دوباره کوچه‌های تاریخی به محله‌های پویا',
          ar: 'الحلقة ٠١: ربط الأزقة التاريخية بالأحياء النابضة',
        },
        publishedAt: '2026-10-08',
        durationSeconds: 1890,
        durationLabel: '31:30',
        waveform: buildWaveform(3),
        frequencyHz: 246.94,
      },
      {
        id: 'urban-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Micro-Plazas & Shaded Street Seating',
          fa: 'اپیزود ۰۲: میدانچه‌های محلی و فضاهای مکث سایه‌دار',
          ar: 'الحلقة ٠٢: الساحات الصغيرة ومناطق الجلوس المظللة',
        },
        publishedAt: '2026-09-29',
        durationSeconds: 1965,
        durationLabel: '32:45',
        waveform: buildWaveform(13),
        frequencyHz: 261.63,
      },
      {
        id: 'urban-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Adaptive Reuse of Neighborhood Workshops',
          fa: 'اپیزود ۰۳: استفاده مجدد انطباقی از کارگاه‌های محلی',
          ar: 'الحلقة ٠٣: إعادة الاستخدام التكيفي للورش المحلية',
        },
        publishedAt: '2026-09-19',
        durationSeconds: 1840,
        durationLabel: '30:40',
        waveform: buildWaveform(23),
        frequencyHz: 277.18,
      },
      {
        id: 'urban-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Night Lighting Without Visual Clutter',
          fa: 'اپیزود ۰۴: نورپردازی شبانه گذرگاه‌ها بدون آشفتگی بصری',
          ar: 'الحلقة ٠٤: الإضاءة الليلية للممرات دون تلوث بصري',
        },
        publishedAt: '2026-09-11',
        durationSeconds: 1865,
        durationLabel: '31:05',
        waveform: buildWaveform(33),
        frequencyHz: 293.66,
      },
    ],
  },
  {
    id: 'podcast-timber-tectonics',
    categoryId: 'materials',
    title: {
      en: 'Vernacular Timber & Lime',
      fa: 'تکتونیک چوب و اندود آهک',
      ar: 'الخشب المحلي والجص الجيري',
    },
    subtitle: {
      en: 'Low-carbon joinery & breathable envelopes',
      fa: 'اتصالات کم‌کربن و پوسته‌های تنفس‌پذیر',
      ar: 'الوصلات منخفضة الكربون والأغلفة المتنفسة',
    },
    description: {
      en: 'From northern forest stewardship to breathable lime renders, this podcast traces zero-waste modular eco-tourism structures built in close partnership with regional artisans.',
      fa: 'از بهره‌برداری مسئولانه از چوب تا اندودهای تنفس‌پذیر آهک؛ این پادکست زنجیره ساخت سازه‌های مدولار کم‌اثر را با همراهی استادکاران محلی روایت می‌کند.',
      ar: 'من الإدارة المسؤولة للغابات إلى الجص الجيري المتنفس؛ يتتبع هذا البودكاست سلسلة بناء المنشآت البيئية مع الحرفيين المحليين.',
    },
    speakers: {
      en: 'Sina Bahrami, Hoda Kazemi',
      fa: 'سینا بهرامی، هدی کاظمی',
      ar: 'سينا بهرامي، هدى كاظمي',
    },
    totalDurationLabel: '2h 26m',
    coverImage: '/images/podcast/ep-04-timber-joinery.jpg',
    coverAlt: {
      en: 'Minimal architectural timber joinery detail in balanced studio light',
      fa: 'جزئیات اتصال چوبی معماری در نور متعادل',
      ar: 'تفاصيل وصلات خشبية معمارية في إضاءة متوازنة',
    },
    platforms: {
      castbox: '#castbox-timber-lime',
      spotify: '#spotify-timber-lime',
      youtube: '#youtube-timber-lime',
    },
    episodes: [
      {
        id: 'timber-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Reclaiming Regional Timber for Eco-Lodges',
          fa: 'اپیزود ۰۱: بازگشت چوب بومی در اقامتگاه‌های بوم‌گردی',
          ar: 'الحلقة ٠١: استعادة الخشب المحلي في النزل البيئية',
        },
        publishedAt: '2026-09-24',
        durationSeconds: 2345,
        durationLabel: '39:05',
        waveform: buildWaveform(4),
        frequencyHz: 261.63,
      },
      {
        id: 'timber-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Dry-Fit Timber Joinery Without Steel Plates',
          fa: 'اپیزود ۰۲: اتصالات خشک چوبی بدون صفحات فولادی',
          ar: 'الحلقة ٠٢: وصلات الخشب الجافة دون صفائح فولاذية',
        },
        publishedAt: '2026-09-14',
        durationSeconds: 2120,
        durationLabel: '35:20',
        waveform: buildWaveform(14),
        frequencyHz: 277.18,
      },
      {
        id: 'timber-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Slaked Lime Renders in Humid Coastal Climates',
          fa: 'اپیزود ۰۳: اندود آهک شکفته در اقلیم‌های مرطوب ساحلی',
          ar: 'الحلقة ٠٣: الجص الجيري في المناخات الساحلية الرطبة',
        },
        publishedAt: '2026-09-05',
        durationSeconds: 2210,
        durationLabel: '36:50',
        waveform: buildWaveform(24),
        frequencyHz: 293.66,
      },
      {
        id: 'timber-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Working Side-by-Side With Master Carpenters',
          fa: 'اپیزود ۰۴: همکاری مستقیم معماران و استادکاران نجار',
          ar: 'الحلقة ٠٤: العمل جنباً إلى جنب مع كبار النجارين',
        },
        publishedAt: '2026-08-26',
        durationSeconds: 2085,
        durationLabel: '34:45',
        waveform: buildWaveform(34),
        frequencyHz: 311.13,
      },
    ],
  },
  {
    id: 'podcast-water-landscapes',
    categoryId: 'research',
    title: {
      en: 'Qanat & Regenerative Water',
      fa: 'قنات و منظرهای احیاگر آب',
      ar: 'القناة والمناظر المائية المتجددة',
    },
    subtitle: {
      en: 'Water-sensitive masterplanning',
      fa: 'طراحی جامع حساس به آب و اقلیم',
      ar: 'التخطيط الشامل الحساس للمياه والمناخ',
    },
    description: {
      en: 'A research-driven podcast investigating how subterranean qanat hydraulics inspire modern rainwater harvesting, terraced public parks, and resilient regional landscapes.',
      fa: 'پادکستی پژوهش‌محور درباره اینکه چگونه مهندسی کهن قنات الهام‌بخش جمع‌آوری آب باران، پارک‌های پلکانی عمومی و منظرهای تاب‌آور معاصر می‌شود.',
      ar: 'بودكاست بحثي يستقصي كيف تلهم هندسة القنوات القديمة حصاد مياه الأمطار والحدائق المدرجة الحديثة.',
    },
    speakers: {
      en: 'Dr. Reza Shirazi, Tara Ebrahimi',
      fa: 'دکتر رضا شیرازی، تارا ابراهیمی',
      ar: 'د. رضا شيرازي، تارا إبراهيمي',
    },
    totalDurationLabel: '2h 44m',
    coverImage: '/images/podcast/ep-05-water-basin.jpg',
    coverAlt: {
      en: 'Calm architectural stone basin reflecting minimal concrete geometry',
      fa: 'حوض سنگی مینیمال با انعکاس هندسه معماری',
      ar: 'حوض حجري هادئ يعكس الهندسة المعمارية البسيطة',
    },
    platforms: {
      castbox: '#castbox-water-landscapes',
      spotify: '#spotify-water-landscapes',
      youtube: '#youtube-water-landscapes',
    },
    episodes: [
      {
        id: 'water-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Subterranean Qanat Hydraulics Decoded',
          fa: 'اپیزود ۰۱: رمزگشایی هیدرولیک زیرزمینی قنات‌ها',
          ar: 'الحلقة ٠١: فك شيفرة الهيدروليك تحت الأرض للقنوات',
        },
        publishedAt: '2026-09-10',
        durationSeconds: 2670,
        durationLabel: '44:30',
        waveform: buildWaveform(5),
        frequencyHz: 293.66,
      },
      {
        id: 'water-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Terraced Bioswales in Arid Public Parks',
          fa: 'اپیزود ۰۲: باغچه‌های پلکانی جذب رواناب در پارک‌های خشک',
          ar: 'الحلقة ٠٢: الأحواض المدرجة لتجميع المياه في الحدائق',
        },
        publishedAt: '2026-09-01',
        durationSeconds: 2410,
        durationLabel: '40:10',
        waveform: buildWaveform(15),
        frequencyHz: 311.13,
      },
      {
        id: 'water-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Stone Retention Basins & Evaporative Cooling',
          fa: 'اپیزود ۰۳: حوض‌های سنگی و سرمایش تبخیری در حیاط',
          ar: 'الحلقة ٠٣: الأحواض الحجرية والتبريد التبخيري',
        },
        publishedAt: '2026-08-22',
        durationSeconds: 2355,
        durationLabel: '39:15',
        waveform: buildWaveform(25),
        frequencyHz: 329.63,
      },
      {
        id: 'water-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Regional Watersheds as Architectural Blueprints',
          fa: 'اپیزود ۰۴: حوضه‌های آبریز منطقه‌ای به‌مثابه نقشه معماری',
          ar: 'الحلقة ٠٤: مستجمعات المياه الإقليمية كمخطط معماري',
        },
        publishedAt: '2026-08-12',
        durationSeconds: 2405,
        durationLabel: '40:05',
        waveform: buildWaveform(35),
        frequencyHz: 349.23,
      },
    ],
  },
  {
    id: 'podcast-portable-shelters',
    categoryId: 'sustainable',
    title: {
      en: 'Reversible Portable Shelters',
      fa: 'سازه‌های پرتابل و برگشت‌پذیر',
      ar: 'المآوي المحمولة القابلة للتفكيك',
    },
    subtitle: {
      en: 'Zero-foundation footprints & mobility',
      fa: 'استقرار بدون فونداسیون و ردپای حداقلی',
      ar: 'استقرار دون أساسات وبصمة بيئية دنيا',
    },
    description: {
      en: 'A structural podcast series examining dry-assembled cabins that touch sensitive alpine and desert terrain lightly, allowing entire sites to return to nature untouched.',
      fa: 'مجموعه پادکستی سازه‌ای درباره کلبه‌های خشک‌چین که با کمترین تماس بر بسترهای حساس کوهستانی و کویری می‌نشینند و امکان بازگشت کامل زمین به طبیعت را فراهم می‌کنند.',
      ar: 'سلسلة بودكاست إنشائية تتناول المقصورات الجافة التي تلامس التضاريس الحساسة بلطف وتتيح للطبيعة استعادة الموقع بالكامل.',
    },
    speakers: {
      en: 'Mehdi Salimi, Negar Azizi',
      fa: 'مهدی سلیمی، نگار عزیزی',
      ar: 'مهدي سليمي، نغار عزيزي',
    },
    totalDurationLabel: '2h 14m',
    coverImage: '/images/podcast/ep-06-modular-cabin.jpg',
    coverAlt: {
      en: 'Minimalist modular architectural pavilion resting lightly above natural terrain',
      fa: 'پاویون مدولار مینیمال مستقر بر بستر طبیعی',
      ar: 'جناح معماري معياري بسيط فوق التضاريس الطبيعية',
    },
    platforms: {
      castbox: '#castbox-portable-shelters',
      spotify: '#spotify-portable-shelters',
      youtube: '#youtube-portable-shelters',
    },
    episodes: [
      {
        id: 'portable-ep-01',
        episodeCode: 'EP 01',
        title: {
          en: 'Ep 01: Touching Fragile Terrain Without Concrete Footings',
          fa: 'اپیزود ۰۱: استقرار روی بسترهای شکننده بدون فونداسیون بتنی',
          ar: 'الحلقة ٠١: البناء على التضاريس الحساسة دون خرسانة',
        },
        publishedAt: '2026-08-28',
        durationSeconds: 2050,
        durationLabel: '34:10',
        waveform: buildWaveform(6),
        frequencyHz: 329.63,
      },
      {
        id: 'portable-ep-02',
        episodeCode: 'EP 02',
        title: {
          en: 'Ep 02: Flat-Pack Envelopes & Off-Grid Assembly',
          fa: 'اپیزود ۰۲: پوسته‌های پیش‌ساخته و مونتاژ خارج از شبکه',
          ar: 'الحلقة ٠٢: الأغلفة مسبقة الصنع والتركيب خارج الشبكة',
        },
        publishedAt: '2026-08-18',
        durationSeconds: 1985,
        durationLabel: '33:05',
        waveform: buildWaveform(16),
        frequencyHz: 349.23,
      },
      {
        id: 'portable-ep-03',
        episodeCode: 'EP 03',
        title: {
          en: 'Ep 03: Passive Solar Heating in High-Altitude Cabins',
          fa: 'اپیزود ۰۳: گرمایش خورشیدی غیرفعال در کلبه‌های کوهستانی',
          ar: 'الحلقة ٠٣: التدفئة الشمسية السلبية في المقصورات الجبلية',
        },
        publishedAt: '2026-08-09',
        durationSeconds: 2015,
        durationLabel: '33:35',
        waveform: buildWaveform(26),
        frequencyHz: 369.99,
      },
      {
        id: 'portable-ep-04',
        episodeCode: 'EP 04',
        title: {
          en: 'Ep 04: Leaving Zero Trace After Seasonal Dismantling',
          fa: 'اپیزود ۰۴: برجا گذاشتن ردپای صفر پس از جمع‌آوری فصلی',
          ar: 'الحلقة ٠٤: ترك أثر صفري بعد التفكيك الموسمي',
        },
        publishedAt: '2026-07-31',
        durationSeconds: 1990,
        durationLabel: '33:10',
        waveform: buildWaveform(36),
        frequencyHz: 392,
      },
    ],
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
